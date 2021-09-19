import { Types as MongooseTypes } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrdersTestHelper } from '../../test/orders-test-helper';

const ordersTestHelper = new OrdersTestHelper();

it('returns an error if the order does not exist', async () => {
  const ticket = new Ticket({
    title: 'test ticket',
    price: 12,
  });
  await ticket.save();

  const user = ordersTestHelper.signIn(
    new MongooseTypes.ObjectId().toHexString()
  );

  await request(app)
    .get(`/api/orders/${new MongooseTypes.ObjectId().toHexString()}`)
    .set('Cookie', user)
    .send()
    .expect(404);
});

it('returns an error if the order is not owned by the user', async () => {
  const ticket = new Ticket({
    title: 'test ticket',
    price: 12,
  });
  await ticket.save();

  const user = ordersTestHelper.signIn(
    new MongooseTypes.ObjectId().toHexString()
  );
  const userTwo = ordersTestHelper.signIn(
    new MongooseTypes.ObjectId().toHexString()
  );

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(401);
});

it('fetches an order successfully', async () => {
  const ticket = new Ticket({
    title: 'test ticket',
    price: 12,
  });
  await ticket.save();

  const user = ordersTestHelper.signIn(
    new MongooseTypes.ObjectId().toHexString()
  );

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(order.id);
  expect(response.body.ticket.id).toEqual(ticket.id);
});
