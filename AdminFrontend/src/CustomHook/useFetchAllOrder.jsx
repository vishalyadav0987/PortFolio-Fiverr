import { useEffect } from 'react';
import { useOrderContext } from '../Context/OrderContext';
import axios from 'axios';

const useFetchAllOrder = () => {
    const {
        setAllOrder,
        setLoading,
        setTotalRevisionRequest,
        setTotalRevisionRequestPending,
        setTotalEarnPayment,
        setTotalPaymentPaid,
        setTotalPaymentPartiallyPaid,
    } = useOrderContext();

    const getAllOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://portfolio-fiverr.onrender.com/api/v1/gig/admin-orders',{
                withCredentials: true, // If you need to send cookies or authentication headers
            });
            
            if (response.data.success) {
                const orders = response.data.orders;
                setAllOrder(orders);

                // Calculate totals
                let totalRevisionRequest = 0;
                let totalRevisionRequestPending = 0;
                let totalEarnPayment = 0;
                let totalPaymentPaid = 0;
                let totalPaymentPartiallyPaid = 0;

                orders.forEach((order) => {

                    totalRevisionRequest += order.revisionRequests.length;


                    totalRevisionRequestPending += order.revisionRequests.filter(
                        (rev) => rev.status === 'Pending'
                    ).length;


                    totalEarnPayment += Number(order.paymentInfo.paidAmount);


                    if (order.paymentInfo.paymentStatus === 'Paid') {
                        totalPaymentPaid += 1;
                    }


                    if (order.paymentInfo.paymentStatus === 'Partially Paid') {
                        totalPaymentPartiallyPaid += 1;
                    }
                });

                setTotalRevisionRequest(totalRevisionRequest);
                setTotalRevisionRequestPending(totalRevisionRequestPending);
                setTotalEarnPayment(totalEarnPayment);
                setTotalPaymentPaid(totalPaymentPaid);
                setTotalPaymentPartiallyPaid(totalPaymentPartiallyPaid);
            }
        } catch (error) {
            console.log('Error in fetching all orders in useFetchAllOrder', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);

   
};

export default useFetchAllOrder;