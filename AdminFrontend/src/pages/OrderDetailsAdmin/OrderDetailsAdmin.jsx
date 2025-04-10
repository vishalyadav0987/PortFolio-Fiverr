import React, { useEffect, useState } from 'react';
import './OrderDetailsAdmin.css';
import {
    FiUser, FiPackage, FiDollarSign, FiCalendar, FiEdit, FiCheckCircle,
    FiTruck, FiClock, FiRefreshCw, FiMessageSquare, FiSettings
} from 'react-icons/fi';
import RevisionsSection from '../../components/RevisionsSection/RevisionsSection';
import { useOrderContext } from '../../Context/OrderContext';
import useFetchOrderById from '../../CustomHook/useGetOrderById';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BsExclamationCircleFill } from "react-icons/bs";

const OrderDetailsAdmin = () => {
    const { orderId } = useParams();
    const { singleOrder, loading } = useOrderContext();
    const { status, setStatus } = useFetchOrderById(orderId); // Fetch order details by ID

    const [adminNotes, setAdminNotes] = useState('');
    const [showNotes, setShowNotes] = useState(false);

    // setStatus(singleOrder?.orderStatus);


    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus)
        try {
            const response = await axios.patch('/api/v1/gig/admin/update-status', {
                orderId,
                orderStatus: newStatus
            }, { headers: { 'Content-Type': 'application/json' } });

            if (response.data.success) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error('Error in handleStatusChange:', error);
            toast.error('Failed to update status');
        }
    };

    const saveAdminNotes = () => {
        // Add API call to save notes
        setShowNotes(false);
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    if (!singleOrder) {
        return <div>Order not found.</div>; // Handle case where order is not found
    }


    const {
        _id,
        buyerId,
        addressInfo,
        OrderItems,
        paymentInfo,
        deliveryDate,
        revisionRequests,
        orderStatus,
        maxRevisions,
        usedRevisions = 0,
    } = singleOrder;


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; // Fallback for invalid or missing dates
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid dates
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        return `${day}/${month}`; // Format: DD/MM
    };


    const givingDateOnly = (dateString) => {
        if (!dateString) return 'N/A'; // Fallback for invalid or missing dates
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid dates
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}`; // Format: DD/MM
    };


    const calculateDeliveryProgress = () => {
        let bookDate = givingDateOnly(singleOrder?.createdAt);
        let todayDate = (new Date()).getDate();
        let deliveryD = givingDateOnly(deliveryDate);

        const orderProgress = (Number(todayDate) - Number(bookDate)) / (Number(deliveryD) - Number(bookDate));


        if (+deliveryD < +todayDate) {
            return [100, "#dc3545"];
        }
        return [orderProgress * 100, "#5eead4"]

    }

    const currentDate = new Date();
    const deliveryDateObj = new Date(deliveryDate);


    const isDeliveryDateCrossed = currentDate > deliveryDateObj;

    return (
        <div className="order-details-admin">
            {/* Order Header */}
            <div className="order-header">
                <div className="order-meta">
                    <h2>Order #{_id?.toString().slice(-8)}</h2>
                    <div className="status-container">
                        <span className={`status-badge ${orderStatus?.replace(' ', '-')}`}>
                            <FiCheckCircle className="status-icon" />
                            {status || singleOrder?.orderStatus}
                        </span>
                        <div className="order-timeline">
                            <span className="timeline-item">
                                <FiCalendar className="icon" />
                                {new Date(paymentInfo?.paidAt).toLocaleDateString()}
                            </span>
                            <span className="timeline-item">
                                <FiClock className="icon" />
                                Due: {formatDate(deliveryDate)}/{(new Date()).getFullYear()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Control Panel */}
                <div className="control-panel">
                    <h3><FiSettings className="icon" /> Order Controls</h3>
                    <div className="control-actions">
                        <select
                            value={status || singleOrder?.orderStatus}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="status-select"
                        >
                            <option value="In Progress">In Progress</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <button className="btn action-btn">
                            <FiEdit /> Extend Delivery Date
                        </button>

                        <button className="btn action-btn">
                            <FiRefreshCw /> Add Revision
                        </button>

                        <div className="admin-notes">
                            <button
                                className="btn notes-btn"
                                onClick={() => setShowNotes(!showNotes)}
                            >
                                <FiMessageSquare /> {showNotes ? 'Hide' : 'Show'} Admin Notes
                            </button>
                            {showNotes && (
                                <div className="notes-editor">
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add private admin notes..."
                                    />
                                    <button onClick={saveAdminNotes} className="btn save-btn">
                                        Save Notes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Grid */}
            <div className="order-grid">
                {/* Buyer Information Section */}
                <div className="buyer-info section-card">
                    <h3><FiUser className="icon" /> Buyer Information</h3>
                    <div className="buyer-details">
                        <img src={buyerId?.avatar?.url} alt="Buyer Avatar" />
                        <div>
                            <p>{buyerId?.name}</p>
                            <p>{buyerId?.email}</p>
                            <p>{addressInfo?.phoneNo}</p>
                        </div>
                    </div>
                    <div className="address-details">
                        <p>{addressInfo?.address}</p>
                        <p>{addressInfo?.city}, {addressInfo?.state}</p>
                        <p>{addressInfo?.country}</p>
                    </div>
                </div>

                {/* Order Items Section */}
                <div className="order-items section-card">
                    <h3><FiPackage className="icon" /> Order Items</h3>
                    {OrderItems?.map((item, index) => (
                        <div key={index} className="order-item">
                            <div className="item-header">
                                <img src={item?.thumbnailImage?.url} alt={item.title} />
                                <div>
                                    <h4>{item?.title}</h4>
                                    <p>{item?.selectedPlan?.planType} Plan</p>
                                </div>
                            </div>
                            <div className="item-details">
                                <div className="plan-details">
                                    <p>Delivery Days: {item?.selectedPlan.deliveryDays}</p>
                                    <p>Revisions: {item?.selectedPlan.revisionCount}</p>
                                    <p>Quantity: {item?.quantity}</p>
                                </div>
                                {item?.extraFeatures?.length > 0 && (
                                    <div className="extra-features">
                                        <h5>Extra Features:</h5>
                                        {item.extraFeatures.map((feature, fIndex) => (
                                            <div key={fIndex} className="feature">
                                                <span>{feature.name}</span>
                                                <span>+${feature.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment & Delivery Section */}
                <div className="payment-section section-card">
                    <h3><FiDollarSign className="icon" /> Payment & Delivery</h3>
                    <div className="payment-details">
                        <div className="payment-row">
                            <span>Payment Type:</span>
                            <span>{paymentInfo?.paymentType}</span>
                        </div>
                        <div className="payment-row">
                            <span>Status:</span>
                            <span className={`status-badge ${paymentInfo?.paymentStatus.replace(' ', '-')}`}>
                                {paymentInfo?.paymentStatus}
                            </span>
                        </div>
                        <div className="payment-row">
                            <span>Total Amount:</span>
                            <span>${paymentInfo?.totalAmount}</span>
                        </div>
                        <div className="payment-row">
                            <span>Paid At:</span>
                            <span>{new Date(paymentInfo?.paidAt).toLocaleString()}</span>
                        </div>
                    </div>

                    <h3 style={{
                        marginBottom: "0.6rem"
                    }}>Delivery Information</h3>
                    <div className="delivery-details"
                        style={{
                            borderBottom: "1px solid #242429",
                            paddingBottom: "20px"
                        }}
                    >
                        <p>Estimated Delivery: {formatDate(deliveryDate)}/{(new Date()).getFullYear()}</p>
                        <div className="progress-bar">
                            <div className="progress-fill"
                                style={{
                                    width: `${calculateDeliveryProgress()[0]}%`,
                                    background: `${calculateDeliveryProgress()[1]}`
                                }}></div>
                        </div>


                        {/* Delivery Information Section */}
                        <div className="delivery-details">
                            {isDeliveryDateCrossed && singleOrder?.orderStatus !== "Delivered" && (
                                <div className="delivery-note">
                                    {/* Clickable Header */}
                                    <p
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            width: "100%",
                                            position: "relative",
                                            cursor: "pointer", // Add pointer cursor
                                            marginBottom: "0"
                                        }}
                                    >
                                        ⚠️ <strong>Delivery Date Crossed</strong>
                                        <BsExclamationCircleFill style={{
                                            position: "absolute",
                                            right: "10px"
                                        }} />
                                    </p>

                                </div>
                            )}
                        </div>
                    </div>
                    <h3 style={{
                        marginBottom: "0.6rem"
                    }}>Delivery Completed + Revision</h3>
                    <div className="delivery-details">
                        <p>Estimated Delivered:
                            {formatDate(singleOrder?.updatedAt)}/{(new Date()).getFullYear()}</p>
                        <div className="progress-bar">
                            <div className="progress-fill"
                                style={{
                                    width: `100%`,
                                }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revisions Section */}
            <div className="revisions-section-control">
                <RevisionsSection
                    orderId={orderId}
                    revisions={revisionRequests}
                    maxRevisions={maxRevisions}
                    usedRevisions={usedRevisions}
                />
            </div>
        </div>
    );
};

export default OrderDetailsAdmin;