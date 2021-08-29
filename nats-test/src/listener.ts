import { randomBytes } from 'crypto';
import nats, { Message } from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketyboo', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const sub = stan.subscribe('ticket:created', 'orders-service-queue-group');

  sub.on('message', (msg: Message) => {
    console.log('Message received', msg.getData());
  });
});
