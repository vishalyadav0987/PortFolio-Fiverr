import React, { useState, useEffect } from "react";
import { FaArrowAltCircleRight, FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import './PricingCard.css';

const PricingCard = ({ SetSlider, selectedPlan,setSelectedPlan,plans,gigId }) => {
    const [showFeatures, setShowFeatures] = useState(false);

    if (!selectedPlan) {
        return <p>No plans available.</p>;
    }

    return (
        <div className="pricing-container">
            <div className="plan-switcher">
                {plans.map((plan) => (
                    <button
                    
                        key={plan.planType}
                        className={`plan-btn ${selectedPlan.planType === plan.planType ? "active" : ""}`}
                        onClick={() => {setSelectedPlan(plan);}}
                    >
                        {plan.planType}
                    </button>
                ))}
            </div>

            <div className="single-gig-card">
                <h2 className="title">{selectedPlan.title} - <span>₹{selectedPlan.price}</span></h2>
                <p className="short-description">{selectedPlan.shortDescription}</p>

                <div className="delivery-revisions">
                    <span className="icon-text">🚚 {selectedPlan.deliveryDays} days</span>
                    <span className="icon-text">🔄 {selectedPlan.revisionCount} revisions</span>
                </div>

                <div className="features-section">
                    <button className={`features-toggle ${showFeatures ? "open" : ""}`} onClick={() => setShowFeatures(!showFeatures)}>
                        What's Included {showFeatures ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    <ul className={`features-list ${showFeatures ? "open" : ""}`}>
                        {selectedPlan.features?.length > 0 ? (
                            selectedPlan.features.map((feature, index) => (
                                <li key={index}><FaCheck className="check-icon" /> {feature}</li>
                            ))
                        ) : (
                            <li>No features available.</li>
                        )}
                    </ul>
                </div>

                <button className="contact-btn" onClick={() => {SetSlider(true); localStorage.setItem("gigId",gigId);}}>
                    Order <FaArrowAltCircleRight />
                </button>
            </div>
        </div>
    );
};

export default PricingCard;
