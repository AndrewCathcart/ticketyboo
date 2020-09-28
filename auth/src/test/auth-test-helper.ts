import { Express } from 'express';
import request from 'supertest';
import { app } from '../app';

export class AuthTestHelper {
  constructor(public app: Express) {}

  async signUp(
    email: string,
    password: string,
    expectedStatusCode: number
  ): Promise<request.Response> {
    const response = await request(app)
      .post('/api/users/signup')
      .send({ email, password })
      .expect(expectedStatusCode);

    return response;
  }

  async signIn(
    email: string,
    password: string,
    expectedStatusCode: number
  ): Promise<request.Response> {
    const response = await request(app)
      .post('/api/users/signIn')
      .send({ email, password })
      .expect(expectedStatusCode);

    return response;
  }

  async getSignUpCookie(
    email: string,
    password: string,
    expectedStatusCode: number
  ): Promise<string[]> {
    const response = await request(app)
      .post('/api/users/signUp')
      .send({ email, password })
      .expect(expectedStatusCode);

    const cookie = response.get('Set-Cookie');

    return cookie;
  }
}
