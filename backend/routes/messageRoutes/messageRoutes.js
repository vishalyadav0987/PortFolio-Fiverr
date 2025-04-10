const express = require('express');
const router = express.Router();
const {authUser} = require('../../middleware/authMiddleware');
const { sendMessage, getMessageByOrderId, getConversationsForAdmin, getConversationsForUserByOrderIdMessage } = require('../../controllers/messageControllers/messageControllers');


router.route('/send-message').post(authUser, sendMessage)
router.route('/order-messages').post(getMessageByOrderId);
router.route('/admin-conversation').get(getConversationsForAdmin);
router.route('/order/user-conversation').post(getConversationsForUserByOrderIdMessage);

module.exports = router;

