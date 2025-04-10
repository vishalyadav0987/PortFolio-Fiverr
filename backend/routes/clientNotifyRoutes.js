const express = require('express');
const { getAllNotificationBuyerId, NotificationClickSeen, NotificationAllSeen } = require('../controllers/clientNotifyController');
const router = express.Router();

router.get('/client-notifications/:buyerId', getAllNotificationBuyerId);
router.post('/client-mark-read/:id', NotificationClickSeen);
router.post('/client-mark-all-read', NotificationAllSeen);

module.exports = router;
