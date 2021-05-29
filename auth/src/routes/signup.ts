import { BadRequestError, validateRequest } from '@ticketyboo/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { JwtManager } from '../utils/jwt-manager';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('A valid email must be provided.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('A user with that email already exists.');
    }

    const user = new User({ email, password });
    await user.save();

    JwtManager.signSession(req, user);

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
