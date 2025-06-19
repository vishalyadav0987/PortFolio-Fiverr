import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import './ForgotPassword.css'
import { useState } from "react";
import axiosInstance from '../../axiosConfig';
import toast from 'react-hot-toast'
import ResetPassword from "../ResetPassword/ResetPassword";
import Spinner from "../../Components/Spinner/Spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false)
  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        '/user/forget-password',
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        toast.success("Reset Password link send to your email!");
        setIsSubmit(true);
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
    <>
      {isSubmit && <ResetPassword email={email} />}
      {
        !isSubmit && (
          <div className="Forget-container">
            <div className="Forget-card">
              <button className="Forget-backButton">
                <FaArrowLeft className="Forget-backIcon" />
              </button>
              <h2 className="Forget-title">Forgot Password</h2>
              <p className="Forget-instructions">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form className="Forget-form" onSubmit={handleForgetPassword}>
                <div className="Forget-inputGroup">
                  <FaEnvelope className="Forget-inputIcon" />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="Forget-input"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <button type="submit" className="Forget-button" 
                style={{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center"
                }}
                disabled={loading}>
                  {
                    loading ? <Spinner/> : "Send Reset Link"
                  }
                </button>
              </form>
            </div>
          </div>
        )
      }
    </>
  );
};

export default ForgotPassword;