import React from 'react'
import { GiNorthStarShuriken } from "react-icons/gi";
import { FaArrowRightLong } from "react-icons/fa6";
import './MyClientProject.css'
import ProjectModal from '../ProjectModal/ProjectModal';
import { useState } from 'react';


const MyClientProject = ({ loading, allProjects }) => {
    const [modal, setModal] = useState(false)
    const [projectId, setProjectId] = useState("")
    return (
        <>
            {
                modal && <ProjectModal setModal={setModal} projectId={projectId} allProjects={allProjects}/>
            }
            <section id="my-client-pro">
                <div className="my-client-pro-container">
                    <div className="my-client-pro-top-tag-new">
                        <GiNorthStarShuriken />
                        <span>Real-World Projects, Real Impact</span>
                        <FaArrowRightLong />
                    </div>
                    <div className="my-client-pro-left-hero-heading">
                        <h1>
                            Building & Scaling Digital  <br />
                            <span>{" "}Experiences</span>
                        </h1>
                    </div>
                    <div className="my-client-pro-short-about-me">
                        Developed 10+ projects using HTML, CSS, JS, React, MERN & animations—crafting high-performance web apps with engaging UI/UX. From interactive designs to full-stack solutions, I’ve delivered value to clients while generating sustainable income. Passionate about innovation, scalability, and creating digital products that make an impact! 💰🔥
                    </div>
                    <div className="my-client-pro-projects-box">
                        {
                            allProjects && allProjects?.length > 0 &&
                            allProjects?.map((project, i) => {
                                return (

                                    <div key={i} className="my-client-pro-projects-box-item"
                                        onClick={() => {
                                            setModal(true);
                                            setProjectId(project._id)
                                            
                                        }}>
                                        <div className="left">
                                            <img 
                                            style={{border:"1px solid #242429"}}
                                            src={project?.img} alt="" />
                                        </div>
                                        <div className="right">
                                            <div className="client-pro-date">From:{" "}
                                                {new Date(project?.timeframe.start).toISOString().split('T')[0]}
                                            </div>
                                            <h1 className='client-pro-heading'>{project?.title} </h1>
                                            <p className="client-pro-desc">
                                                {project?.desc?.slice(0, 80)}
                                            </p>
                                            <div className="client-pro-tech-stack">
                                                {project?.tech?.slice(0,2).map((tech) => (
                                                    <span key={tech} className="tech-tag">
                                                        {tech}
                                                    </span>
                                                ))}
                                                <span>+{project?.tech?.length - 2}</span>
                                            </div>
                                            <div className="client-pro-price-details">
                                                <div>
                                                    <span>Project cost</span>
                                                    <span>₹{project?.priceRange.min}-₹{project?.priceRange.max}</span>
                                                </div>
                                                <div>
                                                    <span>Project duration</span>
                                                    <span>1{
                                                        (new Date(project?.timeframe.start)-new Date(project?.timeframe.end))/ (1000 * 60 * 60 * 24)
                                                        } days</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )
                            })
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default MyClientProject
