const MessageSchema = require('../../models/MessageModels/MessageSchema');
const ConversationSchema = require('../../models/MessageModels/ConversationSchema');
const { io, onlineUsers } = require('../../socket/Socket');
const UserSchema = require('../../models/UserSchema');
const { sendEmailNotification } = require('../../nodeMailer/email')
const NotificationSchema = require('../../models/NotificationSchema')
const ClientNotifySchema = require('../../models/ClientNotifySchema')
const OrderSchema = require('../../models/OrderSchema')


/********************************************************
        Send Message Controller
*********************************************************/
const sendMessage = async (req, res) => {
    try {
        const { orderId, senderId, messageText, img } = req.body;

        if (!orderId || !senderId || !messageText) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const isAdmin = senderId === process.env.ADMIN_ID;

        // Check sender exists (if not admin)
        if (!isAdmin) {
            const sender = await UserSchema.findById(senderId);
            if (!sender) {
                // console.log("❌ Sender not found in DB:", senderId);
                return res.status(404).json({ message: "Sender not found" });
            }
        }

        // console.log("✅ Sender found:", senderId);

        // Find or create conversation
        let conversation = await ConversationSchema.findOne({ orderId });

        if (!conversation) {
            // console.log("⚠️ No conversation found, creating a new one...");
            conversation = new ConversationSchema({
                orderId,
                buyerId: isAdmin ? undefined : senderId,
                adminId: process.env.ADMIN_ID,
                lastMessage: { messageText, senderId }
            });


            await conversation.save();
            // console.log("✅ New conversation created:", conversation._id);
        } else {
            // console.log("✅ Existing conversation found:", conversation._id);
        }

        // Save the new message
        const message = new MessageSchema({
            conversationId: conversation._id,
            senderId,
            messageText,
            img
        });


        const order = await OrderSchema.findById(orderId);

        if (!order) {
            throw new Error("Order not found");
        }


        if (senderId === process.env.ADMIN_ID) {
            // Send real-time notification to the user
            const userNotification = await ClientNotifySchema.create({
                type: 'new_message',
                message: `${messageText}`,
                // message: `Admin sent a message for Order #${orderId?.toString()?.slice(-6)} with ConversationId #${conversation._id?.toString()?.slice(-6)}`,
                orderId: orderId,
                buyerId: order?.buyerId.toString() // Assuming senderId is the user's ID in this case
            });

            // Populate orderId and buyerId
            const populatedUserNotification = await ClientNotifySchema.findById(userNotification._id)
                .populate("orderId")
                .populate("buyerId")
                .exec();

            // Emit notification to the user via Socket.io
            const userSocketId = onlineUsers?.get(order?.buyerId?.toString()); // Assuming senderId is the user's ID

            if (userSocketId) {
                io.to(userSocketId).emit("newMessageUser", populatedUserNotification);
            } else {
                console.warn("User socket ID not found. User might be offline.");
            }
        } else {
            // Send real-time notification to the admin
            const adminNotification = await NotificationSchema.create({
                type: 'new_message',
                message: `User ${senderId} sent a message for Order #${orderId?.toString()?.slice(-6)} with ConversationId #${conversation._id?.toString()?.slice(-6)}`,
                orderId: orderId,
                buyerId: senderId
            });

            // Populate orderId and buyerId
            const populatedAdminNotification = await NotificationSchema.findById(adminNotification._id)
                .populate("orderId")
                .populate("buyerId")
                .exec();

            // Emit notification to the admin via Socket.io
            const adminSocketId = onlineUsers?.get(process.env.ADMIN_ID);

            if (adminSocketId) {
                io.to(adminSocketId).emit("newMessageAdmin", populatedAdminNotification);
            }
        }

        await message.save();
        // console.log("✅ Message saved in DB:", message);

        // Update last message in conversation
        await Promise.all([
            message.save(),
            conversation.updateOne({
                lastMessage: {
                    messageText,
                    senderId,
                },
            }),
        ])

        // Emit message via socket
        // console.log("📡 Emitting message to room:", conversation._id.toString());
        io.to(conversation._id.toString()).emit("newMessage", message);

        // Notify receiver if offline
        const receiverId = isAdmin ? conversation.buyerId : conversation.adminId;

        if (receiverId && !onlineUsers.has(receiverId.toString())) {
            try {
                // Fetch the receiver's details (including email) from the database
                const receiver = await UserSchema.findById(receiverId).select("email").exec();

                if (receiver && receiver.email) {
                    console.log("📧 Receiver offline, sending email notification to:", receiver.email);

                    // Send email notification
                    await sendEmailNotification(receiver.email, messageText,orderId);
                } else {
                    console.error("Receiver email not found for ID:", receiverId);
                }
            } catch (error) {
                console.error("Error fetching receiver details or sending email:", error);
            }
        } else {
            console.log("Receiver is online or receiverId is invalid. No email notification sent.");
        }

        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};



/********************************************************
    Get Message by orderId Controller -- ADMIN
*********************************************************/
const getMessageByOrderId = async (req, res) => {
    try {
        const { orderId } = req.body;
        const conversation = await ConversationSchema.findOne({ orderId });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        const messages = await MessageSchema.find({ conversationId: conversation._id })
            // .sort({ createdAt: -1 })
            .populate("senderId", "name email avatar.url")
            .populate("conversationId", "orderId buyerId adminId");
        res.json({ success: true, messages: messages || [] });
    } catch (error) {
        console.error("Error getting message by orderId:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}



/********************************************************
        Get All converation for Controller -- ADMIN
*********************************************************/
const getConversationsForAdmin = async (req, res) => {
    try {
        const adminId = process.env.ADMIN_ID; // Fixed Admin ID
        const conversations = await ConversationSchema.find({ adminId })
            .populate("buyerId", "name email avatar.url")
            .populate("orderId")
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error("Error fetching admin conversations:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};





/********************************************************
    Get All converation for user by orderId Controller
*********************************************************/
const getConversationsForUserByOrderIdMessage = async (req, res) => {
    try {
        const { orderId } = req.body;

        const conversation = await ConversationSchema.findOne({ orderId })
            .populate("adminId", "name email avatar.url")

        if (!conversation) {
            return;
        }

        const messages = await MessageSchema.find({ conversationId: conversation._id });

        res.json({ success: true, messages, conversation });

    } catch (error) {
        console.error("Error getting messages by orderId:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};




module.exports = {
    sendMessage,
    getMessageByOrderId,
    getConversationsForAdmin,
    getConversationsForUserByOrderIdMessage
}



/**************************************************** 
            Koi sensetive data nh hai ✅
****************************************************/