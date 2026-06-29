import express from "express";
import { login, googleLogin } from "../controllers/authController.js";
import {
  loginValidation,
  googleLoginValidation,
} from "../validations/authValidation.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post("/", validateRequest(loginValidation), login);
router.post(
  "/google-login",
  validateRequest(googleLoginValidation),
  googleLogin,
);

export default router;
