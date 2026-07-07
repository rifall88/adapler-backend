import express from "express";
import { generateKuis, getSoalKuis } from "../controllers/quizController.js";
import { materialIdValidation } from "../validations/paramsValidation.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validateRequest(materialIdValidation),
  generateKuis,
);
router.get(
  "/:materialId",
  authenticate,
  validateRequest(materialIdValidation, "params"),
  getSoalKuis,
);

export default router;
