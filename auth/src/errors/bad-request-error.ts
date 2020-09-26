import { CustomError, FormattedError, FormattedErrors } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors(): FormattedErrors {
    return { errors: [new FormattedError(this.message)] };
  }
}
