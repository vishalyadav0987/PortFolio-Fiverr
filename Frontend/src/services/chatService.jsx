import axios from "axios";

const fetchConversationByOrderId = async (orderId) => {
    
    
    try {
        const response = await axios.post("/api/v1/communicate/order/user-conversation", { orderId });
        return response.data;
    } catch (error) {
        console.error("Error fetching conversation:", error);
        return { success: false, message: error.response?.data?.message || "Failed to fetch conversation" };
    }
};

export {fetchConversationByOrderId};
