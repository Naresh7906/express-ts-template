import { SignJWT, jwtVerify } from 'jose';
import { logger } from './logger.util';
import { env } from '../config/env.config';

export interface JWTPayload {
  userId: string;
  email: string;
  [key: string]: any; // Allow additional custom claims
}

export class JWTUtil {
  private static SECRET = new TextEncoder().encode(
    env.JWT_SECRET
  );
  private static ISSUER = 'your-app-name';
  private static AUDIENCE = 'your-app-audience';

  static async generateToken(payload: JWTPayload): Promise<string> {
    try {
      const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(this.ISSUER)
        .setAudience(this.AUDIENCE)
        .setExpirationTime('2h') // Token expires in 2 hours
        .sign(this.SECRET);

      return token;
    } catch (error) {
      logger.error('Error generating JWT:', error);
      throw new Error('Failed to generate token');
    }
  }

  static async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jwtVerify(token, this.SECRET, {
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      });

      return payload as JWTPayload;
    } catch (error) {
      logger.error('Error verifying JWT:', error);
      throw new Error('Invalid token');
    }
  }
} 