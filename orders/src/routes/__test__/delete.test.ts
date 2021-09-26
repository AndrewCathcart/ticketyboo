import { OrderStatus } from '@ticketyboo/common';
import { Types as MongooseTypes } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
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
    .delete(`/api/orders/${new MongooseTypes.ObjectId().toHexString()}`)
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
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(401);
});

it('deletes an order successfully', async () => {
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

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
