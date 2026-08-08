import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import useMessage from "../../hooks/useMessage";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  Receipt,
  ShoppingCart,
  Home,
  Tv,
  Film,
  Smartphone,
  Car,
  HeartPulse,
  GraduationCap,
  Zap,
  Dumbbell,
  Gift,
  ShieldCheck,
  PiggyBank,
  TrendingUp,
  ShoppingBag,
  Wallet,
  Tag,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import "./Transactions.css";

// Same icon-by-keyword mapping used on the Categories page, so a
// transaction's icon always matches its category's icon.
const iconRules = [
  {
    keywords: ["grocery", "groceries", "food", "dining", "restaurant"],
    Icon: ShoppingCart,
  },
  { keywords: ["rent", "housing", "hostel"], Icon: Home },
  { keywords: ["netflix", "subscription", "streaming", "prime"], Icon: Tv },
  { keywords: ["movie", "cinema", "entertainment"], Icon: Film },
  { keywords: ["recharge", "mobile", "phone"], Icon: Smartphone },
  {
    keywords: ["fuel", "petrol", "transport", "travel", "uber", "taxi", "cab"],
    Icon: Car,
  },
  {
    keywords: ["medical", "health", "hospital", "doctor", "pharmacy"],
    Icon: HeartPulse,
  },
  {
    keywords: ["education", "school", "college", "course", "tuition"],
    Icon: GraduationCap,
  },
  {
    keywords: ["electricity", "utility", "utilities", "water", "bill"],
    Icon: Zap,
  },
  { keywords: ["gym", "fitness", "workout"], Icon: Dumbbell },
  { keywords: ["gift"], Icon: Gift },
  { keywords: ["insurance"], Icon: ShieldCheck },
  { keywords: ["saving", "savings"], Icon: PiggyBank },
  { keywords: ["invest", "stock", "mutual fund"], Icon: TrendingUp },
  { keywords: ["shopping", "clothes", "clothing"], Icon: ShoppingBag },
  { keywords: ["salary", "wage", "paycheck", "income"], Icon: Wallet },
];

function getCategoryIcon(name = "", type) {
  const lower = name.toLowerCase();
  const match = iconRules.find((rule) =>
    rule.keywords.some((keyword) => lower.includes(keyword)),
  );
  if (match) return match.Icon;
  return type === "income" ? Wallet : Tag;
}

// Same palette used on Dashboard + Categories, keyed by category id so a
// category keeps the same color everywhere in the app.
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

function getCategoryColor(id) {
  return categoryColors[id % categoryColors.length];
}

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Groups already-sorted transactions under their date, so the list reads
// like a bank statement instead of a flat table.
function groupByDate(transactions) {
  const groups = [];
  let currentKey = null;
  let currentGroup = null;

  transactions.forEach((transaction) => {
    const key = (transaction.transaction_date || "").slice(0, 10);
    if (key !== currentKey) {
      currentKey = key;
      currentGroup = { key, date: transaction.transaction_date, items: [] };
      groups.push(currentGroup);
    }
    currentGroup.items.push(transaction);
  });

  return groups;
}

function Transactions() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [searchTransactions, setSearchTransactions] = useState([]);
  const [sort, setSort] = useState("new");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteTransaction, setConfirmDeleteTransaction] =
    useState(null);
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

  const initialActiveView = params.get("activeView") || "all";

  const [activeView, setActiveView] = useState(initialActiveView);

  const handleChangeView = (view) => {
    setActiveView(view);
    setSearchCategoryId(0);
    setStartDate("");
    setEndDate("");
  };

  // Same query string is built for every filter combination in one place,
  // instead of one branch per combination (which is what let `transactions`
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
    return searchTransactions
      .filter((transaction) =>
        activeView === "all" ? true : transaction.type === activeView,
      )
      .sort((a, b) =>
        sort === "new"
          ? new Date(b.transaction_date) - new Date(a.transaction_date)
          : new Date(a.transaction_date) - new Date(b.transaction_date),
      );
  }, [searchTransactions, activeView, sort]);

  const groupedTransactions = useMemo(
    () => groupByDate(filteredTransactions),
    [filteredTransactions],
  );

  const totalTransactions = transactions.length;

  const totalAmount = useMemo(() => {
    return transactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0,
    );
  }, [transactions]);

  const totalFilteredTransactions = filteredTransactions.length;
  const totalFilteredAmount = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0,
    );
  }, [filteredTransactions]);

  const hasActiveFilters =
    searchCategoryId !== 0 || startDate !== "" || endDate !== "";

  useEffect(() => {
    const callFun = async () => {
      setLoading(true);
      await handleSearch();
      setLoading(false);
    };
    callFun();
  }, [handleSearch]);

  const resetForm = () => {
    setId(0);
    setCategoryId(0);
    setAmount("");
    setDate("");
    setDescription("");
  };

  const addTransaction = async () => {
    try {
      setSubmitting(true);
      await api.post("/transactions", {
        categoryId,
        amount,
        date,
        description,
      });
      resetForm();
      setFormOpen(false);
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

  const deleteTransaction = async (transactionId) => {
    try {
      await api.delete(`/transactions/${transactionId}`);
      await handleSearch();
      await getTransactions();
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    } finally {
      setConfirmDeleteTransaction(null);
    }
  };

  const editTransaction = (transaction) => {
    // Was transaction.date, which doesn't exist on the object this page
    // renders (transaction_date) — that mismatch left the date field blank
    // on every edit.
    const formattedDate = (transaction.transaction_date || "").slice(0, 16);
    setId(transaction.id);
    setCategoryId(transaction.categoryId);
    setAmount(transaction.amount);
    setDate(formattedDate);
    setDescription(transaction.note);
    setFormOpen(true);
  };

  const cancelEdit = () => {
    resetForm();
    setFormOpen(false);
  };

  const toggleSort = () => {
    setSort(sort === "new" ? "old" : "new");
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
      resetForm();
      setFormOpen(false);
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
        <div className="tp-sidebar-col">
          <Sidebar
            activeView={activeView}
            setActiveView={handleChangeView}
            page="transactions"
          />
          <Link to="/dashboard" className="tp-back-link">
            <ArrowLeft size={15} /> Back to home
          </Link>
        </div>

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

          {error && <p className="error">{error}</p>}

          <div className="tp-toolbar">
            <div className="tp-toolbar-filters">
              <div className="filter-group">
                <label htmlFor="searchCategory">Category</label>
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
                <label htmlFor="startDate">From</label>
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
                <label htmlFor="endDate">To</label>
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

              {hasActiveFilters && (
                <button
                  type="button"
                  className="tp-clear-btn"
                  onClick={() => {
                    setSearchCategoryId(0);
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  <X size={13} /> Clear
                </button>
              )}
            </div>

            <div className="tp-toolbar-actions">
              <button
                type="button"
                className="tp-sort-btn"
                onClick={toggleSort}
              >
                {sort === "new" ? "Newest first" : "Oldest first"}
              </button>
              <button
                type="button"
                className="submit-btn tp-add-btn"
                onClick={() => {
                  resetForm();
                  setFormOpen(true);
                }}
              >
                <Plus size={15} /> Add Transaction
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="tp-empty">
              <div className="tp-empty-icon">
                <Receipt size={22} />
              </div>
              <p className="tp-empty-title">No transactions yet</p>
              <p className="tp-empty-copy">
                Add your first income or expense to start tracking where your
                money goes.
              </p>
              <button
                type="button"
                className="submit-btn"
                onClick={() => {
                  resetForm();
                  setFormOpen(true);
                }}
              >
                <Plus size={15} /> Add Transaction
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="tp-empty">
              <div className="tp-empty-icon">
                <Receipt size={22} />
              </div>
              <p className="tp-empty-title">No matches</p>
              <p className="tp-empty-copy">
                {activeView === "all"
                  ? "No transactions match your filters."
                  : `No ${activeView} transactions match your filters.`}
              </p>
            </div>
          ) : (
            <>
              <div className="tp-stats">
                <div className="tp-stat">
                  <span>{hasActiveFilters ? "Filtered" : "Showing"}</span>
                  <strong>{totalFilteredTransactions}</strong>
                </div>
                <div className="tp-stat">
                  <span>Filtered Total</span>
                  <strong>₹ {totalFilteredAmount}</strong>
                </div>
              </div>

              <div className="tp-statement">
                {groupedTransactions.map((group) => (
                  <div className="tp-day-group" key={group.key}>
                    <p className="tp-day-label">{formatDate(group.date)}</p>

                    <div className="tp-day-rows">
                      {group.items.map((transaction) => {
                        const CategoryIcon = getCategoryIcon(
                          transaction.name,
                          transaction.type,
                        );
                        const iconColor = getCategoryColor(
                          transaction.categoryId,
                        );
                        const isIncome = transaction.type === "income";

                        return (
                          <div className="tp-row" key={transaction.id}>
                            <div
                              className="tp-row-icon"
                              style={{
                                background: `${iconColor}22`,
                                color: iconColor,
                              }}
                            >
                              <CategoryIcon size={17} />
                            </div>

                            <div className="tp-row-main">
                              <p className="tp-row-title">
                                {transaction.note || transaction.name}
                              </p>
                              <p className="tp-row-sub">{transaction.name}</p>
                            </div>

                            <div className="tp-row-amount-wrap">
                              <span
                                className={
                                  isIncome
                                    ? "tp-row-badge tp-row-badge-income"
                                    : "tp-row-badge tp-row-badge-expense"
                                }
                              >
                                {isIncome ? (
                                  <ArrowDownLeft size={12} />
                                ) : (
                                  <ArrowUpRight size={12} />
                                )}
                                {transaction.type}
                              </span>
                              <p
                                className={
                                  isIncome
                                    ? "tp-row-amount income"
                                    : "tp-row-amount expense"
                                }
                              >
                                {isIncome ? "+" : "-"}₹{transaction.amount}
                              </p>
                            </div>

                            <div className="tp-row-actions">
                              <button
                                type="button"
                                className="edit-btn"
                                onClick={() => editTransaction(transaction)}
                                aria-label="Edit transaction"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() =>
                                  setConfirmDeleteTransaction(transaction)
                                }
                                aria-label="Delete transaction"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {formOpen && (
        <div className="tp-modal-overlay" onClick={cancelEdit}>
          <div
            className="tp-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{id ? "Update Transaction" : "Add Transaction"}</h2>

            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  required
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
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  required
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
                  placeholder="e.g. Groceries at DMart"
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
                  value={categoryId === 0 ? "" : categoryId}
                  required
                  onChange={(event) => {
                    setCategoryId(Number(event.target.value));
                  }}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="tp-modal-actions">
                <button
                  className="submit-btn"
                  type="submit"
                  disabled={submitting}
                >
                  {id ? (
                    <>
                      <Pencil size={15} />{" "}
                      {submitting ? "Updating..." : "Update Transaction"}
                    </>
                  ) : (
                    <>
                      <Plus size={15} />{" "}
                      {submitting ? "Adding..." : "Add Transaction"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  <X size={15} /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteTransaction && (
        <div
          className="tp-modal-overlay"
          onClick={() => setConfirmDeleteTransaction(null)}
        >
          <div
            className="tp-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Delete this transaction?</h2>
            <p className="tp-modal-copy">
              "{confirmDeleteTransaction.note || confirmDeleteTransaction.name}"
              for ₹{confirmDeleteTransaction.amount} on{" "}
              {formatDate(confirmDeleteTransaction.transaction_date)}. This
              can't be undone.
            </p>
            <div className="tp-modal-actions">
              <button
                type="button"
                className="delete-btn-solid"
                onClick={() => deleteTransaction(confirmDeleteTransaction.id)}
              >
                Yes, delete
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setConfirmDeleteTransaction(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Transactions;
