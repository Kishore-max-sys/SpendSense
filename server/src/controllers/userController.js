const userServices=require("../services/userServices");

const deleteUser=async(req,res,next) =>{
        try{
                const userId=req.user.id;
                const message=await userServices.deleteUser(userId);
                res.status(200).json({
                        success:true,
                        message
                });
        }
        catch(error) {
                next(error);
        }
}

const getProfile=async (req,res,next) =>{
    const userId=req.user.id;
    const response=await userServices.getProfile(userId);
    res.status(200).json({
        success:true,
        user:response
    });
}

const updateUser=async(req,res,next) =>{
        try{
                const userId=req.user.id;
                const newName=req.body.name;
                const newEmail=req.body.email;
                const message=await userServices.updateUser(userId,newName,newEmail);
                res.status(200).json({
                        success:true,
                        message
                });
        }
        catch(error){
                next(error);
        }
}

const changePassword=async(req,res,next) =>{
    try{
        const userId=req.user.id;
        const {currentPassword,newPassword,confirmNewPassword}=req.body;
        const message=await userServices.changePassword(userId,currentPassword,newPassword,confirmNewPassword);
        res.status(200).json({
                success:true,
                message
        });
    }
    catch(error){
        next(error);
    }
}

const getMe=(req,res) =>{
    res.status(200).json({
        user:req.user
    });
}

module.exports={
        deleteUser,
        getProfile,
        updateUser,
        changePassword,
        getMe
};