import axios from 'axios';
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const checkAuthUser = async () => {
    setIsCheckingAuth(true);
    try {
      const { data } = await axios.get('http://localhost:4000/api/v1/user/check-auth-user', {
        withCredentials: true, 
      });

      if (data.success) {
        console.log("User Authenticated:", data);
        setIsAuthenticate(true);
        setAuthUser(data.data);
      } else {
        setAuthUser(null);
        setIsAuthenticate(false);
      }
    } catch (error) {
      console.error("Error in checkAuthUser ->", error.response?.data || error.message);
      setAuthUser(null);
      setIsAuthenticate(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      authUser,
      setAuthUser,
      loading,
      setLoading,
      isAuthenticate,
      setIsAuthenticate,
      isCheckingAuth,
      setIsCheckingAuth,
      checkAuthUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
