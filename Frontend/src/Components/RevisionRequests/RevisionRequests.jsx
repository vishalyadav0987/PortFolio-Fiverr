// components/RevisionRequests.jsx
import React from 'react';
import './RevisionRequests.css';
import { formatDistanceToNow } from 'date-fns';
import { BsCalendarDate } from "react-icons/bs";
import { FaLuggageCart } from "react-icons/fa";
import { MdEventRepeat } from "react-icons/md";


const RevisionRequests = ({ revisionRequests,usedRevision }) => {
  console.log(revisionRequests);

  return (
    <div className="revision-container">

      {
        revisionRequests?.length === 0 && (
          <div className="no-requests" style={{ textAlign: "center" }}>
            <h3 style={{
              fontSize: "2rem",
              color: "#5eead4",
              marginBottom: "1rem"

            }}>No revision requests found</h3>
          </div>
        )
      }
      {
        revisionRequests?.length !== 0 && <h2 className="revision-title">Revision Requests</h2>
      }
      {revisionRequests &&
        revisionRequests?.length > 0 &&
        revisionRequests?.map((request, i) => (
          <div key={i} className="request-card">
            <div className="request-header">
              <span className="order-id">Order #: {request?.orderId?._id}</span>
              <div>
                <span className={`status-badge ${request?.status?.toLowerCase()}`}>
                  {request?.status}
                </span>
                <span className="status-badge"
                  style={{
                    background: "#0f201f",
                    color: "#5eead4",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "9999px",
                    marginLeft: "10px",
                    fontSize: "0.75rem"
                  }}
                >
                  {request?.requestedAt
                    ? formatDistanceToNow(new Date(request.requestedAt), { addSuffix: true })
                    : "Invalid Date"}


                </span>
              </div>
            </div>

            <div className="request-grid">
              <div className="request-section">
                <h3 className="section-title">
                  <span style={{ fontSize: "1.6rem" }}>
                    <FaLuggageCart color='#5eead4' />
                  </span>
                  Order Information
                </h3>
                <p className="request-detail" style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  <div>
                    <span className="detail-label">Buyer ID:{" "}</span>
                    <span className="detail-value">
                      {request?.buyerId?._id || request?.buyerId}
                    </span>
                  </div>
                  <div>
                    <span className="detail-label">Request ID:{" "}</span>
                    <span className="detail-value" style={{ color: "#5eead4" }}>
                      {request?._id}
                    </span>
                  </div>
                  <div>
                    <span className="detail-label">Email:{" "}</span>
                    <span className="detail-value">
                      {request?.buyerId?.email}
                    </span>
                  </div>
                </p>
              </div>

              <div className="request-section">
                <h3 className="section-title">
                  <span style={{ fontSize: "1.6rem" }}>
                    <MdEventRepeat color='#5eead4' />
                  </span>
                  Revision Details
                </h3>
                <div className="description-box">
                  {request?.revisionDescription}
                </div>
              </div>

              <div className="request-section">
                <h3 className="section-title">
                  <span style={{ fontSize: "1.4rem" }}>
                    <BsCalendarDate color='#5eead4' />
                  </span>
                  Dates
                </h3>
                <p className="request-detail" style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  <div>
                    <span className="detail-label">Requested:{" "}</span>
                    <span className="detail-value">
                      {new Date(request?.requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {
                    request?.orderId?.OrderItems && (
                      <div>
                        <span className="detail-label">Plan Type:{" "}</span>
                        <span className="detail-value">
                          {request?.orderId?.OrderItems[0]?.selectedPlan?.planType || "N/A"}

                        </span>
                      </div>
                    )
                  }
                 {
                    request?.orderId?.OrderItems && (
                      <div>
                        <span className="detail-label">Total Revision:{" "}</span>
                        <span className="detail-value">
                          {request?.orderId?.OrderItems[0]?.selectedPlan?.revisionCount - usedRevision  || "N/A"} Left

                        </span>
                      </div>
                    )
                  }
                </p>
                {request?.completedAt && (
                  <p className="request-detail">
                    <span className="detail-label">Completed:</span>
                    <span className="detail-value">
                      {new Date(request?.completedAt).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default RevisionRequests;
