import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import {Response} from 'express';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any = {
      statusCode: status,
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        responseBody = exceptionResponse;
      } else {
        responseBody = {
          statusCode: status,
          message: exceptionResponse,
        };
      }
    } else if (this.isValidationError(exception)) {
      status = HttpStatus.BAD_REQUEST;
      responseBody = {
        statusCode: status,
        message: this.extractValidationMessages(exception),
        error: 'Bad Request',
      };
    }

    response.status(status).json(responseBody);
  }

  private isValidationError(exception: any): boolean {
    return exception?.name === 'ValidationError' ||
      Array.isArray(exception?.response?.message);
  }

  private extractValidationMessages(exception: any): string[] {
    if (exception.response?.message) {
      return Array.isArray(exception.response.message)
        ? exception.response.message
        : [exception.response.message];
    }
    return ['Validation failed'];
  }
}