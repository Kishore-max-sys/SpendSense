import { PieChart, TrendingUp, Receipt, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ activeView, setActiveView, page }) {
  return (
    <aside className="dp-sidebar">
      <p className="dp-sidebar-label">Insights</p>
      {page === "dashboard" && (
        <>
          <button
            type="button"
            className={
              activeView === "category" ? "dp-nav-btn active" : "dp-nav-btn"
            }
            onClick={() => setActiveView("category")}
          >
            <PieChart size={16} /> Expenses by Category
          </button>

          <button
            type="button"
            className={
              activeView === "trend" ? "dp-nav-btn active" : "dp-nav-btn"
            }
            onClick={() => setActiveView("trend")}
          >
            <TrendingUp size={16} /> Monthly Trend
          </button>
        </>
      )}

      {(page === "categories" || page === "transactions") && (
        <>
          <button
            type="button"
            className={
              activeView === "all" ? "dp-nav-btn active" : "dp-nav-btn"
            }
            onClick={() => setActiveView("all")}
          >
            All
          </button>

          <button
            type="button"
            className={
              activeView === "income" ? "dp-nav-btn active" : "dp-nav-btn"
            }
            onClick={() => setActiveView("income")}
          >
            Income
          </button>

          <button
            type="button"
            className={
              activeView === "expense" ? "dp-nav-btn active" : "dp-nav-btn"
            }
            onClick={() => setActiveView("expense")}
          >
            Expense
          </button>
        </>
      )}
      <p className="dp-sidebar-label dp-sidebar-label-spaced">Manage</p>

      <Link to="/transactions" className="dp-nav-link">
        <Receipt size={16} /> Transactions
      </Link>

      <Link to="/categories" className="dp-nav-link">
        <Tags size={16} /> Categories
      </Link>
    </aside>
  );
}

export default Sidebar;
