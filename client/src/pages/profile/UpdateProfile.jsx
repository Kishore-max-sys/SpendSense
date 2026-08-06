import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import useMessage from "../../hooks/useMessage";
import { UserCog, ArrowLeft } from "lucide-react";
import "./UpdateProfile.css";

function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { error, success, showError, showSuccess } = useMessage();
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
  const updateProfile = async () => {
    try {
      setSubmitting(true);
      await api.put("/users", {
        name,
        email,
      });
      showSuccess("Profile Updated Successfully");
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
    <div className="up-page">
      <div className="up-card">
        <div className="up-badge">
          <UserCog size={20} />
        </div>

        <p className="up-eyebrow">Profile</p>
        <h1 className="up-heading">Update Profile</h1>
        <p className="up-subheading">Keep your name and email up to date.</p>

        {loading ? (
          <div className="up-loading">
            <div className="up-spinner"></div>
            <p>Loading your details...</p>
          </div>
        ) : (
          <>
            {error && <p className="up-error">{error}</p>}
            {success && <p className="up-success">{success}</p>}

            <div className="up-form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>

            <div className="up-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </div>

            <button
              onClick={updateProfile}
              disabled={submitting}
              className="up-submit"
            >
              {submitting ? "Updating..." : "Update"}
            </button>
          </>
        )}

        <button
          onClick={() => {
            navigate("/profile");
          }}
          className="up-back-btn"
        >
          <ArrowLeft size={14} /> Back to Profile
        </button>
      </div>
    </div>
  );
}

export default UpdateProfile;
