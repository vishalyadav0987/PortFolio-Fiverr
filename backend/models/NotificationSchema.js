const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        type: { type: String, required: true }, // "order", "payment", "review", "revision"
        message: { type: String, required: true },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// notificationSchema.pre('save', async function (next) {
//     if (this.type === 'new_message' && this.isRead === true) {
//         console.log('Deleting new_message notification with ID:', this._id);
//         await this.deleteOne();
//         this.$isDeleted = true; // Prevent Mongoose from attempting to save
//         return;
//     }
//     next();
// });

module.exports = mongoose.model("Notification", notificationSchema);
