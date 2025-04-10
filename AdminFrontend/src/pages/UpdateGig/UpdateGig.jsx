import React, { useState, useEffect } from 'react';
import './UpdateGig.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast'
import Spinner from '../../components/Spinner/Spinner'

const UpdateGig = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [upLoading, setUpLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnailImages: [],
        DetailedAboutYourself: {
            from: '',
            since: '',
            AvgResponseT: '',
            Languages: [],
            AboutMe: ''
        },
        MyPortfolio: [],
        PricingPlans: [],
        extraFeatures: [],
        FAQ: [],
        projectDetails: {
            websiteType: '',
            techStack: [],
            functionality: []
        }
    });

    useEffect(() => {
        const fetchGig = async () => {
            try {
                const { data } = await axios.get(`/api/v1/gig/get/${id}`);
                setGig(data.gig.gig);
                setFormData({
                    title: data.gig.title,
                    description: data.gig.description,
                    thumbnailImages: data.gig.thumbnailImages,
                    DetailedAboutYourself: data.gig.DetailedAboutYourself,
                    PricingPlans: data.gig.PricingPlans,
                    extraFeatures: data.gig.extraFeatures,
                    FAQ: data.gig.FAQ,
                    projectDetails: data.gig.projectDetails
                });
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchGig();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        const updatedArray = [...formData[section]];
        updatedArray[index] = {
            ...updatedArray[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            [section]: updatedArray
        }));
    };

    const handleAddItem = (section, template) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], template]
        }));
    };

    const handleRemoveItem = (section, index) => {
        const updatedArray = formData[section].filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            [section]: updatedArray
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpLoading(true)
        try {
            const response = await axios.put(`/api/v1/gig/update/${id}`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/all-gig')
            }

        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.log("Failed to update gig");
            toast.error("Failed to update gig ❌")

        }finally{
            setUpLoading(false)
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="update-gig">
            <h1 className="update-gig__title">Update Your Gig</h1>

            <form onSubmit={handleSubmit} className="update-gig__form">
                {/* Basic Information */}
                <div className="update-gig__section">
                    <h2 className="update-gig__section-title">Basic Information</h2>
                    <div className="update-gig__group">
                        <label className="update-gig__label">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="update-gig__input"
                            required
                        />
                    </div>

                    <div className="update-gig__group">
                        <label className="update-gig__label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="update-gig__textarea"
                            required
                        />
                    </div>
                </div>

                {/* About Yourself */}
                <div className="update-gig__section">
                    <h2 className="update-gig__section-title">About Yourself</h2>
                    <div className="update-gig__group">
                        <label className="update-gig__label">From</label>
                        <input
                            type="text"
                            value={formData.DetailedAboutYourself.from}
                            onChange={(e) => handleNestedChange('DetailedAboutYourself', 'from', e.target.value)}
                            className="update-gig__input"
                            required
                        />
                    </div>

                    <div className="update-gig__group">
                        <label className="update-gig__label">Working Since</label>
                        <input
                            type="text"
                            value={formData.DetailedAboutYourself.since}
                            onChange={(e) => handleNestedChange('DetailedAboutYourself', 'since', e.target.value)}
                            className="update-gig__input"
                            required
                        />
                    </div>

                    <div className="update-gig__group">
                        <label className="update-gig__label">Average Response Time</label>
                        <input
                            type="text"
                            value={formData.DetailedAboutYourself.AvgResponseT}
                            onChange={(e) => handleNestedChange('DetailedAboutYourself', 'AvgResponseT', e.target.value)}
                            className="update-gig__input"
                            required
                        />
                    </div>

                    <div className="update-gig__group">
                        <label className="update-gig__label">Languages (comma separated)</label>
                        <input
                            type="text"
                            value={formData.DetailedAboutYourself.Languages.join(', ')}
                            onChange={(e) => handleNestedChange('DetailedAboutYourself', 'Languages', e.target.value.split(',').map(lang => lang.trim()))}
                            className="update-gig__input"
                            required
                        />
                    </div>

                    <div className="update-gig__group">
                        <label className="update-gig__label">About Me</label>
                        <textarea
                            value={formData.DetailedAboutYourself.AboutMe}
                            onChange={(e) => handleNestedChange('DetailedAboutYourself', 'AboutMe', e.target.value)}
                            className="update-gig__textarea"
                            required
                        />
                    </div>
                </div>

                {/* Portfolio */}
                <div className="update-gig__section">
                    <h2 className="update-gig__section-title">Portfolio Projects</h2>
                    {formData?.MyPortfolio?.map((project, index) => (
                        <div key={index} className="update-gig__item">
                            <div className="update-gig__group">
                                <label className="update-gig__label">Project Title</label>
                                <input
                                    type="text"
                                    value={project.projectTitle}
                                    onChange={(e) => handleArrayChange('MyPortfolio', index, 'projectTitle', e.target.value)}
                                    className="update-gig__input"
                                    required
                                />
                            </div>

                            <div className="update-gig__group">
                                <label className="update-gig__label">Languages Used (comma separated)</label>
                                <input
                                    type="text"
                                    value={project.languagesUsed.join(', ')}
                                    onChange={(e) => handleArrayChange('MyPortfolio', index, 'languagesUsed', e.target.value.split(',').map(lang => lang.trim()))}
                                    className="update-gig__input"
                                    required
                                />
                            </div>

                            <div className="update-gig__group">
                                <label className="update-gig__label">Project Description</label>
                                <textarea
                                    value={project.projectDescription}
                                    onChange={(e) => handleArrayChange('MyPortfolio', index, 'projectDescription', e.target.value)}
                                    className="update-gig__textarea"
                                    required
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemoveItem('MyPortfolio', index)}
                                className="update-gig__remove-btn"
                            >
                                <span className="update-gig__remove-icon">×</span> Remove Project
                            </button>
                        </div>
                    ))}
                    <button
                        disabled={true}
                        type="button"
                        onClick={() => handleAddItem('MyPortfolio', {
                            projectTitle: '',
                            projectImages: [],
                            languagesUsed: [],
                            projectDescription: '',
                            projectDateFrom: new Date(),
                            projectCostRange: { min: 0, max: 0 },
                            projectDuration: ''
                        })}
                        className="update-gig__add-btn"
                    >
                        Add Project
                    </button>
                </div>

                {/* Pricing Plans */}
                <div className="update-gig__section">
                    <h2 className="update-gig__section-title">Pricing Plans</h2>
                    {formData.PricingPlans.map((plan, index) => (
                        <>
                            <div key={index} className="update-gig__item">
                                <div className="update-gig__group">
                                    <label className="update-gig__label">Plan Type</label>
                                    <select
                                        value={plan.planType}
                                        onChange={(e) => handleArrayChange('PricingPlans', index, 'planType', e.target.value)}
                                        className="update-gig__select"
                                        required
                                    >
                                        <option value="Basic">Basic</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                </div>

                                <div className="update-gig__group">
                                    <label className="update-gig__label">Price ($)</label>
                                    <input
                                        type="number"
                                        value={plan.price}
                                        onChange={(e) => handleArrayChange('PricingPlans', index, 'price', e.target.value)}
                                        className="update-gig__input"
                                        required
                                    />
                                </div>

                                <div className="update-gig__group">
                                    <label className="update-gig__label">Title</label>
                                    <input
                                        type="text"
                                        value={plan.title}
                                        onChange={(e) => handleArrayChange('PricingPlans', index, 'title', e.target.value)}
                                        className="update-gig__input"
                                        required
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem('PricingPlans', index)}
                                    className="update-gig__remove-btn"
                                >
                                    <span className="update-gig__remove-icon">×</span> Remove Plan
                                </button>
                            </div>
                            <div style={{
                                height: "1px",
                                width: "100%",
                                background: "#1a272c",
                                marginTop: "20px",
                                marginBottom: "30px"
                            }} />
                        </>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem('PricingPlans', {
                            planType: 'Basic',
                            price: 0,
                            title: '',
                            shortDescription: '',
                            deliveryDays: 0,
                            revisionCount: 0,
                            features: []
                        })}
                        className="update-gig__add-btn"
                    >
                        Add Pricing Plan
                    </button>
                </div>

                {/* Project Details */}
                <div className="update-gig__section">
                    <h2 className="update-gig__section-title">Project Details</h2>
                    <div className="update-gig__group">
                        <label className="update-gig__label">Website Type</label>
                        <input
                            type="text"
                            value={formData.projectDetails.websiteType}
                            onChange={(e) => handleNestedChange('projectDetails', 'websiteType', e.target.value)}
                            className="update-gig__input"
                            required
                        />
                    </div>

                    <div className="update-gig__group">
                        <label className="update-gig__label">Tech Stack (comma separated)</label>
                        <input
                            type="text"
                            value={formData.projectDetails.techStack.join(', ')}
                            onChange={(e) => handleNestedChange('projectDetails', 'techStack', e.target.value.split(',').map(tech => tech.trim()))}
                            className="update-gig__input"
                            required
                        />
                    </div>

                    <div className="update-gig__group">
                        <label className="update-gig__label">Functionality (comma separated)</label>
                        <input
                            type="text"
                            value={formData.projectDetails.functionality.join(', ')}
                            onChange={(e) => handleNestedChange('projectDetails', 'functionality', e.target.value.split(',').map(func => func.trim()))}
                            className="update-gig__input"
                            required
                        />
                    </div>
                </div>

                <div className="update-gig__actions">
                    <button style={{
                        width:"fit-content"
                    }} type="submit" className="update-gig__submit-btn">{
                        loading ? (
                            <>
                            <Spinner/> ...Updating 
                            </>
                        ): "Update Gig"
                    }</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateGig;