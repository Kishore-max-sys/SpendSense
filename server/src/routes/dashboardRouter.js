const express=require("express");
const {
    authMiddleware
}=require("../middlewares/authMiddleware");
const {
    errorHandler
}=require("../middlewares/errorHandler");
const {
    getTotalIncome,
    getTotalExpense,
    getCurrentBalance,
    getExpensesByCategory,
    getMonthlySummary
}=require("../controllers/dashboardController");
const router=express.Router();

router.get("/income",getTotalIncome);
router.get("/expense",getTotalExpense);
router.get("/balance",getCurrentBalance);
router.get("/category-expense",getExpensesByCategory);
router.get("/monthly-summary",getMonthlySummary);

module.exports=router;