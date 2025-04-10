import { useEffect } from "react";
import axios from "axios";
import { useOrderContext } from "../Context/OrderContext";

const useFetchOrderById = (orderId) => {
    const { setSingleOrder, setLoading } = useOrderContext();

    useEffect(() => {
        const fetchOrderById = async () => {
            setLoading(true); // API कॉल से पहले लोडिंग स्टेट सेट करें
            try {
                const response = await axios.get(`/api/v1/gig/order/${orderId}`);
                setSingleOrder(response.data.order);
            } catch (err) {
                TransformStream.error("Error fetching gigs")
                console.error("Error fetching gigs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderById();
    }, [setSingleOrder, setLoading]); // Dependencies Add किए

    return {}; // अगर बाद में कुछ और return करना हो तो यहां एड कर सकते हो
};

export default useFetchOrderById;
