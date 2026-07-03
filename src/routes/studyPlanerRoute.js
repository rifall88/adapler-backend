import express from "express";
import {
  generateStudyPlanner,
  getStudyPlannerByUserId,
  deleteStudyPlannerById,
} from "../controllers/studyPlanerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, generateStudyPlanner);
router.get("/", authenticate, getStudyPlannerByUserId);
router.delete("/:id", authenticate, deleteStudyPlannerById);

export default router;
