import React, { createContext, useContext, useState } from 'react'

export const MessageContext = createContext(null);

export const useMessageContext = () => {
    return useContext(MessageContext)
}

export const MessageContextProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [messages,setMessages] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    return <MessageContext.Provider value={{
        conversations,
        setConversations,
        selectedConversation,
        setSelectedConversation,
        messages,
        setMessages,
    }}>{children}</MessageContext.Provider>
}