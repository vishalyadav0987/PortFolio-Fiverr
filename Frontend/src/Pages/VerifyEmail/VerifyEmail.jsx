'use client'

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../Context/AuthContext';
import Spinner from '../../Components/Spinner/Spinner';

export default function VerifyEmail() {
  const navigate = useNavigate();
    const { loading, setLoading, setAuthUser, setIsAuthenticate } = useAuthContext();
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (index, value, event) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pasteCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasteCode[i] || "";
      }
      setCode(newCode);
      document.getElementById(`otp-${pasteCode.length - 1}`)?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      } else if (!value && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };


  const handleSubmit = async(e) => {
    e.preventDefault();
    e.preventDefault();
    setLoading(true);
    const verificationCode = code.join("");
    try {
        const response = await axios.post(
            'https://portfolio-fiverr.onrender.com/api/v1/user/verify-email',
            { code: verificationCode },
            { headers: { "Content-Type": "application/json" } }
        );
        if (response.data.success) {
            setIsAuthenticate(true);
            toast.success(response.data.message);
            setAuthUser(response.data.user);
            navigate('/')
        } else {
            setIsAuthenticate(false);
            toast.error(response.data.message);
        }
    } catch (error) {
        setIsAuthenticate(false);
        console.log("Error in VerifyEmailHandle->", error)
        toast.error(error.message);
        setAuthUser(null);
    }
    finally {
        setLoading(false)
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Verify your Email</h1>
        </div>
        <div style={styles.textGroup}>
          <p style={styles.subtitle}>We have sent code to your email</p>
          <p style={styles.subtitle}>Enter the 6-digit code sent to your email address.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.pinInputContainer}>
            <div style={styles.pinInputGroup}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value, e)}
                  style={styles.pinInput}
                  placeholder="#"
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !code[index] && index > 0) {
                      document.getElementById(`otp-${index - 1}`)?.focus();
                    }
                  }}
                />

              ))}
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={styles.verifyButton}
            >
              {
                loading ? (
                  <Spinner/>
                ):"Verify"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  formContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '500px',
    margin: '10',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2xl',
    lineHeight: 1.1,
    color: '#ffffff',
    marginBottom: '1rem',
  },
  textGroup: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: 'sm',
    color: '#a0a0a0',
    margin: '0.5rem 0',
  },
  pinInputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  pinInputGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  pinInput: {
    width: '2.5rem',
    height: '2.5rem',
    textAlign: 'center',
    fontSize: '1.125rem',
    borderRadius: '0.375rem',
    border: '1px solid #333333',
    backgroundColor: '#000000',
    color: '#ffffff',
    outline: 'none',
    placeholder: '#333333',
    ':focus': {
      borderColor: '#0d9488',
      boxShadow: '0 0 0 1px #0d9488',
    },
  },
  buttonContainer: {
    marginTop: '1rem',
  },
  verifyButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#0d9488',
    color: '#ffffff',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    ':hover': {
      backgroundColor: '#0b857a',
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    
  },
};