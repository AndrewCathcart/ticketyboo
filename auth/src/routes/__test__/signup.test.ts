import request from 'supertest';
import { app } from '../../app';
import { AuthTestHelper } from '../../test/auth-test-helper';

const authTestHelper = new AuthTestHelper(app);
const validEmail = 'test@test.com';
const validPassword = 'password';

it('returns a 201 and sets a cookie on successful signup', async () => {
  const res = await authTestHelper.signUp(validEmail, validPassword, 201);

  expect(res.get('Set-Cookie')).toBeDefined();
});

it('returns a 400 with an invalid email', async () => {
  await authTestHelper.signUp('invalidEmail', validPassword, 400);
});

it('returns a 400 with an invalid password', async () => {
  await authTestHelper.signUp(validEmail, '', 400);
});

it('returns a 400 with missing email and password', async () => {
  const noPassword = await request(app)
    .post('/api/users/signup')
    .send({ email: validEmail })
    .expect(400);

  expect(noPassword.body).toEqual({
    errors: [
      {
        field: 'password',
        message: 'Password must be between 4 and 20 characters.',
      },
    ],
  });

  const noEmail = await request(app)
    .post('/api/users/signup')
    .send({ password: validPassword })
    .expect(400);

  expect(noEmail.body).toEqual({
    errors: [
      {
        field: 'email',
        message: 'A valid email must be provided.',
      },
    ],
  });
});

it('returns a 400 if the email already exists', async () => {
  await authTestHelper.signUp(validEmail, validPassword, 201);
  const res = await authTestHelper.signUp(validEmail, validPassword, 400);

  expect(res.body).toEqual({
    errors: [{ message: 'A user with that email already exists.' }],
  });
});
