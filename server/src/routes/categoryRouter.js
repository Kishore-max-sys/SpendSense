const express=require("express");
const {
    authMiddleware
}=require("../middlewares/authMiddleware");
const {
    errorHandler
}=require("../middlewares/errorHandler");
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}=require("../controllers/categoryController");
const router=express.Router();

router.post("/",createCategory);
router.get("/",getCategories);
router.put("/:id",updateCategory);
router.delete("/:id",deleteCategory);

module.exports=router;