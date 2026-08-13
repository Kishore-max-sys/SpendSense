const AppError=require("../utils/AppError");

const{
    fetchCategoryByName,
    insertCategory,
    fetchCategories,
    modifyCategory,
    removeCategory,
    fetchCategoryById
}=require("../repositories/categoryRepository");

const {
    fetchTransactionsByCategory
}=require("../repositories/transactionsRepository");

const createCategory=async (user_id,name,type,limit) =>{
    const category=await fetchCategoryByName(user_id,name);
    if(category){
        throw new AppError("Category already exists",404);
    }
    const monthlyLimit=limit===""?null:Number(limit);
    await insertCategory(user_id,name,type,monthlyLimit);
    return "Category created successfully";
}

const getCategories=async(user_id) =>{
    const categories=await fetchCategories(user_id);
    return categories;
};

const updateCategory=async (user_id,category_id,name,limit) =>{
    const categoryExists=await fetchCategoryById(category_id,user_id);
    if(!categoryExists){
        throw new AppError("Category does not exists",404);
    }
    const category=await fetchCategoryByName(user_id,name);
    if(category && category.id!==Number(category_id)){
        throw new AppError("Catgeory already exists",409);
    }
    const monthlyLimit=limit===""?null:Number(limit);
    await modifyCategory(user_id,category_id,name,monthlyLimit);
    return "Category updated successfully";
};

const deleteCategory=async (user_id,category_id) =>{
    const categoryExists=await fetchCategoryById(category_id,user_id);
    if(!categoryExists){
        throw new AppError("Category does not exists",404);
    }
    const transactions=await fetchTransactionsByCategory(user_id,category_id);
    if(transactions.length!==0){
        throw new AppError("Cannot delete category because it contains transactions",400);
    }
    await removeCategory(user_id,category_id);
    return "Category removed successfully";
}

module.exports={
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};