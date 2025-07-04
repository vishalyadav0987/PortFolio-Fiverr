import React, { useState } from 'react'
import { useMessageContext } from '../Context/MessageContext'
import axios from 'axios';
import toast from 'react-hot-toast';

const useGetMessageByOrderId = () => {
    const { setMessages } = useMessageContext();
    const [messageLoading,setMessageLoading] = useState(false)
    const getMessageByOrderId = async(orderId)=>{
        setMessageLoading(true)
        try {
            const response = await axios.post('https://portfolio-fiverr.onrender.com/api/v1/communicate/order-messages',{orderId},{
                withCredentials: true, // If you need to send cookies or authentication headers
            });
            if(response.data.success){
                // console.log(response.data.messages);
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.log("Error in useGetMessageByOrderId hook ",error);
            toast.error('Error fetching messages');
        }finally{
            setMessageLoading(false)
        }
    }

    return {getMessageByOrderId,messageLoading};
}

export default useGetMessageByOrderId
