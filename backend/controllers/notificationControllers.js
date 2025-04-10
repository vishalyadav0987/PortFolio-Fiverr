const NotificationSchema = require('../models/NotificationSchema');

const getAdminNotifications = async (req, res) => {
    try {
        const notifications = await NotificationSchema.find({})
            .populate("orderId buyerId") // Populate order and buyer details
            .sort({ createdAt: -1 }); // Show latest first
            

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const NotificationClickSeen = async (req, res) => {
    const { id } = req.params; 

    try {
        const notification = await NotificationSchema.findOneAndUpdate(
            { _id: id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (notification.type === 'new_message') {
            await NotificationSchema.deleteOne({ _id: id });
        }

        res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const NotificationAllSeen = async (req, res) => {
    try {
        const updateResult = await NotificationSchema.updateMany(
            { isRead: false }, // Filter: Only unread notifications
            { isRead: true }   // Update: Mark as read
        );

        const deleteResult = await NotificationSchema.deleteMany(
            { type: 'new_message', isRead: true } 
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            updatedCount: updateResult.modifiedCount,
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { 
    getAdminNotifications, 
    NotificationClickSeen,
    NotificationAllSeen 
};




/**************************************************** 
            Koi sensetive data nh hai ✅
****************************************************/
