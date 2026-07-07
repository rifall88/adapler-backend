import pool from "../databases/dbConfig.js";

export const createQuizResult = async (data) => {
  const { id, user_id, material_id, score } = data;

  const result = await pool.query(
    `INSERT INTO learning.quiz_results (id, user_id, material_id, score)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, user_id, material_id, score],
  );

  return result.rows[0];
};

export const findQuizResult = async (materialId) => {
  const result = await pool.query(
    `SELECT n.id, n.material_id, m.nama_file, n.score
    FROM learning.quiz_results as n
    INNER JOIN analytics.material as m ON n.material_id = m.id
    WHERE n.material_id = $1`,
    [materialId],
  );

  return result.rows[0];
};
