import request from 'supertest';
import { app } from '../../app';
import { AuthTestHelper } from '../../test/auth-test-helper';

const authTestHelper = new AuthTestHelper(app);
const validEmail = 'test@test.com';
const validPassword = 'password';

it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: validEmail,
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await authTestHelper.signUp(validEmail, validPassword, 201);
  await authTestHelper.signIn(validEmail, 'invalidPassword', 400);
});

it('responds with a cookie with valid credentials', async () => {
  await authTestHelper.signUp(validEmail, validPassword, 201);
  const res = await authTestHelper.signIn(validEmail, validPassword, 200);
  expect(res.get('Set-Cookie')).toBeDefined();
});
