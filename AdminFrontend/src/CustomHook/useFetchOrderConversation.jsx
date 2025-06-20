import { useEffect, useState } from 'react';
import { useMessageContext } from '../Context/MessageContext';
import axios from 'axios';

const useFetchOrderConversation = () => {
    const { setConversations } = useMessageContext();
    const [loading,setLoading] = useState(false)

    const fetchOrderConversation = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://portfolio-fiverr.onrender.com/api/v1/communicate/admin-conversation',{
                withCredentials: true, // If you need to send cookies or authentication headers
            });
            if (response.data.success) {
                // console.log(response.data.conversations);
                setConversations(response.data.conversations);
            }
        } catch (error) {
            console.log("Error in useFetchOrderConversation admin frontend ", error.message);
        }finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchOrderConversation();
    }, []);

    return { loading };
}

export default useFetchOrderConversation;
