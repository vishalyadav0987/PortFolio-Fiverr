import React, { useEffect } from 'react';
import { format } from 'date-fns';
import './ProfilePage.css'
import { useAuthContext } from '../../Context/AuthContext';
import { useOrderContext } from '../../Context/OrderContext';
import useFetchOrder from '../../CustomHook/useFetchOrder'

const ProfilePage = () => {
  const { authUser } = useAuthContext();
  const { allOrders } = useOrderContext();
  useFetchOrder();

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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="Profile-Page__container">
      <div className="Profile-Page__header">
        <div className="Profile-Page__avatar-container">
          <img
            src={authUser.avatar?.url || '/default-avatar.png'}
            alt={authUser.name}
            className="Profile-Page__avatar"
          />
          <span className={`Profile-Page__verification ${authUser.isVerified ? 'verified' : ''}`}>
            {authUser.isVerified ? '✓' : '!'}
          </span>
        </div>
        <h1 className="Profile-Page__name">{authUser.name}</h1>
        <p className="Profile-Page__email">{authUser.email}</p>
      </div>

      <div className="Profile-Page__stats-grid">
        <div className="Profile-Page__stat-card">
          <div className="stat-icon">🕒</div>
          <div className="stat-info">
            <h3>Last Login</h3>
            <p>{format(new Date(authUser.lastLogin), 'dd MMM yyyy HH:mm')}</p>
          </div>
        </div>

        <div className="Profile-Page__stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p>{authUser.orders?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="Profile-Page__details-section">
        <h2 className="Profile-Page__section-title">Account Details</h2>
        <div className="Profile-Page__detail-item">
          <span>Member Since</span>
          <span>{format(new Date(authUser.createdAt), 'MMM yyyy')}</span>
        </div>
        <div className="Profile-Page__detail-item">
          <span>Account Status</span>
          <span className={`status ${authUser.isVerified ? 'verified' : 'pending'}`}>
            {authUser.isVerified ? 'Verified' : 'Pending Verification'}
          </span>
        </div>
      </div>

      <div className="Profile-Page__orders-section">
        <h2 className="Profile-Page__section-title">Recent Orders</h2>
        <div className="Profile-Page__orders-list">
          {allOrders?.slice(0, 3).map((order) => (
            <div key={order._id} className="Profile-Page__order-card">
              <div className="order-info">
                <h4>Project: {order?.OrderItems[0]?.title}</h4>
                <p
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:"0.5rem",
                 
                }}
                >Status: <span className={`status ${order?.orderStatus}`}
                  style={{
                    backgroundColor: `${statusColors[order?.orderStatus]}`,
                     fontSize:"12px"
                  }}
                >
                  {order?.orderStatus}</span>
                  <span className="status-badge" 
                  style={{ backgroundColor: `${PaymentstatusColors[order?.paymentInfo?.paymentStatus]}`,
                    fontSize:"12px" 

                  }}>
                        {order?.paymentInfo?.paymentStatus}
                    </span>
                  </p>
              </div>
              <div className="order-date">
                {format(new Date(order?.createdAt), 'dd MMM yyyy')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;