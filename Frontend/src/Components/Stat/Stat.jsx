import React from 'react'
import { FaUser,FaBox } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import './Stat.css'
import CountUp from 'react-countup';

const Stat = () => {
    return (
        <>
            <section id="stats">
                <div className="container-stats">
                    <svg focusable="false" aria-hidden="true" className="chakra-icon css-15z0y3i" width="245" height="342" viewBox="0 0 245 342" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" d="M1.22588 185.078L181.791 1.26669C185.164 -2.1672 190.594 2.01153 188.316 6.28938L121.111 132.548C119.61 135.362 121.599 138.798 124.729 138.798H240.87C244.611 138.798 246.417 143.495 243.682 146.113L40.1606 340.813C36.5115 344.304 31.0798 339.384 34.0095 335.243L130.352 199.009C132.327 196.216 130.381 192.302 127.015 192.302H4.13106C0.451191 192.302 -1.38514 187.736 1.22588 185.078Z" fill="url(#:S3:-paint0_linear_276_2121)"></path><defs><linearGradient id=":S3:-paint0_linear_276_2121" x1="122.5" y1="0" x2="122.5" y2="342" gradientUnits="userSpaceOnUse"><stop stopColor="currentColor" stopOpacity="0.5"></stop><stop offset="0.505" stopColor="#137773" stopOpacity="0.6"></stop><stop offset="1" stopColor="currentColor" stopOpacity="0.5"></stop></linearGradient></defs></svg>
                    <div className="stat-heading">
                        <h2>Built for developers <br /> <span>By developers</span></h2>
                        <h2>
                            Built for modern product teams. <br />
                            <span>From next-gen startups to established enterprises.</span>
                        </h2>
                    </div>
                    <div className="stat-box">
                        <div className="stat">
                            <div className="counting">
                                {
                                    <CountUp end={100} duration={2} />
                                }+
                            </div>
                            <div className="icon-info">
                                <FaUser />
                                <span>Clients / Year</span>
                            </div>
                        </div>
                        <div className="stat">
                            <div className="counting">
                                {
                                    <CountUp end={22} duration={2} />
                                }+
                            </div>
                            <div className="icon-info">
                                <FaBox />
                                <span>Project Completed</span>
                            </div>
                        </div>
                        <div className="stat">
                            <div className="counting">
                                {
                                    <CountUp end={95} duration={2} />
                                }
                            </div>
                            <div className="icon-info">
                                <MdRateReview  fontSize={"22px"}/>
                                <span>Reviews / Year</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>
        </>
    )
}

export default Stat
