import { Types } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { TicketsTestHelper } from '../../test/tickets-test-helper';

const ticketsTestHelper = new TicketsTestHelper();

const createTestTicket = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', ticketsTestHelper.signIn(new Types.ObjectId().toHexString()))
    .send({ title, price });
};

it('can fetch a list of tickets', async () => {
  await createTestTicket('test 1', 10);
  await createTestTicket('test 2', 20);
  await createTestTicket('test 3', 30);

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
