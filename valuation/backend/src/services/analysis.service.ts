import { FileModel } from "../models/file.model";
import { ReportModel } from "../models/report.model";
import { GeminiService } from "./gemini.service";
import { logger } from "../utils/logger";
import { getRedis } from "../config/redis";
import { v4 as uuidv4 } from "uuid";
import Bull from "bull";
import { S3Service } from "./s3.service";
import { ANALYSIS_SCHEMA } from "../utils/constants";

interface AnalysisJobData {
  fileId: string;
  userId: string;
}

const analysisQueue = new Bull<AnalysisJobData>("analysisQueue", {
  redis: {
    port: parseInt(process.env.REDIS_PORT || "6379"),
    host: process.env.REDIS_HOST || "localhost",
  },
});

analysisQueue.process(5, async (job) => {
  const { fileId, userId } = job.data;
  logger.info(`Processing analysis job for file: ${fileId}`);

  try {
    const file = await FileModel.findById(fileId);
    if (!file) {
      throw new Error(`File with ID ${fileId} not found.`);
    }

    // Download file from S3
    const fileBuffer = await S3Service.getFile(file.s3_key);

    const geminiService = new GeminiService();
    const analysisResults = await geminiService.analyzeDocument(
      fileBuffer.toString("utf8")
    );

    // Save analysis results to report model
    const newReport = await ReportModel.create({
      file_id: file.id,
      user_id: userId,
      report_number: Math.floor(Math.random() * 1000000), // Placeholder
      analysis_results: analysisResults,
      compliance_score: analysisResults.compliance_score || 0, // Assuming schema has this
    });

    await FileModel.updateStatus(fileId, "completed");
    logger.info(`Analysis for file ${fileId} completed and report ${newReport.id} created.`);
    return newReport;
  } catch (error) {
    logger.error(`Error processing analysis job for file ${fileId}:`, error);
    await FileModel.updateStatus(fileId, "failed");
    throw error;
  }
});

export class AnalysisService {
  static async startAnalysis(fileIds: string[], userId: string) {
    const jobs = [];
    for (const fileId of fileIds) {
      const job = await analysisQueue.add({ fileId, userId });
      jobs.push(job);
    }
    return jobs[0]; // Return the first job for status tracking
  }

  static async getAnalysisStatus(jobId: string) {
    const job = await analysisQueue.getJob(jobId);
    if (!job) {
      return "not_found";
    }
    return job.getState();
  }

  static async getAnalysisResults(jobId: string) {
    const job = await analysisQueue.getJob(jobId);
    if (!job) {
      throw new Error("Analysis job not found.");
    }
    const state = await job.getState();
    if (state === "completed") {
      return job.returnvalue;
    } else if (state === "failed") {
      throw new Error(job.failedReason || "Analysis job failed.");
    } else {
      throw new Error(`Analysis job is ${state}. Results not yet available.`);
    }
  }
}

