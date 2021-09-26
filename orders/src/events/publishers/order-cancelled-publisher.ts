import { OrderCancelledEvent, Publisher, Subjects } from '@ticketyboo/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
