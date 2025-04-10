import React from 'react';
import { motion } from 'framer-motion';
import './TechInsights.css';

const techStack = [
    { name: 'MERN', percentage: 30, color: '#FACC15' },
    { name: 'MEAN', percentage: 20, color: '#4ADE80' },
    { name: 'Flutter', percentage: 25, color: '#3B82F6' },
    { name: 'Next.js', percentage: 15, color: '#FB7185' },
    { name: 'Django', percentage: 10, color: '#A78BFA' }
];

const TechInsights = () => {
    return (
        <motion.div 
            className="tech-insights-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="tech-title"
            >
                Technology Usage Insights
            </motion.h2>
            <div className="tech-list">
                {techStack.map((tech, index) => (
                    <motion.div 
                        key={index} 
                        className="tech-item"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        style={{ backgroundColor: tech.color }}
                    >
                        <span className="tech-name">{tech.name}</span>
                        <span className="tech-percentage">{tech.percentage}%</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default TechInsights;
