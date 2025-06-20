import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaCreditCard, FaInfoCircle, FaMoneyCheckAlt, FaRegClock, FaTags, FaEdit, FaEnvelope } from 'react-icons/fa';
import './OrderDetails.css';
import { FaRepeat } from "react-icons/fa6";
import { useOrderContext } from '../../Context/OrderContext';
import useFetchOrderById from '../../CustomHook/useGetOrderById';
import Spinner from '../../Components/Spinner/Spinner';
import RevisionRequests from '../../Components/RevisionRequests/RevisionRequests';
import axios from 'axios';
import toast from 'react-hot-toast';



const OrderDetails = ({ setDropdownOpen }) => {
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
  const { orderId: id } = useParams();
  const { loading, singleOrder, authUser } = useOrderContext()
  useFetchOrderById(id);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [loadingRev, setLoadingRev] = useState(false);

  // Fetch order data (replace with actual API call)
  const order = singleOrder && singleOrder;
  // console.log(order);


  const handlePaymentRequest = () => {
    console.log('Payment change request:', requestMessage);
    setShowPaymentModal(false);
    setRequestMessage('');
  };



  /*---------------------------REVISION LOGIC---------------------------*/
  const [revisionRequests, setRevisionRequests] = useState([]);
  const [usedRevisions, setUsedRevisions] = useState(order?.usedRevisions || 0);




  const handleRevisionRequest = async () => {
    setLoadingRev(true);
    try {
      const singleRequest = {
        orderId: id,
        buyerId: authUser?._id,
        revisionDescription: requestMessage,
        requestedAt: new Date(),
      };
      const response = await axios.post('https://portfolio-fiverr.onrender.com/api/v1/gig/order/revision-request', singleRequest, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.message || 'Revision requested successfully.');
        setRevisionRequests(response.data.data);
        // 🆕 Increment Used Revisions Count
        setUsedRevisions(prev => prev + 1);

      }
    } catch (error) {
      console.error('Error requesting revision:', error);
      toast.error(error.response.data.message || 'An error occurred. Please try again.');

    } finally {
      setShowRevisionModal(false);
      setRequestMessage('');
      setLoadingRev(false);
    }

  };
  /*---------------------------REVISION LOGIC---------------------------*/


  /*----------FETCHING REVISION BASED ON ORDER ID-----------------*/
  useEffect(() => {
    const fetchRevisions = async () => {
      try {
        const response = await axios.get(`/api/v1/gig/order/revision/${id}`);
        if (response.data.success) {
          console.log('Revisions:', response.data.data);

          setRevisionRequests(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching revisions:', error);
        toast.error(error.response.data.message || 'An error occurred. Please try again.');
      }
    };
    fetchRevisions();
  }, [id]);
  /*----------FETCHING REVISION BASED ON ORDER ID-----------------*/

  useEffect(() => {
    console.log(requestMessage);

  }, [requestMessage])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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


  return (
    <div className="order-details-container-1" onClick={() => setDropdownOpen(false)}>
      {/* Header Section */}
      <div className="order-header-1">
        <h2>Order Details #{order?._id?.toString().slice(-6).toUpperCase()}</h2>
        <div className="status-container-1">
          <span className="status-badge-1" style={{ backgroundColor: statusColors[order?.orderStatus] }}>
            {order?.orderStatus}
          </span>
          <span className="status-badge" style={{ backgroundColor: PaymentstatusColors[order?.paymentInfo?.paymentStatus] }}>
            {order?.paymentInfo?.paymentStatus}
          </span>
          <button className="message-button-1" onClick={() => setShowRevisionModal(true)}>
            {
              loadingRev ? (<Spinner />) : (
                <>
                  <FaEnvelope /> Request Revision
                </>
              )
            }
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="order-content-1">
        {/* Order Summary Section */}
        <div className="order-section-1">
          <h3><FaTags /> Order Summary</h3>
          <div className="summary-grid-1">
            <div className="summary-item-1">
              <FaCalendarAlt /> Order Date:
              {new Date(order?.createdAt).toLocaleDateString()}
            </div>
            <div className="summary-item-1">
              <FaRegClock /> Estimated Delivery:
              {order.deliveryDate ? new Date(order?.deliveryDate).toLocaleDateString()?.slice(0, 6) + "/" + `${new Date().getFullYear()}` : 'Pending'}
            </div>
            <div className="summary-item-1">
              <FaMoneyCheckAlt /> Total Amount: ₹{order?.paymentInfo?.totalAmount}
            </div>
            <div className="summary-item-1">
              <FaRepeat /> Revisions: {revisionRequests?.length || order?.usedRevisions}/{order?.maxRevisions} Used
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="order-section-1">
          <h3><FaCreditCard /> Payment Details</h3>
          <div className="payment-details-1">
            <div className="payment-status-1">
              Status: <span>{order?.paymentInfo?.paymentStatus}</span>
            </div>
            <div className="payment-breakdown-1">
              <div>Payment Id: <span>***{order?.paymentInfo?.id?.slice(4)}</span></div>
              <div>Payment Type: <span>
                {
                  order?.paymentInfo?.paymentType
                }
              </span></div>
              <div>Paid Amount: <span>₹{order?.paymentInfo?.paidAmount}</span></div>
              <div>Payment Status: <span style={{
                border: "none",

              }}>
                <span className="status-badge" style={{ backgroundColor: PaymentstatusColors[order?.paymentInfo?.paymentStatus], color: "white" }}>
                  {order?.paymentInfo?.paymentStatus}
                </span></span></div>
              <div>Paid Date: <span>
                {
                  new Date(order.paymentInfo?.paidAt).toLocaleDateString('en-GB', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                  })
                }
              </span></div>
              {
                order?.paymentInfo?.paymentType === "Milestone" && order?.paymentInfo?.paymentStatus === "Partially Paid" && (
                  <button className="pay-full-payment-1">
                    Pay Full Amount (₹{order?.paymentInfo?.paidAmount})
                  </button>
                )
              }
              {order?.paymentInfo?.paymentScreenshot?.url && (
                <div className="payment-proof-1">
                  Payment Proof:
                  <img src={order?.paymentInfo?.paymentScreenshot?.url} alt="Payment proof" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="order-section-1">
          <h3>Order Items</h3>
          {order?.OrderItems?.map((item, index) => (
            <div key={index} className="order-item-1">
              <div className="item-header-1">
                <img src={item?.thumbnailImage?.url} alt={item?.title} />
                <div className="item-info-1">
                  <h4>{item.title}</h4>
                  <span className="plan-badge-1">{item?.selectedPlan?.planType} Plan</span>
                </div>
              </div>
              <div className="item-details-1">
                <div className="plan-details-1">
                  <h5>Plan Details</h5>
                  <p>{item?.selectedPlan.shortDescription}</p>
                  <ul>
                    {item?.selectedPlan.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                {item?.extraFeatures?.length > 0 && (
                  <div className="extra-features-1">
                    <h5>Extra Features</h5>
                    <ul>
                      {item?.extraFeatures?.map((extra, i) => (
                        <li key={i}>{extra.name} (₹{extra.price} x {extra.quantity}){" "}:{" "}₹
                          {extra.price * extra.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Revision History */}
        <div className="order-section-1">
          <h3>Revision History</h3>
          {/* {order?.revisionRequests?.map((request, index) => (
            <div key={index} className="revision-item-1">
              <div className="revision-header-1">
                <span>Request #{index + 1}</span>
                <span>{new Date(request.requestedAt).toLocaleDateString()}</span>
              </div>
              <p>{request.message}</p>
              {request.completedAt && (
                <div className="revision-completed-1">
                  Completed: {new Date(request.completedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))} */}

          <RevisionRequests
            revisionRequests={revisionRequests}
            usedRevision={order?.usedRevisions}
          />
        </div>
      </div>

      {/* Modals */}
      {showPaymentModal && (
        <div className="modal-overlay-1">
          <div className="modal-1">
            <h3>Payment Change Request</h3>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Explain your payment change request..."
            />
            <div className="modal-actions-1">
              <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button onClick={handlePaymentRequest}>Submit Request</button>
            </div>
          </div>
        </div>
      )}

      {showRevisionModal && (
        <div className="modal-overlay-1">
          <div className="modal-1">
            <h3>Revision Request ({order?.usedRevisions}/{order?.maxRevisions} Used)</h3>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Describe the changes you need..."
            />
            <div className="modal-actions-1">
              <button onClick={() => setShowRevisionModal(false)}>Cancel</button>
              <button
                onClick={handleRevisionRequest}
                disabled={order?.usedRevisions >= order?.maxRevisions}
              >
                {order?.usedRevisions < order?.maxRevisions
                  ? 'Submit Revision'
                  : 'No Revisions Left'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default OrderDetails;