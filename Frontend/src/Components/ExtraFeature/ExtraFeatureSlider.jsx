import React, { useEffect, useState } from 'react'
import { MdArrowCircleRight, MdClose } from 'react-icons/md'
import { FaBaseball, FaMinus, FaPlus } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import './ExtraFeatureSlider.css'

const ExtraFeatureSlider = ({ slider, SetSlider, singleGig, selectedPlan ,selectedExtras,setSelectedExtras,totalPrice,setTotalPrice}) => {
    const extra = singleGig?.extraFeatures || [] // Array of extra features
    const navigate = useNavigate();
    

    // Handle checkbox selection
    const handleCheckboxChange = (extraFeature) => {
        setSelectedExtras(prev => {
            const exists = prev.find(extra => extra.id === extraFeature._id);
            if (exists) {
                return prev.filter(extra => extra.id !== extraFeature._id);
            } else {
                return [...prev, { 
                    id: extraFeature._id, 
                    price: extraFeature.price, 
                    name: extraFeature.name,
                    description: extraFeature.description,
                    quantity: 1 
                }];
            }
        });
    };

    // Handle Quantity Change
    const updateQuantity = (extraFeature, increment) => {
        setSelectedExtras(prev => prev.map(extra => 
            extra.id === extraFeature._id 
                ? { ...extra, quantity: Math.max(1, extra.quantity + (increment ? 1 : -1)) } 
                : extra
        ));
    };

    // Calculate total price whenever selectedExtras changes
    useEffect(() => {
        const extrasTotal = selectedExtras.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(selectedPlan?.price + extrasTotal);
    }, [selectedExtras, selectedPlan?.price]);

    return (
        <section id='extra-feature-slider'>
            <div className="extra-feature-container">
                <div className={`over-lay ${slider ? "dsplay-block" : "dsplay-none"}`}
                    onClick={() => SetSlider(!slider)}
                ></div>

                <div className={`slider-container ${slider ? "transLateX" : "transLate-X"}`}>
                    <div className="slider-header">
                        <span>Add Extra Features</span>
                        <span onClick={() => SetSlider(!slider)}><MdClose /></span>
                    </div>

                    <div className="detailed-about-order-container">
                        <div className="detailed-about-order">
                            <div className="detailed-top">
                                <span>{selectedPlan?.planType}</span>
                                <span>₹{selectedPlan?.price}</span>
                            </div>
                            <p className='detailed-desc'>
                                <span>{selectedPlan?.title}</span> {selectedPlan?.shortDescription}
                            </p>
                        </div>
                    </div>

                    <div className="upgrade-order-container">
                        {extra?.map((extraFeature, idx) => {
                            const isChecked = selectedExtras.some(extra => extra.id === extraFeature._id);
                            const selectedExtra = selectedExtras.find(extra => extra.id === extraFeature._id);
                            
                            return (
                                <div className="service-addon-card" key={idx}>
                                    <div className="addon-header">
                                        <span className="addon-title">{extraFeature?.name}</span>
                                        <label className="addon-toggle">
                                            <input 
                                                type="checkbox" 
                                                checked={isChecked}
                                                onChange={() => handleCheckboxChange(extraFeature)}
                                            />
                                            <span className="toggle-switch"></span>
                                        </label>
                                    </div>

                                    <p className="addon-description">
                                        {extraFeature?.description}
                                    </p>

                                    <div className="addon-divider"></div>

                                    <div className="addon-pricing">
                                        <span className="addon-price">₹{extraFeature?.price}</span>
                                        {isChecked && (
                                            <div className="quantity-selector">
                                                <button 
                                                    className="quantity-btn" 
                                                    aria-label="Decrease" 
                                                    onClick={() => updateQuantity(extraFeature, false)}
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span className="quantity-value">{selectedExtra?.quantity || 1}</span>
                                                <button 
                                                    className="quantity-btn" 
                                                    aria-label="Increase" 
                                                    onClick={() => updateQuantity(extraFeature, true)}
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="container-detailed">
                        <div className="pricing-card">
                            <div className="price-header">
                                <h3 className="price">₹{totalPrice}</h3>
                                <p className="price-label">Total Price</p>
                            </div>

                            <ul className="feature-list">
                                <li className="feature-item">
                                    <span className="feature-icon"><FaBaseball /></span>
                                    <span className="feature-text">
                                        {selectedPlan?.planType} Package</span>
                                </li>
                                <li className="feature-item">
                                    <span className="feature-icon">🚚</span>
                                    <span className="feature-text">
                                        {selectedPlan?.deliveryDays}-day delivery</span>
                                </li>
                                <li className="feature-item">
                                    <span className="feature-icon">🔄</span>
                                    <span className="feature-text">
                                        {selectedPlan?.revisionCount} revisions</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button onClick={() => navigate("/process-payment")} className='confirm-payment-order'>
                        Continue (₹{totalPrice}) <MdArrowCircleRight fontSize={"18px"} style={{ marginLeft: "10px" }} />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ExtraFeatureSlider;
