import { useEffect } from "react";
import axios from "axios";
import { useGigContext } from "../Context/gigContext";

const useFetchAllGigs = () => {
    const { setAllGigs, setLoading } = useGigContext();

    useEffect(() => {
        const fetchGigs = async () => {
            setLoading(true); // API कॉल से पहले लोडिंग स्टेट सेट करें
            try {
                const response = await axios.get("https://portfolio-fiverr.onrender.com/api/v1/gig/get",{
                    withCredentials: true, // अगर आपको क्रॉस-ओरिजिन क्रेडेंशियल्स की जरूरत है
                });
                setAllGigs(response.data.gigs);
            } catch (err) {
                TransformStream.error("Error fetching gigs")
                console.error("Error fetching gigs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGigs();
    }, [setAllGigs, setLoading]); // Dependencies Add किए

    return {}; // अगर बाद में कुछ और return करना हो तो यहां एड कर सकते हो
};

export default useFetchAllGigs;
