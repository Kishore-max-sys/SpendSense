import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail } from "lucide-react";
import api from "../../api/axios";
import useMessage from "../../hooks/useMessage";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { error, showError } = useMessage();
  const navigate = useNavigate();
  const sendOtp = async () => {
    try {
      await api.post("/auth/forgot-password", {
        email,
      });

      navigate("/otp-verification", {
        state: {
          email,
        },
        replace: true,
      });
    } catch (error) {
      showError(error.response?.data?.message);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <div className="fp-badge">
          <Mail size={20} />
        </div>
        <div className="fp-brand">
          Spend<span>Sense</span>
        </div>

        <h1 className="fp-heading">Forgot Password</h1>
        <p className="fp-subheading">
          Enter the email on your account and we'll send you a one-time code to
          reset it.
        </p>

        {error && <p className="fp-error">{error}</p>}

        <label htmlFor="email">Enter your mail:</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <button onClick={sendOtp} className="fp-submit">
          Send OTP
        </button>

        <Link to="/" className="fp-back">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
