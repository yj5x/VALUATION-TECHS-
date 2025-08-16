import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { uploadPDF, handleUploadError } from "../middleware/upload.middleware";
import { uploadFiles, getFiles, getFileById, deleteFile, triggerAnalysis } from "../controllers/file.controller";

const router = Router();

router.post(
  "/upload",
  protect,
  uploadPDF,
  handleUploadError,
  uploadFiles
);
router.get("/", protect, getFiles);
router.get("/:id", protect, getFileById);
router.delete("/:id", protect, deleteFile);
router.post("/:id/analyze", protect, triggerAnalysis);

export default router;

