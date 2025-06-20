import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';
import './Auth.css';
import { useAuthContext } from '../../Context/AuthContext';
import axiosInstance from '../../axiosConfig';
import toast from 'react-hot-toast';
import Spinner from '../../Components/Spinner/Spinner';

const Login = () => {
  const { setAuthUser, setIsAuthenticate } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loadingLog, setLoadingLog] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoadingLog(true);
    try {
      const response = await axiosInstance.post(
        '/user/sign-in',
        { email: formData.email, password: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        setIsAuthenticate(true);
        toast.success(response.data.message);
        setAuthUser(response.data.data);
      } else {
        setIsAuthenticate(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setIsAuthenticate(false);
      console.log("Error in loginSubmitHandle->", error)
      toast.error(error.message);
      setAuthUser(null);
    }
    finally {
      setLoadingLog(false);
    }
  }


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>

        <form onSubmit={handleLoginSubmit} className="auth-form" style={{
          gap: "20px"
        }}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="auth-options">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="auth-button" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: loadingLog ? 0.7 : 1,
            cursor: loadingLog ? "not-allowed" : "pointer"
          }}
            disabled={loadingLog}
          >
            {
              loadingLog ? (
                <>
                  <Spinner />
                  <span style={{
                  marginLeft:"15px"
                }} className="loading-text">Logging in...</span>
                </>
              ) : (
                "Login"
              )
            }
          </button>
        </form>

        <div className="social-auth">
          <p className="divider"></p>
          <div className="social-buttons">
            <button type="button" className="social-button google" disabled={true}
              style={{
                opacity: "0.6"
              }}>
              <FaGoogle /> Google
            </button>
            <button type="button" className="social-button github" disabled={true}
              style={{
                opacity: "0.6"
              }}>
              <FaGithub /> GitHub
            </button>
          </div>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;