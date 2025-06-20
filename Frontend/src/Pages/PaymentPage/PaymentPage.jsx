import React, { useEffect, useState } from 'react'
import './PaymentPage.css';
import { toast } from 'react-hot-toast';
import { FaCheck, FaCcVisa, FaCcMastercard, FaPaypal, FaPencilAlt, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FaList, FaUser } from 'react-icons/fa6';
import { FaMoneyCheckAlt, FaProjectDiagram } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);

    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        country: "",
        phone: "",
    });

    const onChangeHandle = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({ ...data, [name]: value }));
    }




    const steps = [
        { id: 1, title: 'Order & Details', icon: <FaPencilAlt /> },
        { id: 2, title: 'Confirm & Pay', icon: <FaList /> },
        { id: 3, title: 'Submit Requirements', icon: <FaUser /> },
    ];

    const nextStep = () => {
        if (step < steps.length) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const [paymentType, setPaymentType] = useState('Full');



    const paymentOptions = [
        {
            type: 'Full',
            icon: <FaMoneyCheckAlt />,
            title: 'Full Payment',
            desc: 'Pay entire amount upfront'
        },
        {
            type: 'Milestone',
            icon: <FaProjectDiagram />,
            title: 'Milestone Payment',
            desc: 'Split payment into stages'
        }
    ];


    /*-------------Hnadle Payment using razorpay-------------*/

    const getData = localStorage.getItem("orderItemsData");
    let parseData = null;
    let total = 0;

    try {
        parseData = JSON.parse(getData) || {};
        total = JSON.parse(localStorage.getItem("totalAmount")) || 0;
    } catch (error) {
        console.error("Error parsing localStorage data:", error);
    }

    useEffect(() => {
        const loadScript = () => {
            if (window.Razorpay) {
                setScriptLoaded(true);
                return;
            }
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            script.onerror = () => toast.error('Failed to load payment gateway');
            document.body.appendChild(script);
        };

        loadScript();

        return () => {
            const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
            if (script) script.remove();
        };
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!data.firstName || !data.lastName || !data.country || !data.city || !data.state || !data.phone || !data.email || !data.street) {
            toast.error("Please fill all the details");
            return;
        }
        if (!scriptLoaded) return toast.error('Payment gateway is loading...');
    
        try {
            setIsProcessing(true);
    
            // 🟢 Milestone logic: Check if half payment is done
            let payableAmount = total;
            let isFirstMilestone = false;
            if (paymentType === "Milestone") {
                const paidAmount = JSON.parse(localStorage.getItem("paidAmount")) || 0;
                if (paidAmount === 0) {
                    payableAmount = total / 2; // First milestone = Half Amount
                    isFirstMilestone = true;
                } else {
                    payableAmount = total - paidAmount; // Remaining half
                }
            }
    
            const dataForBackend = {
                buyerId: parseData?.buyerId,
                deliveryDate: parseData?.deliveryDate,
                maxRevisions: parseData?.maxRevisions,
                orderItems: parseData?.orderItems,
                addressInfo: {
                    address: data.street,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    phoneNo: data.phone
                },
                paymentType,
                totalAmount: total,
                paidAmount: payableAmount, // 🟢 Sending only the current payable amount
            };
    
            const { data: razorpayOrder } = await axios.post("https://portfolio-fiverr.onrender.com/api/v1/gig/order/place", dataForBackend,{
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            });
    
            const options = {
                key: "rzp_test_REPEeGSfqJEoFd",
                amount: (payableAmount * 100).toString(), // 🟢 Convert to paise
                currency: razorpayOrder.currency,
                name: "Vishal Yadav",
                order_id: razorpayOrder.orderId,
                handler: async (response) => {
                    // console.log(response);
                    
                    try {
                        await axios.post('https://portfolio-fiverr.onrender.com/api/v1/gig/order/verify', response);
    
                        // 🟢 Store paid amount for Milestone Payments
                        if (paymentType === "Milestone") {
                            let newPaidAmount = payableAmount;
                            if (!isFirstMilestone) {
                                newPaidAmount += JSON.parse(localStorage.getItem("paidAmount")) || 0;
                            }
                            localStorage.setItem("paidAmount", JSON.stringify(newPaidAmount));
                        }
    
                        toast.success("Payment Successful!");
                        if (paymentType !== "Milestone" || !isFirstMilestone) {
                            localStorage.removeItem("orderItemsData");
                            localStorage.removeItem("totalAmount");
                            localStorage.removeItem("paidAmount");
                            setTimeout(() => navigate('/order-success'), 2000);
                        } else {
                            toast.info("First milestone paid. Please complete the full payment later.");
                        }
                    } catch (error) {
                        toast.error(error.response?.data?.message || "Payment verification failed");
                    }
                },
                prefill: {
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    contact: data.phone
                },
                theme: { color: "#0d9488" },
                modal: { ondismiss: () => toast.error("Payment cancelled") }
            };
    
            new window.Razorpay(options).open();
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment Failed");
        } finally {
            setIsProcessing(false);
        }
    };
    

    /*------------Hnadle Payment using razorpay--------------*/
    const gst = ((+total / 100) * 18).toFixed(0);
    const finalAmount = parseInt((+total + 667.43)) + parseInt(gst);



    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="payment-place-order-container">
            <div className="step-indicator">
                {steps.map((s, i) => (

                    <div key={i} className={`step ${step === s.id ? 'active' : ''}`}>
                        {s.icon}
                        <span>{s.title}</span>
                        {
                            i != 2 && (
                                <div className='line-for-step' style={{ width: "50%" }}></div>
                            )
                        }
                    </div>


                ))}
            </div>
            <div className='payment-place-order'>
                <div className="payment-place-order-left">
                    <p className="payment-title">Delivery Information</p>
                    <div className="payment-multi-fields">
                        <div className="payment-input-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                id="firstName"
                                name='firstName'
                                onChange={onChangeHandle}
                                value={data.firstName}
                                type="text"
                                placeholder='John'
                                required
                            />
                        </div>
                        <div className="payment-input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                id="lastName"
                                name='lastName'
                                onChange={onChangeHandle}
                                value={data.lastName}
                                type="text"
                                placeholder='Doe'
                                required
                            />
                        </div>
                    </div>

                    <div className="payment-input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name='email'
                            onChange={onChangeHandle}
                            value={data.email}
                            type="email"
                            placeholder='john.doe@example.com'
                            required
                        />
                    </div>

                    <div className="payment-input-group">
                        <label htmlFor="street">Street Address</label>
                        <input
                            id="street"
                            name='street'
                            onChange={onChangeHandle}
                            value={data.street}
                            type="text"
                            placeholder='123 Main Street'
                            required
                        />
                    </div>

                    <div className="payment-multi-fields">
                        <div className="payment-input-group">
                            <label htmlFor="zipcode">City</label>
                            <input
                                id="zipcode"
                                name='city'
                                onChange={onChangeHandle}
                                value={data.city}
                                type="text"
                                placeholder='Delhi'
                                required
                            />
                        </div>
                        <div className="payment-input-group">
                            <label htmlFor="country">Country</label>
                            <input
                                id="country"
                                name='country'
                                onChange={onChangeHandle}
                                value={data.country}
                                type="text"
                                placeholder='United States'
                                required
                            />
                        </div>
                    </div>

                    <div className="payment-input-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            name='phone'
                            onChange={onChangeHandle}
                            value={data.phone}
                            type="tel"
                            placeholder='+1 234 567 890'
                            required
                        />
                    </div>
                    <div className="payment-input-group">
                        <label htmlFor="zipcode">State</label>
                        <input
                            id="zipcode"
                            name='state'
                            onChange={onChangeHandle}
                            value={data.state}
                            type="text"
                            placeholder='Delhi'
                            required
                        />
                    </div>
                    <div className="payment-payment-selector-container">
                        <h3 className="payment-selector-heading">Select Payment Method</h3>

                        <div className="payment-payment-options-grid">
                            {paymentOptions.map((option, i) => (
                                <div
                                    key={i}
                                    className={`payment-payment-option-card ${paymentType === option.type ? 'selected' : ''}`}
                                    onClick={() => setPaymentType(option.type)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="payment-option-icon">{option.icon}</div>
                                    <h4 className="payment-option-title">{option.title}</h4>
                                    <p className="payment-option-desc">{option.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="payment-place-order-right">
                    <div className='payment-cart-total-details'>
                        <h2>Order Summary</h2>

                        {/* Project Summary */}
                        <div className="payment-project-summary">
                            <div className="payment-project-header">
                                <img
                                    src={parseData?.orderItems[0]?.thumbnailImage?.url}
                                    alt="Project Preview"
                                    className="payment-project-preview"
                                />
                                <div className="payment-project-titles">
                                    <h3>{parseData.orderItems[0]?.title?.slice(0, -8)}</h3>
                                    <p>{parseData.orderItems[0]?.selectedPlan?.planType}</p>
                                </div>
                            </div>


                            <div className="payment-features-section">
                                <button className={`payment-features-toggle ${showFeatures ? "open" : ""}`} onClick={() => setShowFeatures(!showFeatures)}>
                                    What's Included {showFeatures ? <FaChevronUp /> : <FaChevronDown />}
                                </button>

                                <ul className={`payment-features-list ${showFeatures ? "open" : ""}`}>
                                    {parseData.orderItems[0]?.selectedPlan?.features?.length > 0 ? (
                                        parseData.orderItems[0]?.selectedPlan?.features?.map((feature, index) => (
                                            <li key={index}><FaCheck className="payment-check-icon" /> {feature}</li>
                                        ))
                                    ) : (
                                        <li>No features available.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="payment-price-breakdown">
                            <div className="payment-cart-details">
                                <p>Subtotal</p>
                                <p>₹{total}</p>
                            </div>
                            <div className="payment-cart-details">
                                <p>Service Fee</p>
                                <p style={{
                                    textDecoration: "line-through",
                                    opacity: 0.345,
                                }}>₹677.43</p>
                            </div>
                            <div className="payment-cart-details">
                                <p>GST (18%)</p>
                                <p style={{
                                    textDecoration: "line-through",
                                    opacity: 0.345,
                                }}>₹{((total / 100) * 18).toFixed(2)}</p>
                            </div>

                            <div className="payment-total-amount">
                                <div className="cart-details" style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: '20px'
                                }}>
                                    <div className="payment-total-cut">
                                        <b>Total Amount: </b>
                                        <b style={{
                                            textDecoration: "line-through",
                                            opacity: 0.345,
                                        }}>₹{Math.round(finalAmount)}</b>
                                    </div>
                                    <div className='payment-discounted'>
                                        <b>Discount Price: </b>
                                        <b>₹{total}</b>
                                    </div>
                                </div>
                            </div>

                            <div className="payment-delivery-time">
                                <FaCheck className="payment-check-icon" />
                                <span>Total delivery time: 3 working days</span>
                            </div>
                        </div>

                        <button className="payment-payment-button" type='submit' onClick={handlePayment}>
                            Proceed to Payment (₹{paymentType === "Milestone" ? total / 2 : total})
                            <span className="payment-button-icon">→</span>
                        </button>

                        {/* Accepted Payments */}
                        <div className="payment-accepted-payments">
                            <p>We Accept:</p>
                            <div className="payment-payment-methods">
                                <FaCcVisa className="payment-payment-icon" />
                                <FaCcMastercard className="payment-payment-icon" />
                                <FaPaypal className="payment-payment-icon" />
                                <span>UPI</span>
                                <span>Net Banking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PaymentPage


