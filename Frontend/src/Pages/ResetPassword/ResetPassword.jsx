import { FaCheckCircle, FaArrowLeft, FaEnvelope } from "react-icons/fa";
import './ResetPassword.css'
import {Link} from 'react-router-dom'

const ResetPassword = ({email}) => {
  return (
    <div className="Reset-container">
      <div className="Reset-card">
        <button className="Reset-backButton">
          <FaArrowLeft className="Reset-backIcon" />
        </button>
        
        <div className="Reset-successIcon">
          <FaCheckCircle />
        </div>
        
        <h2 className="Reset-title">Reset Password</h2>
        
        <p className="Reset-message">
          If an account exists for <span className="Reset-email">{email}</span>, 
          you will receive a password reset link shortly.
        </p>
        
        <div className="Reset-buttonGroup" >
          <Link style={{width:"100%"}} to={'/sign-in'}>
          <button style={{width:"100%"}} className="Reset-button secondary">
            <FaArrowLeft className="Reset-buttonIcon" />
            Back to Login
          </button>
          </Link>
         <Link style={{width:"100%"}} to={'https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox'}>
         <button style={{width:"100%"}} className="Reset-button primary">
            <FaEnvelope className="Reset-buttonIcon" />
            Check Email
          </button>
         </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;