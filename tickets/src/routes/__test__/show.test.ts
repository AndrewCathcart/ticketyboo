import { Types as MongooseTypes } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { TicketsTestHelper } from '../../test/tickets-test-helper';

const ticketsTestHelper = new TicketsTestHelper();
const mongoId = new MongooseTypes.ObjectId().toHexString();

it('returns a 404 if the ticket is not found', async () => {
  await request(app).get(`/api/tickets/${mongoId}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const fakeTicket = {
    title: 'Bon Jovi Concert',
    price: 100,
  };

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', ticketsTestHelper.signIn(mongoId))
    .send(fakeTicket)
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(fakeTicket.title);
  expect(ticketResponse.body.price).toEqual(fakeTicket.price);
  expect(ticketResponse.body.userId).toEqual(mongoId);
});
