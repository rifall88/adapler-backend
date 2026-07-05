import pool from "../databases/dbConfig.js";

export const createMaterial = async (data) => {
  const { id, user_id, nama_file, ringkasan, poin_penting, kata_kunci } = data;

  const result = await pool.query(
    `INSERT INTO analytics.material (id, user_id, nama_file, ringkasan, poin_penting, kata_kunci)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
    [
      id,
      user_id,
      nama_file,
      ringkasan,
      JSON.stringify(poin_penting),
      JSON.stringify(kata_kunci),
    ],
  );

  return result.rows[0];
};

export const findMaterial = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, nama_file, created_at FROM analytics.material
    WHERE user_id = $1`,
    [userId],
  );

  return result.rows;
};

export const findMaterialById = async (id, userId) => {
  const result = await pool.query(
    `SELECT id, user_id, nama_file, ringkasan, poin_penting, 
    kata_kunci, created_at FROM analytics.material
    WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );

  return result.rows[0];
};

export const deleteMaterial = async (id, userId) => {
  const result = await pool.query(
    `DELETE FROM analytics.material
    WHERE id = $1 AND user_id = $2
    RETURNING *`,
    [id, userId],
  );

  return result.rows[0];
};
