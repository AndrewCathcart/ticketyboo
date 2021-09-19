import { Types as MongooseTypes } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrdersTestHelper } from '../../test/orders-test-helper';

const ordersTestHelper = new OrdersTestHelper();
const signInId = new MongooseTypes.ObjectId().toHexString();

it('returns an error if the ticket does not exist', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', ordersTestHelper.signIn(signInId))
    .send({
      ticketId: new MongooseTypes.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = new Ticket({
    price: 99,
    title: 'test ticket',
  });
  await ticket.save();
  const order = new Order({
    ticket,
    userId: 'testUserId',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', ordersTestHelper.signIn(signInId))
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = new Ticket({
    price: 99,
    title: 'test ticket',
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', ordersTestHelper.signIn(signInId))
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it.todo('emits an order created event');
