import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import CategoryCard from "../../components/CategoryCard";
import api from "../../api/axios";
import useMessage from "../../hooks/useMessage";
import { Plus, X, ArrowLeft, Tag } from "lucide-react";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  // New: category_id -> amount spent, merged in from the same endpoint
  // your Dashboard page already uses. Needed so CategoryCard can compute
  // a spent/limit percentage — your /categories endpoint only returns
  // the limit itself, not how much has actually been spent.
  const [spendByCategory, setSpendByCategory] = useState({});
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [id, setId] = useState(0);
  const [searchCategory, setSearchCategory] = useState("");
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [activeView, setActiveView] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sort, setSort] = useState("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(null);
  const navigate = useNavigate();
  const { error, showError } = useMessage();

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data.categories);
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // New: fetches the same per-category spend data your Dashboard page
  // already uses, so the budget progress bar has real numbers to show.
  const getCategorySpend = useCallback(async () => {
    try {
      const response = await api.get("/dashboard/category-expense");
      const map = {};
      response.data.categories.forEach((entry) => {
        map[entry.category_id] = entry.expense;
      });
      setSpendByCategory(map);
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    }
  }, [showError]);

  useEffect(() => {
    const callFun = async () => {
      await getCategories();
      await getCategorySpend();
    };
    callFun();
  }, [getCategories, getCategorySpend]);

  useEffect(() => {
    const categoriesSummary = () => {
      const total = categories.length;
      const income = categories.reduce(
        (sum, category) => (category.type === "income" ? sum + 1 : sum),
        0,
      );
      setTotalCategories(total);
      setTotalIncome(income);
      setTotalExpense(total - income);
    };
    categoriesSummary();
  }, [categories]);

  const addCategory = async () => {
    try {
      setSubmitting(true);
      await api.post("/categories", {
        name: name.trim(),
        type,
        monthlyLimit:
          type === "expense" && monthlyLimit !== ""
            ? Number(monthlyLimit)
            : null,
      });
      setName("");
      setType("expense");
      setMonthlyLimit("");
      setFormOpen(false);
      await getCategories();
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      await getCategories();
    } catch (error) {
      showError(
        error.response?.data?.message || "Network failure. Please try again.",
      );
    } finally {
      setConfirmDeleteCategory(null);
    }
  };

  const editCategory = (category) => {
    setId(category.id);
    setName(category.name);
    setType(category.type);
    // category.limit can be null/undefined for categories created before
    // this feature existed — falling back to "" keeps the number input
    // controlled instead of flipping to uncontrolled.
    setMonthlyLimit(category.monthlyLimit ?? "");
    setFormOpen(true);
  };

  const cancelEdit = () => {
    setId(0);
    setName("");
    setType("expense");
    setMonthlyLimit("");
    setFormOpen(false);
  };

  const updateCategory = async () => {
    try {
      setSubmitting(true);
      await api.put(`/categories/${id}`, {
        name: name.trim(),
        monthlyLimit: monthlyLimit !== "" ? Number(monthlyLimit) : null,
      });
      setName("");
      setType("expense");
      setMonthlyLimit("");
      setId(0);
      setFormOpen(false);
      await getCategories();
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
      await updateCategory();
    } else {
      await addCategory();
    }
  };

  const filteredCategories = categories
    .filter((category) => {
      return (
        category.name.toLowerCase().includes(searchCategory.toLowerCase()) &&
        (activeView !== "all" ? category.type === activeView : true)
      );
    })
    .sort((a, b) =>
      sort === "asc"
        ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        : b.name.toLowerCase().localeCompare(a.name.toLowerCase()),
    );

  const toggleSort = () => {
    if (sort === "asc") {
      setSort("desc");
    } else {
      setSort("asc");
    }
  };

  const navigateTransactions = (categoryId) => {
    navigate(`/transactions?categoryId=${categoryId}`);
  };

  return (
    <>
      <header className="cp-header">
        <h1>Categories</h1>
        {!loading && categories.length > 0 && (
          <div className="cp-header-stats">
            <span>
              <strong>{totalCategories}</strong> total
            </span>
            <span className="cp-header-stat-income">
              <strong>{totalIncome}</strong> income
            </span>
            <span className="cp-header-stat-expense">
              <strong>{totalExpense}</strong> expense
            </span>
          </div>
        )}
      </header>

      <div className="cp-layout">
        <div className="cp-sidebar-col">
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            page="categories"
          />
          <Link to="/dashboard" className="cp-back-link">
            <ArrowLeft size={15} /> Back to home
          </Link>
        </div>

        <main className="categories-page">
          {error && <p className="error">{error}</p>}

          {!loading && categories.length > 0 && (
            <div className="cp-toolbar">
              <input
                type="text"
                className="cp-search"
                placeholder="Search categories..."
                value={searchCategory}
                onChange={(event) => {
                  setSearchCategory(event.target.value);
                }}
              />
              <button
                type="button"
                className="cp-sort-btn"
                onClick={toggleSort}
              >
                Sort: {sort === "asc" ? "A–Z" : "Z–A"}
              </button>
              <button
                type="button"
                className="submit-btn cp-add-btn"
                onClick={() => {
                  setId(0);
                  setName("");
                  setType("expense");
                  setMonthlyLimit("");
                  setFormOpen(true);
                }}
              >
                <Plus size={15} /> Add Category
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="cp-empty">
              <div className="cp-empty-icon">
                <Tag size={22} />
              </div>
              <p className="cp-empty-title">No categories yet</p>
              <p className="cp-empty-copy">
                Create your first category to start organizing income and
                expenses.
              </p>
              <button
                type="button"
                className="submit-btn"
                onClick={() => {
                  setId(0);
                  setName("");
                  setType("expense");
                  setMonthlyLimit("");
                  setFormOpen(true);
                }}
              >
                <Plus size={15} /> Add Category
              </button>
            </div>
          ) : filteredCategories.length === 0 ? (
            <p className="cp-no-results">No categories match your search.</p>
          ) : (
            <div className="cp-grid-section">
              <p className="cp-section-label">
                {filteredCategories.length}{" "}
                {filteredCategories.length === 1 ? "category" : "categories"}
              </p>
              <div className="category-grid">
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    spent={spendByCategory[category.id] || 0}
                    onClick={navigateTransactions}
                    onEdit={editCategory}
                    onDelete={setConfirmDeleteCategory}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {formOpen && (
        <div className="cp-modal-overlay" onClick={cancelEdit}>
          <div
            className="cp-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{id ? "Update Category" : "Add Category"}</h2>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="cname">Category Name</label>
                <input
                  id="cname"
                  type="text"
                  autoFocus
                  required
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value);
                  }}
                  disabled={id}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {type === "expense" && (
                <div className="form-group">
                  <label htmlFor="limit">Monthly Budget (optional)</label>
                  <input
                    id="limit"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 5000"
                    value={monthlyLimit}
                    onChange={(event) => {
                      setMonthlyLimit(event.target.value);
                    }}
                  />
                </div>
              )}

              <div className="cp-modal-actions">
                <button
                  className="submit-btn"
                  type="submit"
                  disabled={submitting}
                >
                  {id ? (
                    submitting ? (
                      "Updating..."
                    ) : (
                      "Update Category"
                    )
                  ) : (
                    <>
                      <Plus size={15} />{" "}
                      {submitting ? "Adding..." : "Add Category"}
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

      {confirmDeleteCategory && (
        <div
          className="cp-modal-overlay"
          onClick={() => setConfirmDeleteCategory(null)}
        >
          <div
            className="cp-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Delete "{confirmDeleteCategory.name}"?</h2>
            <p className="cp-modal-copy">
              This can't be undone. This category can only be deleted if it has
              no associated transactions. Please make sure all transactions
              using this category have been deleted first.
            </p>
            <div className="cp-modal-actions">
              <button
                type="button"
                className="delete-btn-solid"
                onClick={() => deleteCategory(confirmDeleteCategory.id)}
              >
                Yes, delete
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setConfirmDeleteCategory(null)}
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

export default Categories;
