import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { startAnalysis, getAnalysisStatus, getAnalysisResults } from "../controllers/analysis.controller";

const router = Router();

router.post("/start", protect, startAnalysis);
router.get("/status/:jobId", protect, getAnalysisStatus);
router.get("/results/:jobId", protect, getAnalysisResults);

export default router;

