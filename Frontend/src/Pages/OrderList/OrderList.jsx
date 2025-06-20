import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaCalendarAlt, FaCreditCard, FaFileInvoice, FaInfoCircle, FaMoneyCheckAlt, FaPaypal, FaRegClock, FaTags } from 'react-icons/fa';
import './Orders.css';
import { useOrderContext } from '../../Context/OrderContext';
import useFetchUserOrders from '../../CustomHook/useFetchOrder'
import Spinner from '../../Components/Spinner/Spinner';
import { Rating } from '@mui/material'
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from '../../Context/AuthContext';
import ChatUI from '../../Components/ChatUI/ChatUI';
import { FaMessage } from 'react-icons/fa6';
import { fetchConversationByOrderId } from "../../services/chatService";
import { useMessageContext } from '../../Context/MessageContext';



const OrderList = ({ setDropdownOpen }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const { loading, allOrders } = useOrderContext();
    useFetchUserOrders();
    const [viewMode, setViewMode] = useState('card');
    const statusColors = {
        'Rejected': '#ef4444',
        'In Progress': '#f59e0b',
        'Accepted': '#3b82f6',
        'Delivered': '#10b981'
    };
     



    if (loading) return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "70vh"
        }}>
            <Spinner />
        </div>
    );


    const orders = allOrders || [];



    return (
        <div className="orders-container" onClick={() => setDropdownOpen(false)}>
            <div>
                <h1 className='order-heading'>Manage Your <span>Orders</span></h1>
                <div className="view-toggle">
                    <button className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`} onClick={() => setViewMode('card')}>
                        <FaBox /> Card View
                    </button>
                    <button className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                        <FaFileInvoice /> Table View
                    </button>
                </div>
            </div>

            {viewMode === 'card' ? (
                <div className="orders-grid">
                    {orders && orders?.map(order => (
                        <OrderCard key={order?._id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Delivery</th>
                                <th>Services</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders?.map(order => (
                                <tr key={order._id}>
                                    <td>
                                        <div className="table-order-id">
                                            <div>#{order?._id.slice(-6).toUpperCase()}</div>
                                            <div className="order-date">
                                                <FaCalendarAlt /> {new Date(order?.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="status-badge" style={{ backgroundColor: statusColors[order?.orderStatus] }}>
                                            {order?.orderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="total-amount">
                                            <FaMoneyCheckAlt /> ₹{order?.paymentInfo.totalAmount}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="delivery-date">
                                            <FaRegClock /> {order?.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-GB') : 'Pending'}


                                        </div>
                                    </td>
                                    <td>
                                        <div className="table-services">
                                            {order?.OrderItems.slice(0, 2).map(item => (
                                                <div key={item.gigId} className="service-item">
                                                    <img src={item.thumbnailImage.url} alt={item.title} />
                                                    <div className="service-info">
                                                        <div className="service-title">{item.title}</div>
                                                        <span className="plan-badge">{item.selectedPlan.planType}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.OrderItems.length > 2 && (
                                                <div className="more-items">+{order.OrderItems.length - 2} more services</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <Link to={`/orders/${order._id}`} className="details-button">
                                            <FaInfoCircle /> Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const OrderCard = ({ order }) => {

    const navigate = useNavigate();
    const { authUser } = useAuthContext()
    const [showReviewModal, setShowReviewModal] = useState(false)
    const statusColors = {
        'Rejected': '#ef4444',
        'In Progress': '#f59e0b',
        'Accepted': '#3b82f6',
        'Delivered': '#10b981'
    };
    const PaymentstatusColors = {
        'Failed': '#ef4444',
        'Partially Paid': '#3b82f6',
        'Paid': '#10b981'
    };
    const [revLoading,setRevLoading] = useState(false)

    /*------------- REIEW LOGIC BASED ON ID AND GIGID ---------------*/
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('')
    const addRatingHandle = async (orderId, gigId) => {
        setRevLoading(true)

        try {
            const response = await axios.post(`https://portfolio-fiverr.onrender.com/api/v1/gig/review`, {
                orderId,
                gigId: gigId[0]?.gigId,
                rating,
                comment
            }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });

            if (response.data.success) {
                toast.success(response.data.message);
                setShowReviewModal(!showReviewModal);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log("Error in addRatingHandle:", error);
        } finally {
            setRevLoading(false)
            setComment('');
            setRating(0);
            setShowReviewModal(!showReviewModal);
        }
    };
    /*------------- REIEW LOGIC BASED ON ID AND GIGID ---------------*/



    /*------------- MILESTONE TO FULL PAYMENT ---------------*/
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
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


    const handleMileToFullPayment = async (orderId) => {
        console.log(orderId);
        if (!orderId) {
            toast.error("Order id sholud be corect!");
            return;
        }

        if (!scriptLoaded) return toast.error('Payment gateway is loading...');

        try {
            setIsProcessing(true);

            const { data: razorpayOrder } =
                await axios.post("https://portfolio-fiverr.onrender.com/api/v1/gig/order/payRemainingAmount", { orderId }, {
                    withCredentials: true,
                });

            const options = {
                key: "rzp_test_REPEeGSfqJEoFd",
                amount: razorpayOrder?.amount, // 🟢 Convert to paise
                currency: razorpayOrder?.currency,
                name: "Vishal Yadav",
                order_id: razorpayOrder?.orderId,
                handler: async (response) => {
                    // console.log(response);

                    try {
                        await axios.post('https://portfolio-fiverr.onrender.com/api/v1/gig/order/verifyRemainingPayment', {
                            orderId,
                            ...response,
                        }, {
                            withCredentials: true,
                        });

                        toast.success("Payment Successful!");

                        setTimeout(() => navigate('/profile'), 2000);

                    } catch (error) {
                        toast.error(error.response?.data?.message || "Payment verification failed");
                    }
                },
                prefill: {
                    name: `${authUser?.name}`,
                    email: authUser?.email,
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

    }
    /*------------- MILESTONE TO FULL PAYMENT ---------------*/







    /*------------- Communicate with Admin ---------------*/
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { conversation, setConversation, messages, setMessages } = useMessageContext()
    const [messageLoading, setMessageLoading] = useState(false)

    const handleOpenChat = async (orderId) => {
        setIsChatOpen(true);
        setMessageLoading(true);
        const data = await fetchConversationByOrderId(orderId);
        console.log(data);

        if (data.success) {
            setConversation(data.conversation);
            setMessages(data.messages);
        } else {
            alert(data.message); // Error handling
        }
        setMessageLoading(false);
    };
    /*------------- Communicate with Admin ---------------*/




    return (
        <div className="order-card">
            <div className="card-header">
                <div className="header-left">
                    <span className="order-id">ORDER #{order._id.slice(-6).toUpperCase()}</span>
                    <span className="order-date">
                        <FaCalendarAlt /> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <span className="status-badge" style={{ backgroundColor: statusColors[order.orderStatus] }}>
                        {order.orderStatus}
                    </span>
                    <span className="status-badge" style={{ backgroundColor: PaymentstatusColors[order?.paymentInfo?.paymentStatus] }}>
                        {order?.paymentInfo?.paymentStatus}
                    </span>
                </div>
            </div>

            <div className="card-body">
                <div className="order-summary">
                    <div className="summary-item">
                        <FaMoneyCheckAlt className="summary-icon" />
                        <div>
                            <span className="summary-label">Total</span>
                            <span className="summary-value">₹{order.paymentInfo.totalAmount}</span>
                        </div>
                    </div>

                    <div className="summary-item">
                        <FaRegClock className="summary-icon" />
                        <div>
                            <span className="summary-label">Delivery</span>
                            <span className="summary-value">
                                {order.deliveryDate ? new Date(order?.deliveryDate).toLocaleDateString()?.slice(0, 6) + "/" + `${new Date().getFullYear()}` : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="order-preview">
                    <h4 className="preview-title">Order Items</h4>
                    <div className="preview-items">
                        {order.OrderItems.slice(0, 2).map(item => (
                            <div key={item.gigId} className="preview-item">
                                <img src={item.thumbnailImage.url} alt={item.title} />
                                <div className="item-info">
                                    <h5>{item.title}</h5>
                                    <span className="plan-badge">{item.selectedPlan.planType} Plan</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {order.OrderItems.length > 2 && (
                        <div className="more-items">+{order.OrderItems.length - 2} more services</div>
                    )}
                </div>
            </div>

            <div className="card-footer" style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
            }}>
                <Link to={`/orders/${order._id}`} className="details-button">
                    <FaInfoCircle /> View Full Details
                </Link>
                {
                    order?.paymentInfo?.paymentStatus === "Partially Paid" && (
                        <button className="details-button" style={{
                            border: 'none',
                            padding: "0.85rem 1rem",
                            cursor: "pointer",

                        }}

                            onClick={(e) => {
                                e.preventDefault();
                                handleMileToFullPayment(order?._id);
                            }}


                        >
                            <FaPaypal /> {
                                isProcessing ? <Spinner /> : ("Pay full amount")
                            } ₹{
                                order?.paymentInfo?.totalAmount / 2
                            }
                        </button>
                    )
                }
                {
                    order?.paymentInfo?.paymentStatus === "Paid" && order?.orderStatus !== "Completed" && (
                        <button className="details-button"
                            onClick={() => setShowReviewModal(true)}
                            style={{
                                border: 'none',
                                padding: "0.85rem 1rem",
                                cursor: "pointer",
                            }}>
                            <FaBox /> Write Review
                        </button>
                    )
                }

                <button className="details-button"
                    onClick={() => {
                        handleOpenChat(order._id)
                    }}
                    style={{
                        border: 'none',
                        padding: "0.85rem 1rem",
                        cursor: "pointer",
                    }}>
                    <FaMessage /> Chat with Admin
                </button>
            </div>
            {showReviewModal && (
                <div className="modal-overlay-1">
                    <div className="modal-1">
                        <h3 style={{ marginBottom: "8px" }}>Enter your review</h3>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <span
                                style={{ color: "#718096", fontSize: "12px", textTransform: "uppercase" }}
                            >
                                orderId:{" "}<span
                                    style={{ color: "#0d9488", fontSize: "12px", textTransform: "lowercase" }}
                                >#{order?._id}</span>
                            </span>
                            <span
                                style={{ color: "#718096", fontSize: "12px", textTransform: "uppercase" }}
                            >
                                gigId: {order?.OrderItems.slice(0, 2).map((item, i) => (
                                    <span
                                        style={{ color: "#0d9488", fontSize: "12px", textTransform: "lowercase" }}
                                        key={i}>#{item?.gigId}</span>
                                ))}
                            </span>
                        </div>
                        <div style={{
                            display: "flex", alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size='large'
                                precision={0.5}
                            />
                            <input type="text"
                                className='rating-input'
                                max={5}
                                min={0}
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                style={{
                                    width: "100px",
                                    border: "1px solid #718096",
                                    marginLeft: "10px",
                                    padding: "8px 10px",
                                    fontSize: "0.8rem",
                                    borderRadius: "5px"
                                }}
                                placeholder='Rating 4.5'
                                pattern="[0-5]+"
                            />
                        </div>
                        <textarea
                            style={{ marginTop: "8px" }}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review here...."
                        />
                        <div className="modal-actions-1">
                            <button
                                onClick={() => setShowReviewModal(false)}>Cancel</button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();

                                    const orderItems = order?.OrderItems.map((item) => ({
                                        gigId: item.gigId
                                    }));

                                    addRatingHandle(order?._id, orderItems);
                                }}
                                disabled={revLoading}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    opacity: revLoading ? 0.6 : 1,
                                    cursor: revLoading ? "not-allowed" : "pointer"
                                }}
                            >
                                {
                                    revLoading ? (
                                        <>
                                            <Spinner />
                                            <span style={{ fontSize: "14px", fontWeight: "500" }}>Submitting...</span>
                                        </>
                                    ) : (
                                        <span style={{ fontSize: "14px", fontWeight: "500" }}>Submit Review</span>
                                    )
                                }
                            </button>


                        </div>
                    </div>
                </div>
            )}

            <ChatUI
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                orderId={order?._id}
                order={order}
                messageLoading={messageLoading}
            />

        </div>
    );
};

// Updated CSS
export default OrderList;