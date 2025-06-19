import React, { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import { FaCog, FaSignOutAlt, FaUser, FaHistory, FaLock } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import axiosInstance from '../../axiosConfig';
import { useAuthContext } from '../../Context/AuthContext'
import toast from 'react-hot-toast'
import Spinner from "../Spinner/Spinner";
import VyIcon from "../VyIcon/VyIcon";
import { formatDistanceToNow } from 'date-fns'
import NotificationCenter from "../NotificationCenter/NotificationCenter";
import { FiSun } from "react-icons/fi";

const Navbar = ({ isDropdownOpen, setDropdownOpen }) => {
  const location = useLocation();
  const { loading, setLoading, setAuthUser, setIsAuthenticate, authUser } = useAuthContext()
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/user/logout');
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Erron in handleLogout function -> ", error);
      const errorMessage = error.response?.data?.message || "Something went wrong, please try again.";
      if (errorMessage === "User Already Exists.") {
        toast.error("This email is already registered. Try logging in.");
      } else {
        toast.error(errorMessage);
      }

    } finally {
      setLoading(false);
      setDropdownOpen(false)
      setAuthUser(null);
      setIsAuthenticate(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <Link to={'/'} style={{ textDecoration: "none", color: "white" }}>
        <div className="logo">
          <VyIcon />
        </div>
      </Link>

      <ul className="nav-links">
        <li className={`${location.pathname === '/' ? 'bacground-nav-color' : ''}`}>
          <Link to="/">Home</Link></li>
        {/* {
          authUser?.isVerified === true && authUser?.isAdmin === true &&(
            <li className={`${location.pathname === '/chat' ? 'bacground-nav-color' : ''}`}>
        <Link to="/chat">Chat Test</Link></li>
          )
        } */}

        <li className={`${location.pathname === '/my-work' ? 'bacground-nav-color' : ''}`}>
          <Link to="/my-work">Past Work</Link></li>
        <li className={`free-lance-tooltip ${location.pathname === '/my-gig' ? 'bacground-nav-color' : ''}`}>
          <Link to="/my-gig">Services</Link>
          <span style={{
            marginLeft: "24px"
          }} className="tooltip">Need a website? I build high-quality, custom sites! 💻✨</span>
        </li>
      </ul>

      <div className="nav-icons">
        <NotificationCenter />
       {
        !authUser?.isVerified && (
          <Link to={`${authUser?.isVerified ? '/my-work' : '/sign-in'}`}>
          <button className='join-as-client'>
            {authUser?.isVerified ? 'View My Work' : 'Join As Client'} </button>
        </Link>
        )
       }
        <button className="bell-icon" >
          <FiSun fontSize={"20px"}  />
        </button>

        {/* Orders Icon with Tooltip */}
        {/* <div className="tooltip-container">
          <FaBox className="icon" />
          <span className="tooltip">Orders</span>
        </div> */}

        {/* Profile Icon with Dropdown */}
        <div className="profile-menu" style={{
          display: "flex",
          alignItems: "center",
        }}>
          {
            authUser && authUser?.isVerified ? <img
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                border: `${isDropdownOpen === true ? "2px solid #5eead4" : "none"}`,
                cursor: "pointer",
                filter: "dropShadow(6px 4px 50px #5eead4)",
                objectFit: "cover"
              }}
              src={authUser?.avatar?.url} alt="" /> : (
              <FaRegUser
                className="icon profile-icon"

              />
            )
          }

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span className="user-email">{authUser?.email}</span>
                <span className="user-status premium">
                  {
                    authUser?.isVerified ? "Verified" : "Not Verified"
                  }
                </span>
              </div>

              <div className="dropdown-divider" />

              <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <FaUser className="dropdown-icon" />
                Profile
                <span className="notification-badge" style={{position:"unset"}}>3</span>
              </Link>

              <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <FaCog className="dropdown-icon" />
                Settings
              </Link>

              <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <FaHistory className="dropdown-icon" />
                Order History
                <span className="status-indicator processing">Processing</span>
              </Link>

              <Link to="/security" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <FaLock className="dropdown-icon" />
                Security
              </Link>

              <div className="dropdown-divider" />

              <div className="dropdown-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
                {
                  loading ? <Spinner /> : (<FaSignOutAlt className="dropdown-icon" />)
                }
                Logout
                <span className="logout-time">Last login: {
                  formatDistanceToNow(new Date(authUser?.lastLogin))
                }</span>
              </div>

              <div className="dropdown-footer">
                <RiSecurePaymentLine />
                <span>Secure SSL Connection 🔒</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




// const VyIcon = () => (
//   <div className="vy-icon-wrapper">
//     <svg xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 800 300"
//       className="portfolio-logo"
//       style={{ enableBackground: 'new 0 0 800 300' }} width={"200px"}>

//       <defs>
//         <linearGradient id="mainGradient" x1="0%" y1="50%" x2="100%" y2="50%">
//           <stop offset="0%" stopColor="#0d9488" />
//           <stop offset="100%" stopColor="#5eead4" />
//         </linearGradient>

//         <filter id="soft-glow">
//           <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
//           <feMerge>
//             <feMergeNode in="blur" />
//             <feMergeNode in="SourceGraphic" />
//           </feMerge>
//         </filter>
//       </defs>

//       {/* Clean Geometric Backdrop */}
//       <rect x="50" y="50" width="700" height="200" rx="20"
//         fill="transparent"
//         stroke="url(#mainGradient)"
//         strokeWidth="2"
//         opacity="0.3" />

//       {/* Core Logo Elements */}
//       <g transform="translate(100 80)" filter="url(#soft-glow)">

//         {/* Modern VY Symbol */}
//         <g className="main-icon">
//           {/* Vertical Bars */}
//           <rect x="0" y="0" width="40" height="200" fill="url(#mainGradient)" rx="8" />
//           <rect x="160" y="0" width="40" height="200" fill="url(#mainGradient)" rx="8" />

//           {/* Dynamic Y Element */}
//           <path d="M80 0 L120 100 L80 200 L40 100 Z"
//             fill="url(#mainGradient)"
//             style={{ mixBlendMode: 'lighten' }} />
//         </g>

//         {/* Text Elements with Clear Hierarchy */}
//         <g className="logo-text" transform="translate(240 30)">
//           <text x="0" y="60" fontSize="56" fill="url(#mainGradient)"
//             fontFamily="'Inter', sans-serif" fontWeight="600"
//             letterSpacing="-1.5">
//             VISHAL YADAV
//           </text>
//           <text x="0" y="110" fontSize="26" fill="#5eead4"
//             fontFamily="'Inter', sans-serif" fontWeight="300"
//             opacity="0.9" letterSpacing="1.2">
//             FULL-STACK SOLUTIONS ARCHITECT
//           </text>
//         </g>
//       </g>

//       {/* Subtle Motion Lines */}
//       <path d="M100 250 Q400 280 700 250"
//         stroke="url(#mainGradient)"
//         strokeWidth="1.5"
//         fill="none"
//         strokeDasharray="4 4"
//         opacity="0.4" />
//     </svg>
//   </div>
// );





