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
  deleteStudyPlannerValidation,
} from "../validations/studyPlanerValidations.js";
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
router.get("/:id", authenticate, getStudyPlannerById);
router.put("/:id", authenticate, putStudyPlanner);
router.delete(
  "/:id",
  authenticate,
  validateRequest(deleteStudyPlannerValidation, "params"),
  deleteStudyPlannerById,
);

export default router;
