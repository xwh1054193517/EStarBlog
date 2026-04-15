import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Prisma } from '../../generated/prisma';

@Catch()
export class ApiExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    // 表示当前请求的运行上下文。
    // 可以从里面切换到 HTTP、RPC、WebSocket 等环境。
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId =
      (request.headers['x-request-id'] as string | undefined) ?? randomUUID();

    // 先设置为500 后续根据情况设置对应code
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'InternalServerError';
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      error = exception.name;
      const payload = exception.getResponse();
      if (typeof payload === 'string') {
        message = payload;
      } else if (payload && typeof payload === 'object') {
        const normalized = payload as {
          message?: string | string[];
          error?: string;
        };
        message = normalized.message ?? message;
        error = normalized.error ?? error;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'PrismaClientKnownRequestError';
      message =
        exception.code === 'P2002'
          ? 'Resource already exists'
          : 'Database request failed';
    } else if (exception instanceof Error) {
      error = exception.name;
      message = exception.message;
    }

    response.setHeader('x-request-id', requestId);
    response.status(statusCode).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode,
      error,
      message,
      requestId,
    });
  }
}
