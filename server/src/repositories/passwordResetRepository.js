const pool=require("../config/db");

const insertResetOTP=async(userId,otp,expiresAt) =>{
    const [result]=await pool.execute(
        `INSERT INTO password_resets(user_id,otp,expires_at)
        VALUES(?,?,?)`,
        [userId,otp,expiresAt]
    );
    return result;
}

const removeResetOTP=async(userId) =>{
        const [result]=await pool.execute(
                `DELETE FROM password_resets
                WHERE user_id=?`,
                [userId]
        )
        return result;
}

const modifyResetOTP=async(userId,otp,expiresAt) =>{
        const [result]=await pool.execute(
                `UPDATE password_resets
                SET otp=?,expires_at=?
                WHERE user_id=?`,
                [otp,expiresAt,userId]
        );
        return result;
}

const findOtpByUserId=async(userId) =>{
        const [rows]=await pool.execute(
                `SELECT *
                FROM password_resets
                WHERE user_id=?`,
                [userId]
        );
        return rows[0];
}

module.exports={
        insertResetOTP,
        removeResetOTP,
        findOtpByUserId,
        modifyResetOTP
}