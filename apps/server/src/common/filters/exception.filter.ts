import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ExceptionFilter as BaseExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface ErrorResponse {
  success: boolean;
  data?: null;
  error: string;
  meta?: {
    timestamp: string;
    code?: string;
  };
}

@Catch()
export class ExceptionFilter implements BaseExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';
    let errorCode: string | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        errorMessage =
          (exceptionResponse as any).message || exception.message;
      } else {
        errorMessage = exceptionResponse as string;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // 处理 Prisma 错误
      statusCode = HttpStatus.BAD_REQUEST;
      errorCode = exception.code;

      switch (exception.code) {
        case 'P2002':
          errorMessage = `Unique constraint failed: ${(exception.meta?.target as string[])?.join(', ') || 'field'}`;
          break;
        case 'P2025':
          errorMessage = 'Record not found';
          statusCode = HttpStatus.NOT_FOUND;
          break;
        case 'P2003':
          errorMessage = 'Foreign key constraint failed';
          break;
        default:
          errorMessage = exception.message;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    this.logger.error(
      `[${statusCode}] ${errorMessage}`,
      exception instanceof Error ? exception.stack : '',
    );

    const errorResponse: ErrorResponse = {
      success: false,
      error: errorMessage,
      meta: {
        timestamp: new Date().toISOString(),
        ...(errorCode && { code: errorCode }),
      },
    };

    response.status(statusCode).json(errorResponse);
  }
}
