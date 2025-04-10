const ClientNotifySchema = require('../models/ClientNotifySchema');
const mongoose = require('mongoose')



/*----------------------------------------------------------------
    Get All Notification of Client using buyerId For Clinet
----------------------------------------------------------------*/
const getAllNotificationBuyerId = async (req, res) => {
    try {
        const {buyerId} = req.params;
        if (!buyerId || !mongoose.Types.ObjectId.isValid(buyerId)) {
            return res.status(400).json({
              success: false,
              message: 'Invalid or missing buyerId'
            });
          }
        const notifications = await ClientNotifySchema.find({ buyerId: buyerId }).sort(
            { createdAt: -1 }
        );
        res.json({
            success:true,
            notifications
        });
    } catch (error) {
        console.log("Error in getAllNotificationBuyerId in backend ", error.message);
        res.status(500).json({ message: error.message });
    }
}



const NotificationClickSeen = async (req, res) => {
    const { id } = req.params; 

    try {
        const notification = await ClientNotifySchema.findOneAndUpdate(
            { _id: id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (notification.type === 'new_message') {
            await ClientNotifySchema.deleteOne({ _id: id });
        }

        res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const NotificationAllSeen = async (req, res) => {
    try {
        const updateResult = await ClientNotifySchema.updateMany(
            { isRead: false }, // Filter: Only unread notifications
            { isRead: true }   // Update: Mark as read
        );

        const deleteResult = await ClientNotifySchema.deleteMany(
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
    getAllNotificationBuyerId,
    NotificationClickSeen,
    NotificationAllSeen
}




/**************************************************** 
            Koi sensetive data nh hai ✅
****************************************************/
