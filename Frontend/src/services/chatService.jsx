import axiosInstance from '../axiosConfig';

const fetchConversationByOrderId = async (orderId) => {
    try {
        const response = await axiosInstance.post("/communicate/order/user-conversation", { orderId });
        return response.data;
    } catch (error) {
        console.error("Error fetching conversation:", error);
        return { success: false, message: error.response?.data?.message || "Failed to fetch conversation" };
    }
};

export {fetchConversationByOrderId};
