import { createContext, useContext, useState } from 'react'

export const OrderContext = createContext(null);

export const useOrderContext = () => {
    return useContext(OrderContext);
}

export const OrderContextProvider = ({ children }) => {
    const [allOrder, setAllOrder] = useState([]);
    const [singleOrder, setSingleOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allReviews, setAllReviews] = useState([]);
    const [totalRevisionRequest,setTotalRevisionRequest] = useState(0);
    const [totalRevisionRequestPending,setTotalRevisionRequestPending] = useState(0);
    const [totalEarnPayment,setTotalEarnPayment] = useState(0);
    const [totalPaymentPaid,setTotalPaymentPaid] = useState(0);
    const [totalPaymentPartiallyPaid,setTotalPaymentPartiallyPaid] = useState(0);

    

    return <OrderContext.Provider value={
        {
            allOrder, // ✅
            setAllOrder, // ✅
            singleOrder, // ✅
            setSingleOrder, // ✅
            loading, // ✅
            setLoading, // ✅
            allReviews, // ✅
            setAllReviews, // ✅
            totalRevisionRequest,
            setTotalRevisionRequest,
            totalRevisionRequestPending,
            setTotalRevisionRequestPending,
            totalEarnPayment,
            setTotalEarnPayment,
            totalPaymentPaid,
            setTotalPaymentPaid,
            totalPaymentPartiallyPaid,
            setTotalPaymentPartiallyPaid,
        }
    }
    >
        {children}
    </OrderContext.Provider>
}