import AWS from "aws-sdk";
import { logger } from "../utils/logger";

export class S3Service {
  private static s3: AWS.S3;

  static initialize() {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET || !process.env.AWS_REGION) {
      logger.warn("AWS S3 credentials or bucket/region not fully configured. S3 operations may fail.");
      return;
    }
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.s3 = new AWS.S3();
    logger.info("AWS S3 service initialized.");
  }

  static async uploadFile(fileBuffer: Buffer, key: string, contentType: string): Promise<string> {
    if (!this.s3) {
      throw new Error("S3 service not initialized. Check AWS configurations.");
    }
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    };

    try {
      const data = await this.s3.upload(params).promise();
      logger.info(`File uploaded successfully to S3: ${data.Location}`);
      return data.Location;
    } catch (error) {
      logger.error("Error uploading file to S3:", error);
      throw new Error("Failed to upload file to S3.");
    }
  }

  static async getFile(key: string): Promise<Buffer> {
    if (!this.s3) {
      throw new Error("S3 service not initialized. Check AWS configurations.");
    }
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      if (!data.Body) {
        throw new Error("File not found in S3 or body is empty.");
      }
      return data.Body as Buffer;
    } catch (error) {
      logger.error("Error getting file from S3:", error);
      throw new Error("Failed to retrieve file from S3.");
    }
  }

  static async deleteFile(key: string): Promise<void> {
    if (!this.s3) {
      throw new Error("S3 service not initialized. Check AWS configurations.");
    }
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    };

    try {
      await this.s3.deleteObject(params).promise();
      logger.info(`File ${key} deleted successfully from S3.`);
    } catch (error) {
      logger.error("Error deleting file from S3:", error);
      throw new Error("Failed to delete file from S3.");
    }
  }
}

