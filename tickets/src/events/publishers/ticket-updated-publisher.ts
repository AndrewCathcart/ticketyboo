import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketyboo/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
