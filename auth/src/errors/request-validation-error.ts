import { ValidationError } from 'express-validator';
import { CustomError, FormattedErrors } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters.');
  }

  serializeErrors(): FormattedErrors {
    return new FormattedErrors(this.errors);
  }
}
