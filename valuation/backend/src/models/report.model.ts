import { getDB } from '../config/database';

export interface Report {
  id: string;
  file_id: string;
  user_id: string;
  report_number: number;
  analysis_results: any; // JSONB type
  compliance_score: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateReportData {
  file_id: string;
  user_id: string;
  report_number: number;
  analysis_results: any;
  compliance_score: number;
}

export class ReportModel {
  static async create(reportData: CreateReportData): Promise<Report> {
    const db = getDB();
    const query = `
      INSERT INTO reports (file_id, user_id, report_number, analysis_results, compliance_score)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, file_id, user_id, report_number, analysis_results, compliance_score, created_at, updated_at
    `;
    const values = [
      reportData.file_id,
      reportData.user_id,
      reportData.report_number,
      reportData.analysis_results,
      reportData.compliance_score,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id: string): Promise<Report | null> {
    const db = getDB();
    const query = `
      SELECT id, file_id, user_id, report_number, analysis_results, compliance_score, created_at, updated_at
      FROM reports
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId: string): Promise<Report[]> {
    const db = getDB();
    const query = `
      SELECT id, file_id, user_id, report_number, analysis_results, compliance_score, created_at, updated_at
      FROM reports
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async update(id: string, updateData: Partial<CreateReportData>): Promise<Report | null> {
    const db = getDB();
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE reports
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, file_id, user_id, report_number, analysis_results, compliance_score, created_at, updated_at
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDB();
    const query = `
      DELETE FROM reports
      WHERE id = $1
      RETURNING id
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }
}

