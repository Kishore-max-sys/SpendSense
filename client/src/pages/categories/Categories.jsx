import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import useMessage from "../../hooks/useMessage";
import "./Categories.css";

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
  const { error, showError } = useMessage();

  const getCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories);
    } catch (error) {
      showError(error.response?.data?.message);
    }
  }, [showError]);

  useEffect(() => {
    const callFunction = async () => {
      await getCategories();
    };
    const categoriesSummary = () => {
      let total = 0;
      let income = 0;
      let expense = 0;
      categories.map((category) => {
        if (category.type === "income") {
          income++;
        } else {
          expense++;
        }
        total++;
      });
      setTotalCategories(total);
      setTotalIncome(income);
      setTotalExpense(expense);
    };
    callFunction();
    categoriesSummary();
  }, [getCategories, categories]);

  const addCategory = async () => {
    try {
      await api.post("/categories", {
        name,
        type,
      });
      setName("");
      setType("expense");
      await getCategories();
    } catch (error) {
      showError(error.response?.data?.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const confirmed = window.confirm("Do you want to delete this category?");
      if (confirmed) {
        await api.delete(`/categories/${id}`);
        await getCategories();
      }
    } catch (error) {
      showError(error.response?.data?.message);
    }
  };

  const editCategory = async (category) => {
    try {
      setId(category.id);
      setName(category.name);
    } catch (error) {
      showError(error.response?.data?.message);
    }
  };

  const updateCategory = async () => {
    try {
      await api.put(`/categories/${id}`, {
        name,
      });
      setName("");
      setId(0);
      await getCategories();
    } catch (error) {
      showError(error.response?.data?.message);
    }
  };

  const handleSubmit = async () => {
    event.preventDefault();
    showError("");

    if (id) {
      await updateCategory();
    } else {
      await addCategory();
    }
  };

  const filteredCategories = categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchCategory.toLowerCase()) &&
      (activeView !== "all" ? category.type === activeView : true)
    );
  });

  return (
    <>
      <header>
        <h1>Categories</h1>
      </header>
      <div className="cp-layout">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          page="categories"
        />
        <main className="categories-page">
          <p>Total: {totalCategories}</p>
          <p>Income: {totalIncome}</p>
          <p>Expense: {totalExpense}</p>

          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="cname">Category Name</label>

              <input
                id="cname"
                type="text"
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

            <button className="submit-btn" type="submit">
              {id ? "Update Category" : "Add Category"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          <h2>{activeView}</h2>
          {categories.length == 0 ? (
            <p>No categories added.</p>
          ) : (
            <>
              <input
                type="text"
                value={searchCategory}
                onChange={(event) => {
                  setSearchCategory(event.target.value);
                }}
              />
              <table className="category-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>

                      <td
                        className={
                          category.type === "income" ? "income" : "expense"
                        }
                      >
                        {category.type}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => editCategory(category)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => deleteCategory(category.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <Link to="/dashboard">Back to home</Link>
        </main>
      </div>
    </>
  );
}

export default Categories;
