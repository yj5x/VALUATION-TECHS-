import * as XLSX from "xlsx";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ReportModel } from "../models/report.model";
import { logger } from "../utils/logger";

export class ExportService {
  static async exportReportToExcel(reportId: string): Promise<string> {
    const report = await ReportModel.findById(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    const data = [
      ["Report ID", report.id],
      ["File ID", report.file_id],
      ["User ID", report.user_id],
      ["Report Number", report.report_number],
      ["Compliance Score", report.compliance_score],
      ["Created At", report.created_at.toISOString()],
      ["Updated At", report.updated_at.toISOString()],
    ];

    // Add analysis results dynamically
    if (report.analysis_results) {
      for (const key in report.analysis_results) {
        data.push([key, JSON.stringify(report.analysis_results[key])]);
      }
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report Details");

    const filePath = path.join(
      process.cwd(),
      `tmp/report_export_${uuidv4()}.xlsx`
    );
    XLSX.writeFile(wb, filePath);
    logger.info(`Report ${reportId} exported to ${filePath}`);
    return filePath;
  }

  static async exportReportsToExcel(reportIds: string[]): Promise<string> {
    const reports = await Promise.all(
      reportIds.map((id) => ReportModel.findById(id))
    );
    const validReports = reports.filter((r) => r !== null);

    if (validReports.length === 0) {
      throw new Error("No valid reports found for batch export");
    }

    const ws = XLSX.utils.json_to_sheet(validReports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Batch Reports");

    const filePath = path.join(
      process.cwd(),
      `tmp/batch_reports_export_${uuidv4()}.xlsx`
    );
    XLSX.writeFile(wb, filePath);
    logger.info(`Batch reports exported to ${filePath}`);
    return filePath;
  }
}

