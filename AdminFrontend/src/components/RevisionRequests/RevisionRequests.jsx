// components/RevisionRequests.jsx
import React from 'react';
import './RevisionRequests.css';

const requests = [
    {
      _id: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      orderId: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      buyerId: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      revisionDescription: "Please change the background color to dark theme and update the logo placement according to the new brand guidelines. Also need to adjust the spacing between sections.",
      requestedAt: new Date(),
      status: 'Pending',
    },
    {
      _id: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      orderId: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      buyerId: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      revisionDescription: "Need to revise the homepage hero section text. Please change the headline to 'Next Generation Digital Solutions' and add 3 new feature cards below.",
      requestedAt: new Date(),
      completedAt: new Date(),
      status: 'Completed',
    },
    {
      _id: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      orderId: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      buyerId: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      revisionDescription: "Requesting to update all form field validations and error messages. Please ensure mobile number validation supports international formats.",
      requestedAt: new Date(),
      status: 'Approved',
    },
    {
      _id: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      orderId: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      buyerId: "vjdfsjvsjfdvdfvjkdjkvjksdj",
      revisionDescription: "Please completely redesign the dashboard layout according to the wireframe provided. Need to add new analytics section and reorganize navigation menu.",
      requestedAt: new Date(),
      completedAt: new Date(),
      status: 'Rejected',
    }
  ];

const RevisionRequests = () => {
  const handleAction = (requestId, action) => {
    // Handle approval/rejection/completion logic
    console.log(`Action ${action} on request ${requestId}`);
  };

  return (
    <div className="revision-container">
      <h2 className="revision-title">Revision Requests</h2>
      
      {requests.map((request) => (
        <div key={request._id} className="request-card">
          <div className="request-header">
            <span className="order-id">Order #: {request.orderId}</span>
            <span className={`status-badge ${request.status.toLowerCase()}`}>
              {request.status}
            </span>
          </div>

          <div className="request-grid">
            <div className="request-section">
              <h3 className="section-title">Order Information</h3>
              <p className="request-detail">
                <span className="detail-label">Buyer ID:</span>
                <span className="detail-value">{request.buyerId}</span>
              </p>
            </div>

            <div className="request-section">
              <h3 className="section-title">Revision Details</h3>
              <div className="description-box">
                {request.revisionDescription}
              </div>
            </div>

            <div className="request-section">
              <h3 className="section-title">Dates</h3>
              <p className="request-detail">
                <span className="detail-label">Requested:</span>
                <span className="detail-value">
                  {new Date(request.requestedAt).toLocaleDateString()}
                </span>
              </p>
              {request.completedAt && (
                <p className="request-detail">
                  <span className="detail-label">Completed:</span>
                  <span className="detail-value">
                    {new Date(request.completedAt).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="action-buttons">
            {request.status === 'Pending' && (
              <>
                <button 
                  className="btn approve-btn"
                  onClick={() => handleAction(request._id, 'approve')}
                >
                  Approve
                </button>
                <button
                  className="btn reject-btn"
                  onClick={() => handleAction(request._id, 'reject')}
                >
                  Reject
                </button>
              </>
            )}
            {request.status === 'Approved' && (
              <button
                className="btn complete-btn"
                onClick={() => handleAction(request._id, 'complete')}
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RevisionRequests;