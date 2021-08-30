import { Message } from 'node-nats-streaming';
import Listener from './base-listener';
import { Subjects } from './subjects';
import TicketCreatedEvent from './ticket-created-event';

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log(
      `Received event #${msg.getSequence()}, data: ${JSON.stringify(data)}`
    );
    msg.ack();
  }
}
