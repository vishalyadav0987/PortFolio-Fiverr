import React from "react";
import './VyIcon.css';

const VyIcon = () => (
    <div className="vy-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 300"
            className="portfolio-logo"
            style={{ enableBackground: 'new 0 0 800 300' }} width={"200px"}>

            <defs>
                <linearGradient id="mainGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#5eead4" />
                </linearGradient>

                <filter id="soft-glow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Clean Geometric Backdrop */}
            <rect x="50" y="50" width="750" height="250" rx="25"
                fill="transparent"
                stroke="url(#mainGradient)"
                strokeWidth="2"
                opacity="0.3" />

            {/* Core Logo Elements */}
            <g transform="translate(100 80)" filter="url(#soft-glow)">

                {/* Modern VY Symbol */}
                <g className="main-icon">
                    {/* Vertical Bars */}
                    <rect x="0" y="0" width="40" height="200" fill="url(#mainGradient)" rx="8" />
                    <rect x="150" y="0" width="40" height="200" fill="url(#mainGradient)" rx="8" />

                    {/* Dynamic Y Element */}
                    <path d="M80 0 L120 100 L80 200 L40 100 Z"
                        fill="url(#mainGradient)"
                        style={{ mixBlendMode: 'lighten' }} />
                </g>

                {/* Text Elements with Clear Hierarchy */}
                <g className="logo-text" transform="translate(240 30)">
                    <text x="0" y="60" fontSize="56" fill="url(#mainGradient)"
                        fontFamily="'Inter', sans-serif" fontWeight="600"
                        letterSpacing="-1.5">
                        VISHAL YADAV
                    </text>
                    <text x="-20" y="110" fontSize="24" fill="#5eead4"
                        fontFamily="'Inter', sans-serif" fontWeight="300"
                        opacity="1" letterSpacing="1.2">
                        FULL-STACK SOLUTIONS ARCHITECT
                    </text>
                </g>
            </g>

            {/* Subtle Motion Lines */}
            <path d="M100 250 Q400 280 700 250"
                stroke="url(#mainGradient)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 4"
                opacity="0.4" />
        </svg>
    </div>
);


export default VyIcon;