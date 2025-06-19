import React, { useEffect, useState } from 'react';
import './Review.css';
import { Rating } from '@mui/material';
import { FaArrowAltCircleDown, FaLocationArrow } from 'react-icons/fa';
import axiosInstance from '../../axiosConfig';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns'


const ReviewCard = ({overallRatingTheseGig, gigId, setShowGigReviewModal, showGigReviewModal }) => {
    const [showAllReview, setShowAllReview] = useState(false);
    const [gigReview, setGigReview] = useState([]);

    /*-----------Get all reviews of a gig-----------*/
    const getGigReviews = async () => {
        try {
            const response = await axiosInstance.get(`/gig/review/${gigId}`);
            if (response.data.success) {
                setGigReview(response.data.reviews);
            }

        } catch (error) {
            console.log("Error while getting gig reviews: ", error);
            toast.error("Error while getting gig reviews");
        }
    }

    useEffect(() => {
        getGigReviews();
    }, [gigId]);


    /*-----------Get all reviews of a gig-----------*/


    const [product, setProduct] = useState({
        ratings: 4.4,
        images: [
            { url: "https://res.cloudinary.com/monday-blogs/w_768,h_384,c_fit/fl_lossy,f_auto,q_auto/wp-blog/2020/12/enterprise-img.jpeg" },
            { url: "https://res.cloudinary.com/monday-blogs/w_768,h_384,c_fit/fl_lossy,f_auto,q_auto/wp-blog/2020/12/enterprise-img.jpeg" },
        ],
        reviews: [
            { _id: 1, name: "John Doe", rating: 4.5, userRevId: "1234", comment: "Great product! Highly recommend." },
            { _id: 2, name: "Jane Smith", rating: 3.0, userRevId: "5678", comment: "Good quality, but a bit expensive." },
            { _id: 3, name: "Jane Smith", rating: 5.0, userRevId: "106711", comment: "Vishal yadav truly impressed me in WEBSITE DEVELOPMENT with his attention to detail and code expertise, consistently exceeding expectations. His politeness and proactive communication made collaboration a breeze, ensuring a timely delivery. Sahil understood the short project and delivered EXACTLY what I needed. 👌" },
            { _id: 4, name: "Jane Smith", rating: 3.5, userRevId: "56278", comment: "Good quality, but a bit expensive." }
        ]
    });

    const options = {
        size: "large",
        readOnly: true,
        precision: 0.5,
    };

    return (
        <div className='review-container'>
            <div className="container">
                <div className="bottom-box">
                    <div className="left-box">
                        <h2>Customer reviews</h2>
                        <div className="review-container">
                            <Rating {...options} value={Math.round(overallRatingTheseGig)}/>
                            <span>({`${Math.round(overallRatingTheseGig)} out of 5`} Reviews)</span>
                        </div>
                        <div className="review-submit-container">
                            <h2>Review this Gig</h2>
                            <p>Share your thoughts with other customers</p>
                            <button onClick={() => {
                                setShowGigReviewModal(!showGigReviewModal)
                            }}>Write gig review here</button>
                        </div>
                    </div>
                    <div className="right-box">
                        <div className="ai-generated">
                            <h3>Customers say</h3>
                            <p className='ai-generated-text'>
                                Customers appreciate the quality and performance of this Gig. Many find it easy to use and value for money.
                            </p>
                            <span className='dummy-ai-text'>
                                AI-generated from the text of customer reviews
                            </span>
                        </div>
                        <div className="product-img">
                            <h2>Reviews with images</h2>
                            <div className="product-img-container">
                                {product.images.map((image, i) => (
                                    <img src={image.url} alt={`Slide ${i}`} key={i} />
                                ))}
                            </div>
                        </div>
                        <div className="all-review-container">
                            <h3>Top reviews</h3>
                            {gigReview && gigReview?.length > 0 ? (
                                 (showAllReview ? gigReview : gigReview.slice(0, 4))?.map((review) => (
                                    <div className="single-review" key={review._id}>
                                        <div className="header">
                                            <img
                                                src={
                                                    review?.avatar || "http://www.pngall.com/wp-content/uploads/5/Profile.png"
                                                }
                                                alt="User"
                                            />
                                            <p className="review-holder-name">
                                                {review.name}
                                                <span>
                                                    {formatDistanceToNow(new Date(review.createdAt),
                                                        { addSuffix: true })}{" "}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="review-container">
                                            <Rating {...options} value={review.rating} />
                                            <span style={{ color: "#c5c5c5" }}>{`UserId # ${review.userRevId}`}</span>
                                        </div>
                                        <p className="review-message">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: "24px", color: "#323232" }}>Add your review here</p>
                            )}
                        </div>
                        {
                            !showAllReview && gigReview && gigReview?.length > 4 && (
                                <button
                                    className='show-more-review'
                                    onClick={() => {
                                        setShowAllReview(true)
                                    }}
                                    style={{
                                        margin: "0"
                                    }}
                                >Show More <FaArrowAltCircleDown /></button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
