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

const createCategory=async (user_id,name,type) =>{
    const category=await fetchCategoryByName(user_id,name);
    if(category){
        throw new AppError("Category already exists",404);
    }
    await insertCategory(user_id,name,type);
    return "Category created successfully";
}

const getCategories=async(user_id) =>{
    const categories=await fetchCategories(user_id);
    return categories;
};

const updateCategory=async (user_id,category_id,name) =>{
    const categoryExists=await fetchCategoryById(category_id,user_id);
    if(!categoryExists){
        throw new AppError("Category does not exists",404);
    }
    const category=await fetchCategoryByName(user_id,name);
    if(category && category.id!==Number(category_id)){
        throw new AppError("Catgeory already exists",409);
    }
    await modifyCategory(user_id,category_id,name);
    return "Category updated successfully";
};

const deleteCategory=async (user_id,category_id) =>{
    const categoryExists=await fetchCategoryById(category_id,user_id);
    if(!categoryExists){
        throw new AppError("Category does not exists",404);
    }
    const transactions=await fetchTransactionsByCategory(user_id,category_id);
    if(transactions.length===0){
        await removeCategory(user_id,category_id);
        return "Category removed successfully";
    }
    return "Cannot delete category because it contains transactions";
}

module.exports={
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};