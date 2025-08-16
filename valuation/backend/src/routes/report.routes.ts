import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getReports, getReportById, updateReport, deleteReport, exportReport, batchExportReports } from "../controllers/report.controller";

const router = Router();

router.get("/", protect, getReports);
router.get("/:id", protect, getReportById);
router.put("/:id", protect, updateReport);
router.delete("/:id", protect, deleteReport);
router.get("/:id/export", protect, exportReport);
router.post("/batch-export", protect, batchExportReports);

export default router;

