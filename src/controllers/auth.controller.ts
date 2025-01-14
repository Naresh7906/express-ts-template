import { NextFunction, Request, Response } from "express";
import { MessageFormatter } from "../utils/messageFormatter.util";
import { JWTUtil } from "../utils/jwt.util";
import { User, IUser } from "../models/user.model";
import { logger } from "../utils/logger.util";
import bcrypt from 'bcrypt';
import { Document } from 'mongoose';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send(MessageFormatter.error("Registration failed", 400, "Email already exists"));
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = await User.create({
        email,
        password: hashedPassword,
        name
      }) as IUser & Document;

      // Generate token
      const token = await JWTUtil.generateToken({ userId: user._id.toString(), email: user.email });
      
      res.status(201).send(MessageFormatter.success("User registered successfully", { token }));
    } catch (error: any) {
      logger.error('Registration error:', error);
      res.status(500).send(MessageFormatter.error("Registration failed", 500, error.message || "Internal server error"));
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email }) as IUser & Document;
      if (!user) {
        return res.status(401).send(MessageFormatter.error("Login failed", 401, "Invalid credentials"));
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).send(MessageFormatter.error("Login failed", 401, "Invalid credentials"));
      }

      // Generate token
      const token = await JWTUtil.generateToken({ userId: user._id.toString(), email: user.email });
      
      res.send(MessageFormatter.success("Login successful", { token }));
    } catch (error: any) {
      logger.error('Login error:', error);
      res.status(500).send(MessageFormatter.error("Login failed", 500, error.message || "Internal server error"));
    }
  }

  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(401).send(MessageFormatter.error("Unauthorized", 401, "Token is required"));
      }
      
      const payload = await JWTUtil.verifyToken(token);
      const user = await User.findById(payload.userId).select('-password');
      
      if (!user) {
        return res.status(401).send(MessageFormatter.error("Unauthorized", 401, "Invalid token"));
      }

      (req as any).user = user;
      next();
    } catch (error) {
      logger.error('Token verification error:', error);
      res.status(401).send(MessageFormatter.error("Unauthorized", 401, "Invalid token"));
    }
  }

  static async auth(req: Request, res: Response, next: NextFunction) {
    await AuthController.verifyToken(req, res, next);
  }
}