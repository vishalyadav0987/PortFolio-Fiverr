import React, { createContext, useContext, useState } from 'react'

export const MessageContext = createContext(null);

export const useMessageContext = () => {
    return useContext(MessageContext)
}

export const MessageContextProvider = ({ children }) => {
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([])


    return <MessageContext.Provider value={{
        conversation,
        setConversation,
        messages,
        setMessages,
    }}>{children}</MessageContext.Provider>
}
