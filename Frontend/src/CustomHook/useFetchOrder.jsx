import { useEffect } from "react";
import axiosInstance from '../axiosConfig';
import { useOrderContext } from "../Context/OrderContext";

const useFetchUserOrder = () => {
    const { setAllOrders, setLoading } = useOrderContext();

    useEffect(() => {
        const fetchUserOrder = async () => {
            setLoading(true); // API कॉल से पहले लोडिंग स्टेट सेट करें
            try {
                const response = await axiosInstance.get(`/gig/order/user-orders`);
                setAllOrders(response.data.orders);
            } catch (err) {
                TransformStream.error("Error fetching gigs")
                console.error("Error fetching gigs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrder();
    }, [setAllOrders, setLoading]); // Dependencies Add किए

    return {}; // अगर बाद में कुछ और return करना हो तो यहां एड कर सकते हो
};

export default useFetchUserOrder;
