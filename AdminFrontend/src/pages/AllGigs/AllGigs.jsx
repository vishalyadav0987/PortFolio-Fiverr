import React, { useState } from 'react';
import { FaEdit, FaTrash, FaMoneyCheckAlt, FaRegClock, FaInfoCircle, FaStar, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { useGigContext } from '../../Context/gigContext';
import useFetchAllGigs from '../../CustomHook/useFetchAllGigs';
import './AllGigs.css'
import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AllGigs = () => {
    useFetchAllGigs();
    const { allGigs, loading, setAllGigs } = useGigContext();

    if (loading) return (
        <div className="spinner-container" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh"
        }}>
            <Spinner />
        </div>
    );

    return (
        <div className="gigs-container">
            <header className="gigs-header" style={{
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between"
            }}>
                <h1>Manage Your <span>Gigs</span></h1>
                <h1>{allGigs?.length}</h1>
            </header>

            <div className="gigs-grid">
                {allGigs.map(gig => (
                    <GigCard key={gig._id} gig={gig} setAllGigs={setAllGigs} />
                ))}
            </div>
        </div>
    );
};

const GigCard = ({ gig, setAllGigs }) => {
    const statusColors = {
        'draft': '#94a3b8',
        'active': '#10b981',
        'paused': '#f59e0b'
    };

    /*************************************************/
    const [delLoading, setDelLoading] = useState(false);
    const deleteGigHandler = async (gigId) => {
        setDelLoading(true);
        try {
            const response = await axios.delete(`https://portfolio-fiverr.onrender.com/api/v1/gig/delete/${gigId}`,{
                withCredentials: true, // If you need to send cookies or authentication headers
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setAllGigs((prev) => {
                    return prev.filter(item => item._id !== gigId);
                })
            }
        } catch (error) {
            console.log("Error in deleteGigHandler: ", error.message);
            toast.error("Error in delete the gig");
        } finally {
            setDelLoading(false);
        }
    }
    /*************************************************/

    return (
        <div className="gig-card horizontal">
            <div className="card-media">
                <img src={gig.thumbnailImages[1]?.url} alt="Thumbnail" className="gig-thumbnail" />
            </div>
            <div className="card-content">
                <div className="card-header">
                    <h3 className="gig-title">{gig.title}</h3>
                    <span className="status-badge" style={{ backgroundColor: statusColors[gig.status] }}>
                        {gig.status}
                    </span>
                </div>
                <div className="card-body">
                    <div className="pricing-section">
                        <div className="price-tier">
                            <FaMoneyCheckAlt className="summary-icon" />
                            <div className="price-info">
                                <span className="tier-label">Basic Plan</span>
                                <span className="tier-price">₹{gig.PricingPlans.find(p => p.planType === 'Basic')?.price || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="price-tier">
                            <FaMoneyCheckAlt className="summary-icon" />
                            <div className="price-info">
                                <span className="tier-label">Standard Plan</span>
                                <span className="tier-price">₹{gig.PricingPlans.find(p => p.planType === 'Standard')?.price || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="price-tier">
                            <FaMoneyCheckAlt className="summary-icon" />
                            <div className="price-info">
                                <span className="tier-label">Premium Plan</span>
                                <span className="tier-price">₹{gig.PricingPlans.find(p => p.planType === 'Premium')?.price || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="details-section">
                        <div className="detail-item">
                            <FaStar className="detail-icon" />
                            <span>Rating: {gig.ratings} ({gig.numOfReviews} reviews)</span>
                        </div>
                        <div className="detail-item">
                            <FaUser className="detail-icon" />
                            <span>Created by: {gig.createdBy?.name || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <FaCalendarAlt className="detail-icon" />
                            <span>Created on: {new Date(gig.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                  <Link to={`/update-gig/${gig._id}`} style={{
                    display:"flex",
                    width:"50%"
                  }}>
                  <button className="action-btn edit">
                        <FaEdit /> Edit Gig
                    </button>
                  </Link>
                    <button className="action-btn delete" onClick={() => {
                        deleteGigHandler(gig._id)
                    }}>
                        <FaTrash /> {
                            delLoading ? (
                                <>
                                    <Spinner /> "deleting...."
                                </>
                            ) : "delete"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};


export default AllGigs;