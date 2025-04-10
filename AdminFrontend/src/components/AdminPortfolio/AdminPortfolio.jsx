import React, { useState } from "react";
import {  FaTrash, FaPlus, FaCalendarAlt, FaClock, FaDollarSign, FaCode } from "react-icons/fa";
import "./AdminPortfolio.css";


const AdminPortfolio = ({projects,setProjects,newProject,setNewProject}) => {
     const [imagesPreview, setImagesPreview] = useState([]);
    
    // 🟢 Handle input changes (general)
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes("projectCostRange")) {
            const field = name.split(".")[1]; // "min" or "max"
            setNewProject((prev) => ({
                ...prev,
                projectCostRange: { ...prev.projectCostRange, [field]: value },
            }));
        } else {
            setNewProject((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // 🟢 Handle multiple languages input
    const handleLanguagesChange = (e) => {
        setNewProject((prev) => ({
            ...prev,
            languagesUsed: e.target.value.split(",").map((lang) => lang.trim()), // Convert comma-separated string to array
        }));
    };

    // 🟢 Handle multiple images
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
    
        const imagesArray = [];
        const newPreviews = [];
    
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    const imageObject = {
                        id: `${Date.now()}-${index}`,
                        url: reader.result
                    };
                    imagesArray.push(reader.result);
                    newPreviews.push(imageObject);
                    
                    // Ensure state updates after all images are loaded
                    if (imagesArray.length === files.length) {
                        setNewProject((prev) => ({
                            ...prev,
                            projectImages: [...prev.projectImages, ...imagesArray],
                        }));
                        setImagesPreview((prev) => [...prev, ...newPreviews]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };
    

    // 🟢 Add Project
    const handleAddProject = () => {
        if (!newProject.projectTitle || !newProject.projectDescription) return;
        setProjects([...projects, { ...newProject, id: projects.length + 1 }]);
        setNewProject({
            projectTitle: "",
            projectImages: [],
            languagesUsed: [],
            projectDescription: "",
            projectDateFrom: "",
            projectCostRange: { min: "", max: "" },
            projectDuration: "",
        });
    };

    // 🟢 Delete Project
    const handleDeleteProject = (id) => {
        setProjects(projects.filter((project) => project.id !== id));
    };

    return (
        <div className="admin-portfolio-container">
            {/* ✅ Project Form */}
            <div className="project-form">
                <input type="text" name="projectTitle" placeholder="Project Title" value={newProject.projectTitle} onChange={handleInputChange} />
                <input type="text" name="projectDescription" placeholder="Project Description" value={newProject.projectDescription} onChange={handleInputChange} />
                <input type="date" name="projectDateFrom" value={newProject.projectDateFrom} onChange={handleInputChange} />
                <input type="text" name="languagesUsed" placeholder="Languages (comma separated)" value={newProject.languagesUsed.join(", ")} onChange={handleLanguagesChange} />
                <input type="number" name="projectCostRange.min" placeholder="Min Cost ($)" value={newProject.projectCostRange.min} onChange={handleInputChange} />
                <input type="number" name="projectCostRange.max" placeholder="Max Cost ($)" value={newProject.projectCostRange.max} onChange={handleInputChange} />
                <input type="text" name="projectDuration" placeholder="Project Duration" value={newProject.projectDuration} onChange={handleInputChange} />
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                <button onClick={handleAddProject}><FaPlus /> Add Project</button>
            </div>

            {/* ✅ Project List */}
            <div className="project-list">
                <h3>Existing Projects</h3>
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <div className="image-container">
                            {imagesPreview?.map((img, index) => (
                                <img key={index} src={img.url} alt={`Project ${index}`} />
                            ))}
                        </div>
                        <div className="project-info">
                            <h4>{project.projectTitle}</h4>
                            <p>{project.projectDescription}</p>
                            <div className="meta">
                                <span><FaCalendarAlt /> {new Date(project.projectDateFrom).toLocaleDateString()}</span>
                                <span><FaClock /> {project.projectDuration}</span>
                                <span><FaDollarSign /> ${project.projectCostRange.min} - ${project.projectCostRange.max}</span>
                            </div>
                            <div className="languages">
                                {project.languagesUsed.map((lang, i) => (
                                    <span key={i} className="lang-badge"><FaCode /> {lang}</span>
                                ))}
                            </div>
                        </div>
                        <div className="actions">
                            <button className="delete-btn" onClick={() => handleDeleteProject(project.id)}><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPortfolio;
