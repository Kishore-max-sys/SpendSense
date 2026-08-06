const express=require("express");
const {
    authMiddleware
}=require("../middlewares/authMiddleware");
const {
    errorHandler
}=require("../middlewares/errorHandler");
const {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
}=require("../controllers/transactionsController");
const router=express.Router();

router.post("/",addTransaction);
router.get("/",getTransactions);
router.put("/:id",updateTransaction);
router.delete("/:id",deleteTransaction);

module.exports=router;