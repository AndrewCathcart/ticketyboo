import request from 'supertest';
import { app } from '../../app';
import { AuthTestHelper } from '../../test/auth-test-helper';

const authTestHelper = new AuthTestHelper(app);

it('responds with a cookie with valid credentials', async () => {
  await authTestHelper.signUp('test@test.com', 'password', 201);

  const res = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(res.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
