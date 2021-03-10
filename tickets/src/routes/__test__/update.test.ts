import { Types as MongooseTypes } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { TicketsTestHelper } from '../../test/tickets-test-helper';

const ticketsTestHelper = new TicketsTestHelper();
const mongoId = new MongooseTypes.ObjectId().toHexString();

it('returns a 404 if the ticket id does not exist', async () => {
  const missingId = new MongooseTypes.ObjectId().toHexString();
  const updatedTicket = {
    title: 'updated ticket',
    price: 100,
  };

  await request(app)
    .put(`/api/tickets/${missingId}`)
    .set('Cookie', ticketsTestHelper.signIn(mongoId))
    .send(updatedTicket)
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const missingId = new MongooseTypes.ObjectId().toHexString();
  const updatedTicket = {
    title: 'updated ticket',
    price: 100,
  };

  await request(app)
    .put(`/api/tickets/${missingId}`)
    .send(updatedTicket)
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const firstUserId = new MongooseTypes.ObjectId().toHexString();
  const secondUserId = new MongooseTypes.ObjectId().toHexString();
  const newTicket = {
    title: 'new fake ticket',
    price: 99,
  };
  const updatedTicket = {
    title: 'updated fake ticket',
    price: 999,
  };

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', ticketsTestHelper.signIn(firstUserId))
    .send(newTicket)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', ticketsTestHelper.signIn(secondUserId))
    .send(updatedTicket)
    .expect(401);
});

it('returns a 400 if the user provides invalid input', async () => {
  const cookie = ticketsTestHelper.signIn(
    new MongooseTypes.ObjectId().toHexString()
  );
  const ticket = {
    title: 'fake ticket',
    price: 99,
  };

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(ticket);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'valid title', price: -10 })
    .expect(400);
});

it('updates the ticket with valid input', async () => {
  const cookie = ticketsTestHelper.signIn(
    new MongooseTypes.ObjectId().toHexString()
  );

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'abcd', price: 1 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'valid title', price: 5 })
    .expect(200);

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticket.body.title).toEqual('valid title');
  expect(ticket.body.price).toEqual(5);
});
