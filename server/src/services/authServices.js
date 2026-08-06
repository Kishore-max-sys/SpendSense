const {
    findUserByEmail,
    createUser,
    modifyPassword
}=require("../repositories/userRepository");
const {
    insertResetOTP,
    removeResetOTP,
    findOtpByUserId,
    modifyResetOTP
}=require("../repositories/passwordResetRepository");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const AppError=require("../utils/AppError");
const sendOtp=require("../utils/sendOtp");

const registerUser=async ({name,email,password,confirmPassword}) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
            throw new AppError("Invalid Email Format",400);
    }
    const userExists=await findUserByEmail(email);
    if(userExists){
        throw new AppError("User Already Exists",409);
    }
    if(password!==confirmPassword){
        throw new AppError("Passwords does not match",400);
    }
    if(password.length<8){
        throw new AppError("Password must contain atleast 8 characters.",400);
    }
    const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$/;
    if(!passwordRegex.test(password)){
        throw new AppError("Password must contain uppercase, lowercase, number, and special character.",400);
    }
    const hashedPassword=await bcrypt.hash(password,10);
    await createUser(name,email,hashedPassword);
    const user=await findUserByEmail(email);
    const token=jwt.sign({
        id:user.id
    },process.env.JWT_SECRET,{
        expiresIn:"8h"
    });

    return {
        message:"Register Successful",
        token
    };
};

const loginUser=async ({email,password}) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
            throw new AppError("Invalid Email Format",400);
    }
    const user=await findUserByEmail(email);
    if(!user){
        throw new AppError("User does not exists",404);
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(isMatch){
        const token=jwt.sign({
            id:user.id
        },process.env.JWT_SECRET,{
            expiresIn:"8h"
        });

        return {
            message:"Login Successful",
            token
        };
    }
    throw new AppError("Invalid Email or Password",400);

}

const otpGenerator=async(email) =>{
    const user=await findUserByEmail(email);
    if(!user){
        return "If an account with that email exists, an OTP has been sent.";
    }
    const userId=user.id;
    const otp=Math.floor(100000+Math.random()*900000).toString();
    const expiresAt=new Date(Date.now()+10*60*1000);
    const otpExists=await findOtpByUserId(userId);
    if(otpExists){
        await modifyResetOTP(userId,otp,expiresAt);
    }else{
        await insertResetOTP(userId,otp,expiresAt);
    }
    await sendOtp(email,otp);
    return "If an account with that email exists, an OTP has been sent.";
}

const otpValidator=async(email,otp) =>{
    const user=await findUserByEmail(email);
    if(!user){
        throw new AppError("Invalid Otp",400);
    }
    const userId=user.id;
    const passwordReset=await findOtpByUserId(userId);
    if(!passwordReset || passwordReset.otp!==otp ){
        throw new AppError("Invalid OTP",400);
    }
    if(new Date()>passwordReset.expires_at){
        throw new AppError("OTP has expired.",400);
    }
    return "OTP is verified";
}

const resetPassword=async(email,newPassword,confirmNewPassword) =>{
    const user=await findUserByEmail(email);
    if(!user){
        throw new AppError("Invalid password reset request.",400);
    }
    if(newPassword!==confirmNewPassword){
        throw new AppError("Passwords does not match",400);
    }
    if(newPassword.length<8){
        throw new AppError("Password must contain atleast 8 characters.",400);
    }
    const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$/;
    if(!passwordRegex.test(newPassword)){
        throw new AppError("Password must contain uppercase, lowercase, number, and special character.",400);
    }
    const isSame=await bcrypt.compare(newPassword,user.password);
    if(isSame){
        throw new AppError("New password must be different from the current password.",400);
    }
    const newHashedPassword=await bcrypt.hash(newPassword,10);
    await modifyPassword(user.id,newHashedPassword);
    return "Password changed successfully";
}

module.exports={
    registerUser,
    loginUser,
    otpGenerator,
    otpValidator,
    resetPassword
};