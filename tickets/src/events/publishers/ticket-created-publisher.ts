import { Publisher, Subjects, TicketCreatedEvent } from '@ticketyboo/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
