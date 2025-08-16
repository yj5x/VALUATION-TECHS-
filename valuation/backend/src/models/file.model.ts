import { getDB } from '../config/database';
import { logger } from '../utils/logger';

export interface File {
  id: string;
  user_id: string;
  original_name: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_key: string;
  upload_date: Date;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
}

export interface CreateFileData {
  user_id: string;
  original_name: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_key: string;
}

export class FileModel {
  static async create(fileData: CreateFileData): Promise<File> {
    const db = getDB();
    const query = `
      INSERT INTO files (user_id, original_name, file_name, file_type, file_size, s3_key)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, original_name, file_name, file_type, file_size, s3_key, upload_date, status
    `;
    const values = [
      fileData.user_id,
      fileData.original_name,
      fileData.file_name,
      fileData.file_type,
      fileData.file_size,
      fileData.s3_key,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id: string): Promise<File | null> {
    const db = getDB();
    const query = `
      SELECT id, user_id, original_name, file_name, file_type, file_size, s3_key, upload_date, status
      FROM files
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  static async updateStatus(id: string, status: File['status']): Promise<File | null> {
    const db = getDB();
    const query = `
      UPDATE files
      SET status = $1, upload_date = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, user_id, original_name, file_name, file_type, file_size, s3_key, upload_date, status
    `;
    const result = await db.query(query, [status, id]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId: string): Promise<File[]> {
    const db = getDB();
    const query = `
      SELECT id, user_id, original_name, file_name, file_type, file_size, s3_key, upload_date, status
      FROM files
      WHERE user_id = $1
      ORDER BY upload_date DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDB();
    const query = `
      DELETE FROM files
      WHERE id = $1
      RETURNING id
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }
}

