import React, { useEffect, useState } from 'react';
import { FiBell, FiX, FiPackage, FiDollarSign, FiRefreshCw, FiMessageSquare } from 'react-icons/fi';
import { useSocketContext } from '../../Context/SocketContext';
import axios from 'axios';
import './Notification.css';
import toast from 'react-hot-toast'
import {
    FaBoxOpen,         // For orders
    FaEdit,            // For editing actions
    FaCommentDots,     // For reviews
    FaCreditCard,      // For payments
    FaEye,
    FaRegCheckCircle,
    FaEnvelope,
    FaUser,         // For recurring/repeat payments
} from 'react-icons/fa';
import { FaRepeat } from "react-icons/fa6";
  
  const typeNot = [
      {
          id: 1,
          type: 'new_order',
          icon: FaBoxOpen,
          betterText: '🎉 New order received! Check your dashboard for details.'
      },
      {
          id: 2,
          type: 'edit_order_review',
          icon: FaEdit,
          betterText: '✏️ Your order review has been updated successfully.'
      },
      {
          id: 3,
          type: 'new_order_review',
          icon: FaCommentDots,
          betterText: '🌟 New review received! Check what your client said.'
      },
      {
          id: 4,
          type: 'edit_gig_review',
          icon: FaEdit,
          betterText: '📝 Your gig review has been updated.'
      },
      {
          id: 5,
          type: 'new_review',
          icon: FaCommentDots,
          betterText: '⭐ You have a new review! Check it out now.'
      },
      {
          id: 6,
          type: 'full_payment',
          icon: FaCreditCard,
          betterText: '💳 Payment received! Thank you for your purchase.'
      },
      {
          id: 7,
          type: 'revision_request',
          icon: FaRepeat,
          betterText: '🔄 Revision requested. Please check the order details.'
      },
      {
        id: 8,
        type: 'new_message',
        icon: FaEnvelope, // Better icon for messages
        betterText: '📩 New message received! Check your inbox for details.'
    },
    {
        id: 9,
        type: 'new_user_joined',
        icon: FaUser, // Better icon for messages
        betterText: '🎉 New User Joined!'
    }
  ];

const NotificationCenter = () => {
    const { socket } = useSocketContext();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch stored notifications from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await axios.get("/api/v1/notify/admin-notifications");
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter(n => !n.isRead).length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, []);

    // Socket listeners for real-time updates
    useEffect(() => {
        const handleNotification = (notification) => {
            // 1. Use the notification argument instead of data.notifications
            const notificationType = notification?.type;
            const message = notification?.message || notificationType || 'New notification';

            // 2. Find icon using the received notification type
            const matchedType = typeNot.find(not => not.type === notificationType);
            const IconComponent = matchedType?.icon;

            toast.success(matchedType?.betterText, {
                className: 'toaster',
                duration: 6000,
                icon: IconComponent ? (
                    <IconComponent className="toaster-icon" fontSize={"26px"} />
                ) : (
                    <svg
                        className="toaster-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                ),
                closeButton: ({ closeToast }) => (
                    <button
                        onClick={closeToast}
                        className="toaster-close"
                        aria-label="Close notification"
                    >
                        <svg
                            className="toaster-close-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                )
            });

            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        socket?.on("newOrderNotification", handleNotification);
        socket?.on("newReviewNotification", handleNotification);
        socket?.on("editReviewNotification", handleNotification);
        socket?.on("revisionRequestNotification", handleNotification);
        socket?.on("fullPaymentNotification", handleNotification);
        socket?.on("newMessageAdmin", handleNotification);
        socket?.on("newUserJoined", handleNotification);

        return () => {
            socket?.off("newOrderNotification", handleNotification);
            socket?.off("newReviewNotification", handleNotification);
            socket?.off("editReviewNotification", handleNotification);
            socket?.off("revisionRequestNotification", handleNotification);
            socket?.off("fullPaymentNotification", handleNotification);
            socket?.off("newMessageAdmin", handleNotification);
            socket?.off("newUserJoined", handleNotification);
        };
    }, [socket]);


    const handleNotificationClick = async (id) => {

        try {
            const { data } = await axios.post(`/api/v1/notify/mark-read/${id}`);
            if(data.success){
                toast.success('Message marked as seen', {
                    className: 'toaster',
                    duration: 3000,
                    icon: <FaRegCheckCircle className="toaster-icon" />, 
                });
            }

            setNotifications(prev =>
                prev
                    .map(notification => {
                        if (notification._id === id) {
                            return { ...notification, isRead: true };
                        }
                        return notification;
                    })
                    .filter(notification => !(notification.type === 'new_message' && notification.isRead)) 
            );
        
           
            setUnreadCount(prev => {
                const notification = notifications.find(n => n._id === id);
                return notification && !notification.isRead ? prev - 1 : prev;
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const { data } = await axios.post("/api/v1/notify/mark-all-read");
            // console.log(data.success);
            if(data.success){
                toast.success('All messages marked as seen', {
                    className: 'toaster',
                    duration: 3000,
                    icon: <FaEye className="toaster-icon" />, 
                });
            }
            setNotifications(prev =>
                prev
                    .map(notification => ({ ...notification, isRead: true })) 
                    .filter(notification => !(notification.type === 'new_message' && notification.isRead)) 
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    return (
        <div className="notification-container">
            <button className="bell-icon" onClick={() => setIsOpen(!isOpen)}>
                <FiBell fontSize={"20px"} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications ({notifications?.length})</h3>
                        <div className="header-actions">
                            <button onClick={handleMarkAllRead} className="mark-all-read">
                                Mark all as read
                            </button>
                            <FiX className="close-icon" onClick={() => setIsOpen(false)} />
                        </div>
                    </div>

                    <div className="notification-list">
                        {notifications.map(notification => (
                            <div
                                key={notification._id}
                                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                onClick={() => handleNotificationClick(notification._id)}
                            >
                                <div className="notification-icon">
                                    {notification.type === 'order' && <FiPackage />}
                                    {notification.type === 'payment' && <FiDollarSign />}
                                    {notification.type === 'revision' && <FiRefreshCw />}
                                    {notification.type === 'review' && <FiMessageSquare />}
                                </div>
                                <div className="notification-content">
                                    <p className="message">{notification.message}</p>
                                    <div className="meta">
                                        <span className="time">
                                            {new Date(notification.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        {!notification.isRead && (
                                            <span className="unread-dot"></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="notification-footer">
                        <a href="/notifications">View all notifications</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;