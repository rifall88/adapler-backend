import {
  createTask,
  updateTask,
  findTaskFinishByUser,
  findTaskNotFinishByUser,
  deleteTask,
} from "../models/taskModel.js";
import { v4 as uuidv4 } from "uuid";

export const addTask = async (req, res) => {
  try {
    const {
      id,
      user_id,
      task_name,
      deadline_date,
      deadline_time,
      prioritas,
      status,
    } = req.body;
    const userId = req.user.id;

    const today = new Date();
    const combinedDeadline = new Date(`${deadline_date}T${deadline_time}:00`);

    if (isNaN(combinedDeadline.getTime())) {
      return res
        .status(400)
        .json({ status: "failed", message: "Format tanggal/waktu salah" });
    }

    if (combinedDeadline < today) {
      return res.status(400).json({
        status: "failed",
        message: "The deadline cannot be smaller than the current time",
      });
    }

    const taskData = await createTask({
      id: uuidv4(),
      user_id: userId,
      task_name,
      deadline: combinedDeadline,
      prioritas,
      status,
    });
    res.status(201).json({
      status: "success",
      message: "Add task successfull",
      taskData,
    });
  } catch (error) {
    console.error("Add task rrror:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const putTask = async (req, res) => {
  try {
    const { task_name, deadline_date, deadline_time, prioritas, status } =
      req.body;
    const userId = req.user.id;
    const id = req.params.id;

    const today = new Date();
    const combinedDeadline = new Date(`${deadline_date}T${deadline_time}:00`);

    if (isNaN(combinedDeadline.getTime())) {
      return res
        .status(400)
        .json({ status: "failed", message: "Format tanggal/waktu salah" });
    }

    if (combinedDeadline < today) {
      return res.status(400).json({
        status: "failed",
        message: "The deadline cannot be smaller than the current time",
      });
    }

    const data = Object.fromEntries(
      Object.entries({
        task_name,
        deadline: combinedDeadline,
        prioritas,
        status,
      }).filter(([_, value]) => {
        return typeof value === "string"
          ? value.trim() !== ""
          : value !== undefined;
      }),
    );

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "No valid data to update",
      });
    }

    const updatedTask = await updateTask(id, data, userId);

    if (!updatedTask) {
      return res.status(404).json({
        status: "failed",
        message: "Task not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error while updating task:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const getTaskFinishedByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await findTaskFinishByUser(userId);
    return res.status(200).json({
      status: "success",
      data: {
        tasks: tasks || [],
      },
    });
  } catch (error) {
    console.error("Getting task error: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const getTaskNotFinishedByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await findTaskNotFinishByUser(userId);
    return res.status(200).json({
      status: "success",
      data: {
        tasks: tasks || [],
      },
    });
  } catch (error) {
    console.error("Getting task error: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const deleteTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const deletedTasks = await deleteTask(id, userId);

    if (!deletedTasks) {
      return res
        .status(404)
        .json({ status: "failed", message: "Task not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Task deletion successful",
      data: {
        id,
        taskName: deletedTasks.task_name,
      },
    });
  } catch (error) {
    console.error("Error while deleting task: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};
