import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./AdminPricingPlans.css";

const AdminPricingPlans = ({pricingPlans,setPricingPlans,extraFeatures,setExtraFeatures,newPlan,setNewPlan,newFeature,setNewFeature}) => {
    

    const handlePlanChange = (e) => {
        const { name, value } = e.target;
        setNewPlan((prev) => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (e) => {
        const { name, value } = e.target;
        setNewFeature((prev) => ({ ...prev, [name]: value }));
    };

    const addPricingPlan = () => {
        if (!newPlan.title || !newPlan.price) return;
        setPricingPlans([...pricingPlans, { ...newPlan, features: newPlan.features.split(",").map(f => f.trim()) }]);
        setNewPlan({ planType: "Basic", price: "", title: "", shortDescription: "", deliveryDays: "", revisionCount: "", features: "" });
    };

    const deletePricingPlan = (index) => {
        setPricingPlans(pricingPlans.filter((_, i) => i !== index));
    };

    const addExtraFeature = () => {
        if (!newFeature.name || !newFeature.price) return;
        setExtraFeatures([...extraFeatures, newFeature]);
        setNewFeature({ name: "", description: "", price: "" });
    };

    const deleteExtraFeature = (index) => {
        setExtraFeatures(extraFeatures.filter((_, i) => i !== index));
    };

    return (
        <div className="price-container">
            {/* Pricing Plans */}
            <div className="price-section">
                <h3 className="price-heading">Pricing Plans</h3>
                <select className="price-select" name="planType" value={newPlan.planType} onChange={handlePlanChange}>
                    <option>Basic</option>
                    <option>Standard</option>
                    <option>Premium</option>
                </select>
                <input className="price-input" type="text" name="title" placeholder="Title" value={newPlan.title} onChange={handlePlanChange} />
                <input className="price-input" type="number" name="price" placeholder="Price ($)" value={newPlan.price} onChange={handlePlanChange} />
                <textarea className="price-textarea" name="shortDescription" placeholder="Short Description" value={newPlan.shortDescription} onChange={handlePlanChange} />
                <input className="price-input" type="number" name="deliveryDays" placeholder="Delivery Days" value={newPlan.deliveryDays} onChange={handlePlanChange} />
                <input className="price-input" type="number" name="revisionCount" placeholder="Revision Count" value={newPlan.revisionCount} onChange={handlePlanChange} />
                <input className="price-input" type="text" name="features" placeholder="Features (comma-separated)" value={newPlan.features} onChange={handlePlanChange} />
                <button className="price-btn" onClick={addPricingPlan}><FaPlus /> Add Plan</button>
                <ul className="price-list">
                    {pricingPlans.map((plan, index) => (
                        <li key={index} className="price-list-item">
                            {plan.planType} - {plan.title} - ${plan.price}
                            <button className="price-delete-btn" onClick={() => deletePricingPlan(index)}><FaTrash /></button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Extra Features */}
            <div className="price-extra-section">
                <h3 className="price-heading">Extra Features</h3>
                <input className="price-input" type="text" name="name" placeholder="Feature Name" value={newFeature.name} onChange={handleFeatureChange} />
                <input className="price-input" type="text" name="description" placeholder="Description" value={newFeature.description} onChange={handleFeatureChange} />
                <input className="price-input" type="number" name="price" placeholder="Price ($)" value={newFeature.price} onChange={handleFeatureChange} />
                <button className="price-btn" onClick={addExtraFeature}><FaPlus /> Add Feature</button>
                <ul className="price-list">
                    {extraFeatures.map((feature, index) => (
                        <li key={index} className="price-list-item">
                            {feature.name} - ${feature.price}
                            <button className="price-delete-btn" onClick={() => deleteExtraFeature(index)}><FaTrash /></button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminPricingPlans;
