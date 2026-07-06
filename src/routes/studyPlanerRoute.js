import express from "express";
import {
  generateStudyPlanner,
  getStudyPlannerByUserId,
  getStudyPlannerById,
  putStudyPlanner,
  deleteStudyPlannerById,
} from "../controllers/studyPlanerController.js";
import {
  createStudyPlannerValidation,
  updateStudyPlannerValidation,
} from "../validations/studyPlanerValidations.js";
import { paramsValidation } from "../validations/paramsValidation.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validateRequest(createStudyPlannerValidation),
  generateStudyPlanner,
);
router.get("/", authenticate, getStudyPlannerByUserId);
router.get(
  "/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  getStudyPlannerById,
);
router.put(
  "/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  validateRequest(updateStudyPlannerValidation),
  putStudyPlanner,
);
router.delete(
  "/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  deleteStudyPlannerById,
);

export default router;
