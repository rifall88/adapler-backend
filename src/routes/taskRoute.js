import express from "express";
import {
  addTask,
  putTask,
  getTaskFinishedByUserId,
  getTaskNotFinishedByUserId,
  deleteTaskById,
} from "../controllers/taskController.js";
import {
  createTaskValidation,
  updateTaskValidation,
} from "../validations/taskValidation.js";
import { paramsValidation } from "../validations/paramsValidation.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, validateRequest(createTaskValidation), addTask);
router.get("/finish", authenticate, getTaskFinishedByUserId);
router.get("/not-finish", authenticate, getTaskNotFinishedByUserId);
router.put(
  "/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  validateRequest(updateTaskValidation),
  putTask,
);
router.delete(
  "/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  deleteTaskById,
);

export default router;
