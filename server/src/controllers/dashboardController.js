const dashboardServices=require("../services/dashboardServices");

const getTotalIncome=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const response=await dashboardServices.getTotalIncome(user_id);
        res.status(200).json({
            success:true,
            income:response
        });
    }
    catch(error){
        next(error);
    }
};

const getTotalExpense=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const response=await dashboardServices.getTotalExpense(user_id);
        res.status(200).json({
            success:true,
            expense:response
        });
    }
    catch(error){
        next(error);
    }
};

const getCurrentBalance=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const response =await dashboardServices.getCurrentBalance(user_id);
        res.status(200).json({
            success:true,
            balance:response
        });
    }
    catch(error){
        next(error);
    }
};

const getExpensesByCategory=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const response =await dashboardServices.getExpensesByCategory(user_id);
        res.status(200).json({
            success:true,
            categories:response
        });
    }
    catch(error){
        next(error);
    }
};

const getMonthlySummary=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const response =await dashboardServices.getMonthlySummary(user_id);
        res.status(200).json({
            success:true,
            summary:response
        });
    }
    catch(error){
        next(error);
    }
};

module.exports={
    getTotalIncome,
    getTotalExpense,
    getCurrentBalance,
    getExpensesByCategory,
    getMonthlySummary
};