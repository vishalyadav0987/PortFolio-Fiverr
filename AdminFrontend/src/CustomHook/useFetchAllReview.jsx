import { useEffect } from "react";
import axios from "axios";
import { useOrderContext } from "../Context/OrderContext";

const useFetchAllReview = () => {
    const {  setAllReviews } = useOrderContext();

    const getGigAllReviews = async () => {
        try {
          const response = await axios.get(`/api/v1/gig/reviews`);
          if (response.data.success) {    
            setAllReviews(response.data.reviews);
          }
    
        } catch (error) {
          console.log("Error while getting gig reviews: ", error);
          toast.error("Error while getting gig reviews");
        }
      }

       useEffect(() => {
          getGigAllReviews();
        }, [setAllReviews]);

    return {}; 
};

export default useFetchAllReview;
