import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home/Home'
import MyWork from './Pages/MyWork/MyWork'
import './App.css'
import Footer from './Components/Footer/Footer'
import Navbar from './Components/Header/Header'
import MyGigs from './Pages/MyGigs/MyGigs'
import { HelmetProvider } from "react-helmet-async";
import SingleGig from './Pages/SingleGig/SingleGig'
import { Toaster } from 'react-hot-toast'
import PaymentPage from './Pages/PaymentPage/PaymentPage'
import OrderSuccessPage from './Pages/OrderSuccessPage/OrderSuccessPage'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp'
import VerifyEmail from './Pages/VerifyEmail/VerifyEmail'
import { useAuthContext } from './Context/AuthContext'
import Spinner from './Components/Spinner/Spinner'
import axios from 'axios'
import OrderList from './Pages/OrderList/OrderList'
import OrderDetails from './Pages/OrderDetailes/OrderDetails'
import ProfilePage from './Pages/ProfilePage/ProfilePage'
import Security from './Pages/Security/Security'
import ForgotPassword from './Pages/ForgotPage/ForgotPage'
import CreateNewPassword from './Pages/CreateNewPassword/CreateNewPassword'

const ProtectRoute = ({ children }) => {
  const { isAuthenticate, authUser, loading } = useAuthContext();

  if (loading)
    return <Spinner />

  if (isAuthenticate === false || authUser === false) return <Navigate to='/sign-in' />;
  if (authUser.isVerified === false) return <Navigate to='/verify-email' />;

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticate, authUser, loading } = useAuthContext();

  if (loading) return <Spinner />;

  if (isAuthenticate === true && authUser?.isVerified === true) return <Navigate to='/' />;

  return children;
};

const App = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { checkAuthUser ,authUser} = useAuthContext();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isAppChecking, setIsAppChecking] = useState(true); // Step 1: Add local loading state

  useEffect(() => {
    const checkTokenAndAuth = async () => {
      try {
        // Check if token exists
        const { data } = await axios.get('https://portfolio-fiverr.onrender.com/api/v1/user/check-token', {
          withCredentials: true
        });

        console.log(data.hasToken);
        

        if (data.hasToken) {
          await checkAuthUser(); // Validate the user if token exists
        }
      } catch (error) {
        console.log("No token found or validation failed");
      } finally {
        setIsAppChecking(false); // Step 2: Update loading state when checks complete
      }
    };

    checkTokenAndAuth();
  }, []);

  if (isAppChecking) { // Step 3: Show spinner until checks are done
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar
        isDropdownOpen={isDropdownOpen}
        setDropdownOpen={setDropdownOpen}
      />
      <Toaster position="top-right" />
      <HelmetProvider>
        <Routes>
          <Route path='/' element={<Home setDropdownOpen={setDropdownOpen} />} />

          <Route path='/sign-up' element={
            <RedirectAuthenticatedUser>
              <SignUp />
            </RedirectAuthenticatedUser>
          } />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/sign-in' element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          } />
          <Route path='/forgot-password' element={
            <RedirectAuthenticatedUser>
              <ForgotPassword />
            </RedirectAuthenticatedUser>
          } />
          <Route path='/create-password/:token' element={
            <RedirectAuthenticatedUser>
              <CreateNewPassword />
            </RedirectAuthenticatedUser>
          } />
          <Route path='/orders' element={
            <ProtectRoute>
              <OrderList setDropdownOpen={setDropdownOpen} />
            </ProtectRoute>
          } />
          <Route path='/orders/:orderId' element={
            <ProtectRoute>
              <OrderDetails setDropdownOpen={setDropdownOpen} />
            </ProtectRoute>
          } />
          <Route path='/profile' element={
            <ProtectRoute>
              <ProfilePage />
            </ProtectRoute>
          } />
          <Route path='/my-work' element={<MyWork setDropdownOpen={setDropdownOpen} />} />
          <Route path='/my-gig' element={<MyGigs
            setDropdownOpen={setDropdownOpen}
            showReviewModal={showReviewModal}
            setShowReviewModal={setShowReviewModal}
          />} />
          <Route path='/my-gig/:gigId' element={<SingleGig
            setDropdownOpen={setDropdownOpen} />}
            showReviewModal={showReviewModal}
            setShowReviewModal={setShowReviewModal}
          />
          <Route path='/process-payment' element={
            <ProtectRoute>
              <PaymentPage />
            </ProtectRoute>
          } />
          <Route path='/order-success' element={
            <ProtectRoute>
              <OrderSuccessPage />
            </ProtectRoute>
          } />

          <Route path='/security' element={<Security />} />
          {/* {
            authUser?.isVerified === true && authUser?.isAdmin === true && (
              <Route path='/chat' element={<ChatUI />} />
              )
          } */}
          {/* Catch all routes */}
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </HelmetProvider>
      <Footer />
    </>
  )
}

export default App;