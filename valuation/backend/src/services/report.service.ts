import { ReportModel } from "../models/report.model";
import { FileModel } from "../models/file.model";
import { logger } from "../utils/logger";
import * as XLSX from "xlsx";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class ReportService {
  static async getReportsByUserId(userId: string) {
    return ReportModel.findByUserId(userId);
  }

  static async getReportById(reportId: string) {
    return ReportModel.findById(reportId);
  }

  static async updateReport(reportId: string, updateData: any) {
    return ReportModel.update(reportId, updateData);
  }

  static async deleteReport(reportId: string) {
    return ReportModel.delete(reportId);
  }

  static async exportReport(reportId: string): Promise<string> {
    const report = await ReportModel.findById(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    const ws = XLSX.utils.json_to_sheet([report]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    const filePath = path.join(
      process.cwd(),
      `tmp/report-${uuidv4()}.xlsx`
    );
    XLSX.writeFile(wb, filePath);
    return filePath;
  }

  static async batchExportReports(reportIds: string[]): Promise<string> {
    const reports = await Promise.all(
      reportIds.map((id) => ReportModel.findById(id))
    );
    const validReports = reports.filter((r) => r !== null);

    if (validReports.length === 0) {
      throw new Error("No valid reports found for export");
    }

    const ws = XLSX.utils.json_to_sheet(validReports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");

    const filePath = path.join(
      process.cwd(),
      `tmp/batch-reports-${uuidv4()}.xlsx`
    );
    XLSX.writeFile(wb, filePath);
    return filePath;
  }
}

