import {
  createTask,
  updateTask,
  findTaskFinishByUser,
  findTaskNotFinishByUser,
  deleteTask,
} from "../models/taskModel.js";
import { formatDateForFE } from "../utils/dateFormatter.js";
import { v4 as uuidv4 } from "uuid";

export const addTask = async (req, res) => {
  try {
    const {
      id,
      user_id,
      task_name,
      deadline_date,
      deadline_time,
      progres,
      prioritas,
      status,
    } = req.body;
    const userId = req.user.id;

    const today = new Date();
    const combinedDeadline = new Date(`${deadline_date}T${deadline_time}:00`);
    combinedDeadline.setHours(combinedDeadline.getHours() - 7);

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

    if (status === "selesai" && progres !== 100) {
      return res.status(400).json({
        status: "failed",
        message: "Status can only be 'completed' if progress is 100%",
      });
    }

    const taskData = await createTask({
      id: uuidv4(),
      user_id: userId,
      task_name,
      deadline: combinedDeadline,
      progres,
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
    const {
      task_name,
      deadline_date,
      deadline_time,
      progres,
      prioritas,
      status,
    } = req.body;
    const userId = req.user.id;
    const id = req.params.id;

    let combinedDeadline;

    if (deadline_date !== undefined || deadline_time !== undefined) {
      if (!deadline_date || !deadline_time) {
        return res.status(400).json({
          status: "failed",
          message: "Deadline date and deadline time must be provided together",
        });
      }

      combinedDeadline = new Date(`${deadline_date}T${deadline_time}:00`);
      combinedDeadline.setHours(combinedDeadline.getHours() - 7);

      if (isNaN(combinedDeadline.getTime())) {
        return res.status(400).json({
          status: "failed",
          message: "Format tanggal/waktu salah",
        });
      }

      if (combinedDeadline < new Date()) {
        return res.status(400).json({
          status: "failed",
          message: "The deadline cannot be smaller than the current time",
        });
      }
    }

    const data = Object.fromEntries(
      Object.entries({
        task_name,
        deadline: combinedDeadline,
        progres,
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
    console.error("Error while updating task:", error);
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

    const formattedData = (tasks || []).map((taskItem) => {
      const { deadline, ...sisaData } = taskItem;
      return {
        ...sisaData,
        deadline: formatDateForFE(deadline),
      };
    });

    return res.status(200).json({
      status: "success",
      data: {
        tasks: formattedData || [],
      },
    });
  } catch (error) {
    console.error("Getting task error: ", error);
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

    const formattedData = (tasks || []).map((taskItem) => {
      const { deadline, ...sisaData } = taskItem;
      return {
        ...sisaData,
        deadline: formatDateForFE(deadline),
      };
    });

    return res.status(200).json({
      status: "success",
      data: {
        tasks: formattedData || [],
      },
    });
  } catch (error) {
    console.error("Getting task error: ", error);
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
    console.error("Error while deleting task: ", error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};
