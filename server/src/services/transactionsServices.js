const AppError=require("../utils/AppError");

const {
    insertTransaction,
    fetchTransactions,
    modifyTransaction,
    fetchTransactionById,
    removeTransaction,
    fetchTransactionsBetweenDates,
    fetchTransactionsByCategory,
    fetchTransactionsBetweenDatesByCategory,
    fetchTransactionsByStartDate,
    fetchTransactionsByStartDateByCategory,
    fetchTransactionsByEndDate,
    fetchTransactionsByEndDateByCategory
}=require("../repositories/transactionsRepository");
const {fetchCategoryById}=require("../repositories/categoryRepository");

const addTransaction=async (user_id,category_id,amount,note,transaction_date) =>{
    const category=await fetchCategoryById(category_id,user_id);
    if(!category){
        throw new AppError("Category does not exist",404);
    }
    if(amount<=0){
        throw new AppError("Amount should be greater than zero",400);
    }
    await insertTransaction(user_id,category_id,amount,note,transaction_date);
    return "Transaction created successfully";
};

const getTransactions=async (user_id) =>{
    const transactions=await fetchTransactions(user_id);
    return transactions;
}

const updateTransaction=async (transaction_id,user_id,category_id,amount,note,transaction_date) =>{
    const transaction=await fetchTransactionById(transaction_id,user_id);
    if(!transaction){
        throw new AppError("Transaction does not exists",404);
    }
    const category=await fetchCategoryById(category_id,user_id);
    if(!category){
        throw new AppError("Category does not exist",404);
    }
    if(amount<=0){
        throw new AppError("Amount should be greater than zero",400);
    }
    await modifyTransaction(transaction_id,user_id,category_id,amount,note,transaction_date);
    return "Transaction modified successfully";
}

const deleteTransaction=async (transaction_id,user_id) =>{
    const transaction=await fetchTransactionById(transaction_id,user_id);
    if(!transaction){
        throw new AppError("Transaction does not exists",404);
    }
    await removeTransaction(transaction_id,user_id);
    return "Transaction deleted successfully";
}

const getTransactionsBetweenDates=async (user_id,start_date,end_date) =>{
    if(start_date>end_date){
        throw new AppError("The start date must be on or before the end date.",400);
    }
    const transactions=await fetchTransactionsBetweenDates(user_id,start_date,end_date);
    return transactions;
}

const getTransactionsByCategory=async (user_id,category_id) =>{
    const transactions=await fetchTransactionsByCategory(user_id,category_id);
    return transactions;
}

const getTransactionsBetweenDatesByCategory=async (user_id,category_id,start_date,end_date) =>{
    if(start_date>end_date){
        throw new AppError("The start date must be on or before the end date.",400);
    }
    const transactions=await fetchTransactionsBetweenDatesByCategory(user_id,category_id,start_date,end_date);
    return transactions;
}

const getTransactionsByStartDate=async (user_id,start_date) =>{
    const transactions=await fetchTransactionsByStartDate(user_id,start_date);
    return transactions;
}

const getTransactionsByStartDateByCategory=async (user_id,category_id,start_date) =>{
    const transactions=await fetchTransactionsByStartDateByCategory(user_id,category_id,start_date);
    return transactions;
}

const getTransactionsByEndDate=async (user_id,end_date) =>{
    const transactions=await fetchTransactionsByEndDate(user_id,end_date);
    return transactions;
}

const getTransactionsByEndDateByCategory=async (user_id,category_id,end_date) =>{
    const transactions=await fetchTransactionsByEndDateByCategory(user_id,category_id,end_date);
    return transactions;
}

module.exports={
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionsBetweenDates,
    getTransactionsByCategory,
    getTransactionsBetweenDatesByCategory,
    getTransactionsByStartDate,
    getTransactionsByStartDateByCategory,
    getTransactionsByEndDate,
    getTransactionsByEndDateByCategory
};