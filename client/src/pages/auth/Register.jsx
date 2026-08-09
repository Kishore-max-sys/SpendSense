import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Eye, EyeOff, Wallet } from "lucide-react";
import useMessage from "../../hooks/useMessage";
import "./Register.css";

function Register() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const inputPasswordContainer = useRef(null);
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const { error, showError } = useMessage();
  const confirmInputPasswordContainer = useRef(null);

  const register = async (event) => {
    try {
      event.preventDefault();
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      if (response.data.success === true) {
        login(response.data.token);
        navigate("/dashboard", { replace: true });
      }
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
    <div className="rp-page">
      <div className="rp-card">
        <div className="rp-badge">
          <Wallet size={20} />
        </div>
        <div className="rp-brand">
          Spend<span>Sense</span>
        </div>
        <h1 className="rp-heading">Create your account</h1>
        <p className="rp-subheading">
          Start tracking your expenses in seconds.
        </p>
        <form onSubmit={register} className="rp-form">
          <label htmlFor="name">Enter User Name:</label>
          <div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </div>

          <label htmlFor="email">Enter email:</label>
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>

          <label htmlFor="password">Enter password:</label>
          <div className="rp-input-wrap">
            <input
              id="password"
              type={passwordType}
              ref={inputPasswordContainer}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
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

          <label htmlFor="confirm">Confirm Password:</label>
          <div className="rp-input-wrap">
            <input
              id="confirm"
              type={confirmPasswordType}
              ref={confirmInputPasswordContainer}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
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
          <button type="submit" className="rp-submit">
            Register
          </button>
          {error && <p className="rp-error">{error}</p>}
        </form>
        <div className="rp-rules">
          <h3>Password must contain:</h3>
          <p>At least 8 characters </p>
          <p>At least one uppercase letter (A-Z)</p>
          <p>At least one lowercase letter (a-z)</p>
          <p>At least one digit (0-9)</p>
          <p>At least one special character (@ # $ % & * ! ?, etc.)</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
