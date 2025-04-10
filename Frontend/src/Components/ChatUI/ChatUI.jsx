import { useState } from 'react';
import './ChatUI.css';
import { FaWindowClose, FaPlus } from "react-icons/fa";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuthContext } from '../../Context/AuthContext';
import { useMessageContext } from '../../Context/MessageContext';
import { format } from 'date-fns';
import { useSocketContext } from '../../Context/SocketContext';
import { useRef } from 'react';
import { useEffect } from 'react';
import MessageSound from '../../assests/message.mp3'

const ChatUI = ({ isChatOpen, setIsChatOpen, orderId, messageLoading, order }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { authUser } = useAuthContext();
    const { setMessages, conversation, setConversation, messages } = useMessageContext();
    const { onlineUsers, socket } = useSocketContext();
    const lastMessageRef = useRef();

    const sendMessageHandle = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) {
            toast.error("Message cannot be empty");
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post(
                '/api/v1/communicate/send-message',
                { messageText: messageInput, orderId: orderId, senderId: authUser?._id },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );

            if (response.data.success) {
                toast.success("Message sent successfully");

                setMessages(prev => [...prev, response.data.message]);
                setConversation(prev => ({
                    ...prev,
                    lastMessage: {
                        messageText: response.data.message.messageText,
                        senderId: response.data.message.senderId,
                    }
                }));
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(error.response?.data?.message || "Failed to send message");
        } finally {
            setLoading(false);
            setMessageInput("");
        }
    };


    // Skeleton loader for messages
    const MessageSkeleton = ({ isSender }) => (
        <div className={`message-skeleton ${isSender ? 'sender' : 'receiver'}`}>
            {!isSender && <div className="skeleton-avatar"></div>}
            <div className="skeleton-content">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-status"></div>
            </div>
        </div>
    );




    useEffect(() => {
        if (!orderId || !socket) return;

        socket.emit("joinConversation", conversation?._id);

        const handleNewMessage = (message) => {
            if (message.senderId === authUser?._id) return;
            if (message.conversationId === conversation?._id) {
                setMessages(prev => {
                    if (prev.some(msg => msg._id === message._id)) return prev;
                    return [...prev, message];
                });
                setConversation(prev => ({
                    ...prev,
                    lastMessage: {
                        messageText: message.messageText,
                        senderId: message.senderId,
                    }
                }));

                // Play sound only if message is from another user and window is not focused
                if (message.senderId !== authUser?._id && !document.hasFocus()) {
                    new Audio(MessageSound).play();
                }
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [conversation?._id, socket, orderId, authUser?._id, setMessages, setConversation]);




    // useEffect(() => {
    //     if (!conversation || !messages?.length) return;

    //     // Get the last message's sender ID
    //     const lastMessage = messages[messages.length - 1];
    //     const lastMessageSenderId = lastMessage?.senderId?._id || lastMessage?.senderId;

    //     // Check if the last message is from the other user
    //     const lastMessageIsFromOtherUser = lastMessageSenderId && lastMessageSenderId !== authUser?._id;

    //     console.log("Last message is from other user:", lastMessageIsFromOtherUser);
    //     console.log("Last message conversation ID matches current conversation:", lastMessage?.conversationId === conversation?._id);

    //     // Emit "markMessagesAsSeen" event if conditions are met
    //     if (lastMessageIsFromOtherUser && (lastMessage?.conversationId === conversation?._id)) {
    //         socket.emit("markMessagesAsSeen", {
    //             conversationId: conversation._id,
    //             userId: "67d96a079a494f51f7c7e1f5" //  receiver's ID
    //         });

    //     }


    //     socket.on("messagesSeen", ({ conversationId  }) => {
    //         if(!conversationId){
    //             console.log("id chatUI:" ,conversation._id);

    //         }
    //         console.log("Checking is these true chatUI: ", conversation._id === conversationId);

    //         console.log("Why not printing: ", conversationId);
    //         if (conversation._id === conversationId) {
    //             console.log("Messages seen for conversation chatUI:", conversationId);

    //             setMessages((prev) => {
    //                 console.log("Updating messages state chatUI");
    //                 const updatedMessageSeen = prev.map((message) => {
    //                     if (!message.seen) {
    //                         return {
    //                             ...message,
    //                             seen: true,
    //                         };
    //                     }
    //                     return message;
    //                 });
    //                 return updatedMessageSeen;
    //             });
    //         }
    //     });

    //     console.log("done3");
    // }, [socket, conversation, messages, setMessages]);



    // useEffect(() => {
    //     if (!socket || !conversation || !messages?.length) return;

    //     const lastMessage = messages[messages.length - 1];
    //     const lastMessageSenderId = lastMessage?.senderId?._id || lastMessage?.senderId;

    //     // ✅ Ensure last message is from Admin & is unseen
    //     const lastMessageIsFromAdmin = lastMessageSenderId && lastMessageSenderId !== authUser?._id;

    //     if (lastMessageIsFromAdmin && !lastMessage?.seen) {
    //         console.log("🔵 Client emitting markMessagesAsSeen:", {
    //             conversationId: conversation._id,
    //             userId: conversation.adminId._id, // ✅ FIXED: Admin should be receiver
    //         });

    //         socket.emit("markMessagesAsSeen", {
    //             conversationId: conversation._id,
    //             userId: conversation.adminId._id, // ✅ FIXED
    //         });
    //     }

    //     // ✅ Define event handler
    //     const handleMessagesSeen = ({ conversationId }) => {
    //         if (String(conversation._id) === String(conversationId)) {
    //             console.log("✅ Messages seen for conversation:", conversationId);

    //             setMessages((prev) =>
    //                 prev.map((message) =>
    //                     message.seen ? message : { ...message, seen: true }
    //                 )
    //             );
    //         }
    //     };

    //     // ✅ Attach event listener
    //     socket.on("messagesSeen", handleMessagesSeen);

    //     // ✅ Cleanup function
    //     return () => {
    //         socket.off("messagesSeen", handleMessagesSeen);
    //     };
    // }, [socket, conversation, messages, setMessages, authUser]);


    useEffect(() => {
        if (!socket || !conversation || !messages?.length) return;
    
        const lastMessage = messages[messages.length - 1];
        const lastMessageSenderId = lastMessage?.senderId?._id || lastMessage?.senderId;
    
        // ✅ Ensure last message is from the other user & is unseen
        const lastMessageIsFromOtherUser = lastMessageSenderId && lastMessageSenderId !== authUser?._id;
    
        if (lastMessageIsFromOtherUser && !lastMessage?.seen) {
            console.log("🔵 Emitting markMessagesAsSeen:", {
                conversationId: conversation._id,
                userId: conversation?.adminId._id, // Client ID
            });
    
            socket.emit("markMessagesAsSeen", {
                conversationId: conversation._id,
                userId: conversation?.adminId._id, // Client ID
            });
        }
    
        // ✅ Define event handler for updating seen messages
        const handleMessagesSeen = ({ conversationId }) => {
            if (String(conversation._id) === String(conversationId)) {
                console.log("✅ Messages seen for conversation:", conversationId);
    
                setMessages((prev) =>
                    prev.map((message) =>
                        !message.seen ? { ...message, seen: true } : message
                    )
                );
            }
        };
    
        // ✅ Attach event listener
        socket.on("messagesSeen", handleMessagesSeen);
    
        // ✅ Cleanup function
        return () => {
            socket.off("messagesSeen", handleMessagesSeen);
        };
    }, [socket, conversation, messages, setMessages, authUser]);
    




    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="">
            {isChatOpen && (
                <div className="chat-overlay">
                    {/* Product Details Card */}
                    {showDetails && (
                        <div className="product-details">
                            <button
                                className="close-details-btn"
                                onClick={() => setShowDetails(false)}
                            >
                                ×
                            </button>
                            <img src={order?.OrderItems[0]?.thumbnailImage.url} alt="Product" />
                            <h3>{order?.OrderItems[0]?.title}</h3>
                            <p className="product-price">₹{order?.OrderItems[0]?.selectedPlan?.price}</p>
                            <p className="product-description" style={{
                                fontSize: "14px"
                            }}>
                                {order?.OrderItems[0]?.selectedPlan?.shortDescription}
                            </p>
                            <div style={{
                                padding: "0.4rem 0.2rem",
                                marginTop: "0.8rem"
                            }}>
                                <span className="status-pill">{order?.orderStatus}</span>
                            </div>
                        </div>
                    )}

                    <div className="chat-container">
                        <div className="chat-main">
                            {/* Chat Header */}
                            <div className="chat-header">
                                <div className="user-info">
                                    <img
                                        src={conversation?.adminId?.avatar?.url || 'https://via.placeholder.com/40'}
                                        alt="Admin"
                                        className="user-photo"
                                    />
                                    <div>
                                        <h3>{conversation?.adminId?.name || 'Support Team'}</h3>
                                        <p className="online-status">
                                            {onlineUsers?.includes(conversation?.adminId?._id) ?
                                                'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>

                                <div className="header-controls">
                                    <button
                                        className="view-details-btn"
                                        onClick={() => setShowDetails(!showDetails)}
                                    >
                                        {showDetails ? 'Hide Details' : 'View Details'}
                                    </button>
                                    <FaWindowClose
                                        className="close-chat-icon"
                                        onClick={() => setIsChatOpen(false)}
                                    />
                                </div>
                            </div>

                            {/* Order Subhead */}
                            <div className="subhead" style={{
                                padding: '12px 16px',
                                background: '#18181f',
                                borderBottom: '1px solid #46474c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#5eead4'
                            }}>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    opacity: '0.8'
                                }}>
                                    Conversation for Order
                                </span>
                                <span style={{
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    letterSpacing: '-0.2px'
                                }}>
                                    #{orderId}
                                </span>
                            </div>

                            {/* Chat Messages */}
                            <div className="messages-container">
                                {
                                    messageLoading ? (
                                        // Show skeleton loaders when loading
                                        <>
                                            <MessageSkeleton isSender={false} />
                                            <MessageSkeleton isSender={true} />
                                            <MessageSkeleton isSender={false} />
                                            <MessageSkeleton isSender={true} />
                                        </>
                                    ) : messages?.map((message) => {
                                        const isSender = message?.senderId === authUser?._id;
                                        return (
                                            <div
                                                key={message?._id}
                                                className={`message ${isSender ?
                                                    'sender' : 'receiver'}`}
                                                ref={messages?.length - 1
                                                    === messages.indexOf(message) ?
                                                    lastMessageRef : null}
                                            >
                                                {!isSender && (
                                                    <img
                                                        src={conversation?.adminId?.avatar?.url || 'https://via.placeholder.com/32'}
                                                        alt="Admin"
                                                        className="message-photo"
                                                    />
                                                )}
                                                <div className="message-content">
                                                    <p>{message?.messageText}</p>
                                                    <div className="message-status">
                                                        <span className="time">
                                                            {format(new Date(message?.createdAt), 'hh:mm a')}
                                                        </span>
                                                        {isSender && (
                                                            <span className={`status 
                                                            ${message?.seen ? 'seen' : 'delivered'}`}>
                                                                {message?.seen ? '✓✓' : '✓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }

                            </div>

                            {/* Chat Input */}
                            <form className="input-container" onSubmit={sendMessageHandle}>
                                <button type="button" className="file-btn">
                                    <FaPlus />
                                </button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    className="send-btn"
                                    disabled={loading || !messageInput.trim()}
                                >
                                    {loading ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatUI;