import React, { useState } from 'react';
import { FiRefreshCw, FiCheck, FiX, FiClock, FiEdit, FiAlertCircle } from 'react-icons/fi';
import './RevisionsSection.css'
import axios from 'axios';
import toast from 'react-hot-toast';

const RevisionsSection = ({ orderId, revisions, maxRevisions, usedRevisions }) => {
  const [localRevisions, setLocalRevisions] = useState(revisions)
  // const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(null);

  const handleStatusUpdate = async (revisionId, newStatus) => {
    setLocalRevisions(prev =>
      prev.map(rev =>
        rev._id === revisionId
          ? {
            ...rev,
            status: newStatus,
            completedAt: newStatus === "Completed" ? Date.now() : "",
          }
          : rev
      )
    );

    try {
      const response = await axios.patch('/api/v1/gig/admin/update-revision-status', {
        orderId,
        revisionId,
        revisionStatus: newStatus
      });

      if (response.data.success) {
        toast.success(response.data.message)
      }
    } catch (error) {
      console.error('Error in handleStatusUpdate:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="revisions-section section-card">
      <div className="revisions-header">
        <h3><FiRefreshCw className="icon" /> Revisions Management</h3>
        <div className="revisions-progress">
          <div className="progress-text">
            <span className="used">{usedRevisions}</span> /
            <span className="max">{maxRevisions}</span> Revisions Used
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(usedRevisions / maxRevisions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="revision-list">
        {revisions &&
          revisions?.length > 0 &&
          localRevisions?.map((revision, index) => (
            <div key={revision._id} className={`revision-item ${revision.status}`}>
              <div className="revision-meta">
                <span className="revision-number">#{index + 1}</span>
                <span className={`status-badge ${revision.status}`}>
                  {revision.status === 'Completed' && <FiCheck />}
                  {revision.status === 'Rejected' && <FiX />}
                  {revision.status}
                </span>
              </div>

              <div className="revision-details">
                <p className="description">
                  <FiAlertCircle /> {revision.revisionDescription}
                </p>
                <div className="timestamps">
                  <span>
                    <FiClock /> Requested: {new Date(revision?.requestedAt).toLocaleDateString()}
                  </span>
                  {revision.completedAt && (
                    <span>
                      <FiCheck /> Completed: {new Date(revision?.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="revision-controls">
                <select
                  value={revision.status}
                  onChange={(e) => handleStatusUpdate(revision._id, e.target.value)}
                  className="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                  <option value="Completed">Mark Completed</option>
                </select>

                {/* <button 
                className="btn note-btn"
                onClick={() => {
                  setSelectedRevision(revision);
                  setShowRevisionDialog(true);
                }}
              >
                <FiEdit /> Add Note
              </button> */}
              </div>
            </div>
          ))}
      </div>

      {/* Revision Note Dialog */}
      {/* {showRevisionDialog && (
        <div className="revision-dialog">
          <div className="dialog-content">
            <h4>Add Admin Note for Revision #{selectedRevision._id.slice(-4)}</h4>
            <textarea placeholder="Enter private admin notes..."></textarea>
            <div className="dialog-actions">
              <button className="btn cancel" onClick={() => setShowRevisionDialog(false)}>
                Cancel
              </button>
              <button className="btn save">Save Note</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default RevisionsSection