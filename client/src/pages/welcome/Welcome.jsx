import { Link, useNavigate } from "react-router-dom";
import { Wallet, PieChart, TrendingUp, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import useVerifyUser from "../../hooks/useVerifyUser";
import "./Welcome.css";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { isLoading, isVerified } = useVerifyUser();
  useEffect(() => {
    if (!isLoading && isVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, isVerified, navigate]);
  if (isLoading) {
    return <p>Loading..</p>;
  }
  return (
    <div className="wp-page">
      <nav className="wp-nav">
        <div className="wp-brand">
          Spend<span>Sense</span>
        </div>
        <div className="wp-nav-links">
          <Link to="/login" className="wp-nav-login">
            Login
          </Link>
          <Link to="/register" className="wp-nav-register">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="wp-hero">
        <div className="wp-badge">
          <Wallet size={22} />
        </div>
        <h1>
          Know exactly where <span>every rupee</span> goes.
        </h1>
        <p>
          SpendSense helps you track income and expenses, organize spending by
          category, and see clear monthly summaries — so managing money feels
          simple, not stressful.
        </p>
        <div className="wp-cta">
          <Link to="/register" className="wp-btn-primary">
            Create Free Account
          </Link>
          <Link to="/login" className="wp-btn-secondary">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="wp-features">
        <div className="wp-feature-card">
          <div className="wp-feature-icon">
            <Wallet size={20} />
          </div>
          <h3>Track Every Transaction</h3>
          <p>
            Log income and expenses in seconds and keep a running balance you
            can trust.
          </p>
        </div>

        <div className="wp-feature-card">
          <div className="wp-feature-icon">
            <PieChart size={20} />
          </div>
          <h3>Organize by Category</h3>
          <p>
            See exactly what you're spending on — groceries, bills,
            subscriptions, and more.
          </p>
        </div>

        <div className="wp-feature-card">
          <div className="wp-feature-icon">
            <TrendingUp size={20} />
          </div>
          <h3>Monthly Summaries</h3>
          <p>
            Spot trends over time with clear month-by-month income and expense
            breakdowns.
          </p>
        </div>

        <div className="wp-feature-card">
          <div className="wp-feature-icon">
            <ShieldCheck size={20} />
          </div>
          <h3>Private & Secure</h3>
          <p>
            Your financial data is yours — protected behind a secure account,
            always.
          </p>
        </div>
      </section>

      <footer className="wp-footer">
        <p>© {new Date().getFullYear()} SpendSense. All rights reserved.</p>
      </footer>
    </div>
  );
}
