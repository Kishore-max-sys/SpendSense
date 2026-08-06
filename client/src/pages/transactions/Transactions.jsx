import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import useMessage from "../../hooks/useMessage";
import "./Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState(0);
  const [searchCategoryId, setSearchCategoryId] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchTransactions, setSearchTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { error, showError } = useMessage();

  const getCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories);
      if (response.data.categories.length > 0) {
        setCategoryId(response.data.categories[0].id);
      }
    } catch (error) {
      showError(error.response?.data?.message);
    }
  }, [showError]);

  useEffect(() => {
    const callFunction = async () => {
      await getCategories();
    };
    callFunction();
  }, [getCategories]);

  const handleSearch = useCallback(async () => {
    try {
      if (searchCategoryId !== 0 && startDate !== "" && endDate !== "") {
        const response = await api.get(
          `/transactions?categoryId=${searchCategoryId}&startDate=${startDate}&endDate=${endDate}`,
        );
        setSearchTransactions(response.data.transactions);
      } else if (searchCategoryId !== 0 && startDate !== "" && endDate === "") {
        const response = await api.get(
          `/transactions?categoryId=${searchCategoryId}&startDate=${startDate}`,
        );
        setSearchTransactions(response.data.transactions);
      } else if (searchCategoryId !== 0 && startDate === "" && endDate !== "") {
        const response = await api.get(
          `/transactions?categoryId=${searchCategoryId}&endDate=${endDate}`,
        );
        setSearchTransactions(response.data.transactions);
      } else if (searchCategoryId === 0 && startDate !== "" && endDate !== "") {
        const response = await api.get(
          `/transactions?startDate=${startDate}&endDate=${endDate}`,
        );
        setSearchTransactions(response.data.transactions);
      } else if (searchCategoryId !== 0 && startDate === "" && endDate === "") {
        const response = await api.get(
          `/transactions?categoryId=${searchCategoryId}`,
        );
        setSearchTransactions(response.data.transactions);
      } else if (searchCategoryId === 0 && startDate !== "" && endDate === "") {
        const response = await api.get(`/transactions?startDate=${startDate}`);
        setSearchTransactions(response.data.transactions);
      } else if (searchCategoryId === 0 && startDate === "" && endDate !== "") {
        const response = await api.get(`/transactions?endDate=${endDate}`);
        setSearchTransactions(response.data.transactions);
      } else {
        const response = await api.get("/transactions");
        setTransactions(response.data.transactions);
        setSearchTransactions(response.data.transactions);
      }
    } catch (error) {
      showError(error.response?.data?.message);
    }
  }, [searchCategoryId, startDate, endDate, showError]);

  useEffect(() => {
    const callFun = async () => {
      await handleSearch();
    };
    callFun();
  }, [handleSearch]);

  useEffect(() => {
    const transactionsSummary = () => {
      let total = 0;
      let amount = 0;
      transactions.forEach((transaction) => {
        total += 1;
        amount += Number(transaction.amount);
      });
      setTotalTransactions(total);
      setTotalAmount(amount);
    };
    const filterTransactions = async () => {
      const result = transactions.filter((transaction) => {
        return activeView !== "all" ? transaction.type === activeView : true;
      });
      setSearchTransactions(result);
    };
    filterTransactions();
    transactionsSummary();
  }, [transactions, activeView]);

  const addTransaction = async () => {
    try {
      console.log(categoryId);
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
    } catch (error) {
      showError(error.response?.data?.message);
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
      }
    } catch (error) {
      showError(error.response?.data?.message);
    }
  };

  const editTransaction = (transaction) => {
    const formattedDate = transaction.date.slice(0, 16);
    setId(transaction.id);
    setCategoryId(transaction.categoryId);
    setAmount(transaction.amount);
    setDate(formattedDate);
    setDescription(transaction.note);
  };

  const updateTransaction = async () => {
    try {
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
    } catch (error) {
      showError(error.response?.data?.message);
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
      <header>
        <h1>Transactions</h1>
      </header>

      <div className="tp-layout">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          page="transactions"
        />
        <main className="transactions-page">
          <p>{totalTransactions} transactions</p>
          <p>&#8377; {totalAmount} Total</p>
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

            <button className="submit-btn" type="submit">
              {id ? "Update Transaction" : "Add Transaction"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          {transactions.length === 0 ? (
            <p>No transactions added.</p>
          ) : (
            <>
              <h2>{activeView}</h2>
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

              {searchTransactions.length == 0 ? (
                <p>No transactions found for the selected filters.</p>
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
                    {searchTransactions.map((transaction) => {
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
          <Link to="/dashboard">Back to home</Link>
        </main>
      </div>
    </>
  );
}

export default Transactions;
