import React, { useState } from 'react'
import './HeroSectionGig.css'
import { FaArrowAltCircleRight, FaStar } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaFacebookMessenger } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa";
import GigCard from '../GigCard/GigCard';
import Review from '../Review/Review';
import { useGigContext } from '../../Context/gigContext';
import useFetchAllGigs from '../../CustomHook/useFetchAllGigs';
import Spinner from '../Spinner/Spinner';
import ProfileImage from '../../assets/vishal.jpeg'

const HeroSectionGig = ({ showReviewModal, setShowReviewModal }) => {

    useFetchAllGigs();
    const { allGigs, loading } = useGigContext();


    /*-------------------Calcualtion overall rating-------------------*/
    let avgRating = 0;
    let totalRatingCnt = 0;
    let ratingSum = 0;
    const calculateOverallRating = () => {
        allGigs.forEach(gig => {
            totalRatingCnt += gig.numOfReviews;
            ratingSum += gig.ratings
        });
    }
    calculateOverallRating();
    avgRating = (ratingSum / allGigs?.length)
    /*-------------------Calcualtion overall rating-------------------*/




    /*-------------------Skills Array-------------------*/
    const [showSkill, setShowSkill] = useState(false)
    const skillsArr = [
        // Programming Languages
        "MERN Stack",
        "HTML", "CSS", "Tailwind CSS", "React.js", "Redux", "Chakra UI",
        "Node.js", "Express.js",
        "MongoDB", "MySQL", "Postman", "Git", "GitHub", "VS Code",
        "C++", "JavaScript", "C", "Python",
        "Custom Website Developer",
        "Full-Stack Website Developer",
        "WordPress Website Developer",
        "MERN Stack Website Cloning Expert",
        "Problem-Solving", "Project Management", "Adaptability", "Results-Driven"
    ];


    /*-------------------Skills Array-------------------*/


    return (
        <>
            <section id="hero-section-gig">
                <div className="hero-section-gig-container">
                    <div className="hero-section-gig-content">
                        <div className="left">
                            <div className="gig-top">
                                <div className="profile-img">
                                    <img src={ProfileImage} alt="" />
                                </div>
                                <div className="info-about-me">
                                    <h2>Vishal Yadav <span>@vishalyadav0987</span></h2>
                                    <div className="review-box">
                                        <span><FaStar /></span>
                                        <span>{avgRating?.toFixed(2)}</span>
                                        <span>({totalRatingCnt})</span>
                                    </div>
                                    <p className='passion'>Software developer</p>
                                    <div className="location">
                                        <span>
                                            <MdOutlineLocationOn />
                                            India
                                        </span>
                                        <span>
                                            <FaFacebookMessenger />
                                            <span>Hindi, English</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="about-me-short-desc">
                                <h2>About Me</h2>
                                <p>I'm a full-stack developer specializing in the MERN stack, gRPC with Node.js, and expertise in JavaScript, Python, C, and C++. With a deep understanding of machine learning, AI, and data analysis, I excel at building intelligent, scalable, and high-performance applications. My passion is bridging the gap between software engineering and AI, leveraging cutting-edge technologies to create impactful solutions. Whether it's developing efficient ML models, optimizing data pipelines, or architecting full-stack applications, I bring a strategic and innovative approach to every project. Let's build something groundbreaking together!</p>
                            </div>
                            <div className="my-tech-stack-work">
                                <h2>Skills</h2>
                                <div className="skills-container">
                                    <div className="skills-grid">
                                        {(showSkill ? skillsArr : 
                                        skillsArr.slice(0, 20))?.map((skill, index) => (
                                            <span className="skill-item" key={index}>{skill}</span>
                                        ))}
                                    </div>
                                    {!showSkill && (
                                        <button
                                            className="skill-show-more-btn pulse"
                                            onClick={() => setShowSkill(true)}
                                        >
                                            Show More
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <button className='About-me-more'>More About Me <FaArrowAltCircleRight /></button>
                            <div className="contact-card">
                                <div className="image-box">
                                    <div className="profile-img">
                                        <img src={ProfileImage} alt="" />
                                    </div>
                                    <div className='time-online'>
                                        <h2>Vishal Yadav</h2>
                                        <p>
                                            <span>Software Developer </span>
                                            <span></span>
                                            <span>last online 3:34 P.M</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0px",
                                        marginTop: "6px",
                                        marginBottom: "6px"
                                    }}
                                    className='About-me-more'>Contact Me <FaLocationArrow /></button>
                            </div>
                        </div>
                    </div>
                    <div className="my-gig-container">
                        <h2>My Gigs</h2>
                        <div className="my-gig-box">
                            {
                                loading ? <Spinner /> : (
                                    allGigs?.length > 0 && allGigs.map((gig, i) => {
                                        return (
                                            <GigCard key={i} gig={gig} />
                                        )
                                    })
                                )
                            }
                        </div>
                    </div>
                    <div className="gig-review-container">
                        <h2>Reviews
                            <span>1-4 out of {totalRatingCnt} Reviews</span>
                        </h2>
                        <Review />
                        {showReviewModal && (
                            <div className="modal-overlay-1">
                                <div className="modal-1">
                                    <h3>Enter your review</h3>
                                    <textarea
                                        //   value={requestMessage}
                                        //   onChange={(e) => setRequestMessage(e.target.value)}
                                        placeholder="Describe the changes you need..."
                                    />
                                    <div className="modal-actions-1">
                                        <button onClick={() => setShowReviewModal(false)}>Cancel</button>
                                        <button
                                        // onClick={handleRevisionRequest}
                                        // disabled={order?.usedRevisions >= order?.maxRevisions}
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </section>
        </>
    )
}

export default HeroSectionGig
