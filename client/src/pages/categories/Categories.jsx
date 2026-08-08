import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import useMessage from "../../hooks/useMessage";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
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
} from "lucide-react";
import "./Categories.css";

// Maps a category name to a fitting icon by keyword. Falls back to a
// generic icon based on type when nothing matches, so every category gets
// an icon even if it's not one of the recognized keywords.
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

function getCategoryIcon(name, type) {
  const lower = name.toLowerCase();
  const match = iconRules.find((rule) =>
    rule.keywords.some((keyword) => lower.includes(keyword)),
  );
  if (match) return match.Icon;
  return type === "income" ? Wallet : Tag;
}

// Same palette used on the Dashboard pie chart, kept within the app's
// existing gold/rust/forest/brown tones. Colored by category id (not by
// position in the filtered/sorted list) so a category keeps the same
// color no matter how you sort or search — an index-based color would
// visibly shift around every time the list reorders.
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

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [id, setId] = useState(0);
  const [searchCategory, setSearchCategory] = useState("");
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [activeView, setActiveView] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sort, setSort] = useState("asc");
  // Controls the add/edit form modal instead of an always-visible form.
  const [formOpen, setFormOpen] = useState(false);
  // Holds the category pending deletion, replacing window.confirm.
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

  useEffect(() => {
    const callFun = async () => {
      await getCategories();
    };
    callFun();
  }, [getCategories]);

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
      });
      setName("");
      setType("expense");
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

  // Was missing `setType(category.type)`. The Type field in the edit
  // modal is disabled (you can't change a category's type after
  // creation), but since `type` state wasn't synced here, the disabled
  // dropdown kept showing whatever was left over from your last *add* —
  // e.g. editing an income category could still show "Expense".
  const editCategory = (category) => {
    setId(category.id);
    setName(category.name);
    setType(category.type);
    setFormOpen(true);
  };

  const cancelEdit = () => {
    setId(0);
    setName("");
    setType("expense");
    setFormOpen(false);
  };

  const updateCategory = async () => {
    try {
      setSubmitting(true);
      await api.put(`/categories/${id}`, {
        name: name.trim(),
      });
      setName("");
      setType("expense");
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
                {filteredCategories.map((category) => {
                  const CategoryIcon = getCategoryIcon(
                    category.name,
                    category.type,
                  );
                  const iconColor = getCategoryColor(category.id);
                  return (
                    <div
                      key={category.id}
                      onClick={() => {
                        navigateTransactions(category.id);
                      }}
                      className="category-card"
                    >
                      <div className="category-card-top">
                        <div
                          className="category-icon"
                          style={{
                            background: `${iconColor}22`,
                            color: iconColor,
                          }}
                        >
                          <CategoryIcon size={18} />
                        </div>
                        <div className="category-card-actions">
                          <button
                            type="button"
                            className="edit-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              editCategory(category);
                            }}
                            aria-label={`Edit ${category.name}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              setConfirmDeleteCategory(category);
                            }}
                            aria-label={`Delete ${category.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="category-name">{category.name}</p>
                      <p
                        className={
                          category.type === "income"
                            ? "category-type category-type-income"
                            : "category-type category-type-expense"
                        }
                      >
                        {category.type}
                      </p>
                    </div>
                  );
                })}
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

              <div className="cp-modal-actions">
                <button
                  className="submit-btn"
                  type="submit"
                  disabled={submitting}
                >
                  {id ? (
                    <>
                      <Pencil size={15} />{" "}
                      {submitting ? "Updating..." : "Update Category"}
                    </>
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
              This can't be undone.This category can only be deleted if it has
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
