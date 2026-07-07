import pool from "../databases/dbConfig.js";

export const createQuizBatch = async (quizArray) => {
  const insertedQuizzes = [];

  for (const q of quizArray) {
    const result = await pool.query(
      `INSERT INTO learning.quiz (id, material_id, tipe_soal, pertanyaan, kunci_jawaban, pembahasan)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        q.id,
        q.material_id,
        q.tipe_soal,
        q.pertanyaan,
        q.kunci_jawaban,
        q.pembahasan,
      ],
    );
    insertedQuizzes.push(result.rows[0]);
  }

  return insertedQuizzes;
};

export const findQuizByMaterialId = async (materialId) => {
  const result = await pool.query(
    `SELECT id, material_id, tipe_soal, pertanyaan, kunci_jawaban, pembahasan, created_at 
     FROM learning.quiz 
     WHERE material_id = $1 
     ORDER BY created_at ASC`,
    [materialId],
  );

  return result.rows;
};
