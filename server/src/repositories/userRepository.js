const pool=require("../config/db");
const findUserByEmail=async (email)=>{
    const [rows]=await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
}

const fetchUserById=async (user_id) =>{
    const [rows]=await pool.execute(
        `SELECT * 
        FROM users
        WHERE id=?`,
        [user_id]
    );
    return rows[0];
}

const createUser=async (name,email,hashedPassword) =>{
    const [result]=await pool.execute(
        `INSERT INTO users(name,email,password)
        VALUES(?,?,?)`,
        [name,email,hashedPassword]
    );
    return [result];
}

const removeUser=async (user_id) =>{
    const [result]=await pool.execute(
        `DELETE FROM users
        WHERE id=?`,
        [user_id]
    );
    return result;
}

const modifyUser=async(user_id,newName,newEmail) =>{
    const [result]=await pool.execute(
        `UPDATE users
        SET name=?,email=?
        WHERE id=?`,
        [newName,newEmail,user_id]
    );
    return result;
}

const modifyPassword=async(user_id,newHashedPassword) =>{
    const [result]=await pool.execute(
        `UPDATE users
        SET password=?
        WHERE id=?`,
        [newHashedPassword,user_id]
    );
    return result;
}

module.exports={
    findUserByEmail,
    fetchUserById,
    createUser,
    removeUser,
    modifyUser,
    modifyPassword
};