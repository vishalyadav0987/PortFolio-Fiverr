const express = require('express');
const { getAdminNotifications, NotificationClickSeen, NotificationAllSeen } = require('../controllers/notificationControllers');
const router = express.Router();

router.get('/admin-notifications', getAdminNotifications);
router.post('/mark-read/:id', NotificationClickSeen);
router.post('/mark-all-read', NotificationAllSeen);

module.exports = router;
