import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import api from "../../api/axios";
import useMessage from "../../hooks/useMessage";
import "./ResetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { error, showError } = useMessage();
  const inputPasswordContainer = useRef(null);
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const confirmInputPasswordContainer = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state;
  const handleSubmit = async () => {
    try {
      await api.post("/auth/reset-password", {
        email,
        newPassword,
        confirmNewPassword,
      });
      setNewPassword("");
      setConfirmNewPassword("");
      alert("Password changed successfully.");
      navigate("/");
    } catch (error) {
      showError(error.response?.data?.message);
    }
  };

  const togglePassword = async () => {
    const inputPasswordEle = inputPasswordContainer.current;
    setPasswordType(inputPasswordEle.type);
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  const toggleConfirmPassword = async () => {
    const confirmInputPasswordEle = confirmInputPasswordContainer.current;
    setConfirmPasswordType(confirmInputPasswordEle.current);
    if (confirmPasswordType === "password") {
      setConfirmPasswordType("text");
    } else {
      setConfirmPasswordType("password");
    }
  };
  return (
    <div className="rst-page">
      <div className="rst-card">
        <div className="rst-badge">
          <KeyRound size={20} />
        </div>
        <div className="rst-brand">
          Spend<span>Sense</span>
        </div>

        <h1 className="rst-heading">Reset Password</h1>
        <p className="rst-subheading">
          Choose a new password to secure your account.
        </p>

        {error && <p className="rst-error">{error}</p>}

        <label htmlFor="newPassword">New Password:</label>
        <div className="rst-input-wrap">
          <input
            id="newPassword"
            type={passwordType}
            value={newPassword}
            ref={inputPasswordContainer}
            onChange={(event) => {
              setNewPassword(event.target.value);
            }}
          />
          <button
            type="button"
            className="rp-eye-toggle"
            onClick={() => {
              togglePassword();
            }}
          >
            {passwordType === "password" ? (
              <Eye size={17} />
            ) : (
              <EyeOff size={17} />
            )}
          </button>
        </div>

        <label htmlFor="confirmNewPassword">Confirm New Password:</label>
        <div className="rst-input-wrap">
          <input
            id="confirmNewPassword"
            type={confirmPasswordType}
            value={confirmNewPassword}
            ref={confirmInputPasswordContainer}
            onChange={(event) => {
              setConfirmNewPassword(event.target.value);
            }}
          />
          <button
            type="button"
            className="rp-eye-toggle"
            onClick={() => {
              toggleConfirmPassword();
            }}
          >
            {confirmPasswordType === "password" ? (
              <Eye size={17} />
            ) : (
              <EyeOff size={17} />
            )}
          </button>
        </div>

        <button onClick={handleSubmit} className="rst-submit">
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
