import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import "./PasswordStrength.css"; // We'll create this CSS file
import { useEffect, useRef } from "react";

const PasswordStrengthCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contain uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contain lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contain a number", met: /\d/.test(password) },
    { label: "Contain special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="criteria-container">
      {criteria.map((item) => (
        <div key={item.label} className="criteria-item">
          {item.met ? (
            <IoMdCheckmark className="check-icon" />
          ) : (
            <RxCross2 className="cross-icon" />
          )}
          <span className={`criteria-text ${item.met ? "met" : ""}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password, profileImage,setProfileImage,setAvatar }) => {
  const fileInputRef = useRef(null);

  const profileHandler = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if (!file) return;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setProfileImage(fileReader.result);
          setAvatar(file);
        }
      }
      fileReader.readAsDataURL(file)
    }
  }

  const getStrength = (passWord) => {
    let strength = 0;
    if (passWord.length >= 8) strength++;
    if (passWord.match(/[a-z]/) && passWord.match(/[A-Z]/)) strength++;
    if (passWord.match(/\d/)) strength++;
    if (passWord.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  const getColor = () => {
    if (strength === 0) return "#E53E3E";
    if (strength === 1) return "#FC8181";
    if (strength === 2) return "#ECC94B";
    if (strength === 3) return "#F6E05E";
    return "#48BB78";
  };

  const getStrengthText = () => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };


  return (
    <div className="password-strength-container">
      <form className="upload-profile" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <img
          style={{ width: 40, height:"40px", borderRadius: "50%" }}
          src={profileImage && profileImage}
          alt="Profile"
        />
        <div
          className="upload"
          onClick={() => {
            fileInputRef.current.click();
          }}
          style={{
            width: "300px",
            height: "36px",
            border: "1px solid #333333",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#718096",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          <input
            type="file"
            name="avatar"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={profileHandler}
          />
          Upload Profile here
        </div>
      </form>
      <div className="strength-header">
        <span className="strength-label">Password strength</span>
        <span
          className="strength-text"
          style={{ color: strength === 0 ? "#718096" : getColor() }}
        >
          {getStrengthText()}
        </span>
      </div>

      <div className="strength-meter">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="strength-segment"
            style={{
              backgroundColor: index < strength ? getColor() : "#4A5568",
              width: `${100 / 4}%`
            }}
          />
        ))}
      </div>

      <PasswordStrengthCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;