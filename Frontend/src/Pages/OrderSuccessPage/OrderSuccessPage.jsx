import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheckCircle,
  FaDownload,
  FaHome,
  FaCalendarCheck,
  FaReceipt
} from 'react-icons/fa';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { GiDeliveryDrone } from 'react-icons/gi';
import './OrderSuccessPage.css';
import {useOrderContext} from '../../Context/OrderContext'
import useFetchOrderById from '../../CustomHook/useGetOrderById'

const OrderSuccessPage = () => {
  // const id = localStorage.getItem("gigId")
  // const { loading, singleOrder } = useOrderContext()
  // useFetchOrderById(id);
  const orderDetails = {
    orderId: "#ORD-789456",
    deliveryDate: "March 30, 2024",
    paymentId: "PAY-123456789",
    totalAmount: "₹9,440.98",
    items: [
      { name: "Functional Website", price: "₹7,323.56" },
      { name: "Service Fee", price: "₹677.43" },
      { name: "GST (18%)", price: "₹1,439.99" }
    ]
  };

  // Trigger confetti on mount
  useEffect(() => {
    if (window.confetti) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="success-container">
      <div className="success-card">
        {/* Success Header */}
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h1 className="glow-text text-4xl font-bold mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-400 text-lg">
            Your order has been confirmed. Details have been sent to your email.
          </p>
        </div>

        {/* Order Details */}
        <div className="detail-card">
          <div className="grid-container">
            <div className="detail-item">
              <FaCalendarCheck className="detail-icon" />
              <div>
                <p className="detail-label">Order ID</p>
                <p className="detail-value">{orderDetails.orderId}</p>
              </div>
            </div>

            <div className="detail-item">
              <GiDeliveryDrone className="detail-icon" />
              <div>
                <p className="detail-label">Delivery Date</p>
                <p className="detail-value">{orderDetails.deliveryDate}</p>
              </div>
            </div>

            <div className="detail-item">
              <RiSecurePaymentFill className="detail-icon" />
              <div>
                <p className="detail-label">Payment ID</p>
                <p className="detail-value">{orderDetails.paymentId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="detail-card">
          <h2 className="section-title">Order Summary</h2>
          <div className="summary-items">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.name}</span>
                <span>{item.price}</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="total-container">
            <span className="total-label">Total Paid</span>
            <span className="total-amount">{orderDetails.totalAmount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-btns">
          <Link
            to="/orders"
            className="action-btn view-order-btn"
          >
            <FaReceipt className="mr-2" />
            Manage Orders
          </Link>

          <Link
            to="/"
            className="action-btn home-btn"
          >
            <FaHome className="mr-2" />
            Return Home
          </Link>
        </div>

        {/* Support Section */}
        <div className="support-section">
          <p className="support-text">
            Need assistance? Contact our{' '}
            <span className="support-link">24/7 support team</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;