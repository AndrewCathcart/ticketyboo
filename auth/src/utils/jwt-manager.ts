import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export class JwtManager {
  static signSession(req: Request, user: User) {
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!
    );

    req.session = {
      jwt: userJwt,
    };
  }
}
