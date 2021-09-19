import { Types as MongooseTypes } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrdersTestHelper } from '../../test/orders-test-helper';

const buildTicket = async (title: string, price: number) => {
  const ticket = new Ticket({
    title,
    price,
  });
  await ticket.save();
  return ticket;
};

const ordersTestHelper = new OrdersTestHelper();

it('fetches orders from a particular user', async () => {
  const ticketOne = await buildTicket('ticketOne', 111);
  const ticketTwo = await buildTicket('ticketTwo', 222);
  const ticketThree = await buildTicket('ticketThree', 333);

  const userOne = ordersTestHelper.signIn(
    new MongooseTypes.ObjectId().toHexString()
  );
  const userTwo = ordersTestHelper.signIn(
    new MongooseTypes.ObjectId().toHexString()
  );

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body).toHaveLength(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
