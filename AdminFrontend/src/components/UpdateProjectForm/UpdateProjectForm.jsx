import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave, FiTrash2, FiX, FiCheck, FiPlus, FiXCircle } from 'react-icons/fi';
import './UpdateProjectForm.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const UpdateProjectForm = ({ onCancel }) => {
    const { id: projectId } = useParams();
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
        type: 'web',
    });

    const [currentTech, setCurrentTech] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch project data
    useEffect(() => {
        const fetchProject = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/v1/client/get-project/${projectId}`);
                if (response.data.success) {
                    setFormData(response.data.data);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

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
        setIsSubmitting(true);

        try {
            const response = await axios.put(`/api/v1/client/update-project/${projectId}`,
                formData,
            )
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/all-project')
            }
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('Failed to update project')
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            // Replace with actual API call
            console.log('Deleting project:', projectId);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // On success, you might want to redirect or show a success message
            alert('Project deleted successfully!');
            onCancel(); // Close the form after deletion
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    if (isLoading) {
        return (
            <div className="update-project-container">
                <div className="loading-spinner">Loading project data...</div>
            </div>
        );
    }

    return (
        <div className="update-project-container">
            <div className="form-header">
                <button style={{
                    width: "fit-content"
                }} onClick={onCancel} className="back-button">
                    <FiArrowLeft /> Back to Projects
                </button>
                <h2>Update Project</h2>
                <div className="project-id">ID: {projectId}</div>
            </div>

            <form onSubmit={handleSubmit} className="project-form">
                <div className="form-grid">
                    {/* Left Column */}
                    <div className="form-column">
                        {/* Image URL */}
                        <div className="form-group">
                            <label htmlFor="img">Project Image URL</label>
                            <div className="image-preview-container">
                                {formData.img ? (
                                    <img src={formData.img} alt="Project preview" className="image-preview" />
                                ) : (
                                    <div className="image-placeholder">No image</div>
                                )}
                                <input
                                    type="text"
                                    id="img"
                                    name="img"
                                    value={formData.img}
                                    onChange={handleChange}
                                    placeholder="https://example.com/project-image.jpg"
                                />
                            </div>
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
                                rows="5"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="form-column">
                        {/* Technologies */}
                        <div className="form-group">
                            <label>Technologies*</label>
                            <div className="tech-input-container">
                                <input
                                    type="text"
                                    value={currentTech}
                                    onChange={(e) => setCurrentTech(e.target.value)}
                                    placeholder="Add technology..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTechAdd())}
                                />
                                <button style={{
                                    width: "fit-content"
                                }} type="button" onClick={handleTechAdd} className="tech-add-btn">
                                    <FiPlus />
                                </button>
                            </div>
                            <div className="tech-tags">
                                {formData.tech.map((tech) => (
                                    <span key={tech} className="tech-tag">
                                        {tech}
                                        <button
                                            style={{
                                                width: "fit-content"
                                            }}
                                            type="button"
                                            onClick={() => handleTechRemove(tech)}
                                            className="tech-remove-btn"
                                        >
                                            <FiX />
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
                                        value={new Date(formData.timeframe.start).toISOString().split('T')[0]}
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
                                        value={
                                            new Date(formData.timeframe.end).toISOString().split('T')[0]
                                        }
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
                                value={
                                    new Date(formData.completionDate).toISOString().split('T')[0]
                                }
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


                    </div>
                </div>

                <div className="form-actions">
                    <div className="left-actions">
                        <button
                            style={{
                                width: "fit-content"
                            }}
                            type="button"
                            className="delete-btn"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <FiTrash2 /> Delete Project
                        </button>
                    </div>
                    <div className="right-actions">
                        <button
                            style={{
                                width: "fit-content"
                            }}
                            type="button"
                            className="cancel-btn"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            style={{
                                width: "fit-content"
                            }}
                            type="submit"
                            className="save-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'} <FiSave />
                        </button>
                    </div>
                </div>
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="delete-confirm-modal">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this project? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                style={{
                                    width: "fit-content"
                                }}
                                className="cancel-delete-btn"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                <FiXCircle /> Cancel
                            </button>
                            <button
                                style={{
                                    width: "fit-content"
                                }}
                                className="confirm-delete-btn"
                                onClick={handleDelete}
                            >
                                <FiCheck /> Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateProjectForm;