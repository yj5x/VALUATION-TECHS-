import { UserModel, CreateUserData } from "../models/user.model";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/auth.types";

export class AuthService {
  static async register(userData: CreateUserData) {
    const user = await UserModel.create(userData);
    const token = this.generateToken({ id: user.id, email: user.email });
    const refreshToken = this.generateRefreshToken({ id: user.id, email: user.email });
    return { user, token, refreshToken };
  }

  static async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email);
    if (!user || !(await UserModel.verifyPassword(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    const token = this.generateToken({ id: user.id, email: user.email });
    const refreshToken = this.generateRefreshToken({ id: user.id, email: user.email });
    return { user, token, refreshToken };
  }

  static async updateProfile(userId: string, userData: Partial<CreateUserData>) {
    const updatedUser = await UserModel.update(userId, userData);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  }

  static async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }
      const newAccessToken = this.generateToken({ id: user.id, email: user.email });
      const newRefreshToken = this.generateRefreshToken({ id: user.id, email: user.email });
      return { user, token: newAccessToken, newRefreshToken };
    } catch (error) {
      logger.error("Refresh token error:", error);
      throw new Error("Invalid or expired refresh token");
    }
  }

  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
  }
}

