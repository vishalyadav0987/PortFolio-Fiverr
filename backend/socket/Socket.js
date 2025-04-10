const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const app = express();
const MessageSchema = require('../models/MessageModels/MessageSchema');
const ConversationSchema = require('../models/MessageModels/ConversationSchema');

let onlineUsers = new Map(); // Stores { userId: socketId }
// console.log(process.env.ADMIN_FRONTEND_URL,process.env.FRONTEND_URL);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.ADMIN_FRONTEND_URL,process.env.FRONTEND_URL],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // User joins a specific room based on conversationId
    socket.on("joinConversation", (conversationId) => {
        if (conversationId) {
            socket.join(conversationId);
            console.log(`🚪 User joined conversation: ${conversationId}`);
        }
    });

    socket.on("join", (userId) => {
        if (!userId) return;
        onlineUsers.set(userId, socket.id);
        console.log(`✅ User joined: ${userId}, socket: ${socket.id}`);
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys())); // Emit updated users list
    });


    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
        console.log("Marking messages as seen for conversation:", conversationId, "and user:", userId);

        if (!conversationId || !userId) {
            console.error("Invalid conversationId or userId");
            return;
        }

        try {
            // Update all unseen messages in the conversation to "seen"
            await MessageSchema.updateMany(
                { conversationId, seen: false },
                { $set: { seen: true } }
            );

            // Update the last message in the conversation to "seen"
            await ConversationSchema.updateOne(
                { _id: conversationId },
                { $set: { "lastMessage.seen": true } }
            );

            // Notify the client (receiver) that their messages have been seen
            const receiverSocketId = onlineUsers.get(userId); // Get the socket ID of the receiver

            if (receiverSocketId) {
                console.log("Notifying receiver with socket ID:", receiverSocketId);
                console.log(conversationId,"Iska dekhte kya hoga");

                io.to(receiverSocketId).emit("messagesSeen", { conversationId });
            } else {
                console.log("Receiver is not online. Cannot notify.");
            }

        } catch (error) {
            console.error("Error marking messages as seen:", error.message);
        }
    });


   
    
    
   


    socket.on("disconnect", () => {
        const userId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
        if (userId) onlineUsers.delete(userId);
        console.log(`❌ User disconnected: ${userId}`);
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
});


module.exports = { server, app, io, onlineUsers };


/**************************************************** 
            Koi sensetive data nh hai ✅
****************************************************/
