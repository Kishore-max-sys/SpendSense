import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Wallet } from "lucide-react";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useMessage from "../../hooks/useMessage";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, showError } = useMessage();

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      showError("");
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      if (response.data.success === true) {
        login(response.data.token);
        navigate("/dashboard", { replace: true });
      } else {
        showError("Invalid email or password");
      }
    } catch (error) {
      showError(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="lp-page">
      <div className="lp-card">
        <div className="lp-badge">
          <Wallet size={20} />
        </div>
        <div className="lp-brand">
          Spend<span>Sense</span>
        </div>
        <p className="lp-subheading">Welcome back — log in to keep tracking.</p>

        <form onSubmit={handleLogin} className="lp-form">
          {error && <p className="lp-error">{error}</p>}

          <label>Email</label>
          <input
            type="email"
            className="email-input"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />

          <label>Password</label>
          <div className="lp-input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              className="password-input"
              placeholder="••••••••"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <button
              type="button"
              className="lp-eye-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <Link to="/forgot-password" className="lp-forgot">
            forgot password?
          </Link>

          <button type="submit" className="lp-submit">
            Login
          </button>
        </form>

        <p className="lp-footer">
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
