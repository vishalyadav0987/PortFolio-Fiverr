import React, { useEffect, useState } from 'react';
import { FiBell, FiX, FiPackage, FiDollarSign, FiRefreshCw, FiMessageSquare } from 'react-icons/fi';
import { useSocketContext } from '../../Context/SocketContext';
import axios from 'axios';
import './Notification.css';
import toast from 'react-hot-toast'
import {
    FaBoxOpen,
    FaEye,
    FaRegCheckCircle,
    FaEnvelope,
} from 'react-icons/fa';
import { FaRepeat } from "react-icons/fa6";
import { useAuthContext } from '../../Context/AuthContext';

const typeNot = [
    {
        id: 1,
        type: 'update_order_status',
        icon: FaBoxOpen,
        betterText: '🎉 Your Order Staus has been updated',
    },
    {
        id: 2,
        type: 'update_revision_status',
        icon: FaRepeat,
        betterText: '🔄 Your Revision Request has been updated',
    },
    {
        id: 3,
        type: 'new_message',
        icon: FaEnvelope, // Better icon for messages
        betterText: '📩 New message received! Check your inbox for details.'
    }
];

const NotificationCenter = () => {
    const { socket } = useSocketContext();
    const {authUser} = useAuthContext()
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch stored notifications from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await
                    axios.get(`/api/v1/notify/client/client-notifications/${authUser?._id}`);
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

            toast.success(notificationType === "new_message" ? message : matchedType?.betterText, {
                className: 'toaster',
                duration: 10000,
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
               
            });

            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        socket?.on("updateOrderStatusNotification", handleNotification);
        socket?.on("updateRevisionStatusNotification", handleNotification);
        socket?.on("newMessageUser", handleNotification);

        return () => {
            socket?.off("updateOrderStatusNotification", handleNotification);
            socket?.off("updateRevisionStatusNotification", handleNotification);
            socket?.off("newMessageUser", handleNotification);
        };
    }, [socket]);


    const handleNotificationClick = async (id) => {

        try {
            const { data } = await axios.post(`/api/v1/notify/client/client-mark-read/${id}`);
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
            const { data } = await axios.post("/api/v1/notify/client/client-mark-all-read");
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
                <FiBell fontSize={"20px"} style={{
                    fill:isOpen && "#5eead4"
                }}/>
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