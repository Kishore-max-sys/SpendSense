const express=require("express");
const router=express.Router();
const{
    registerUser,
    loginUser,
    forgotPassword,
    otpValidator,
    resetPassword
}=require("../controllers/authControllers");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/forgot-password",forgotPassword);
router.post("/otp-verification",otpValidator);
router.post("/reset-password",resetPassword);

module.exports=router;