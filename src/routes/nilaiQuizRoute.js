import express from "express";
import {
  submitKuisDanHitungNilai,
  getNilaiKuis,
} from "../controllers/nilaiQuizController.js";
import { submitKuisValidation } from "../validations/nilaiQuizValidation.js";
import { materialIdValidation } from "../validations/paramsValidation.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/:materialId",
  authenticate,
  validateRequest(materialIdValidation, "params"),
  validateRequest(submitKuisValidation),
  submitKuisDanHitungNilai,
);
router.get(
  "/:materialId",
  authenticate,
  validateRequest(materialIdValidation, "params"),
  getNilaiKuis,
);

export default router;
