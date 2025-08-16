import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { logger } from '../utils/logger';

export const startAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileIds } = req.body;
    // @ts-ignore
    const userId = req.user.id;
    const job = await AnalysisService.startAnalysis(fileIds, userId);
    res.status(202).json({ message: 'Analysis job started', jobId: job.id });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const status = await AnalysisService.getAnalysisStatus(jobId);
    res.status(200).json({ jobId, status });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const results = await AnalysisService.getAnalysisResults(jobId);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

