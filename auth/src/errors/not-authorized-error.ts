import { CustomError, FormattedError, FormattedErrors } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not authorised.');
  }

  serializeErrors(): FormattedErrors {
    return { errors: [new FormattedError('Not authorized.')] };
  }
}
