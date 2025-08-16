import { FileModel, CreateFileData } from "../models/file.model";
import { logger } from "../utils/logger";
import { S3Service } from "./s3.service";
import { AnalysisService } from "./analysis.service";
import { v4 as uuidv4 } from "uuid";

export class FileService {
  static async uploadFiles(files: Express.Multer.File[], userId: string) {
    const uploadPromises = files.map((file) =>
      this.processFile(file, userId)
    );
    return Promise.all(uploadPromises);
  }

  private static async processFile(file: Express.Multer.File, userId: string) {
    // Validate PDF
    if (file.mimetype !== "application/pdf") {
      throw new Error("Only PDF files allowed");
    }

    const s3Key = `uploads/${userId}/${uuidv4()}-${file.originalname}`;
    const s3Location = await S3Service.uploadFile(
      file.buffer,
      s3Key,
      file.mimetype
    );

    const fileData: CreateFileData = {
      user_id: userId,
      original_name: file.originalname,
      file_name: file.filename || file.originalname,
      file_type: file.mimetype,
      file_size: file.size,
      s3_key: s3Key,
    };

    const newFile = await FileModel.create(fileData);
    logger.info(`File ${newFile.original_name} uploaded to S3: ${s3Location}`);

    return newFile;
  }

  static async getFilesByUserId(userId: string) {
    return FileModel.findByUserId(userId);
  }

  static async getFileById(fileId: string) {
    return FileModel.findById(fileId);
  }

  static async deleteFile(fileId: string) {
    const file = await FileModel.findById(fileId);
    if (!file) {
      return false;
    }
    await S3Service.deleteFile(file.s3_key);
    return FileModel.delete(fileId);
  }

  static async triggerAnalysis(fileId: string, userId: string) {
    const file = await FileModel.findById(fileId);
    if (!file) {
      throw new Error("File not found");
    }
    // Update file status to processing
    await FileModel.updateStatus(fileId, "processing");
    // Trigger analysis job
    const job = await AnalysisService.startAnalysis([fileId], userId);
    return job;
  }
}

