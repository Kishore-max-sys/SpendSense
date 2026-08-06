const authServices=require("../services/authServices");

const registerUser=async (req,res,next)=>{
    try{
        const {name,email,password,confirmPassword}=req.body;
        const response=await authServices.registerUser({name,email,password,confirmPassword});
        res.status(201).json({
            success:true,
            ...response
        });
    }
    catch(error){
        next(error);
    }
}

const loginUser=async (req,res,next) =>{
    try{
        const {email,password}=req.body;
        const response=await authServices.loginUser({email,password});
        res.status(200).json({
            success:true,
            ...response
        });
    }
    catch(error){
        next(error);
    }
}

const forgotPassword=async(req,res,next) =>{
    try{
        const {email}=req.body;
        const message=await authServices.otpGenerator(email);
        res.status(200).json({
            success:true,
            message
        });
    }
    catch(error){
        next(error);
    }
}

const otpValidator=async(req,res,next) =>{
    try{
        const {email,otp}=req.body;
        const message=await authServices.otpValidator(email,otp);
        res.status(200).json({
            success:true,
            message
        });
    }
    catch(error){
        next(error);
    }
}

const resetPassword=async(req,res,next) =>{
    try{
        const {email,newPassword,confirmNewPassword}=req.body;
        const message=await authServices.resetPassword(email,newPassword,confirmNewPassword);
        res.status(200).json({
            success:true,
            message
        });
    }
    catch(error){
        next(error);
    }
}



module.exports={
    registerUser,
    loginUser,
    forgotPassword,
    otpValidator,
    resetPassword
};