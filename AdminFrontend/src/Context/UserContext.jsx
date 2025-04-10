import axios from 'axios';
import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
  const [allRegisteredUser, setAllRegisteredUser] = useState(null);
  const [loading, setLoading] = useState(false);
  

  

  return (
    <UserContext.Provider value={{
        allRegisteredUser,
        setAllRegisteredUser,
        loading,
        setLoading,
    }}>
      {children}
    </UserContext.Provider>
  );
};
