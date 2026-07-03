import pool from "../databases/dbConfig.js";

export const createStudyPlanner = async (data) => {
  const { id, user_id, tanggal, detail_jadwal } = data;

  const result = await pool.query(
    `INSERT INTO analytics.study_planer (id, user_id, tanggal, detail_jadwal)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
    [id, user_id, tanggal, JSON.stringify(detail_jadwal)],
  );

  return result.rows[0];
};

export const findStudyPlanner = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM analytics.study_planer
    WHERE user_id = $1`,
    [userId],
  );

  return result.rows;
};

export const deleteStudyPlanner = async (id, userId) => {
  const result = await pool.query(
    `DELETE FROM analytics.study_planer
    WHERE id = $1 AND user_id = $2
    RETURNING *`,
    [id, userId],
  );

  return result.rows[0];
};
