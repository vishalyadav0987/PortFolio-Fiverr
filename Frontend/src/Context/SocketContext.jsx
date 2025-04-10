import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuthContext } from './AuthContext';

export const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    //  console.log("Api url: ",import.meta.env.VITE_BACKEND_TARGET_URL);
    //  console.log("Admin Id: ",import.meta.env.VITE_ADMIN_ID);

    useEffect(() => {
        if (!authUser?._id) return;
        const newSocket = io(import.meta.env.VITE_BACKEND_TARGET_URL, {
            query: { userId: authUser?._id },
            withCredentials: true
        });
        
        setSocket(newSocket);
        newSocket.emit("join", authUser?._id);
        newSocket.on("getOnlineUsers", setOnlineUsers);
        
        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [authUser?._id]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
