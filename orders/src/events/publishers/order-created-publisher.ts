import { OrderCreatedEvent, Publisher, Subjects } from '@ticketyboo/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
