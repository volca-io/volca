import { StatusCodes } from 'http-status-codes';

interface ErrorProperties {
  message: string;
  statusCode: StatusCodes;
}

export class ServiceError extends Error {
  public statusCode: StatusCodes;

  constructor({ message, statusCode }: ErrorProperties) {
    super(message);
    this.statusCode = statusCode;
  }
}
