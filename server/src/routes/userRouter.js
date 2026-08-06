const express=require("express");
const router=express.Router();
const {
        getProfile,
        deleteUser,
        updateUser,
        changePassword,
        getMe
}=require("../controllers/userController");

router.get("/me",getMe);
router.get("/",getProfile);
router.delete("/",deleteUser);
router.put("/",updateUser);
router.put("/change-password",changePassword);

module.exports=router;