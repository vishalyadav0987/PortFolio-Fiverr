import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./AdminFAQ.css";

const AdminFAQ = ({faqs,setFaqs,newFaq,setNewFaq}) => {
    

    const handleFaqChange = (e) => {
        const { name, value } = e.target;
        setNewFaq((prev) => ({ ...prev, [name]: value }));
    };

    const addFaq = () => {
        if (!newFaq.question || !newFaq.answer) return;
        setFaqs([...faqs, newFaq]);
        setNewFaq({ question: "", answer: "" });
    };

    const deleteFaq = (index) => {
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    return (
        <div className="FAQ-container">
            <h3>FAQs</h3>
            <input type="text" name="question" placeholder="Question" value={newFaq.question} onChange={handleFaqChange} />
            <textarea name="answer" placeholder="Answer" value={newFaq.answer} onChange={handleFaqChange} />
            <button onClick={addFaq}><FaPlus /> Add FAQ</button>
            <ul>
                {faqs.map((faq, index) => (
                    <li key={index}>
                        <strong>Question: {faq.question}</strong>Answer: {faq.answer}
                        <button className="delete-btn" onClick={() => deleteFaq(index)}><FaTrash /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AdminProjectDetails = ({projectDetails,setProjectDetails}) => {
   

    const handleProjectChange = (e) => {
        const { name, value } = e.target;
        setProjectDetails((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="FAQ-ProjectDetails-container">
            <h3>Project Details</h3>
            <input type="text" name="websiteType" placeholder="Type of project" value={projectDetails.websiteType} onChange={handleProjectChange} />
            <input type="text" name="techStack" placeholder="Tech Stack (comma-separated)" value={projectDetails.techStack} onChange={handleProjectChange} />
            <input type="text" name="functionality" placeholder="Functionality (comma-separated)" value={projectDetails.functionality} onChange={handleProjectChange} />
        </div>
    );
};

export { AdminFAQ, AdminProjectDetails };
