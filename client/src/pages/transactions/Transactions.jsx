import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import useMessage from "../../hooks/useMessage";
import "./Transactions.css";

function Transactions() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [searchTransactions, setSearchTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { error, showError } = useMessage();

  const getCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories);
      if (response.data.categories.length > 0) {
        setCategoryId(response.data.categories[0].id);
      }
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    }
  }, [showError]);

  useEffect(() => {
    const callFunction = async () => {
      await getCategories();
    };
    callFunction();
  }, [getCategories]);

  // Always fetches the full, unfiltered list — used only for the header
  // totals, so they reflect everything you've ever added, not just what
  // the current search filters match.
  const getTransactions = useCallback(async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data.transactions);
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    }
  }, [showError]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getTransactions();
  }, [getTransactions]);

  const URLlocation = useLocation();
  const params = new URLSearchParams(URLlocation.search);

  const initialCategoryId = Number(params.get("categoryId")) || 0;

  const [searchCategoryId, setSearchCategoryId] = useState(initialCategoryId);

  // Simplified from the original 8-branch if/else chain — same query
  // string is produced for every combination, just built in one place
  // instead of one place per combination (which is what let `transactions`
  // and `searchTransactions` drift out of sync before).
  const handleSearch = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchCategoryId !== 0) {
        queryParams.append("categoryId", searchCategoryId);
      }
      if (startDate !== "") {
        queryParams.append("startDate", startDate);
      }
      if (endDate !== "") {
        queryParams.append("endDate", endDate);
      }
      const query = queryParams.toString();
      const response = await api.get(
        `/transactions${query ? `?${query}` : ""}`,
      );
      setSearchTransactions(response.data.transactions);
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    }
  }, [searchCategoryId, startDate, endDate, showError]);

  const filteredTransactions = useMemo(() => {
    return searchTransactions.filter((transaction) =>
      activeView === "all" ? true : transaction.type === activeView,
    );
  }, [searchTransactions, activeView]);

  const totalTransactions = transactions.length;

  const totalAmount = useMemo(() => {
    return transactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0,
    );
  }, [transactions]);

  useEffect(() => {
    const callFun = async () => {
      setLoading(true);
      await handleSearch();
      setLoading(false);
    };
    callFun();
  }, [handleSearch]);

  const addTransaction = async () => {
    try {
      setSubmitting(true);
      await api.post("/transactions", {
        categoryId,
        amount,
        date,
        description,
      });
      setCategoryId(0);
      setAmount(0);
      setDate("");
      setDescription("");
      await handleSearch();
      await getTransactions();
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const isConfirmed = window.confirm(
        "Do you want to delete this transaction?",
      );
      if (isConfirmed) {
        await api.delete(`/transactions/${id}`);
        await handleSearch();
        await getTransactions();
      }
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    }
  };

  const editTransaction = (transaction) => {
    // Was transaction.date, which doesn't exist on the object your table
    // renders (transaction_date) — that mismatch would throw on click.
    const formattedDate = (
      transaction.transaction_date ||
      transaction.date ||
      ""
    ).slice(0, 16);
    setId(transaction.id);
    setCategoryId(transaction.categoryId);
    setAmount(transaction.amount);
    setDate(formattedDate);
    setDescription(transaction.note);
  };

  const cancelEdit = () => {
    setId(0);
    setCategoryId(categories.length > 0 ? categories[0].id : 0);
    setAmount(0);
    setDate("");
    setDescription("");
  };

  const updateTransaction = async () => {
    try {
      setSubmitting(true);
      await api.put(`/transactions/${id}`, {
        categoryId,
        amount,
        description,
        date,
      });
      setId(0);
      setCategoryId(0);
      setAmount(0);
      setDate("");
      setDescription("");
      await handleSearch();
      await getTransactions();
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    showError("");

    if (id) {
      await updateTransaction();
    } else {
      await addTransaction();
    }
  };

  return (
    <>
      <header className="tp-header">
        <h1>Transactions</h1>
      </header>

      <div className="tp-layout">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          page="transactions"
        />
        <main className="transactions-page">
          <div className="tp-stats">
            <div className="tp-stat">
              <span>Transactions</span>
              <strong>{totalTransactions}</strong>
            </div>
            <div className="tp-stat">
              <span>Total</span>
              <strong>₹ {totalAmount}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                }}
              >
                {categories.map((category) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <button className="submit-btn" type="submit" disabled={submitting}>
              {id
                ? submitting
                  ? "Updating..."
                  : "Update Transaction"
                : submitting
                  ? "Adding..."
                  : "Add Transaction"}
            </button>

            {id > 0 && (
              <button type="button" className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </form>

          {error && <p className="error">{error}</p>}

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <p className="tp-empty">No transactions added yet.</p>
          ) : searchTransactions.length === 0 ? (
            <p className="tp-empty">
              No transactions found for the selected filters.
            </p>
          ) : (
            <>
              <div className="filters-card">
                <div className="form-group">
                  <label htmlFor="searchCategory">Search transactions</label>
                  <select
                    id="searchCategory"
                    value={searchCategoryId}
                    onChange={(event) => {
                      setSearchCategoryId(Number(event.target.value));
                    }}
                  >
                    <option value={0}>All Categories</option>
                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={(event) => {
                      setStartDate(event.target.value);
                    }}
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    onChange={(event) => {
                      setEndDate(event.target.value);
                    }}
                  />
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <p className="tp-empty">
                  No {activeView} transactions match your filters.
                </p>
              ) : (
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map((transaction) => {
                      return (
                        <tr key={transaction.id}>
                          <td>{transaction.transaction_date}</td>

                          <td>{transaction.note}</td>

                          <td>{transaction.name}</td>

                          <td>{transaction.type}</td>

                          <td
                            className={
                              transaction.type === "income"
                                ? "income"
                                : "expense"
                            }
                          >
                            ₹ {transaction.amount}
                          </td>

                          <td>
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() => {
                                editTransaction(transaction);
                              }}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => {
                                deleteTransaction(transaction.id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          )}

          <Link to="/dashboard" className="tp-back-link">
            Back to home
          </Link>
        </main>
      </div>
    </>
  );
}

export default Transactions;
