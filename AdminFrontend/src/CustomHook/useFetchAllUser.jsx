import { useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../Context/UserContext";

const useFetchAllUser = () => {
    const {  setAllRegisteredUser,setLoading } = useUserContext();

    const getGigAllUser = async () => {
        setLoading(true)
        try {
          const response = await axios.get(`/api/v1/user/get-all-user`);
          if (response.data.success) {    
            setAllRegisteredUser(response.data.data);
          }
    
        } catch (error) {
          console.log("Error while getting gig reviews: ", error);
          toast.error("Error while getting gig reviews");
        }finally{
            setLoading(false)
        }
      }

       useEffect(() => {
          getGigAllUser();
        }, [setAllRegisteredUser,setLoading]);

    return {}; 
};

export default useFetchAllUser;
