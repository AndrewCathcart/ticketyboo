import { Types as MongooseTypes } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { TicketsTestHelper } from '../../test/tickets-test-helper';

const ticketsTestHelper = new TicketsTestHelper();
const mongoId = new MongooseTypes.ObjectId().toHexString();

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', ticketsTestHelper.signIn(mongoId))
    .send({});
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', ticketsTestHelper.signIn(mongoId))
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', ticketsTestHelper.signIn(mongoId))
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', ticketsTestHelper.signIn(mongoId))
    .send({
      title: 'test',
      price: -1,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', ticketsTestHelper.signIn(mongoId))
    .send({
      title: 'test',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const fakeTicket = {
    title: 'test',
    price: 10,
  };
  await request(app)
    .post('/api/tickets')
    .set('Cookie', ticketsTestHelper.signIn(mongoId))
    .send(fakeTicket)
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].id).toBeDefined();
  expect(tickets[0].title).toEqual(fakeTicket.title);
  expect(tickets[0].price).toEqual(fakeTicket.price);
  expect(tickets[0].userId).toEqual(mongoId);
});
