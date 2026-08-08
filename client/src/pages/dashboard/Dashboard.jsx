import api from "../../api/axios";
import { useEffect, useState } from "react";
import monthFinder from "../../utils/monthFinder";
import Sidebar from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { User, PieChart, TrendingUp } from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useMessage from "../../hooks/useMessage";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

// A color set for the pie chart, kept within the app's existing
// gold/rust/forest/brown palette rather than introducing new hues.
const categoryColors = [
  "#c9a15a",
  "#a6512f",
  "#1f6f4f",
  "#8b5e3c",
  "#7a6f61",
  "#94402a",
  "#5c7d6b",
  "#b98d46",
];

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState([]);
  // Was `useState(false)` — with false, the page rendered one frame of
  // "₹0 balance" / empty charts before the fetch effect even started,
  // since the effect only runs after the first paint.
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [years, setYears] = useState([]);
  const { error, showError } = useMessage();

  // Drives which sidebar panel (Category / Trend) is shown.
  const [activeView, setActiveView] = useState("category");

  useEffect(() => {
    const getBalance = async () => {
      try {
        const response = await api.get("/dashboard/balance");
        setBalance(response.data.balance);
      } catch (error) {
        showError(
          error.response?.data?.message || "Network failure. Please try again.",
        );
      }
    };

    const getIncome = async () => {
      try {
        const response = await api.get("/dashboard/income");
        setIncome(response.data.income);
      } catch (error) {
        showError(
          error.response?.data?.message || "Network failure. Please try again.",
        );
      }
    };

    const getExpense = async () => {
      try {
        const response = await api.get("/dashboard/expense");
        setExpense(response.data.expense);
      } catch (error) {
        showError(
          error.response?.data?.message || "Network failure. Please try again.",
        );
      }
    };

    const getCategories = async () => {
      try {
        const response = await api.get("/dashboard/category-expense");
        setCategories(response.data.categories);
      } catch (error) {
        showError(
          error.response?.data?.message || "Network failure. Please try again.",
        );
      }
    };

    const getSumary = async () => {
      try {
        const response = await api.get("/dashboard/monthly-summary");
        setSummary(response.data.summary);
      } catch (error) {
        showError(
          error.response?.data?.message || "Network failure. Please try again.",
        );
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getBalance(),
          getIncome(),
          getExpense(),
          getCategories(),
          getSumary(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [showError]);

  const navigate = useNavigate();
  const navigateTransactions = (value) => {
    navigate(`/transactions?activeView=${value}`);
  };

  useEffect(() => {
    const getTotalExpenses = () => {
      // Was `sum + category.expense`. If the API serializes `expense` as a
      // string (common with SQL decimal columns over JSON), `+` silently
      // does string concatenation instead of addition the moment one
      // operand is a string, producing garbled totals like "0120.5040.00"
      // instead of 160.50. Number(...) guarantees real addition.
      const total = categories.reduce(
        (sum, category) => sum + Number(category.expense),
        0,
      );
      setTotalExpenses(total);
    };

    getTotalExpenses();
  }, [categories]);

  useEffect(() => {
    const getYears = () => {
      const uniqueYears = [
        ...new Set(summary.map((item) => item.date.split("-")[0])),
      ];
      return uniqueYears.sort((a, b) => b.localeCompare(a));
    };

    const getChartData = (year) => {
      const yearRows = summary.filter(
        (item) => item.date.split("-")[0] === year,
      );

      const data = {
        labels: yearRows.map((item) =>
          monthFinder(Number(item.date.split("-")[1])),
        ),
        datasets: [
          {
            label: "Income",
            data: yearRows.map((item) => item.income),
            borderColor: "green",
            backgroundColor: "green",
            pointRadius: 6,
            pointHoverRadius: 8,
          },
          {
            label: "Expense",
            data: yearRows.map((item) => item.expense),
            borderColor: "red",
            backgroundColor: "red",
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      };
      setChartData(data);
    };

    const uniqueYears = getYears();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYears(uniqueYears);

    // Was hardcoded to `filterYear` (which defaults to today's real-world
    // year). If your data doesn't include the current year, the chart
    // rendered empty by default even though older data existed. Now it
    // falls back to the most recent year that actually has data.
    const yearToShow = uniqueYears.includes(filterYear)
      ? filterYear
      : uniqueYears[0];

    if (yearToShow && yearToShow !== filterYear) {
      setFilterYear(yearToShow);
    } else {
      getChartData(filterYear);
    }
  }, [summary, filterYear]);

  // Derived from your existing `categories` state — not stored, just
  // recomputed on render like a normal variable.
  const pieData = {
    labels: categories.map((category) => category.name),
    datasets: [
      {
        data: categories.map((category) => category.expense),
        backgroundColor: categories.map(
          (_, index) => categoryColors[index % categoryColors.length],
        ),
        borderColor: "#fffefb",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw}`,
        },
      },
    },
  };

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard">
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Was `{!loading && !error && (...)}` — a single failed request
          (e.g. just the balance call) hid the entire dashboard, including
          data from the other four calls that loaded fine. Error now shows
          as a banner alongside whatever content did load. */}
      {!loading && (
        <>
          {error && <p className="error">{error}</p>}

          <header className="dp-header">
            <h1 className="dp-brand">
              Spend<span>Sense</span>
            </h1>
            <Link to="/profile" className="profile-btn">
              <User size={16} /> Profile
            </Link>
          </header>

          <div className="dp-layout">
            <Sidebar
              activeView={activeView}
              setActiveView={setActiveView}
              page="dashboard"
            />

            <main className="dp-main">
              <div className="balance-card">
                Current Balance
                <h2>₹ {balance}</h2>
              </div>

              <div className="summary-cards">
                <div
                  className="income-card"
                  onClick={() => {
                    navigateTransactions("income");
                  }}
                >
                  <h3>Income</h3>
                  <h2>₹ {income}</h2>
                </div>

                <div
                  className="expense-card"
                  onClick={() => {
                    navigateTransactions("expense");
                  }}
                >
                  <h3>Expense</h3>
                  <h2>₹ {expense}</h2>
                </div>
              </div>

              {activeView === "category" && (
                <div className="category-card">
                  <h2>Expenses by Category</h2>

                  {categories.length === 0 ? (
                    <div className="cat-empty">
                      <div className="cat-empty-icon">
                        <PieChart size={22} />
                      </div>
                      <p className="cat-empty-title">No expenses yet</p>
                      <p className="cat-empty-copy">
                        Add a transaction and your spending breakdown will show
                        up here.
                      </p>
                      <Link to="/transactions" className="cat-empty-btn">
                        Add a transaction
                      </Link>
                    </div>
                  ) : (
                    <div className="cat-content">
                      <div className="cat-chart-wrap">
                        <Pie data={pieData} options={pieOptions} />
                        <div className="cat-chart-total">
                          <span>Total</span>
                          <strong>₹{totalExpenses}</strong>
                        </div>
                      </div>

                      <div className="cat-legend">
                        {categories.map((category, index) => {
                          const percentage =
                            totalExpenses > 0
                              ? (category.expense / totalExpenses) * 100
                              : 0;
                          return (
                            <div
                              key={category.category_id}
                              className="cat-legend-row"
                            >
                              <span
                                className="cat-dot"
                                style={{
                                  background:
                                    categoryColors[
                                      index % categoryColors.length
                                    ],
                                }}
                              ></span>
                              <div className="cat-legend-text">
                                <p className="cat-name">{category.name}</p>
                                <p className="cat-percentage">
                                  {percentage.toFixed(1)}%
                                </p>
                              </div>
                              <p className="cat-amount">₹{category.expense}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeView === "trend" && (
                <div className="month-card">
                  {summary.length === 0 ? (
                    <div className="cat-empty">
                      <div className="cat-empty-icon">
                        <TrendingUp size={22} />
                      </div>
                      <p className="cat-empty-title">No trend data yet</p>
                      <p className="cat-empty-copy">
                        Once you've logged income and expenses across a couple
                        of months, your trend will show up here.
                      </p>
                      <Link to="/transactions" className="cat-empty-btn">
                        Add a transaction
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="month-header">
                        <h2>Monthly Trend</h2>

                        <select
                          value={filterYear}
                          onChange={(event) => {
                            setFilterYear(event.target.value);
                          }}
                        >
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="chart-container">
                        <Line data={chartData} options={chartOptions} />
                      </div>
                    </>
                  )}
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
