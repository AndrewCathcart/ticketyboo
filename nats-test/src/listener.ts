import { randomBytes } from 'crypto';
import nats, { Message } from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketyboo', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed.');
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('orders-service');
  const sub = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );

  sub.on('message', (msg: Message) => {
    console.log(`Received event #${msg.getSequence()}, data: ${msg.getData()}`);
    msg.ack();
  });
});

// Gracefully handle shutdown by closing the client
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
