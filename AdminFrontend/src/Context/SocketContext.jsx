import { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socketRef = useRef(null);
    // console.log("Api url: ",import.meta.env.VITE_BACKEND_TARGET_URL);
    //  console.log("Admin Id: ",import.meta.env.VITE_ADMIN_ID);
    
    useEffect(() => {
        const adminId = localStorage.getItem("adminId") || import.meta.env.VITE_ADMIN_ID;
        const newSocket = io(import.meta.env.VITE_BACKEND_TARGET_URL, {
            query: { userId: adminId },
            withCredentials: true
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
        newSocket.emit("join", adminId);
        
        newSocket.on("getOnlineUsers", setOnlineUsers);
        
        return () => {
            newSocket.off("getOnlineUsers", setOnlineUsers);
            newSocket.disconnect();
            setSocket(null);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};