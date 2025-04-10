import { createContext, useContext, useState } from 'react';
export const OrderContext = createContext([]);


export const useOrderContext = () => {
    return useContext(OrderContext);
}

export const OrderContextProvider = ({ children }) => {
    const [allOrders, setAllOrders] = useState([]);
    const [singleOrder, setSingleOrder] = useState({});
    const [loading, setLoading] = useState(true);
    return <OrderContext.Provider value={{
        allOrders,
        setAllOrders,
        loading,
        setLoading,
        singleOrder,
        setSingleOrder
    }}>{children}</OrderContext.Provider>
}