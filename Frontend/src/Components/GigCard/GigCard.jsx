import React from "react";
import { FaStar } from "react-icons/fa";
import "./GigCard.css";
import { Link } from "react-router-dom";


const GigCard = ({gig}) => {

  return (
   <Link to={`/my-gig/${gig?._id}`}>
     <div className="gig-card">
      <img src={gig?.thumbnailImages[0]?.url} alt="Product" className="gig-card-image" />
      <div className="gig-card-content">
        <h3 className="gig-card-title" title={gig?.title}>
          {gig?.title}
        </h3>
        <div className="gig-card-rating">
          <FaStar className="gig-star-icon" /> {gig?.ratings} ({gig?.reviews?.length})
        </div>
        <p className="gig-card-price">From ₹{gig?.PricingPlans[0]?.price}</p>
      </div>
    </div>
   </Link>
  );
};

export default GigCard;
