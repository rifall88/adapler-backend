import pool from "../databases/dbConfig.js";

export const createChatHistory = async (data) => {
  const { id, user_id, role, pesan } = data;

  const result = await pool.query(
    `INSERT INTO learning.chat_history (id, user_id, role, pesan)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
    [id, user_id, role, pesan],
  );

  return result.rows[0];
};

export const findChatHistoryByUser = async (userId) => {
  const result = await pool.query(
    `SELECT role, pesan 
     FROM (
       SELECT role, pesan, created_at 
       FROM learning.chat_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 15
     ) AS subquery
     ORDER BY created_at ASC`,
    [userId],
  );

  return result.rows;
};

export const findChatHistory = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, role, pesan FROM learning.chat_history
    WHERE user_id = $1`,
    [userId],
  );

  return result.rows;
};

export const deleteChatHistory = async (id, userId) => {
  const result = await pool.query(
    `DELETE FROM learning.chat_history
    WHERE id = $1 AND user_id = $2
    RETURNING *`,
    [id, userId],
  );

  return result.rows[0];
};
