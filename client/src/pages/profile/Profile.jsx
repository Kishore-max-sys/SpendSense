import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useMessage from "../../hooks/useMessage";
import {
  User,
  Pencil,
  KeyRound,
  Trash2,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { error, showError } = useMessage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/users");
        setName(response.data.user.name);
        setEmail(response.data.user.email);
      } catch (error) {
        showError(
          error.response?.data?.message || "Network failure. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [showError]);
  const updateProfile = () => {
    navigate("/profile/update");
  };
  const deleteProfile = async () => {
    try {
      await api.delete("/users");
      logout();
      navigate("/");
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    }
  };
  const changePassword = () => {
    navigate("/profile/change-password");
  };

  const logoutUser = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="pf-page">
      <div className="pf-card">
        <div className="pf-badge">
          <User size={20} />
        </div>

        <p className="pf-eyebrow">Profile</p>

        {loading ? (
          <div className="pf-loading">
            <div className="pf-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        ) : (
          <>
            <div className="pf-hero">
              <div className="pf-avatar">
                {name ? name.charAt(0).toUpperCase() : ""}
              </div>
              <h1 className="pf-hero-name">{name || "\u00A0"}</h1>
              <p className="pf-hero-email">{email}</p>
            </div>

            {error && <p className="pf-error">{error}</p>}

            <div className="pf-details">
              <p className="pf-details-title">Account Details</p>

              <div className="pf-info-row">
                <span className="pf-label">Name</span>
                <p className="pf-value">{name}</p>
              </div>

              <div className="pf-info-row">
                <span className="pf-label">Email</span>
                <p className="pf-value">{email}</p>
              </div>
            </div>

            <div className="pf-actions">
              <button onClick={updateProfile} className="pf-btn pf-btn-primary">
                <Pencil size={15} /> Update Profile
              </button>

              <button
                onClick={changePassword}
                className="pf-btn pf-btn-secondary"
              >
                <KeyRound size={15} /> Change Password
              </button>

              <button
                onClick={() => setConfirmingDelete(true)}
                className="pf-btn pf-btn-danger"
              >
                <Trash2 size={15} /> Delete Account
              </button>
            </div>

            <div className="pf-footer-row">
              <button
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="pf-back-btn"
              >
                <ArrowLeft size={14} /> Back to home
              </button>
              <span className="pf-footer-divider">•</span>
              <button onClick={logoutUser} className="pf-logout-btn">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </>
        )}
      </div>

      {confirmingDelete && (
        <div className="pf-modal-overlay">
          <div className="pf-modal">
            <h2>Delete your account?</h2>
            <p>
              This permanently removes your profile and all associated data.
              This action cannot be undone.
            </p>
            <div className="pf-modal-actions">
              <button
                className="pf-btn pf-btn-danger pf-btn-solid"
                onClick={deleteProfile}
              >
                Yes, delete permanently
              </button>
              <button
                className="pf-btn pf-btn-secondary"
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
