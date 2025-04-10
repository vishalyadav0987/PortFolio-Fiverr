import React, { useState } from "react";
import { FaGlobe, FaCalendarAlt, FaClock, FaLanguage, FaUser, FaArrowRight } from "react-icons/fa";
import "./EnterDetails.css";

const EnterDetails = ({formData,setFormData}) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="enter-details">

      <div className="input-group">
        <FaGlobe className="icon" />
        <input type="text" name="from" placeholder="Country (e.g., India)" value={formData.from} onChange={handleChange} />
      </div>

      <div className="input-group">
        <FaCalendarAlt className="icon" />
        <input type="text" name="since" placeholder="Since (e.g., 2020)" value={formData.since} onChange={handleChange} />
      </div>

      <div className="input-group">
        <FaClock className="icon" />
        <input type="text" name="AvgResponseT" placeholder="Avg Response Time (e.g., 2 hours)" value={formData.AvgResponseT} onChange={handleChange} />
      </div>

      <div className="input-group">
        <FaLanguage className="icon" />
        <input type="text" name="Languages" placeholder="Languages (e.g., English, Hindi)" value={formData.Languages} onChange={handleChange} />
      </div>

      <div className="input-group">
        <textarea name="AboutMe" placeholder="Tell us about yourself..." value={formData.AboutMe} onChange={handleChange} />
      </div>

    </div>
  );
};

export default EnterDetails;
