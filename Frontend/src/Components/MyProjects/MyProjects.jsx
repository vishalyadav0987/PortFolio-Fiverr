import React from 'react'
import './MyProjects.css'
import MyProjectCard from '../MyProjectCard/MyProjectCard'
import { FaArrowCircleRight } from 'react-icons/fa'
import threadApp from '../../assets/thread.png'
import tailwind from '../../assets/tailwind.png'
import jobApp from '../../assets/job.png'
import authForm from '../../assets/auth.png'
import ecommerce from '../../assets/e-commerce.png'
import foodDelApp from '../../assets/food.png'

const MyProjects = () => {
    const projects = [
        {
            img: threadApp,
            projectName: "Thread App",
            tech: ["MERN", "Cloudinary", "JWT", "Web Socket", "Chakra-UI"],
            description: "A MERN-based social media app for seamless connections—sign up, share posts/media, like, comment, and message. Features real-time feed, notifications, and secure JWT auth.",
            liveLink: "https://thread-app-mc1i.onrender.com/",
            githubLink: "https://github.com/vishalyadav0987/Thread-App",
        },
        {
            img: foodDelApp,
            projectName: "Food Delivey App",
            tech: ["MERN", "JWT", "CSS", "Cloudinary", "Stripe"],
            description: "A full-stack food delivery platform—browse menus, place orders, and track meals. Admins manage inventory, users, and orders through a powerful dashboard.",
            liveLink: "https://food-del-frontend-8a2e.onrender.com/",
            githubLink: "https://github.com/vishalyadav0987/Food-App",
        },
        {
            img: jobApp,
            projectName: "Job App",
            tech: ["MERN", "Cloudinary", "JWT", "Chakra-UI", "Redux"],
            description: "Job search platform connecting applicants with employers. Post jobs, apply, and manage hires seamlessly.",
            liveLink: "https://job-app-e7r7.onrender.com/",
            githubLink: "https://github.com/vishalyadav0987/Job-App",
        },
        {
            img: tailwind,
            projectName: "Nike Page",
            tech: ["React.js", "Tailwind",],
            description: "Nike Landing Page – A responsive e-commerce demo built with Tailwind CSS, perfect for learning its fundamentals.",
            liveLink: "https://nike-tailwind-0987.netlify.app/",
            githubLink: "https://github.com/vishalyadav0987/Nike-Tailwind",
        },

        {
            img: authForm,
            projectName: "Auth Form",
            tech: ["MERN", "Mailtrap", "JWT", "Chakra-UI"],
            description: "Email-based MERN auth: Verify accounts & reset passwords. Get a code on signup or a reset link if forgotten.",
            liveLink: "https://auth-form-aonu.onrender.com/",
            githubLink: "https://github.com/vishalyadav0987/Auth-Form",
        },
        {
            img: ecommerce,
            projectName: "E-Commerce",
            tech: ["MERN", "JWT", "CSS", "Nodemailer", "Redux", "Cloudinary", "Stripe"],
            description: "Multi-vendor e-commerce platform: Sellers manage stores & orders, buyers shop seamlessly. Secure payments, vendor dashboards, analytics & more—all in one marketplace.",
            liveLink: "https://github.com/vishalyadav0987/E-Commerce",
            githubLink: "https://github.com/vishalyadav0987/E-Commerce",
        },
    ]
    return (
        <>
            <section id="myprojects">
                <div className="myproject-container">
                    <div className="myproject-heading">
                        <h2>My Dev Playground Projects That<br /> <span> Define Me</span></h2>
                        <h2>
                            A collection of projects where I experiment, build, and push my limits. <br />
                            <span>Each one reflects my passion for coding and problem-solving. 🚀</span>
                        </h2>
                    </div>
                    <div className="myprojects-box">
                        {
                            projects.map((project, i) => {
                                return (
                                    <MyProjectCard
                                        key={i}
                                        img={project.img}
                                        projectName={project.projectName}
                                        tech={project.tech}
                                        description={project.description}
                                        liveLink={project.liveLink}
                                        githubLink={project.githubLink}
                                    />
                                )
                            })
                        }

                        <a className='show-more-roject'>Show More <FaArrowCircleRight /></a>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MyProjects
