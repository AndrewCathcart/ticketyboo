import { CustomError, FormattedError, FormattedErrors } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'An error occurred connecting to the database.';

  constructor() {
    super('An error occurred connecting to the database.');
  }

  serializeErrors(): FormattedErrors {
    return { errors: [new FormattedError(this.reason)] };
  }
}
