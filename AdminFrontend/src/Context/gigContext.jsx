import { createContext, useContext, useState } from 'react';
export const GigContext = createContext([]);


export const useGigContext = () => {
    return useContext(GigContext);
}

export const GigContextProvider = ({ children }) => {
    const [allGigs, setAllGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    return <GigContext.Provider value={{ allGigs, setAllGigs,loading,setLoading }}>{children}</GigContext.Provider>
}