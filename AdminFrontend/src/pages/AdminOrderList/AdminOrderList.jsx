import React, { useState } from "react";
import { FiFilter, FiSearch, FiEye, FiRefreshCw } from "react-icons/fi";
import "./AdminOrderList.css";
import { Link } from 'react-router-dom'
import { useOrderContext } from "../../Context/OrderContext";
import useFetchAllOrder from "../../CustomHook/useFetchAllOrder";
import Spinner from '../../components/Spinner/Spinner'
import { FaIndianRupeeSign } from "react-icons/fa6";

const AdminOrderList = () => {

  const {
    allOrder,
    loading,
    totalRevisionRequest,
    totalRevisionRequestPending,
    totalEarnPayment,
    totalPaymentPaid,
    totalPaymentPartiallyPaid,
  } = useOrderContext();
  useFetchAllOrder();
  // console.log(totalEarnPayment);

  let orders = allOrder;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Calculate statistics
  const totalRevisions = totalRevisionRequest;
  const usedRevisions = totalRevisionRequestPending;
  const paidOrders = totalPaymentPaid;
  const partiallyPaidOrders = totalPaymentPartiallyPaid;

  // Filter orders
  const filteredOrders = orders && orders
    .filter((order) => {
      const matchesSearch =
        order._id.includes(searchQuery) ||
        order.buyerId.toString().includes(searchQuery) ||
        order.OrderItems[0].title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || order.orderStatus === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by latest order

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Fallback for invalid or missing dates
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid dates
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}`; // Format: DD/MM/YYYY
  };

  return (
    <div className="admin-order-list">
      {/* Statistics Header */}
      <div className="dash-stats-header">
        <div className="dash-stat-card">
          <FiRefreshCw className="icon" />
          <h3>Revisions</h3>
          <div>

            <p>
              {usedRevisions} Pending, {totalRevisions} Total Request
            </p>
          </div>
        </div>
        <div className="dash-stat-card">
          <FaIndianRupeeSign className="icon" />
          <h3>Payments</h3>
          <div>

            <p>
              {paidOrders} Paid, {partiallyPaidOrders} Partially Paid
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID, Buyer ID, or Gig Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
          <FiFilter className="filter-icon" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Accepted">Accepted</option>
            <option value="Delivered">Delivered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Due Date</th>
              <th>Plan Type</th>
              <th>Total Price</th>
              <th>Payment Status</th>
              <th>Gig ID</th>
              <th>Order Status</th>
              <th>Revisions Left</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              loading ? (
                <tr>
                  <td colSpan="10">
                    <Spinner />
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order?._id}>
                    <td>#{order?._id.toString().slice(-6)}</td>
                    <td>
                      {formatDate(order?.createdAt)}/{(new Date()).getFullYear()}

                    </td>
                    <td>
                      {formatDate(order?.deliveryDate)}/{(new Date()).getFullYear()}
                    </td>
                    <td
                      style={{
                        textAlign: "center"
                      }}>
                      <span className="plan-badge">{order?.OrderItems[0].selectedPlan.planType}</span>
                    </td>
                    <td
                      style={{
                        textAlign: "center"
                      }}
                    >₹{order.paymentInfo.totalAmount}</td>
                    <td style={{
                      textAlign: "center"
                    }}>
                      <span

                        className={`payment-status ${order?.paymentInfo.paymentStatus.replace(" ", "-")}`}>
                        {order.paymentInfo.paymentStatus}
                      </span>
                    </td>
                    <td

                    >#{order.OrderItems[0].gigId.slice(-6)}</td>
                    <td
                      style={{
                        textAlign: "center"
                      }}
                    >
                      <span className={`order-status ${order?.orderStatus.replace(" ", "-")}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: "center"
                      }}
                    >{order?.maxRevisions - order?.usedRevisions} / {order?.maxRevisions}</td>
                    <td>
                      <Link to={`/manage-order/${order?._id}`}>
                        <button className="view-btn">
                          <FiEye /> View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )
            }

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderList;