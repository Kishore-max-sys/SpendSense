const {removeTransactionsByUser}=require("../repositories/transactionsRepository");
const {removeCategoriesByUser}=require("../repositories/categoryRepository");
const {
        removeUser,
        modifyUser,
        findUserByEmail,
        modifyPassword,
        fetchUserById
}=require("../repositories/userRepository");
const AppError =require("../utils/AppError");
const bcrypt=require("bcrypt");

const deleteUser=async(userId) =>{
        await removeTransactionsByUser(userId);
        await removeCategoriesByUser(userId);
        await removeUser(userId);
        return "User deleted successfully";
}

const getProfile=async (userId) =>{
    const user=await fetchUserById(userId); 
    return ({
        name:user.name,
        email:user.email
    });
}

const updateUser=async(userId,newName,newEmail) =>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(newEmail)){
                throw new AppError("Invalid Email Format",400);
        }
        const user=await findUserByEmail(newEmail);
        if(user && user.id!==userId){
                throw new AppError("Email already exists",409);
        }
        await modifyUser(userId,newName,newEmail);
        return "User updated successfully";
}

const changePassword=async(userId,currentPassword,newPassword,confirmNewPassword) =>{
        const user=await fetchUserById(userId);
        const isMatch=await bcrypt.compare(currentPassword,user.password);
        if(!isMatch){
                throw new AppError("Current password is incorrect.",400);
        }
        if(newPassword!==confirmNewPassword){
                throw new AppError("Password and confirm password must match.",400);
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
        deleteUser,
        getProfile,
        updateUser,
        changePassword
};