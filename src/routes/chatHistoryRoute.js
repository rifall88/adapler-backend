import express from "express";
import {
  generateChatHistory,
  getChatHistoryByUserId,
} from "../controllers/chatHistoryController.js";
import { createChatHistoryValidation } from "../validations/chatHistoryValidation.js";
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

export default router;
