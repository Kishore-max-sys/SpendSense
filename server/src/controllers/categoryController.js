const categoryServices=require("../services/categoryServices");

const createCategory=async (req,res,next) =>{
    try{
        const {name,type}=req.body;
        const user_id=req.user.id;
        const message=await categoryServices.createCategory(user_id,name,type);
        res.status(201).json({
            success:true,
            message
        });
    }
    catch(error){
        next(error);
    }

};

const getCategories=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const response=await categoryServices.getCategories(user_id);
        res.status(200).json({
            success:true,
            categories:response
        });
    }
    catch(error){
        next(error);
    }
};

const updateCategory=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const category_id=req.params.id;
        const {name}=req.body;
        const message=await categoryServices.updateCategory(user_id,category_id,name);
        res.status(200).json({
            success:true,
            message
        });
    }
    catch(error){
        next(error);
    }
};

const deleteCategory=async (req,res,next) =>{
    try{
        const user_id=req.user.id;
        const category_id=req.params.id;
        const message=await categoryServices.deleteCategory(user_id,category_id);
        res.status(200).json({
            success:true,
            message
        });
    }
    catch(error){
        next(error);
    }
};

module.exports={
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};