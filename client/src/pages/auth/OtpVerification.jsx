import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { ShieldCheck } from "lucide-react";
import api from "../../api/axios";
import useMessage from "../../hooks/useMessage";
import "./OtpVerification.css";

function OtpVerification() {
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { error, showError } = useMessage();
  const inputRefs = useRef([]);
  const { email } = location.state;
  const navigate = useNavigate();
  const handleChange = (event, index) => {
    const value = event.target.value;
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };
  const handleKeyDown = (event, index) => {
    if (/^\d$/.test(event.key) && otp[index] !== "") {
      event.preventDefault();
      if (index < otp.length - 1) {
        const newOtp = [...otp];
        newOtp[index + 1] = event.key;
        setOtp(newOtp);
        inputRefs.current[index + 1].focus();
      }
      return;
    }
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1].focus();
    } else if (event.key === "Enter" && index < 5) {
      event.preventDefault();
      inputRefs.current[index + 1].focus();
    }
  };
  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(text)) return;
    const newOtp = text.split("");
    setOtp(newOtp);
    inputRefs.current[5].focus();
  };
  const handleSubmit = async () => {
    try {
      const finalOtp = otp.join("");
      if (finalOtp.length !== 6) {
        alert("Enter Complete OTP");
        return;
      }
      await api.post("/auth/otp-verification", {
        email,
        otp: finalOtp,
      });
      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      showError(error.response?.data?.message);
    }
  };
  return (
    <div className="op-page">
      <div className="op-card">
        <div className="op-badge">
          <ShieldCheck size={20} />
        </div>
        <div className="op-brand">
          Spend<span>Sense</span>
        </div>

        <h1 className="op-heading">OTP Verification</h1>
        <p className="op-subheading">
          Enter the 6-digit code we sent to your email.
        </p>

        {error && <p className="op-error">{error}</p>}

        <label htmlFor="email">Email:</label>
        <input id="email" className="op-email" value={email} disabled />

        <div className="op-otp-row">
          {otp.map((digit, index) => {
            return (
              <input
                key={index}
                className="op-otp-box"
                value={digit}
                type="text"
                maxLength={1}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                onChange={(event) => {
                  handleChange(event, index);
                }}
                onKeyDown={(event) => {
                  handleKeyDown(event, index);
                }}
                onPaste={(event) => {
                  handlePaste(event);
                }}
              />
            );
          })}
        </div>

        <button onClick={handleSubmit} className="op-submit">
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default OtpVerification;
