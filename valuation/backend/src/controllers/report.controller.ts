import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { logger } from '../utils/logger';

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const reports = await ReportService.getReportsByUserId(userId);
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const report = await ReportService.getReportById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedReport = await ReportService.updateReport(id, req.body);
    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const success = await ReportService.deleteReport(id);
    if (!success) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const exportReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const filePath = await ReportService.exportReport(id);
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};

export const batchExportReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportIds } = req.body;
    const filePath = await ReportService.batchExportReports(reportIds);
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};

