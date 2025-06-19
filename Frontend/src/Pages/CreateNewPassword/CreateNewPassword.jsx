import { FaLock, FaCheck, FaEye, FaEyeSlash,FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import './CreateNewPassword.css'
import {useParams,useNavigate} from 'react-router-dom'
import axiosInstance from '../../axiosConfig';
import toast from 'react-hot-toast'
import Spinner from "../../Components/Spinner/Spinner";

const CreateNewPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  console.log(token);
  
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/user/reset-password/${token}`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error in handleForgetPassword ->", error)
      toast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="Reset-container">
      <div className="Reset-card">
        <button className="Reset-backButton">
          <FaArrowLeft className="Reset-backIcon" />
        </button>
        
        <h2 className="Reset-title">Create New Password</h2>
        
        <p className="Reset-message">
          Your new password must be different from previous used passwords.
        </p>
        
        <form className="Reset-form" onSubmit={handleResetPassword}>
          <div className="Reset-inputGroup">
            <FaLock className="Reset-inputIcon" />
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="Reset-input"
              required
              onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button 
              type="button" 
              className="Reset-passwordToggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <div className="Reset-inputGroup">
            <FaCheck className="Reset-inputIcon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="Reset-input"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <button 
              type="button" 
              className="Reset-passwordToggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <div className="Reset-passwordRules">
            <p className="Reset-ruleItem"><span className="Reset-ruleIcon">•</span> Minimum 8 characters</p>
            <p className="Reset-ruleItem"><span className="Reset-ruleIcon">•</span> At least one number</p>
            <p className="Reset-ruleItem"><span className="Reset-ruleIcon">•</span> At least one special character</p>
          </div>
          
          <button type="submit" className="Reset-button primary"disabled={loading}>
                  {
                    loading ? <Spinner/> : "Reset Password"
                  }
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPassword;