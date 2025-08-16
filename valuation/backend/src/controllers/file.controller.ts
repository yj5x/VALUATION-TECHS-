import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/file.service';
import { logger } from '../utils/logger';

export const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    // @ts-ignore
    const files = req.files as Express.Multer.File[];
    const uploadedFiles = await FileService.uploadFiles(files, userId);
    res.status(201).json(uploadedFiles);
  } catch (error) {
    next(error);
  }
};

export const getFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const files = await FileService.getFilesByUserId(userId);
    res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};

export const getFileById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const file = await FileService.getFileById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const success = await FileService.deleteFile(id);
    if (!success) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const triggerAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;
    const job = await FileService.triggerAnalysis(id, userId);
    res.status(202).json({ message: 'Analysis job started', jobId: job.id });
  } catch (error) {
    next(error);
  }
};

