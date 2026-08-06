const pool=require("../config/db");

const fetchCategoryByName=async (user_id,name)=>{
    const [rows]=await pool.execute(
        `SELECT * FROM categories
        WHERE user_id=? AND name=?`,
        [user_id,name]
    );
    return rows[0];
}

const fetchCategoryById=async (category_id,user_id)=>{
    const [rows]=await pool.execute(
        `SELECT * FROM categories
        WHERE id=? AND user_id=?`,
        [category_id,user_id]
    );
    return rows[0];
};

const insertCategory=async (user_id,name,type) =>{
    const [result]=await pool.execute(
        `INSERT INTO categories(user_id,name,type)
        VALUES(?,?,?)`,
        [user_id,name,type]
    );
    return [result];
};

const fetchCategories=async (user_id) =>{
    const [rows]=await pool.execute(
        `SELECT id,name,type
        FROM categories
        WHERE user_id=?`,
        [user_id]
    );
    return rows;
}

const modifyCategory=async (user_id,category_id,name) =>{
    const [result]=await pool.execute(
        `UPDATE categories
        SET name=?
        WHERE user_id=? AND id=?`,
        [name,user_id,category_id]
    );
    return result;
}

const removeCategory=async (user_id,category_id) =>{
    const [result]=await pool.execute(
        `DELETE FROM categories
        WHERE user_id=? AND id=?`,
        [user_id,category_id]
    );
    return result;
}

const removeCategoriesByUser=async (user_id) =>{
    const result=await pool.execute(
        `DELETE FROM categories
        WHERE user_id=?`,
        [user_id]
    );
    return result;
}

module.exports={
    insertCategory,
    fetchCategoryByName,
    fetchCategories,
    fetchCategoryById,
    modifyCategory,
    removeCategory,
    removeCategoriesByUser
};