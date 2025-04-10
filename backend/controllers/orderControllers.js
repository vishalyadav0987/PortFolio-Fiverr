const razorpay = require('../config/razorpay');
const OrderSchema = require('../models/OrderSchema');
const mongoose = require('mongoose');
const UserSchema = require('../models/UserSchema');
const crypto = require("crypto");
const { sendOrderConfirmationEmail, sendFullPaymentEmail, sendEmailNotificationUpdateOrderStatus, sendRevisionStatusEmail } = require('../nodeMailer/email');
const NotificationSchema = require('../models/NotificationSchema')
const ClientNotifySchema = require('../models/ClientNotifySchema')
const { onlineUsers, io } = require('../socket/Socket')

/*------------------------------------------
        Save Order to Database
------------------------------------------*/
const saveOrderToDB = async (orderNotes, paymentDetails) => {
  try {
    const newOrder = new OrderSchema({
      buyerId: new mongoose.Types.ObjectId(orderNotes.buyerId),
      addressInfo: JSON.parse(orderNotes.addressInfo),
      OrderItems: JSON.parse(orderNotes.OrderItems),
      deliveryDate: new Date(orderNotes.deliveryDate),
      maxRevisions: orderNotes.maxRevisions,
      orderStatus: 'In Progress',
      paymentInfo: {
        id: paymentDetails.id,
        paymentType: orderNotes.paymentType,
        paymentStatus: 'Paid',
        paidAmount: paymentDetails.amount / 100, // Convert paisa to INR
        totalAmount: paymentDetails.amount / 100,
        paidAt: new Date(paymentDetails.created_at * 1000)
      }
    });

    const savedOrder = await newOrder.save();
    console.log('✅ Order saved successfully:', savedOrder._id);
    return savedOrder;
  } catch (error) {
    console.error('💥 Database save error:', error);
    throw error;
  }
};

const generateReceiptId = (buyerId) => {
  const hash = crypto
    .createHash('sha1')
    .update(`${buyerId}-${Date.now()}`)
    .digest('hex');
  return hash.substring(0, 40);
};

const validateOrderItems = (OrderItems) => {
  if (!Array.isArray(OrderItems) || OrderItems.length === 0) {
    return { valid: false, message: 'Invalid or empty OrderItems' };
  }
  for (const item of OrderItems) {
    if (!item?.selectedPlan?.price) {
      return { valid: false, message: 'Invalid item structure - missing price' };
    }
  }
  return { valid: true };
};

const calculateTotalAmount = (OrderItems) => {
  return OrderItems.reduce((sum, item) => {
    const basePrice = item.selectedPlan.price * (item.quantity || 1);
    const extrasTotal = (item.extraFeatures || []).reduce(
      (eSum, extra) => eSum + (extra.price * (extra.quantity || 1)),
      0
    );
    return sum + basePrice + extrasTotal;
  }, 0) * 100; // Convert to paisa
};

const placeOrder = async (req, res) => {
  try {
    const { addressInfo, orderItems, deliveryDate, maxRevisions, paymentType } = req.body;
    // console.log(req.body.orderItems);

    const buyerId = req.user?._id

    const validation = validateOrderItems(orderItems);
    if (!validation.valid) {
      return res.status(400).json(validation);
    }

    let totalAmount = calculateTotalAmount(orderItems);
    // console.log("Total Amount:", totalAmount);

    let initialPaymentAmount = Math.ceil(Number(totalAmount) / 2); // First 50%
    if (paymentType === "Full") {
      initialPaymentAmount = totalAmount;
    }
    console.log("Initial Payment Amount:", initialPaymentAmount);

    const options = {
      amount: initialPaymentAmount,
      currency: "INR",
      receipt: generateReceiptId(buyerId),
      notes: {
        buyerId: buyerId.toString(),
        addressInfo: JSON.stringify(addressInfo),
        OrderItems: JSON.stringify(orderItems),
        deliveryDate,
        maxRevisions,
        paymentType,
        totalAmount: totalAmount.toString(),
      }
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({
      success: false,
      message: error.error?.description || error.message
    });
  }
};

const paymentWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  try {
    // Verify signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(req.rawBody);
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
      console.error('⚠️ Invalid webhook signature');
      return res.status(401).json({ success: false });
    }

    const event = JSON.parse(req.rawBody);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const order = await razorpay.orders.fetch(payment.order_id);

      // Save order to database
      await saveOrderToDB(order.notes, payment);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('💥 Webhook processing error:', error);
    res.status(500).json({ success: false });
  }
};


/*------------------------------------------
      Payment Verification Controller
------------------------------------------*/
const verifyPayment = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification parameters" });
    }

    // console.log("razorpay_payment_id",razorpay_payment_id);
    // console.log("razorpay_order_id",razorpay_order_id);
    // console.log("razorpay_signature",razorpay_signature);

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // console.log("generatedSignature",generatedSignature);


    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const existingOrder = await OrderSchema.findOne({ "paymentInfo.id": razorpay_order_id });

    if (existingOrder) {
      return res.status(200).json({ success: true, message: "Payment already verified", order: existingOrder });
    }

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (!razorpayOrder || !payment) {
      return res.status(400).json({ success: false, message: "Invalid Razorpay Order or Payment" });
    }

    // console.log("Razorpay Notes:", razorpayOrder.notes);

    if (!razorpayOrder.notes) {
      return res.status(400).json({ success: false, message: "Missing order notes" });
    }

    const buyerId = new mongoose.Types.ObjectId(razorpayOrder.notes.buyerId);
    const addressInfo = JSON.parse(razorpayOrder.notes.addressInfo);
    const orderItems = JSON.parse(razorpayOrder.notes.OrderItems);
    const deliveryDate = new Date(razorpayOrder.notes.deliveryDate);
    const maxRevisions = razorpayOrder.notes.maxRevisions;
    const paymentType = razorpayOrder.notes.paymentType;
    const totalAmount = Number(razorpayOrder.notes.totalAmount) / 100;
    const paidAmount = payment.amount / 100;

    // console.log(paidAmount,
    //   totalAmount,
    //   paymentType,
    // );


    let paymentStatus = "Paid";
    if (paymentType === "Milestone") {
      const halfAmount = totalAmount / 2;
      if (paidAmount < halfAmount) {
        paymentStatus = "Pending";
      } else if (paidAmount <= totalAmount) {  // ✅ Fix: Includes `halfAmount`
        paymentStatus = "Partially Paid";
      }
    }


    const newOrder = new OrderSchema({
      buyerId,
      addressInfo,
      OrderItems: orderItems,
      deliveryDate,
      maxRevisions,
      paymentInfo: {
        id: razorpay_payment_id,
        paymentType,
        paymentStatus,
        paidAmount,
        totalAmount: Number(totalAmount),
        paidAt: new Date(payment.created_at * 1000)
      }
    });


    await newOrder.save();

    await UserSchema.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } }, { new: true });


    // Send real-time notification to admin
    const adminId = process.env.ADMIN_ID; // Replace with actual admin user ID
    const notification = await NotificationSchema.create({
      type: 'new_order',
      message: `User ${newOrder.buyerId} has Placed New Order #${newOrder._id?.toString()?.slice(-6)}`,
      orderId: newOrder._id,
      buyerId: newOrder.buyerId
    });

    // Populate orderId and buyerId
    const populatedNotification = await NotificationSchema.findById(notification._id)
      .populate("orderId")
      .populate("buyerId")
      .exec();


    // Emit notification to admin via Socket.io
    const adminSocketId = onlineUsers?.get(adminId);
    console.log(adminSocketId);

    if (adminSocketId) {
      io.to(adminSocketId).emit("newOrderNotification", populatedNotification);
    }



    await sendOrderConfirmationEmail(
      req.user.email,
      newOrder._id,
      `****${razorpay_payment_id.slice(-4)}`,
      newOrder.paymentInfo.paymentStatus,
      "Razorpay",
      newOrder.paymentInfo.totalAmount,
      req.user.name,
      req.user.email,
      newOrder.addressInfo.phoneNo,
      newOrder.addressInfo.address,
      "Punjabi Bagh, New Delhi",
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${orderItems[0]?.title}</td>
        <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">1</td>
        <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">₹${newOrder.paymentInfo.paidAmount}</td>
        <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">₹${newOrder.paymentInfo.totalAmount}</td>
        <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">${new Date(newOrder?.paymentInfo.paidAt).toLocaleDateString()?.slice(0, 6) + "/" + `${new Date().getFullYear()}`}</td>
       </tr>`,
      new Date(newOrder?.deliveryDate).toLocaleDateString()?.slice(0, 6) + "/" + `${new Date().getFullYear()}`
    );

    res.status(200).json({ success: true, message: "Payment verified and order saved", order: newOrder });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, message: error.message || "Payment verification failed" });
  }
};




/*------------------------------------------
        Get User Order Controllers
------------------------------------------*/

const getUserOrders = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await OrderSchema.find({ _id: { $in: user.orders } });
    res.status(200).json({
      orders,
      count: orders?.length,
      success: true
    });
  } catch (error) {
    console.log("Error in getUserOrders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};






/*------------------------------------------
      Get User Order by id Controllers
------------------------------------------*/
const getOrderById = async (req, res) => {
  try {
    const order = await OrderSchema.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};





/*------------------------------------------
    Revision Create Controllers
------------------------------------------*/
const requestRevision = async (req, res) => {
  try {
    const { orderId, revisionDescription } = req.body;

    if (!orderId || !revisionDescription) {
      return res.status(400).json({ success: false, message: 'Order ID and revision description are required' });
    }

    // Order fetch karo
    const order = await OrderSchema.findById(orderId)
      .populate('revisionRequests.buyerId', 'name email')
      .populate('revisionRequests.orderId', 'OrderItems');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Max revisions ka check
    if (order.usedRevisions >= order.maxRevisions) {
      return res.status(400).json({ success: false, message: 'No more revisions allowed' });
    }

    // User ki info check karo (security)
    const buyerId = req.user?._id?.toString() || order.buyerId.toString();

    if (!buyerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized request' });
    }




    // Order me revision request add karo
    const updatedOrder = await OrderSchema.findByIdAndUpdate(
      orderId,
      {
        $push: {
          revisionRequests: {
            revisionDescription,
            requestedAt: new Date(),
            status: 'Pending',
            buyerId,  // ✅ Securely added
            orderId: order._id
          }
        },
        $inc: { usedRevisions: 1 }
      },
      { new: true }
    ).populate('revisionRequests.buyerId', 'name email'); // ✅ Populate after update

    // Notify admin in real-time
    const adminId = process.env.ADMIN_ID;
    const notification = await NotificationSchema.create({
      type: "revision_request",
      message: `User ${buyerId} requested a revision for Order #${orderId.toString().slice(-6)}`,
      orderId,
      buyerId,
    });

    // Populate orderId and buyerId
    const populatedNotification = await NotificationSchema.findById(notification._id)
      .populate("orderId")
      .populate("buyerId")
      .exec();

    // Emit notification to admin
    const adminSocketId = onlineUsers?.get(adminId);
    if (adminSocketId) {
      io.to(adminSocketId).emit("revisionRequestNotification", populatedNotification);
    }

    res.json({
      success: true,
      data: updatedOrder.revisionRequests,
      message: 'Revision requested successfully'
    });
  } catch (error) {
    console.error('Error in requestRevision:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};



/*------------------------------------------
    get all revsion by id Controllers
------------------------------------------*/
const getAllRevisionById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await OrderSchema
      .findById(orderId)
      .populate('revisionRequests.buyerId', 'name email')
      .populate('revisionRequests.orderId', 'OrderItems');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({
      success: true,
      data: order.revisionRequests,
      message: 'Revisions fetched successfully'
    });
  }
  catch (error) {
    console.error('Error in getAllRevisionById:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
}





/*-------------------------------------------------------------------------
            Remaining or partially payment controller
-------------------------------------------------------------------------*/
const payRemainingAmount = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Order Fetch karo
    const order = await OrderSchema.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Check remaining amount
    let remainingAmount = order?.paymentInfo?.totalAmount - order?.paymentInfo?.paidAmount;
    if (remainingAmount <= 0) {
      return res.status(400).json({ success: false, message: "No remaining amount to pay" });
    }

    // Razorpay Order Create
    const options = {
      amount: remainingAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `rem_${orderId}`,
      notes: {
        buyerId: order.buyerId.toString(),
        orderId: order._id.toString(),
        totalAmount: order?.paymentInfo?.totalAmount.toString(),
        remainingAmount: remainingAmount.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });

  } catch (error) {
    console.error("Error in remaining payment:", error);
    res.status(500).json({ success: false, message: "Payment processing failed" });
  }
};




/*-------------------------------------------------------------------------
          Verify Remaining or partially payment controller
-------------------------------------------------------------------------*/
const verifyRemainingPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid payment signature" });
  }

  // Order Fetch karo
  const order = await OrderSchema.findById(orderId);
  // console.log(order);

  if (!order) return res.status(404).json({ success: false, message: "Order not found" });


  const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
  const payment = await razorpay.payments.fetch(razorpay_payment_id);

  if (!razorpayOrder || !payment) {
    return res.status(400).json({ success: false, message: "Invalid Razorpay Order or Payment" });
  }

  // Update Payment Info
  order.paymentInfo.paidAmount += payment.amount / 100;
  order.paymentInfo.paymentStatus = "Paid";
  if (order.paymentInfo) {
    order.paymentInfo.mileStoneId = razorpay_payment_id;
  }

  await order.save();


  // Notify admin in real-time
  const adminId = process.env.ADMIN_ID;
  const notification = await NotificationSchema.create({
    type: "full_payment",
    message: `User ${req.user?._id} paid full payment for Order #${orderId.toString().slice(-6)}`,
    orderId,
    buyerId: req.user?._id,
  });

  // Populate orderId and buyerId
  const populatedNotification = await NotificationSchema.findById(notification._id)
    .populate("orderId")
    .populate("buyerId")
    .exec();

  // Emit notification to admin
  const adminSocketId = onlineUsers?.get(adminId);
  if (adminSocketId) {
    io.to(adminSocketId).emit("fullPaymentNotification", populatedNotification);
  }

  await sendFullPaymentEmail(
    req.user?.email,
    req.user?.name,
    order.OrderItems[0]?.title,
    orderId,
    order.paymentInfo.totalAmount
  );

  res.status(200).json({ success: true, message: "Final payment successful", order });
};






/*--------------------------------------------------------
          Get All Order --- ADMIN
---------------------------------------------------------*/
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderSchema.find({}).populate("buyerId").exec();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};




/*--------------------------------------------------------
          Get All Order By Id --- ADMIN
---------------------------------------------------------*/
const getOrderByIdAdmin = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await OrderSchema.findById(orderId).populate("buyerId").exec();
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching order" });
  }
};








/*----------------------------------------------------------------
          orderStatus Update Controller --- ADMIN
----------------------------------------------------------------*/
const updateOrderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body
  try {
    const order = await OrderSchema.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false, message: "Order not found"
      });
    }
    order.orderStatus = orderStatus;
    await order.save();
    


    // Notify the buyer in real-time
    const buyerId = order.buyerId;

    // Create a notification for the buyer
    const notification = await ClientNotifySchema.create({
        type: "update_order_status",
        message: `Your order #${orderId.toString().slice(-6).toUpperCase()} status has been updated to "${orderStatus}".`,
        orderId,
        buyerId,
    });

    // Populate the notification with order and buyer details
    const populatedNotification = await ClientNotifySchema.findById(notification._id)
        .populate("orderId")
        .populate("buyerId")
        .exec();

    // Emit the notification to the buyer (if online)
    const buyerSocketId = onlineUsers?.get(buyerId.toString()); // Ensure buyerId is a string
    if (buyerSocketId) {
        io.to(buyerSocketId).emit("updateOrderStatusNotification", populatedNotification);
    }

    sendEmailNotificationUpdateOrderStatus(
      populatedNotification?.buyerId?.email,
      orderId,
      orderStatus
    )



    res.status(200).json({
      success: true, message: "Order status updated successfully"
    });
  } catch (error) {
    console.log("Error in update order status", error);
    res.status(500).json({ success: false, message: "Internal server error" });

  }
}



/*----------------------------------------------------------------
         Update Revision status Controller --- ADMIN
----------------------------------------------------------------*/
const updateRevisionStatus = async (req, res) => {
  const { orderId, revisionStatus, revisionId } = req.body;

  try {
    const order = await OrderSchema.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const revisionRequest = order.revisionRequests.find(
      (rev) => rev._id.toString() === revisionId
    );

    if (!revisionRequest) {
      return res.status(404).json({
        success: false,
        message: "Revision request not found",
      });
    }

    revisionRequest.status = revisionStatus;
    if (revisionStatus === 'Completed') {
      revisionRequest.completedAt = Date.now()
    } else {
      revisionRequest.completedAt = ""
    }

    await order.save();

     // Notify the buyer in real-time
     const buyerId = order.buyerId;

     // Create a notification for the buyer
     const notification = await ClientNotifySchema.create({
         type: "update_revision_status",
         message: `Your revision #${revisionId.toString().slice(-6).toUpperCase()} status has been updated to "${revisionStatus}".`,
         orderId,
         buyerId,
     });
 
     // Populate the notification with order and buyer details
     const populatedNotification = await ClientNotifySchema.findById(notification._id)
         .populate("orderId")
         .populate("buyerId")
         .exec();
 
     // Emit the notification to the buyer (if online)
     const buyerSocketId = onlineUsers?.get(buyerId.toString()); // Ensure buyerId is a string
     if (buyerSocketId) {
         io.to(buyerSocketId).emit("updateRevisionStatusNotification", populatedNotification);
     }


     sendRevisionStatusEmail(
      populatedNotification?.buyerId?.email,
      orderId, revisionId, revisionStatus
     )

    res.status(200).json({
      success: true,
      message: "Revision status updated successfully",
    });
  } catch (error) {
    console.log("Error in update revision status", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};





module.exports = {
  placeOrder,
  paymentWebhook,
  verifyPayment,
  getUserOrders,
  getOrderById,
  requestRevision,
  getAllRevisionById,
  payRemainingAmount,
  verifyRemainingPayment,
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  updateRevisionStatus
};  // ✅ Exporting functions as module.exports



/**************************************************** 
            Koi sensetive data nh hai ✅
****************************************************/