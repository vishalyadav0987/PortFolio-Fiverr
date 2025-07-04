import { useEffect, useState } from "react";
import axiosInstance from '../axiosConfig';

const useFetchAllReview = () => {
    const [allReviews, setAllReviews] = useState([])
    const [loading, setLoading] = useState(false)

    const getGigAllReviews = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(`/gig/reviews`);
            if (response.data.success) {
                setAllReviews(response.data.reviews);
            }

        } catch (error) {
            console.log("Error while getting gig reviews: ", error);
            toast.error("Error while getting gig reviews");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getGigAllReviews();
    }, [setAllReviews]);

    return { allReviews, loading };
};

export default useFetchAllReview;
