import { ValidationError } from 'express-validator';

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  abstract serializeErrors(): FormattedErrors;
}

interface IFormattedErrors {
  errors: IFormattedError[];
}

interface IFormattedError {
  message: string;
  field?: string;
}

export class FormattedError implements IFormattedError {
  constructor(public message: string, public field?: string) {}
}

export class FormattedErrors implements IFormattedErrors {
  errors: FormattedError[];

  constructor(errors: ValidationError[]) {
    this.errors = errors.map((err) => {
      return new FormattedError(err.msg, err.param);
    });
  }
}
