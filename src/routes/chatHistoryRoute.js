import express from "express";
import {
  generateChatHistory,
  getChatHistoryByUserId,
  deleteChatHistoryById,
} from "../controllers/chatHistoryController.js";
import { createChatHistoryValidation } from "../validations/chatHistoryValidation.js";
import { paramsValidation } from "../validations/paramsValidation.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validateRequest(createChatHistoryValidation),
  generateChatHistory,
);
router.get("/", authenticate, getChatHistoryByUserId);
router.delete(
  "/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  deleteChatHistoryById,
);

export default router;
