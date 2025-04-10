import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaMoneyCheckAlt, FaMoon, FaPencilAlt, FaPortrait, FaQq, FaSun, FaUser } from "react-icons/fa";
import { FaTrash, FaUpload, FaArrowsAlt } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaList } from 'react-icons/fa';
import JoditEditor from "jodit-pro-react";
import EnterDetails from '../../components/EnterDetails/EnterDetails'
import './CreateGig.css'
import AdminPortfolio from '../../components/AdminPortfolio/AdminPortfolio';
import AdminPricingPlans from '../../components/AdminPricingPlans/AdminPricingPlans';
import { AdminFAQ, AdminProjectDetails } from '../../components/AdminFAQ/AdminFAQ';
import axios from 'axios'
import { toast } from 'react-hot-toast';
import Spinner from '../../components/Spinner/Spinner';


const CreateGig = () => {
    const [loading,setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("");
    const editor = useRef(null)
    const [content, setContent] = useState('')

    const maxLength = 100;
    const isLimitExceeded = title.length > maxLength;
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const newImages = [];
        const newPreviews = [];

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    const imageObject = {
                        id: `${Date.now()}-${index}`,
                        url: reader.result
                    };
                    newImages.push(reader.result);
                    newPreviews.push(imageObject);

                    // Ensure state updates after all images are loaded
                    if (newImages.length === files.length) {
                        setImages((prev) => [...prev, ...newImages]);
                        setImagesPreview((prev) => [...prev, ...newPreviews]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemove = (id) => {
        setImagesPreview((prev) => prev.filter((img) => img.id !== id));
        setImages((prev) => prev.filter((_, index) => index !== imagesPreview.findIndex((img) => img.id === id)));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedItems = [...imagesPreview];
        const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, reorderedItem);
        setImagesPreview(reorderedItems);
    };



    const steps = [
        { id: 1, title: 'Title & Thumbnail', icon: <FaPencilAlt /> },
        { id: 2, title: 'Detailed Description', icon: <FaList /> },
        { id: 3, title: 'About Me', icon: <FaUser /> },
        { id: 4, title: 'My Portfolio', icon: <FaPortrait /> },
        { id: 5, title: 'Pricing Plans', icon: <FaMoneyCheckAlt /> },
        { id: 6, title: 'FAQs', icon: <FaQq /> },
    ];

    const nextStep = () => {
        if (step < steps.length) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    /*---------- Ye UseSate hai EnterDetails.jsx se ----------*/
    const [formDataA, setFormDataA] = useState({
        from: "",
        since: "",
        AvgResponseT: "",
        Languages: "",
        AboutMe: "",
    });
    /*---------- Ye UseSate hai EnterDetails.jsx se ----------*/




    /*---------- Ye UseSate hai AdminPortflio.jsx se ----------*/
    const [projects, setProjects] = useState([]);

    const [newProject, setNewProject] = useState({
        projectTitle: "",
        projectImages: [],
        languagesUsed: [],
        projectDescription: "",
        projectDateFrom: "",
        projectCostRange: { min: "", max: "" },
        projectDuration: "",
    });
    /*---------- Ye UseSate hai AdminPortflio.jsx se ----------*/



    /*---------- Ye UseSate hai AdminPricingPlans.jsx se ----------*/
    const [pricingPlans, setPricingPlans] = useState([]);
    const [extraFeatures, setExtraFeatures] = useState([]);
    const [newPlan, setNewPlan] = useState({
        planType: "Basic",
        price: "",
        title: "",
        shortDescription: "",
        deliveryDays: "",
        revisionCount: "",
        features: "",
    });
    const [newFeature, setNewFeature] = useState({ name: "", description: "", price: "" });
    useEffect(() => {
        console.log(pricingPlans);

    }, [pricingPlans])
    /*---------- Ye UseSate hai AdminPricingPlans.jsx se ----------*/



    /*---------- Ye UseSate hai AdminFAQ.jsx se ----------*/
    const [faqs, setFaqs] = useState([]);
    const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
    const [projectDetails, setProjectDetails] = useState({
        websiteType: "",
        techStack: "",
        functionality: ""
    });
    /*---------- Ye UseSate hai AdminFAQ.jsx se ----------*/



    /*---------- API ka Khel Yha se Start Hogo ----------*/

    const createGigHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title || "");
        formData.append("description", content || "");

        // Ensure images array exists
        if (Array.isArray(images)) {
            images.forEach((image) => formData.append("thumbnailImages", image));
        } else {
            console.warn("images is undefined or not an array");
        }

        // Append about me details safely
        formData.append("from", formDataA?.from || "");
        formData.append("since", formDataA?.since || "");
        formData.append("AvgResponseT", formDataA?.AvgResponseT || "");
        formData.append("Languages", formDataA.Languages.split(","));
        formData.append("AboutMe", formDataA?.AboutMe || "");

        formData.append(`MyPortfolio`, projects);
        formData.append(`PricingPlans`, JSON.stringify(pricingPlans));
        formData.append(`FAQ`, JSON.stringify(faqs));
        formData.append(`extraFeatures`, JSON.stringify(extraFeatures));

        // Append project details safely
        formData.append("websiteType", projectDetails.websiteType);
        formData.append("techStack", projectDetails?.techStack.split(","));
        formData.append("functionality", projectDetails?.functionality.split(","));


        try {
            const response = await axios.post("/api/v1/gig/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setLoading(false);
                // Reset state
                setStep(1);
                setTitle("");
                setContent("");
                setImages([]);
                setImagesPreview([]);
                setProjects([]);
                setPricingPlans([]);
                setExtraFeatures([]);
                setProjectDetails({ websiteType: "", techStack: "", functionality: "" });
            }

        } catch (error) {
            setLoading(false)
            console.error("Error creating gig:", error);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };




    /*---------- API ka Khel Yha se End Hogo ------------*/


    return (
        <section id='create-gig'>
            <div className="create-gig-container">
            <header className="gigs-header">
                <h1>Create Your <span>Gigs</span></h1>
            </header>
                {/* Step Progress Bar */}
                <div className="step-indicator">
                    {steps.map((s, i) => (
                        <>
                            <div key={s.id} className={`step ${step === s.id ? 'active' : ''}`}
                                onClick={() => {
                                    setStep(i + 1)
                                }}>
                                {s.icon}
                                <span>{s.title}</span>
                            </div>
                            {
                                i != 3 && (
                                    <div className='line-for-step'></div>
                                )
                            }
                        </>
                    ))}
                </div>
                {/* <form onSubmit={createGigHandler}> */}
                {/*  Step 1. */}
                {
                    step == 1 && (
                        <div className="" id="step-1">
                            <div className="title-input-container">
                                <label className="title-label">Enter Gig Title</label>
                                <div className={`title-box ${isLimitExceeded ? "error" : ""}`}>
                                    <FaPencilAlt className="title-icon" />
                                    <input
                                        type="text"
                                        placeholder="Enter your gig title..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="title-input"
                                    />
                                    <span className={`char-count ${isLimitExceeded ? "error" : ""}`}>
                                        {title.length}/{maxLength}
                                    </span>
                                </div>
                                <p className={`note ${isLimitExceeded ? "error" : ""}`}>Max: {maxLength} characters</p>
                            </div>
                            <div className="thumbnail-box">
                                <label className="title-label">Enter Gig Thubnail</label>
                                <div className="thumbnail-container">
                                    <label className="upload-label">
                                        <FaUpload /> Upload Images
                                        <input
                                            type="file"
                                            name="gig-image"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            multiple
                                        />

                                    </label>

                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="imagesPreview" direction="horizontal">
                                            {(provided) => (
                                                <div
                                                    className="thumbnail-grid"
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {imagesPreview?.map((img, index) => (
                                                        <Draggable key={img.id} draggableId={img.id} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    className="thumbnail"
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <FaArrowsAlt className="drag-icon" />
                                                                    <img src={img.url} alt="Uploaded" />
                                                                    <button className="remove-btn" onClick={() => handleRemove(img.id)}>
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>
                                <p className={`note ${isLimitExceeded ? "error" : ""}`}>Images: Add mutilple</p>
                            </div>
                        </div>
                    )
                }
                {/* ENTER DESCRIPTION DETAILED */}  {/*  Step 2. */}
                {
                    step == 2 && (
                        <>
                            <div className="editor-for-desc">
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    tabIndex={1}
                                    onChange={newContent => setContent(newContent)}
                                />
                            </div>
                        </>
                    )
                }
                {/*  Step 3. */}
                {
                    step == 3 && (
                        <EnterDetails
                            formData={formDataA}
                            setFormData={setFormDataA} />
                    )
                }
                {/*  Step 4. */}
                {
                    step == 4 && (
                        <AdminPortfolio
                            projects={projects}
                            setProjects={setProjects}
                            newProject={newProject}
                            setNewProject={setNewProject}
                        />
                    )
                }
                {/*  Step 5. */}
                {
                    step == 5 && (
                        <AdminPricingPlans
                            pricingPlans={pricingPlans}
                            setPricingPlans={setPricingPlans}
                            extraFeatures={extraFeatures}
                            setExtraFeatures={setExtraFeatures}
                            newPlan={newPlan} setNewPlan={setNewPlan}
                            newFeature={newFeature}
                            setNewFeature={setNewFeature}
                        />
                    )
                }
                {/*  Step 6. */}
                {
                    step == 6 && (
                        <>
                            <AdminFAQ
                                faqs={faqs}
                                setFaqs={setFaqs}
                                newFaq={newFaq}
                                setNewFaq={setNewFaq}
                            />
                            <AdminProjectDetails
                                projectDetails={projectDetails}
                                setProjectDetails={setProjectDetails}
                            />
                        </>
                    )
                }
                {/* Navigation Buttons */}

                <div className='step-button-submit'>
                    <div className="step-buttons">
                        {step > 1 && <button onClick={prevStep}><FaArrowLeft /></button>}
                        {step < steps.length ? <button onClick={nextStep}><FaArrowRight /></button> : null}
                    </div>
                    {/* <Spinner/> */}
                    <div>
                    {
                        step == 6 && (
                            <button id='submit-gig-button' type="button" onClick={createGigHandler}>{
                                loading ? 
                                (<Spinner/>) : ("Create Gig")
                            }</button>

                        )
                    }
                    </div>
                </div>

                {/* </form> */}
            </div>
        </section>
    )
}

export default CreateGig
