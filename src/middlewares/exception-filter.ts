import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MongoServerError } from 'mongodb';
import { mongoErrorMapping } from 'src/constants/mongoErrorMapping';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    console.log('Excetipn Filter ----- ', JSON.stringify(exception));

    const ctx = host.switchToHttp();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Unknown Error, Kindly connect admin.';
    let response = null;
    let stack = null;

    if (typeof exception === 'string') {
      message = exception;
    }

    if ((exception as any).message) {
      message = (exception as any).message;
    }

    if (exception instanceof HttpException) {
      response = exception.getResponse();
      statusCode = exception.getStatus();
      message = exception.message;
      stack = exception.stack;
    }

    if (exception instanceof MongoServerError) {
      statusCode = mongoErrorMapping[exception.code].httpCode;
      message = mongoErrorMapping[exception.code].message;
    }

    const responseBody = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      response,
      message,
      stack: exception,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
