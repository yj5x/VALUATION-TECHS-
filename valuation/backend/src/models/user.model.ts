import { getDB } from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  license_number?: string;
  membership_category?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  license_number?: string;
  membership_category?: string;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const db = getDB();
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const query = `
      INSERT INTO users (email, password, name, license_number, membership_category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, license_number, membership_category, created_at, updated_at, is_active
    `;

    const values = [
      userData.email,
      hashedPassword,
      userData.name,
      userData.license_number,
      userData.membership_category,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<(User & { password: string }) | null> {
    const db = getDB();
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const db = getDB();
    const query = `
      SELECT id, email, name, license_number, membership_category, created_at, updated_at, is_active 
      FROM users WHERE id = $1 AND is_active = true
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id: string, userData: Partial<CreateUserData>): Promise<User | null> {
    const db = getDB();
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'password') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      fields.push(`password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, name, license_number, membership_category, created_at, updated_at, is_active
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

