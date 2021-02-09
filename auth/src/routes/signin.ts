import { BadRequestError, validateRequest } from '@ticketyboo/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { JwtManager } from '../utils/jwt-manager';
import { PasswordManager } from '../utils/password-manager';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('An email must be provided.'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('A password must be provided.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid login credentials.');
    }

    const correctPassword = await PasswordManager.compare(
      existingUser.password,
      password
    );
    if (!correctPassword) {
      throw new BadRequestError('Invalid login credentials.');
    }

    JwtManager.signSession(req, existingUser);

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
