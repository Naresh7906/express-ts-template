interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string | number;
    details?: any;
  };
}

export class MessageFormatter {
  static success<T>(message: string = "Success", data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message: string = "Error", code?: string | number, details?: any): ApiResponse {
    return {
      success: false,
      message,
      error: {
        code,
        details
      }
    };
  }
} 