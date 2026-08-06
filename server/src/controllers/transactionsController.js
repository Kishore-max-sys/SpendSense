const { fetchTransactionsBetweenDates } = require("../repositories/transactionsRepository");
const transactionServices=require("../services/transactionsServices");

const addTransaction=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const {categoryId,amount,description,date}=req.body;
        const message=await transactionServices.addTransaction(user_id,categoryId,amount,description,date);
        res.status(201).json({
            success:true,
            message
        });
    }
    catch(error){
        next(error);
    }
};

const getTransactions=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const queryParams=req.query;
        if(queryParams.startDate && queryParams.endDate && queryParams.categoryId){
            const {startDate,endDate,categoryId}=queryParams;
            const response=await transactionServices.getTransactionsBetweenDatesByCategory(user_id,categoryId,startDate,endDate);
            res.status(200).json({
                success:true,
                transactions:response
            });
        }
        else if(queryParams.categoryId && queryParams.startDate){
            const {categoryId,startDate}=queryParams;
            const response=await transactionServices.getTransactionsByStartDateByCategory(user_id,categoryId,startDate);
            res.status(200).json({
                success:true,
                transactions:response
            });
        }
        else if(queryParams.categoryId && queryParams.endDate){
            const {categoryId,endDate}=queryParams;
            const response=await transactionServices.getTransactionsByEndDateByCategory(user_id,categoryId,endDate);
            res.status(200).json({
                success:true,
                transactions:response
            });
        }
        else if(queryParams.startDate && queryParams.endDate){
            const {startDate,endDate}=req.query;
            const response=await transactionServices.getTransactionsBetweenDates(user_id,startDate,endDate);
            res.status(200).json({
                success:true,
                transactions:response
            });
        }
        else if(queryParams.categoryId){
            const {categoryId}=queryParams;
            const response=await transactionServices.getTransactionsByCategory(user_id,categoryId);
            res.status(200).json({
                success:true,
                transactions:response
            });
        }
        else if(queryParams.startDate){
            const {startDate}=queryParams;
            const response=await transactionServices.getTransactionsByStartDate(user_id,startDate);
            res.status(200).json({
                success:true,
                transactions:response
            });
        }
        else if(queryParams.endDate){
            const {endDate}=queryParams;
            const response=await transactionServices.getTransactionsByEndDate(user_id,endDate);
            res.status(200).json({
                success:true,
                transactions:response
            });
        }
        else{
            const response=await transactionServices.getTransactions(user_id);
            res.status(200).json({
                success:true,
                transactions:response
            });
        }
    }
    catch(error){
        next(error);
    }
}

const updateTransaction=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const transaction_id=req.params.id;
        const {categoryId,amount,description,date}=req.body;
        const message=await transactionServices.updateTransaction(transaction_id,user_id,categoryId,amount,description,date);
        res.status(200).json({
            success:true,
            message
        });
    }
    catch(error){
        next(error);
    }
}

const deleteTransaction=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const transaction_id=req.params.id;
        const message=await transactionServices.deleteTransaction(transaction_id,user_id);
        res.status(200).json({
            success:true,
            message
        });
    }
    catch(error){
        next(error);
    }
}

module.exports={addTransaction,getTransactions,updateTransaction,deleteTransaction};