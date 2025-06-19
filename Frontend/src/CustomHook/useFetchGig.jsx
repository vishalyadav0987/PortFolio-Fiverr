import { useEffect } from "react";
import axiosInstance from '../axiosConfig';
import { useGigContext } from "../Context/gigContext";

const useFetchGigs = (id) => {
    const { setSingleGig, setLoading } = useGigContext();

    useEffect(() => {
        const fetchGigs = async () => {
            setLoading(true); // API कॉल से पहले लोडिंग स्टेट सेट करें
            try {
                const response = await axiosInstance.get(`/gig/get/${id}`);
                setSingleGig(response.data.gig);
            } catch (err) {
                TransformStream.error("Error fetching gigs")
                console.error("Error fetching gigs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGigs();
    }, [setSingleGig, setLoading]); // Dependencies Add किए

    return {}; // अगर बाद में कुछ और return करना हो तो यहां एड कर सकते हो
};

export default useFetchGigs;
