const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    adminId: { // Keeping it as a String
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    lastMessage: {
        messageText: String,
        senderId: {
            type: String, // Changed from ObjectId to String to support both User ID & Custom Admin ID
            required: true
        },
        seen: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
