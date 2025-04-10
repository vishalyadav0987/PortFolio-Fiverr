import React, { useState } from 'react';
import './AddProjectForm.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddProjectForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    img: '',
    title: '',
    desc: '',
    tech: [],
    timeframe: {
      start: '',
      end: ''
    },
    priceRange: {
      min: '',
      max: ''
    },
    completionDate: '',
    type: 'web'
  });

  const [currentTech, setCurrentTech] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTechAdd = () => {
    if (currentTech.trim() && !formData.tech.includes(currentTech.trim())) {
      setFormData(prev => ({
        ...prev,
        tech: [...prev.tech, currentTech.trim()]
      }));
      setCurrentTech('');
    }
  };

  const handleTechRemove = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.filter(tech => tech !== techToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    try {
      const response = await axios.post('/api/v1/client/add-project', 
        formData
      , {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response.data.success){
        toast.success(response.data.message);
        navigate('/all-project')
      }
    } catch (error) {
      console.error('Error adding client project:', error);
      toast.error('Failed to add client project');
    }

  };

  return (
    <div className="add-project-container">
      <h1 className="add-project-title">Add New Project</h1>

      <form onSubmit={handleSubmit} className="project-form">
        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="img">Project Image URL</label>
          <input
            type="text"
            id="img"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="https://example.com/project-image.jpg"
          />
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Project Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="E-commerce Platform"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="desc">Project Description*</label>
          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            required
            rows="4"
            placeholder="A full-featured online store with payment integration..."
          />
        </div>

        {/* Technologies */}
        <div className="form-group">
          <label>Technologies*</label>
          <div className="tech-input-container">
            <input
              type="text"
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              placeholder="React"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTechAdd())}
            />
            <button style={{
              width: "fit-content"
            }} type="button" onClick={handleTechAdd} className="tech-add-btn">
              Add
            </button>
          </div>
          <div className="tech-tags">
            {formData.tech.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
                <button style={{
                  width: "fit-content"
                }} type="button" onClick={() => handleTechRemove(tech)} className="tech-remove-btn">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Timeframe */}
        <div className="form-group">
          <label>Project Timeframe*</label>
          <div className="date-range">
            <div className="date-input">
              <label htmlFor="timeframe.start">Start Date</label>
              <input
                type="date"
                id="timeframe.start"
                name="timeframe.start"
                value={formData.timeframe.start}
                onChange={handleChange}
                required
              />
            </div>
            <div className="date-input">
              <label htmlFor="timeframe.end">End Date</label>
              <input
                type="date"
                id="timeframe.end"
                name="timeframe.end"
                value={formData.timeframe.end}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="form-group">
          <label>Price Range*</label>
          <div className="price-range">
            <div className="price-input">
              <label htmlFor="priceRange.min">Min ($)</label>
              <input
                type="number"
                id="priceRange.min"
                name="priceRange.min"
                value={formData.priceRange.min}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="price-input">
              <label htmlFor="priceRange.max">Max ($)</label>
              <input
                type="number"
                id="priceRange.max"
                name="priceRange.max"
                value={formData.priceRange.max}
                onChange={handleChange}
                min={formData.priceRange.min || 0}
                required
              />
            </div>
          </div>
        </div>

        {/* Completion Date */}
        <div className="form-group">
          <label htmlFor="completionDate">Completion Date</label>
          <input
            type="date"
            id="completionDate"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleChange}
          />
        </div>

        {/* Project Type */}
        <div className="form-group">
          <label htmlFor="type">Project Type*</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Web">Web Application</option>
            <option value="Ecommerce">Ecommerce Website</option>
            <option value="Bussiness">Bussiness Website</option>
            <option value="PortFolio">PortFolio Website</option>
            <option value="Embedded">Embedded System</option>
            <option value="LandingPage">LandingPage</option>
          </select>
        </div> 

        <div className="form-actions">
          <button style={{
            width: "fit-content"
          }} type="submit" className="submit-btn">
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProjectForm;