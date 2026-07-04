import pool from "../databases/dbConfig.js";

export const createTask = async (data) => {
  const { id, user_id, task_name, deadline, progres, prioritas, status } = data;

  const result = await pool.query(
    `INSERT INTO task_management.task (id, user_id, task_name, deadline, progres, prioritas, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING*`,
    [id, user_id, task_name, deadline, progres, prioritas, status],
  );

  return result.rows[0];
};

export const updateTask = async (id, data, userId) => {
  const allowedColumns = [
    "task_name",
    "deadline",
    "progres",
    "prioritas",
    "status",
  ];
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
    `UPDATE task_management.task
    SET ${fields.join(", ")}
    WHERE id = $${index} AND user_id = $${index + 1}
    RETURNING *`,
    values,
  );

  return result.rows[0];
};

export const findTaskNotFinishByUser = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, task_name, deadline, progres, 
    prioritas, status FROM task_management.task
    WHERE user_id = $1 AND status = 'belum_selesai'`,
    [userId],
  );
  return result.rows;
};

export const findTaskFinishByUser = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, task_name, deadline, progres, 
    prioritas, status FROM task_management.task
    WHERE user_id = $1 AND status = 'selesai'`,
    [userId],
  );
  return result.rows;
};

export const deleteTask = async (id, userId) => {
  const result = await pool.query(
    `DELETE FROM task_management.task
    WHERE id = $1 AND user_id = $2
    RETURNING *`,
    [id, userId],
  );

  return result.rows[0];
};
