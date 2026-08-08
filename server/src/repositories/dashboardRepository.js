const pool=require("../config/db");

const fetchTotalIncome=async (user_id) =>{
    const [result]=await pool.execute(
        `SELECT COALESCE(SUM(t.amount),0) AS total_income
        FROM transactions t
        JOIN categories c
            ON t.category_id=c.id
        WHERE t.user_id=? AND c.type=?`,
        [user_id,"income"]
    );
    return result[0];
};

const fetchTotalExpense=async (user_id) =>{
    const [result]=await pool.execute(
        `SELECT COALESCE(SUM(t.amount),0) AS total_expense
        FROM transactions t
        JOIN categories c
            ON t.category_id=c.id
        WHERE t.user_id=? AND c.type=?`,
        [user_id,"expense"]
    );
    return result[0];
};

const fetchCurrentBalance=async (user_id) =>{
    const [result]=await pool.execute(
        `SELECT COALESCE(
            SUM(
                CASE 
                    WHEN c.type=? 
                    THEN t.amount 
                    END
            ),0
        ) AS total_income , 
        COALESCE(
            SUM(
                CASE 
                    WHEN c.type=? 
                    THEN t.amount 
                    END
            ),0
        ) AS total_expense
        FROM transactions t
        JOIN categories c
            ON t.category_id=c.id
        WHERE t.user_id=?`,
        ["income","expense",user_id]
    );
    return result[0];
}

const fetchExpensesByCategory=async (user_id) =>{
    const [rows]=await pool.execute(
        `SELECT c.id AS category_id,c.name AS name,SUM(t.amount) AS expense
        FROM transactions t
        JOIN categories c
	        ON t.category_id=c.id
        WHERE t.user_id=? AND c.type=?
        GROUP BY c.id
        ORDER BY expense DESC`,
        [user_id,"expense"]
    );
    return rows
}

const fetchMonthlySummary=async (user_id) =>{
    const [rows]=await pool.execute(
        `SELECT DATE_FORMAT(t.transaction_date,'%Y-%m') AS date,
                SUM(
                    CASE
                        WHEN c.type=?
                        THEN t.amount
                    END 
                ) AS income,
                SUM(
                    CASE
                        WHEN c.type=?
                        THEN t.amount
                    END
                ) AS expense
        FROM transactions t
        JOIN categories c
            ON c.id=t.category_id
        WHERE t.user_id=?
        GROUP BY DATE_FORMAT(t.transaction_date,'%Y-%m')`,
        ["income","expense",user_id]
    );
    return rows;
}

module.exports={
    fetchTotalIncome,
    fetchTotalExpense,
    fetchCurrentBalance,
    fetchExpensesByCategory,
    fetchMonthlySummary
};