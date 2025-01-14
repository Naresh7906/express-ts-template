import { env } from "../config/env.config";

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private stage: string;

  constructor() {
    this.stage = env.STAGE;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.stage === 'production') {
      // In production, only log warnings and errors
      return ['warn', 'error'].includes(level);
    }
    // In development/staging, log everything
    return true;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args);
    }
  }
}

export const logger = new Logger();
