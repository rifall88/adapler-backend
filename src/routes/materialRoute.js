import express from "express";
import multer from "multer";
import {
  processNewMaterial,
  getMaterialUserId,
  getDetailMaterial,
  getDocumentMaterial,
  putMaterial,
  deleteMaterialById,
} from "../controllers/materialController.js";
import { updateMaterialValidation } from "../validations/materialValidation.js";
import { paramsValidation } from "../validations/paramsValidation.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads"),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/vnd.ms-excel",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Format salah! File harus berupa PDF, DOCX, Excel, CSV, atau Gambar (PNG/JPG/WEBP)",
        ),
        false,
      );
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    upload.single("document")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: "failed",
          message: err.message,
        });
      }
      next();
    });
  },
  processNewMaterial,
);
router.get("/", authenticate, getMaterialUserId);
router.get(
  "/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  getDetailMaterial,
);
router.get(
  "/document/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  getDocumentMaterial,
);
router.put(
  "/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  validateRequest(updateMaterialValidation),
  putMaterial,
);
router.delete(
  "/:id",
  authenticate,
  validateRequest(paramsValidation, "params"),
  deleteMaterialById,
);

export default router;
