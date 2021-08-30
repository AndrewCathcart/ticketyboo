import Publisher from './base-publisher';
import { Subjects } from './subjects';
import TicketCreatedEvent from './ticket-created-event';

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
