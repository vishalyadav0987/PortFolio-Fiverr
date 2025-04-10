import React, { useEffect } from "react";
import { FaStar, FaTrash, FaUserCircle } from "react-icons/fa";
import "./ReviewsFeedback.css";
import { useOrderContext } from "../../Context/OrderContext";
import { format } from 'date-fns'
import { Rating } from '@mui/material';
import useFetchAllReview  from '../../CustomHook/useFetchAllReview'



const ReviewsFeedback = () => {
  const { allReviews, setAllReviews } = useOrderContext();

  /*-----------Get all reviews of a gig-----------*/
  useFetchAllReview();
  /*-----------Get all reviews of a gig-----------*/

  allReviews.sort((b,a) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });


  const handleDeleteReview = (id) => {
    setAllReviews(reviews.filter((review) => review.id !== id));
  };

  const overallRating = allReviews && allReviews?.reduce((sum, review) => sum + Number(review.rating), 0) / allReviews?.length || 0;

  const options = {
    value: overallRating,
    size: "large",
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="review-admin">
      <header className="gigs-header">
        <h1>Customer Reviews <span>Dashboard</span></h1>
      </header>

      <div className="review-admin-stats-container">
        <div className="review-admin-stat-box" style={{ backgroundColor: '#1a272c' }}>
          <span className="review-admin-stat-value">{overallRating.toFixed(1)}</span>
          <span className="review-admin-stat-label">Overall Rating</span>
          <div className="review-admin-stars">
            <Rating {...options} />
          </div>
        </div>

        <div className="review-admin-stat-box" style={{ backgroundColor: '#1a272c' }}>
          <span className="review-admin-stat-value">{allReviews?.length}</span>
          <span className="review-admin-stat-label">Total Reviews</span>
        </div>
      </div>

      <div className="review-admin-reviews-container">
        {allReviews && allReviews?.map((review) => (
          <div className="review-admin-card" key={review.createdAt} style={{ backgroundColor: '#18181f' }}>
            <div className="review-admin-card-header">
              <div className="review-admin-user-info">
                {review.avatar ? (
                  <img src={review.avatar} alt={review?.name} className="review-admin-user-photo" />
                ) : (
                  <FaUserCircle className="review-admin-user-icon" />
                )}
                <div>
                  <h3 style={{ color: '#5eead4' }}>{review?.user.name}</h3>
                  <span className="review-admin-timestamp">
                    {



                      format(new Date(review.createdAt), "MMMM d, yyyy")
                    }
                  </span>
                </div>
              </div>
              <div className="review-admin-rating-badge">
                <span>{review.rating}/5</span>
                <FaStar className="review-admin-star-icon" />
              </div>
            </div>

            <p className="review-admin-comment">{review.comment}</p>

            <button
              className="review-admin-delete-btn"
              onClick={() => handleDeleteReview(review._id)}
              style={{ backgroundColor: '#0d9488' }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsFeedback;