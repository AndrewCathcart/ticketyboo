import { CustomError, FormattedError, FormattedErrors } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route not found.');
  }

  serializeErrors(): FormattedErrors {
    return { errors: [new FormattedError('Not Found')] };
  }
}
