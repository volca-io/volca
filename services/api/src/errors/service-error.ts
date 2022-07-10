import { StatusCodes } from 'http-status-codes';
import { ErrorNames } from '../constants';

interface ErrorProperties {
  name: ErrorNames;
  message: string;
  statusCode: StatusCodes;
  debug?: string;
}

export class ServiceError extends Error {
  public statusCode: StatusCodes;
  public debug?: string;

  constructor({ name, message, statusCode, debug }: ErrorProperties) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.debug = debug;
  }
}
