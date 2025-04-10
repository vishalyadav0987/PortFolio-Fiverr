const mongoose = require("mongoose");

const ClientNotifySchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        // "Message from Admin", "OrderStatus", "Revision status"
        message: { type: String, required: true },
        name: { type: String, default: "Admin" },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" }, // required
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // required
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);



module.exports = mongoose.model("clientNotify", ClientNotifySchema);
