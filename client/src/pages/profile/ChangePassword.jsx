import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import useMessage from "../../hooks/useMessage";
import { KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react";
import "./ChangePassword.css";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { error, success, showError, showSuccess } = useMessage();
  const navigate = useNavigate();
  const changePassword = async () => {
    try {
      setSubmitting(true);
      await api.put("/users/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      showSuccess("Password Changed Successfully");
      setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 1000);
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="cp-page">
      <div className="cp-card">
        <div className="cp-badge">
          <KeyRound size={20} />
        </div>

        <p className="cp-eyebrow">Security</p>
        <h1 className="cp-heading">Change Password</h1>
        <p className="cp-subheading">
          Choose a strong new password to keep your account secure.
        </p>

        {error && <p className="cp-error">{error}</p>}
        {success && <p className="cp-success">{success}</p>}

        <div className="cp-form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <div className="cp-input-wrap">
            <input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value);
              }}
            />
            <button
              type="button"
              className="cp-eye-toggle"
              onClick={() => setShowCurrent((v) => !v)}
            >
              {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="cp-form-group">
          <label htmlFor="newPassword">New Password</label>
          <div className="cp-input-wrap">
            <input
              id="newPassword"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
            />
            <button
              type="button"
              className="cp-eye-toggle"
              onClick={() => setShowNew((v) => !v)}
            >
              {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="cp-form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <div className="cp-input-wrap">
            <input
              id="confirmNewPassword"
              type={showConfirm ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(event) => {
                setConfirmNewPassword(event.target.value);
              }}
            />
            <button
              type="button"
              className="cp-eye-toggle"
              onClick={() => setShowConfirm((v) => !v)}
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button
          onClick={changePassword}
          disabled={submitting}
          className="cp-submit"
        >
          {submitting ? "Changing..." : "Change Password"}
        </button>

        <button
          onClick={() => {
            navigate("/profile");
          }}
          className="cp-back-btn"
        >
          <ArrowLeft size={14} /> Back to Profile
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
