import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaGithub, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import './Auth.css';
import PasswordStrengthMeter from '../../PasswordSrengthMeter/PasswordStrengthMeter';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../Context/AuthContext'
import toast from 'react-hot-toast';
import Spinner from '../../Components/Spinner/Spinner';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const { setAuthUser, loading, setLoading, setIsAuthenticate } = useAuthContext()

  const [avatar, setAvatar] = useState(null);
  const [profileImage, setProfileImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const { name, email, password } = formData;
      const dataToSend = { name, email, password, avatar: profileImage };

      const { data } = await axios.post("https://portfolio-fiverr.onrender.com/api/v1/user/sign-up", dataToSend, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // ✅ Ensures cookies are properly set
      });

      if (data.success) {
        setIsAuthenticate(true);
        setAuthUser(data.user);
        toast.success(data.message);
        navigate("/verify-email");
      }
    } catch (error) {
      console.error("Error in registerHandle --->", error);

      setIsAuthenticate(false);
      setAuthUser(null);

      // ✅ Handle "User Already Exists" error
      const errorMessage = error.response?.data?.message || "Something went wrong, please try again.";
      if (errorMessage === "User Already Exists.") {
        toast.error("This email is already registered. Try logging in.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container" style={{
      marginTop: "36px",
      position: "relative"
    }}>
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleSubmit} className="auth-form" style={{
          gap: "30px"
        }}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

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

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="auth-button" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {
              loading ? (
                <Spinner />
              ) : ("Create Account")
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
          Already have an account? <Link to="/sign-in">Login</Link>
        </p>
      </div>
      <PasswordStrengthMeter
        password={formData.password}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        setAvatar={setAvatar}
      />
    </div>
  );
};

export default SignUp;