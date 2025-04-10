import React from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'
import { GiNorthStarShuriken } from 'react-icons/gi'
import './AboutMe.css'

const AboutMe = () => {
    return (
        <>
            <section id="about-me">
                <div className="about-me-container">
                <svg focusable="false" aria-hidden="true" className="chakra-icon css-15z0y3i" width="245" height="342" viewBox="0 0 245 342" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" d="M1.22588 185.078L181.791 1.26669C185.164 -2.1672 190.594 2.01153 188.316 6.28938L121.111 132.548C119.61 135.362 121.599 138.798 124.729 138.798H240.87C244.611 138.798 246.417 143.495 243.682 146.113L40.1606 340.813C36.5115 344.304 31.0798 339.384 34.0095 335.243L130.352 199.009C132.327 196.216 130.381 192.302 127.015 192.302H4.13106C0.451191 192.302 -1.38514 187.736 1.22588 185.078Z" fill="url(#:S3:-paint0_linear_276_2121)"></path><defs><linearGradient id=":S3:-paint0_linear_276_2121" x1="122.5" y1="0" x2="122.5" y2="342" gradientUnits="userSpaceOnUse"><stop stopColor="currentColor" stopOpacity="0.5"></stop><stop offset="0.505" stopColor="#137773" stopOpacity="0.6"></stop><stop offset="1" stopColor="currentColor" stopOpacity="0.5"></stop></linearGradient></defs></svg>
                    <div className="about-top-tag-new">
                        <GiNorthStarShuriken />
                        <span>Introduction</span>
                        <FaArrowRightLong />
                    </div>
                    <h1>Overview.</h1>
                    <p>
                    I'm a full-stack developer specializing in the MERN stack, gRPC with Node.js, and expertise in JavaScript, Python, C, and C++. With a deep understanding of machine learning, AI, and data analysis, I excel at building intelligent, scalable, and high-performance applications. My passion is bridging the gap between software engineering and AI, leveraging cutting-edge technologies to create impactful solutions. Whether it's developing efficient ML models, optimizing data pipelines, or architecting full-stack applications, I bring a strategic and innovative approach to every project. Let's build something groundbreaking together!
                    </p>
                    <div className="overview-card-box">
                        <div className="overview-card">
                            <img src="https://rizwansaifi571.github.io/assets/backend-hTXvHAtb.png"  />
                            <span>MERN Stack</span>
                        </div>
                        <div className="overview-card">
                            <img src="https://rizwansaifi571.github.io/assets/mobile-DOyYxxYf.png"  />
                            <span>Full Stack Development</span>
                        </div>
                        <div className="overview-card">
                            <img src="https://rizwansaifi571.github.io/assets/web-08ko_qNY.png"  />
                            <span>Web Development</span>
                        </div>
                        <div className="overview-card">
                            <img src="https://rizwansaifi571.github.io/assets/backend-hTXvHAtb.png" />
                            <span>WordPress Development</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutMe
