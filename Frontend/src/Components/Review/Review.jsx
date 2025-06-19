import React, { useEffect, useState } from 'react';
import './Review.css';
import { Rating } from '@mui/material';
import { FaArrowAltCircleDown, FaLocationArrow } from 'react-icons/fa';
import axiosInstance from '../../axiosConfig';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const Review = () => {
    const [showAllReview, setShowAllReview] = useState(false);
    const [gigAllReview, setGigAllReview] = useState([]);

    /*-----------Get all reviews of a gig-----------*/
    const getGigAllReviews = async () => {
        try {
            const response = await axiosInstance.get(`/gig/reviews`);
            if (response.data.success) {
                setGigAllReview(response.data.reviews);
            }

        } catch (error) {
            console.log("Error while getting gig reviews: ", error);
            toast.error("Error while getting gig reviews");
        }
    }

    useEffect(() => {
        getGigAllReviews();
    }, []);

    // console.log(gigAllReview);

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

    let rate = product.ratings;
    let rates = rate?.toFixed(1);
    const options = {
        value: rates,
        size: "large",
        readOnly: true,
        precision: 0.5,
    };

    return (
        <div className='review-container'>
            <div className="container">
                <div className="bottom-box">
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
                            {gigAllReview && gigAllReview.length > 0 ? (
                                (showAllReview ? gigAllReview : gigAllReview.slice(0, 4))?.map((review, i) => (
                                    <div className="single-review" key={i}>
                                        <div className="header">
                                            <img
                                                src={review?.avatar || "http://www.pngall.com/wp-content/uploads/5/Profile.png"}
                                                alt="User"
                                            />
                                            <p className="review-holder-name">
                                                {review?.user?.name}
                                                <span>
                                                    {review?.edited && (
                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                color: "#0d9488",
                                                                fontSize: "14px",
                                                                background: "#0f201f",
                                                                padding: "5px 20px",
                                                                borderRadius: "50px",
                                                                margin: "0 8px",
                                                            }}
                                                        >
                                                            Edited
                                                        </span>
                                                    )}
                                                    <span>
                                                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                                    </span>
                                                </span>
                                            </p>
                                        </div>
                                        <div className="review-container">
                                            <Rating {...options} value={review.rating} />
                                            <span style={{ color: "#c5c5c5", fontSize: "13px" }}>{`UserId # ${review.user?._id}`}</span>
                                            {review?.orderId ? (
                                                <div className="gig-details"
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        width: "100%",
                                                        background: "#121212",
                                                        padding: "10px 20px",
                                                        borderRadius: "6px",
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    <div className="preview-item" style={{ background: "none", padding: "0", margin: "0" }}>
                                                        <img src="https://res.cloudinary.com/du6ukwxhb/image/upload/v1741790409/products/ktfbrmkabunqumjnx4bd.webp" />
                                                        <div className="item-info">
                                                            <h5>{review?.orderId?.OrderItems[0]?.title}</h5>
                                                            <span className="plan-badge">
                                                                {review?.orderId?.OrderItems[0]?.selectedPlan?.planType}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="price-duration"
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "start",
                                                            justifyContent: "center",
                                                            gap: "8px",
                                                        }}
                                                    >
                                                        <span style={{ color: "#c5c5c5", fontSize: "15px" }}>
                                                            Price: <span>₹{review?.orderId?.OrderItems[0]?.selectedPlan?.price}</span>
                                                        </span>
                                                        <span style={{ color: "#c5c5c5", fontSize: "15px" }}>
                                                            Duration: <span>{review?.orderId?.OrderItems[0]?.selectedPlan?.deliveryDays} days</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span style={{ color: "#c5c5c5", fontSize: "13px" }}>{`GigId # ${review?.gigId}`}</span>
                                            )}
                                        </div>
                                        <hr style={{ background: "#222" }} />
                                        <p className="review-message">{review?.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: "24px", color: "#323232" }}>Add your review here</p>
                            )}

                        </div>
                        {
                           !showAllReview && gigAllReview && gigAllReview?.length > 4 && (
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

export default Review;
