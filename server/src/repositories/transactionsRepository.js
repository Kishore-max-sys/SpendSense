const pool=require("../config/db");

const insertTransaction=async (user_id,category_id,amount,note,transaction_date) =>{
    const [result]=await pool.execute(
        `INSERT INTO transactions(user_id,category_id,amount,note,transaction_date)
        VALUES(?,?,?,?,?)`,
        [user_id,category_id,amount,note,transaction_date]
    );
    return result;
}

const fetchTransactions=async (user_id) =>{
    const [rows]=await pool.execute(
        `SELECT t.id,t.category_id,c.name,c.type,t.amount,t.note,t.transaction_date
        FROM transactions t
        JOIN categories c
            ON c.id=t.category_id
        WHERE t.user_id=?`,
        [user_id]
    );
    return rows;
}

const fetchTransactionById=async (transaction_id,user_id) =>{
    const [rows]=await pool.execute(
        `SELECT *
        FROM transactions
        WHERE id=? AND user_id=?`,
        [transaction_id,user_id]
    );
    return rows[0];
}

const modifyTransaction=async (transaction_id,user_id,category_id,amount,note,transaction_date) =>{
    const [result]=await pool.execute(
        `UPDATE transactions
        SET category_id=?,
            amount=?,
            note=?,
            transaction_date=?
        WHERE id=? AND user_id=?`,
        [category_id,amount,note,transaction_date,transaction_id,user_id]
    );
    return result;
}

const removeTransaction=async (transaction_id,user_id) =>{
    const [result]=await pool.execute(
        `DELETE FROM transactions
        WHERE id=? AND user_id=?`,
        [transaction_id,user_id]
    );
    return result;
}

const fetchTransactionsBetweenDates=async (user_id,start_date,end_date) =>{
    const [rows]=await pool.execute(
        `SELECT t.id,c.name,c.type,t.amount,t.note,t.transaction_date
        FROM transactions t
        JOIN categories c
            ON c.id=t.category_id
        WHERE t.user_id=? AND
            t.transaction_date BETWEEN ? AND ?`,
        [user_id,start_date,end_date]
    );
    return rows;
}

const fetchTransactionsByCategory=async (user_id,category_id) =>{
    const [rows]=await pool.execute(
        `SELECT t.id,c.name,c.type,t.amount,t.note,t.transaction_date
        FROM transactions t
        JOIN categories c
            ON c.id=t.category_id
        WHERE t.user_id=? AND
            t.category_id=?`,
        [user_id,category_id]
    );
    return rows;
}

const fetchTransactionsBetweenDatesByCategory=async (user_id,category_id,start_date,end_date) => {
    const [rows]=await pool.execute(
        `SELECT t.id,c.name,c.type,t.amount,t.note,t.transaction_date
        FROM transactions t
        JOIN categories c
            ON c.id=t.category_id
        WHERE t.user_id=? AND
            t.category_id=? AND
            t.transaction_date BETWEEN ? AND ?`,
        [user_id,category_id,start_date,end_date]
    );
    return rows;
}

const removeTransactionsByUser=async (user_id) =>{
    const result=await pool.execute(
        `DELETE FROM transactions
        WHERE user_id=?`,
        [user_id]
    );
    return result;
}

const fetchTransactionsByStartDate=async (user_id,start_date) =>{
    const [rows]=await pool.execute(
        `SELECT t.id,c.name,c.type,t.amount,t.note,t.transaction_date
        FROM transactions t
        JOIN categories c
            ON c.id=t.category_id
        WHERE t.user_id=? AND
            t.transaction_date >= ?`,
        [user_id,start_date]
    );
    return rows;
}

const fetchTransactionsByStartDateByCategory=async (user_id,category_id,start_date) =>{
    const [rows]=await pool.execute(
        `SELECT t.id,c.name,c.type,t.amount,t.note,t.transaction_date
        FROM transactions t
        JOIN categories c
            ON c.id=t.category_id
        WHERE t.user_id=? AND
            t.category_id=? AND
            t.transaction_date >= ?`,
        [user_id,category_id,start_date]
    );
    return rows;
}

const fetchTransactionsByEndDate=async (user_id,end_date) =>{
    const [rows]=await pool.execute(
        `SELECT t.id,c.name,c.type,t.amount,t.note,t.transaction_date
        FROM transactions t
        JOIN categories c
            ON c.id=t.category_id
        WHERE t.user_id=? AND
            t.transaction_date <= ?`,
        [user_id,end_date]
    );
    return rows;
}

const fetchTransactionsByEndDateByCategory=async (user_id,category_id,end_date) =>{
    const [rows]=await pool.execute(
        `SELECT t.id,c.name,c.type,t.amount,t.note,t.transaction_date
        FROM transactions t
        JOIN categories c
            ON c.id=t.category_id
        WHERE t.user_id=? AND
            t.category_id=? AND
            t.transaction_date <= ?`,
        [user_id,category_id,end_date]
    );
    return rows;
}

module.exports={
    insertTransaction,
    fetchTransactions,
    modifyTransaction,
    fetchTransactionById,
    removeTransaction,
    fetchTransactionsBetweenDates,
    fetchTransactionsByCategory,
    fetchTransactionsBetweenDatesByCategory,
    removeTransactionsByUser,
    fetchTransactionsByStartDate,
    fetchTransactionsByStartDateByCategory,
    fetchTransactionsByEndDate,
    fetchTransactionsByEndDateByCategory
};