import { useEffect, useState } from "react";
import { useSocketContext } from '../../Context/SocketContext';
import axios from 'axios';

const Notify = () => {
    const { socket } = useSocketContext();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch stored notifications from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await axios.get("https://portfolio-fiverr.onrender.com/api/v1/notify/admin-notifications",{
                    withCredentials: true, // If you need to send cookies or authentication headers
                });
                console.log(data);
                
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.filter(n => !n.isRead).length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, []);

    // Listen for real-time notifications
    useEffect(() => {
        socket?.on("newOrderNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            socket?.off("newOrderNotification");
        };
    }, [socket]);

    const markAsRead = () => {
        setUnreadCount(0);
        // Optionally send request to mark all as read in backend
    };

    return (
        <div>
            <button onClick={markAsRead}>
                Notifications ({unreadCount})
            </button>
            <ul>
                {notifications.map((notif, index) => (
                    <li key={index}>{notif.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notify;
