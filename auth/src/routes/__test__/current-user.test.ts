import request from 'supertest';
import { app } from '../../app';
import { AuthTestHelper } from '../../test/auth-test-helper';

const authTestHelper = new AuthTestHelper(app);
const validEmail = 'test@test.com';
const validPassword = 'password';

it('responds with details about the current user', async () => {
  const cookie = await authTestHelper.getSignUpCookie(
    validEmail,
    validPassword,
    201
  );

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeDefined();
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if unauthenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body).toEqual({ currentUser: null });
});
