const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/authMiddleware');
const {
    placeOrder,
    paymentWebhook,
    verifyPayment,
    getUserOrders,
    getOrderById,
    requestRevision,
    getAllRevisionById,
    verifyRemainingPayment,
    payRemainingAmount,
    getAllOrders,
    getOrderByIdAdmin,
    updateOrderStatus,
    updateRevisionStatus
} = require('../controllers/orderControllers');


router.route('/order/place').post(authUser, placeOrder);
router.route('/order/verify').post(authUser, verifyPayment);
router.route('/order/user-orders').get(authUser, getUserOrders);
router.get('/order/:id', authUser, getOrderById);
router.post('/order/revision-request', authUser, requestRevision);
router.get('/order/revision/:orderId', authUser, getAllRevisionById);

/*--------------FULL PAYMENT After MILESTONE PAYMENT---------------*/
router.route('/order/payRemainingAmount').post(authUser, payRemainingAmount);
router.route('/order/verifyRemainingPayment').post(authUser, verifyRemainingPayment);
/*--------------FULL PAYMENT After MILESTONE PAYMENT---------------*/





/*------------------------------- Admin Routes --------------------------------*/
router.get('/admin-orders', getAllOrders);
router.get('/admin-orders/:orderId', getOrderByIdAdmin);
router.route('/admin/update-status').patch(updateOrderStatus);
router.route('/admin/update-revision-status').patch(updateRevisionStatus);
/*------------------------------- Admin Routes --------------------------------*/





router.post("/webhook", express.raw({ type: "application/json" }), paymentWebhook);

module.exports = router;
