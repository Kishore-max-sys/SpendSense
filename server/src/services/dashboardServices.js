const {
    fetchTotalIncome,
    fetchTotalExpense,
    fetchCurrentBalance,
    fetchExpensesByCategory,
    fetchMonthlySummary
}=require("../repositories/dashboardRepository");

const getTotalIncome=async (user_id) =>{
    const result=await fetchTotalIncome(user_id);
    const totalIncome=Number(result.total_income);
    return totalIncome;
}

const getTotalExpense=async (user_id) =>{
    const result=await fetchTotalExpense(user_id);
    const totalExpense=Number(result.total_expense);
    return totalExpense;
}

const getCurrentBalance=async (user_id) =>{
    const result=await fetchCurrentBalance(user_id);
    const balance=Number(result.total_income)-Number(result.total_expense);
    return balance;
}

const getExpensesByCategory=async (user_id) =>{
    const categories=await fetchExpensesByCategory(user_id);
    categories.forEach((category) =>{
        category.expense=Number(category.expense);
    });
    return categories;
}

const getMonthlySummary=async (user_id) =>{
    const months=await fetchMonthlySummary(user_id);
    months.forEach((month) =>{
        month.income=Number(month.income);
        month.expense=Number(month.expense);
    });
    return months;
}

module.exports={
    getTotalIncome,
    getTotalExpense,
    getCurrentBalance,
    getExpensesByCategory,
    getMonthlySummary
};