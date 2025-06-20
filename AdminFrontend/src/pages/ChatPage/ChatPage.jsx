// ChatPage.jsx
import { useEffect, useRef, useState } from 'react';
import { FaWindowClose, FaRegClock, FaTag, FaPaperPlane, FaImage, FaChevronRight, FaCheckCircle } from 'react-icons/fa';
import './ChatPage.css';
import useFetchOrderConversation from '../../CustomHook/useFetchOrderConversation';
import { useMessageContext } from '../../Context/MessageContext';
import { useSocketContext } from '../../Context/SocketContext';
import Spinner from '../../components/Spinner/Spinner'
import useGetMessageByOrderId from '../../CustomHook/useGetMessageByOrderId';
import axios from 'axios';
import toast from 'react-hot-toast';
import MessageSound from '../../../src/assests/message.mp3'
import { TbRepeatOff } from "react-icons/tb";

const ChatPage = ({ splashImage }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sendMessLoading, setSendMessLoading] = useState(false)



  /**********************************************************
          Get converstion of Admin based on order
  **********************************************************/
  const { onlineUsers } = useSocketContext()

  const { loading } = useFetchOrderConversation();
  const { conversations,
    messages,
    setMessages,
    setConversations,
    selectedConversation,
    setSelectedConversation
  } = useMessageContext();
  const AdminId = import.meta.env.VITE_ADMIN_ID;
  // console.log(AdminId);
    

  const { socket } = useSocketContext();

  const { getMessageByOrderId, messageLoading } = useGetMessageByOrderId()


  const sendMessageHandle = async (e) => {

    e.preventDefault();
    if (!messageInput.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    setSendMessLoading(true);

    try {
      const response = await axios.post(
        'https://portfolio-fiverr.onrender.com/api/v1/communicate/send-message',
        {
          messageText: messageInput,
          orderId: selectedConversation?.orderId?._id,
          senderId: import.meta.env.VITE_ADMIN_ID // Use authenticated user ID
        },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Message sent successfully");

        // Use response data directly from server
        setMessages(prev => [...prev, response.data.message]);

        setConversations((prevCon) =>
          prevCon.map((conversation) =>
            conversation._id === selectedConversation._id ? {
              ...conversation,
              lastMessage: response.data.message
            } : conversation
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSendMessLoading(false);
      setMessageInput("");
    }
  };

  // const sendMessageHandle = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('/api/v1/communicate/send-message', {
  //       messageText: messageInput,
  //       orderId: selectedConversation?.orderId?._id,
  //       senderId: AdminId
  //     });

  //     if (response.data.success) {
  //       // Optimistic update with temporary ID
  //       const tempMessage = {
  //         ...response.data.message,
  //         _id: `temp-${Date.now()}`
  //       };

  //       setMessages(prev => [...prev, tempMessage]);

  //       // Replace with server response
  //       setTimeout(() => {
  //         setMessages(prev => [
  //           ...prev.filter(msg => msg._id !== tempMessage._id),
  //           response.data.message
  //         ]);
  //       }, 100);
  //     }
  //   } catch (error) {
  //     // Rollback on error
  //     setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
  //   } finally {
  //     setMessageInput("");
  //   }
  // };


  useEffect(() => {
    if (!selectedConversation || !socket) return;

    socket.emit("joinConversation", selectedConversation._id);


    const handleNewMessage = (message) => {
      // console.log('Received message:', message);

      if (message.senderId === AdminId) return;
      if (message.conversationId === selectedConversation._id &&
        !messages.some(msg => msg._id === message._id)) {

        setMessages(prev => {
          // Check duplicates using previous state
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });


        if (!document.hasFocus()) {
          new Audio(MessageSound).play();
        }


      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation, messages]);


  useEffect(() => {
    setConversations(prev => prev.map(convo =>
      convo._id === selectedConversation?._id
        ? { ...convo, lastMessage: messages[messages.length - 1] }
        : convo
    ));
  }, [messages]);



  //   useEffect(() => {
  //     if (!socket || !selectedConversation?._id || !messages?.length) return;

  //     const AdminId = import.meta.env.VITE_ADMIN_ID; // Define AdminId

  //     const lastMessage = messages[messages.length - 1];
  //     const lastMessageSenderId = lastMessage?.senderId?._id || lastMessage?.senderId;

  //     const lastMessageIsFromOtherUser = lastMessageSenderId && lastMessageSenderId !== AdminId;

  //     // ✅ Only emit event if the last message is unseen
  //     if (lastMessageIsFromOtherUser && !lastMessage.seen) {
  //         console.log("🔵 Emitting markMessagesAsSeen:", {
  //             conversationId: selectedConversation._id,
  //             userId: selectedConversation?.buyerId._id, // Receiver Id
  //         });

  //         socket.emit("markMessagesAsSeen", {
  //             conversationId: selectedConversation?._id,
  //             userId: selectedConversation?.buyerId._id, // Receiver Id
  //         });
  //     }

  //     // ✅ Clean up the previous event listener before adding a new one
  //     const handleMessagesSeen = ({ conversationId }) => {
  //         if (selectedConversation._id === conversationId) {
  //             console.log("✅ Messages seen for conversation:", conversationId);

  //             setMessages((prev) =>
  //                 prev.map((message) =>
  //                     message.seen ? message : { ...message, seen: true }
  //                 )
  //             );
  //         }
  //     };

  //     socket.on("messagesSeen", handleMessagesSeen);

  //     return () => {
  //         socket.off("messagesSeen", handleMessagesSeen); // ✅ Cleanup old listeners
  //     };
  // }, [socket, selectedConversation, messages, setMessages]);




  useEffect(() => {
    if (!socket || !selectedConversation?._id || !messages?.length) return;

    const AdminId = import.meta.env.VITE_ADMIN_ID; // Admin ID fixed

    const lastMessage = messages[messages.length - 1];
    const lastMessageSenderId = lastMessage?.senderId?._id || lastMessage?.senderId;

    // ✅ Ensure last message is from Client (Buyer) & is unseen
    const lastMessageIsFromClient = lastMessageSenderId && lastMessageSenderId !== AdminId;

    if (lastMessageIsFromClient && !lastMessage?.seen) {
      console.log("🔵 Admin emitting markMessagesAsSeen:", {
        conversationId: selectedConversation._id,
        userId: selectedConversation?.buyerId._id, // Client ID
      });

      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation?.buyerId._id, // Client ID
      });
    }

    // ✅ Define event handler
    const handleMessagesSeen = ({ conversationId }) => {
      if (String(selectedConversation._id) === String(conversationId)) {
        console.log("✅ Messages seen for conversation:", conversationId);

        setMessages((prev) =>
          prev.map((message) =>
            message.seen ? message : { ...message, seen: true }
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
  }, [socket, selectedConversation, messages, setMessages]);




  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
    
  }, [messages])

  





  return (
    <div className="chat-app-container">
      {/* Conversations Sidebar */}
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <h2>Customer Support</h2>
          <div className="active-status">
            <span className="status-indicator"></span>
            <span>{onlineUsers && onlineUsers?.length} Active</span>
          </div>
        </div>

        <div className="conversations-list">
          {
            loading ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh"
              }}>
                <Spinner />
              </div>
            ) : (
              conversations &&
              conversations?.length > 0 &&
              conversations?.map((convo) => (
                <div
                  key={convo._id}
                  className={`conversation-item ${selectedConversation?._id === convo._id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedConversation(convo)
                    getMessageByOrderId(convo?.orderId?._id);
                  }}
                >
                  <div className="conversation-meta">
                    <img
                      src={convo.orderId.OrderItems[0]?.thumbnailImage?.url || 'https://res.cloudinary.com/du6ukwxhb/image/upload/v1741790409/products/ktfbrmkabunqumjnx4bd.webp'}
                      alt="Order"
                      className="order-thumbnail"
                    />
                    <div className="conversation-info">
                      <h4>{convo?.buyerId?.name}</h4>
                      <p className="message-preview">
                        {convo.lastMessage?.messageText || "New conversation"}
                        {/* {
                          lastConversationMessage  &&
                          !lastConversationMessage.seen && (
                            <span style={{
                              display: "inline-block",
                              width: "9px",
                              height: "9px",
                              background: "#03ff88",
                              marginLeft: "10px",
                              borderRadius: "50%"
                            }}></span>
                          )
                        } */}
                      </p>
                      <div className="order-tags" style={{
                        alignItems: "center",
                        gap: "0.8rem"
                      }}>
                        <span className="order-id">#{convo?.orderId?._id.slice(-6)}</span>
                        <span className="plan-type">
                          <FaTag /> {convo?.orderId?.OrderItems[0]?.selectedPlan?.planType}
                        </span>
                        {
                          convo?.orderId?.orderStatus === "Delivered" && (
                            <span className="plan-type">
                              <FaCheckCircle fontSize={"15px"} color='#2fd573' />
                            </span>

                          )
                        }

                        {
                          !(convo?.orderId?.maxRevisions - convo?.orderId?.usedRevisions) && (
                            <span className="plan-type">
                              <TbRepeatOff fontSize={"16px"} color='#dc3545' />
                            </span>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <FaChevronRight className="chevron-icon" />
                </div>
              ))
            )
          }
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat-area">
        {selectedConversation ? (
          <div className="chat-content-wrapper">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="header-left">
                <img
                  src={selectedConversation?.orderId?.OrderItems[0]?.thumbnailImage?.url || splashImage}
                  alt="Order"
                  className="product-image"
                />
                <div className="product-info">
                  <h3>{selectedConversation?.orderId?.OrderItems[0]?.title}</h3>
                  <div className="order-status" style={{
                    display: "flex",
                    gap: "8px"
                  }}>
                    <span className="status-pill">
                      {selectedConversation?.orderId.orderStatus}
                    </span>
                    <span className="order-id">
                      Order #{selectedConversation?.orderId?._id.slice(-6)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="header-controls">
                <button
                  className="details-btn"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide Details' : 'View Details'}
                </button>
                <FaWindowClose
                  className="close-icon"
                  onClick={() => setSelectedConversation(null)}
                />
              </div>
            </div>

            {/* Messages Container */}
            <div className="messages-container"

            >
              {messages?.map((message) => {

                const isSender = (message.senderId._id ?
                  message.senderId._id : message.senderId) === AdminId
                return (
                  <div key={message._id}
                    className={`message-row ${isSender ? 'right' : 'left'}`}
                    ref={messages?.length - 1 === messages.indexOf(message) ? lastMessageRef : null}
                  >
                    {!isSender && (
                      <img
                        src={selectedConversation?.buyerId?.avatar.url || 'http://res.cloudinary.com/du6ukwxhb/image/upload/v1742047691/avatars/ng5crl4qk4gv3vej2rns.webp'}
                        alt="sender"
                        className="sender-avatar"
                      />
                    )}
                    <div className={`message-wrapper ${isSender ? 'sent' : 'received'}`}>
                      <div className={`message-bubble ${isSender ? 'sent' : 'received'}`}>
                        <div className="message-content">
                          <p className="message-text">{message.messageText}</p>
                          <div className="message-meta">
                            <span className="time">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isSender && (
                              <span className={`status ${message.seen ? 'seen' : 'delivered'}`}>
                                {message.seen ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <form className="message-input-container" onSubmit={sendMessageHandle}>
              <button type="button" className="attach-btn">
                <FaImage />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
              />
              <button type="submit" className="send-btn" disabled={sendMessLoading}>
               
                {
                  sendMessLoading ? "sending..." :  <FaPaperPlane />
                }
              </button>
            </form>

            {/* Order Details Overlay */}
            {showDetails && (
              <div className="details-overlay">
                <div className="details-card">
                  <div className="card-header">
                    <h3>Order Details</h3>
                    <button
                      className="close-btn"
                      onClick={() => setShowDetails(false)}
                    >
                      <FaWindowClose />
                    </button>
                  </div>

                  <div className="card-content">
                    <div className="thumbnail-section">
                      <img
                        src={selectedConversation.orderId?.OrderItems[0]?.thumbnailImage?.url || splashImage}
                        alt="Order"
                        className="detail-thumbnail"
                      />
                      <div className="plan-info">
                        <h4>{selectedConversation.orderId?.OrderItems[0]?.title}</h4>
                        <div className="plan-meta">
                          <span><FaRegClock /> {selectedConversation.orderId?.OrderItems[0]?.selectedPlan?.deliveryDays} days delivery</span>
                          <span>{selectedConversation.orderId?.OrderItems[0]?.selectedPlan?.revisionCount} revisions</span>
                        </div>
                      </div>
                    </div>

                    <div className="details-section">
                      <h4><FaTag /> Included Features</h4>
                      <p>{selectedConversation.orderId?.OrderItems[0]?.selectedPlan?.shortDescription}</p>
                    </div>

                    <div className="extra-features">
                      <h4>Additional Services</h4>
                      {selectedConversation.orderId?.OrderItems[0]?.extraFeatures?.map((feature) => (
                        <div key={feature._id} className="feature-item">
                          <span className="feature-name">{feature.name}</span>
                          <span className="feature-price">+₹{feature.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <h2>Select a Conversation</h2>
              <p>Choose from your active conversations to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

