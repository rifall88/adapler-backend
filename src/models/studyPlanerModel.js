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
    `SELECT id, user_id, tanggal, detail_jadwal
    FROM analytics.study_planer
    WHERE user_id = $1`,
    [userId],
  );

  return result.rows;
};

export const findDetailStudyPlanner = async (id, userId) => {
  const result = await pool.query(
    `SELECT id, user_id, tanggal, detail_jadwal
    FROM analytics.study_planer
    WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );

  return result.rows[0];
};

export const updateStudyPlanner = async (id, data, userId) => {
  const allowedColumns = ["detail_jadwal"];
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    if (allowedColumns.includes(key)) {
      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index++;
    }
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);
  values.push(userId);

  const result = await pool.query(
    `UPDATE analytics.study_planer
    SET ${fields.join(", ")}
    WHERE id = $${index} AND user_id = $${index + 1}
    RETURNING *`,
    values,
  );

  return result.rows[0];
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
