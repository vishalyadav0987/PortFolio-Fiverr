import React from "react";
import { FaCode, FaGithub, FaInstagram, FaLinkedin, FaMailBulk } from "react-icons/fa";
import { Link } from "react-router-dom";
import VyIcon from "../VyIcon/VyIcon";
import "./Footer.css";
import { FaReact } from "react-icons/fa";
import { FaNodeJs } from "react-icons/fa6";
import { SiMongodb } from "react-icons/si";
import { SiExpress } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-gradient"></div>

      <div className="footer-content">
        <div className="footer-top">
          <Link to="/" className="logo-container">
            <VyIcon className="logo-hover-effect" />
            <span className="logo-glow"></span>
          </Link>

          <div className="deploy-info">
            <div className="deploy-marquee">
              <span>🚀 Deployed on Vercel</span>
              <span>⚡ Powered by Node.js</span>
              <span>🔒 Secured with HTTPS</span>
              <span>📦 MongoDB Atlas Powered</span>
              <span>🔄 Express.js REST APIs</span>
              <span>⚛️ React Dynamic Frontend</span>
              <span>🖥️ Node.js Microservices</span>
              <span>📱 WordPress Developer</span>
              <span>💿 Clone Website</span>
            </div>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="section-title">Navigation</h3>
            <ul className="footer-links">
              <li><Link to="/my-work" className="hover-underline">Projects</Link></li>
              <li><Link to="/my-gig" className="hover-underline">About</Link></li>
              <li><Link to="/orders" className="hover-underline">Orders</Link></li>
              <li><Link to="/security" className="hover-underline">Security</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="section-title">Resources</h3>
            <ul className="footer-links">
              <li><a href="/profile" className="hover-underline">Profile</a></li>
              <li><a href="#topreview" className="hover-underline">Top Reviews</a></li>
              <li><a href="/my-work" className="hover-underline">Showcase</a></li>
              <li><a href="/my-gig" className="hover-underline">Gigs</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="section-title">Connect</h3>
            <div className="social-icons">
              <a href="https://github.com/vishalyadav0987" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaGithub className="icon-hover-effect" />
                <span className="social-tooltip">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/vishal-yadav-831049254/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaLinkedin className="icon-hover-effect" />
                <span className="social-tooltip">LinkedIn</span>
              </a>
              <a href="https://leetcode.com/vishalyadav0987" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaCode className="icon-hover-effect" />
                <span className="social-tooltip">LeetCode</span>
              </a>
              <a href="mailto:viahalyadav0987@gmail.com" className="social-icon">
                <FaMailBulk className="icon-hover-effect" />
                <span className="social-tooltip">Email</span>
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram className="icon-hover-effect" />
                <span className="social-tooltip">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} Vishal Yadav. Crafted with passion and React.
          </p>
          <div className="tech-stack">
            <span>
              <SiMongodb />
              Mongo DB
            </span>
            <span>
              <SiExpress />
              Express JS
            </span>
            <span>
              <FaReact />
              React JS
            </span>
            <span>
              <FaNodeJs />
              Node JS
            </span>


          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;