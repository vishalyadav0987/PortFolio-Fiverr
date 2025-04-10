import React, { useEffect } from 'react'
import './Home.css'
import HeroSection from '../../Components/HeroSection/HeroSection';
import SkillSet from '../../Components/SkillSet/SkillSet';
import Stat from '../../Components/Stat/Stat';
import TopReview from '../../Components/TopReview/TopReview';
import MyProjects from '../../Components/MyProjects/MyProjects';
import Template from '../../Components/Template/Template';
import { Helmet } from 'react-helmet-async';

const Home = ({ setDropdownOpen }) => {
    const totalBoxes = Math.ceil(window.innerWidth / 80) * Math.ceil(window.innerHeight / 80);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div id='home' onClick={
            () => {
                setDropdownOpen(false);
            }
        }>
            <Helmet>
                <title>VY Portfolio | Web Developer & MERN Expert</title>
                <meta name="description" content="Developed 10+ projects using HTML, CSS, JS, React, MERN & animations—creating seamless user experiences while generating sustainable income!" />
                <meta name="keywords" content="Web Development, React, MERN, Frontend, Animations, GSAP" />
                <meta name="author" content="Vishal" />
            </Helmet>
            <div className="grid-background">
                {[...Array(totalBoxes * 6)].map((_, i) => (
                    <div key={i} className="grid-box"></div>
                ))}
            </div>

            <HeroSection />
            <SkillSet />
            <Stat />
            <TopReview />
            <MyProjects />
            <Template />
        </div>
    )
}

export default Home
