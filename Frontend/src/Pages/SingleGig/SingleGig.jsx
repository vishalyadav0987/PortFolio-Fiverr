import React, { useEffect, useState } from 'react'
import { FaHome, FaHeart, FaShareAlt } from "react-icons/fa";
import './SingleGig.css'
import toast from 'react-hot-toast';
import SingleGigTable from '../../Components/SingleGigTable/SingleGigTable';
import SingleFAQ from '../../Components/SingleFaq/SingleFaq';
import ReviewCard from '../../Components/ReviewCard/ReviewCard';
import PricingCard from '../../Components/PricingCard/PricingCard';
import { MdOutlineLocationOn } from 'react-icons/md';
import { FaFacebookMessenger, FaStar } from 'react-icons/fa6';
import { Link, useParams } from 'react-router-dom';
import ExtraFeatureSlider from '../../Components/ExtraFeature/ExtraFeatureSlider';
import { useGigContext } from '../../Context/gigContext';
import useFetchGigs from '../../CustomHook/useFetchGig';
import profileImage from '../../assets/vishal.jpeg'
import { useAuthContext } from '../../Context/AuthContext';
import { Rating } from '@mui/material';
import axiosInstance from '../../axiosConfig';
import Spinner from '../../Components/Spinner/Spinner';



const SingleGig = ({ setDropdownOpen }) => {
    const [showGigReviewModal, setShowGigReviewModal] = useState(false);
    const { gigId } = useParams();
    const { singleGig } = useGigContext();
    useFetchGigs(gigId);
    const [slider, SetSlider] = useState(false)
    const plans = singleGig?.PricingPlans || [];
    const [selectedPlan, setSelectedPlan] = useState(plans.length > 0 ? plans[0] : null);
    const { authUser } = useAuthContext();
    const [revLoading,setRevLoading] = useState(false)




    useEffect(() => {
        if (plans.length > 0) {
            setSelectedPlan(plans[0]);
        }
    }, [singleGig]); // Re-run when singleGig changes




    const [likes, setLikes] = useState(0);
    const images = singleGig?.thumbnailImages;

    const handleLike = () => {
        setLikes(likes + 1);
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard');
        } catch (err) {
            toast.error("Failed to copy link")
        }
    };

    /*****************SELECTED EXTRAFETURE ****************/
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [totalPrice, setTotalPrice] = useState(selectedPlan?.price || 0);
    /*****************SELECTED EXTRAFETURE ****************/

    // selectedPlan,selectedExtras
    // useEffect(() => {
    //     console.log(selectedPlan);
    //     console.log(selectedExtras);
    //     console.log(totalPrice);
    // }, [selectedPlan, selectedExtras, totalPrice]);





    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    /*-------------ORDERITEM Array for storing in localstoarge*-------------*/

    const calculateDeliveryDate = () => {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + selectedPlan?.deliveryDays);

        return deliveryDate.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        if (selectedPlan) {
            const orderItem = {
                title: selectedPlan?.title,
                thumbnailImage: images && images[0],
                selectedPlan: {
                    price: selectedPlan?.price,
                    planType: selectedPlan?.planType,
                    title: selectedPlan?.title,
                    shortDescription: selectedPlan?.shortDescription,
                    deliveryDays: selectedPlan?.deliveryDays,
                    revisionCount: selectedPlan?.revisionCount,
                    features: selectedPlan?.features,
                },
                extraFeatures: selectedExtras.length > 0 ? selectedExtras : [],
                gigId,

            };

            setOrderItems([orderItem]); // Ensure it's set only once
        }
    }, [selectedPlan, selectedExtras, images, gigId]);

    const data = {
        orderItems,
        buyerId: authUser && authUser?._id,
        deliveryDate: calculateDeliveryDate(),
        maxRevisions: selectedPlan?.revisionCount,
    }

    useEffect(() => {
        localStorage.setItem("orderItemsData", JSON.stringify(data))
        localStorage.setItem("totalAmount", JSON.stringify(totalPrice))
    }, [orderItems, totalPrice]);

    /*-------------ORDERITEM Array for storing in localstoarge*-------------*/



    /*-------------Review Logic Start from Here-------------*/
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('');
    const addRatingHandle = async (e) => {
        e.preventDefault();
        setRevLoading(true);
        try {
            const response = await axiosInstance.post(`/gig/review`, {
                gigId,
                rating,
                comment
            }, { headers: { 'Content-Type': 'application/json' } });
            if (response.data.success) {
                toast.success(response.data.message);
                setShowGigReviewModal(!showGigReviewModal);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Erron in addRatingHandle", error);
        } finally {
            setRevLoading(false);
            setComment('');
            setRating(0);
            setShowGigReviewModal(!showGigReviewModal);
        }
    }



    /*-------------Review Logic Start from Here-------------*/





    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section id='single-gig' onClick={() => setDropdownOpen(false)}>
            <div className="slider" style={{ position: "absolute", top: "-75px", zIndex: "9999" }}>
                <ExtraFeatureSlider
                    slider={slider}
                    SetSlider={SetSlider}
                    singleGig={singleGig && singleGig}
                    selectedPlan={selectedPlan}
                    selectedExtras={selectedExtras}
                    setSelectedExtras={setSelectedExtras}
                    totalPrice={totalPrice}
                    setTotalPrice={setTotalPrice}
                />
            </div>
            <div className="single-gig-container">
                <div className="single-gig-header">
                    <div className="single-gig-left">
                        <Link to={'/'}>
                            <FaHome />
                        </Link> &nbsp; / &nbsp; Programming & Tech &nbsp;/&nbsp; Website Development&nbsp; /&nbsp; WordPress
                    </div>
                    <div className="single-gig-right">
                        <button style={{ background: 'transparent', border: "none" }} className="single-gig-like" onClick={handleLike}>
                            <FaHeart /> <span className='like-span'>{likes}</span>
                        </button>
                        <button style={{ background: 'transparent', border: "none" }} className="single-gig-share" onClick={handleShare}>
                            <FaShareAlt />
                        </button>
                    </div>
                </div>
                <div className="single-gig-content">
                    <div className="gig-left">
                        <h1>
                            {singleGig?.title?.slice(0, -3)}
                            <span>{" "} {singleGig?.title?.slice(-3)}</span>
                        </h1>
                        <div className="gig-top">
                            <div className="profile-img">
                                <img src={profileImage} alt="" />
                            </div>
                            <div className="info-about-me">
                                <h2>Vishal Yadav <span>@vishalyadav0987</span></h2>
                                <div className="review-box">
                                    <span><FaStar /></span>
                                    <span>{singleGig?.ratings}</span>
                                    <span>({singleGig?.reviews?.length})</span>
                                </div>
                                <p className='passion'>Software developer</p>
                                <div className="location">
                                    <span>
                                        <MdOutlineLocationOn />
                                        India
                                    </span>
                                    <span>
                                        <FaFacebookMessenger />
                                        <span>{
                                            singleGig?.DetailedAboutYourself?.Languages?.map((lang, i) => {
                                                return (
                                                    <span key={i}>{lang}</span>
                                                )
                                            })
                                        }</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-container">
                            <div className="carousel-wrapper">
                                <div className="carousel-track"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                    {images?.map((img, index) => (
                                        <img key={index} src={img.url} alt={`Slide ${index + 1}`} className="carousel-img" />
                                    ))}
                                </div>
                            </div>
                            <button className="carousel-btn right" onClick={nextSlide}>❯</button>
                            <button className="carousel-btn left" onClick={prevSlide}>❮</button>
                        </div>

                        <div className="detailed-desc-about-gig">
                            <h2>About this gig</h2>
                            <div dangerouslySetInnerHTML={{ __html: singleGig?.description }} />

                        </div>
                        <div className="get-to-kwon-about-me">
                            <h2>Get to know Vishal Yadav</h2>
                            <div className="gig-top">
                                <div className="profile-img">
                                    <img src={profileImage} alt="" />
                                </div>
                                <div className="info-about-me">
                                    <h2>Vishal Yadav <span>@vishalyadav0987</span></h2>
                                    <div className="review-box">
                                        <span><FaStar /></span>
                                        <span>{singleGig?.ratings}</span>
                                        <span>({singleGig?.reviews?.length})</span>
                                    </div>
                                    <p className='passion'>Software developer</p>
                                    <div className="location">
                                        <span>
                                            <MdOutlineLocationOn />
                                            India
                                        </span>
                                        <span>
                                            <FaFacebookMessenger />
                                            <span>{
                                                singleGig?.DetailedAboutYourself?.Languages?.map((lang, i) => {
                                                    return (
                                                        <span key={i}>{lang}</span>
                                                    )
                                                })
                                            }</span>
                                        </span>

                                    </div>
                                </div>
                            </div>
                            <div className="detailed-box-about-me">
                                <div className="details">
                                    <div>
                                        <span>From</span>
                                        <span>
                                            {singleGig?.DetailedAboutYourself?.from}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Member since</span>
                                        <span>
                                            {singleGig?.DetailedAboutYourself?.since}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Avg. response time</span>
                                        <span>
                                            {singleGig?.DetailedAboutYourself?.AvgResponseT} hour
                                        </span>
                                    </div>
                                    <div>
                                        <span>Last delivery</span>
                                        <span>1 week</span>
                                    </div>
                                    <div>
                                        <span>Languages</span>
                                        <span>{
                                            singleGig?.DetailedAboutYourself?.Languages?.map((lang, i) => {
                                                return (
                                                    <article key={i}>{lang}</article>
                                                )
                                            })
                                        }</span>
                                    </div>
                                </div>
                                <p className="desc-avout-me">
                                    {singleGig?.DetailedAboutYourself?.AboutMe}
                                </p>
                            </div>
                        </div>
                        <div className="table-functionality">
                            <h2>Compare packages</h2>
                            <SingleGigTable singleGig={singleGig && singleGig} />
                        </div>
                        <div className="FAQ-functionality">
                            <h2>FAQ</h2>
                            <SingleFAQ singleGig={singleGig && singleGig} />
                        </div>
                        <div className="review-container-">
                            <h2>Review</h2>
                            <ReviewCard
                                overallRatingTheseGig={singleGig?.ratings}
                                gigId={gigId}
                                setShowGigReviewModal={setShowGigReviewModal}
                                showGigReviewModal={showGigReviewModal}
                            />
                            {showGigReviewModal && (
                                <div className="modal-overlay-1">
                                    <div className="modal-1">
                                        <h3 style={{ marginBottom: "8px" }}>Enter your review</h3>
                                        <div style={{
                                            display: "flex", alignItems: "center",
                                            justifyContent: "space-between"
                                        }}>
                                            <Rating
                                                onChange={(e) => setRating(e.target.value)}
                                                value={rating}
                                                size='large'
                                                precision={0.5}
                                            />
                                            <input type="text"
                                                className='rating-input'
                                                max={5}
                                                min={0}
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                                style={{
                                                    width: "100px",
                                                    border: "1px solid #718096",
                                                    marginLeft: "10px",
                                                    padding: "8px 10px",
                                                    fontSize: "0.8rem",
                                                    borderRadius: "5px"
                                                }}
                                                placeholder='Rating 4.5'
                                                pattern="[0-5]+"
                                            />
                                        </div>
                                        <textarea
                                            style={{ marginTop: "8px" }}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Write your review here...."
                                        />
                                        <div className="modal-actions-1">
                                            <button
                                                onClick={() => setShowGigReviewModal(false)}>Cancel</button>
                                            <button
                                                onClick={addRatingHandle}
                                                disabled={revLoading || !rating || !comment}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "8px"
                                                }}
                                            >
                                                {revLoading ? (
                                                    <>
                                                        <Spinner />
                                                        <span style={{ fontSize: "14px", fontWeight: "500" }}>Submitting...</span>
                                                    </>
                                                ) : (
                                                    <span style={{ fontSize: "14px", fontWeight: "500" }}>Submit Review</span>
                                                )}
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="gig-right">
                        <PricingCard
                            SetSlider={SetSlider}
                            selectedPlan={selectedPlan}
                            setSelectedPlan={setSelectedPlan}
                            plans={plans}
                            gigId={gigId}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SingleGig
