import jwt from 'jsonwebtoken';

export class TicketsTestHelper {
  signIn(id: string): string[] {
    const token = jwt.sign(
      {
        id: id,
        email: 'test@test.com',
      },
      process.env.JWT_SECRET!
    );
    const sessionJSON = JSON.stringify({ jwt: token });
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`express:sess=${base64}`];
  }
}
