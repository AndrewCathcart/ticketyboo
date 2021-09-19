import { Document, model, Schema } from 'mongoose';
import { Order, OrderStatus } from './order';

interface ITicket {
  title: string;
  price: number;
}

export interface ITicketDoc extends Document, ITicket {
  isReserved(): Promise<boolean>;
}

const ticketSchema = new Schema<ITicketDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

// if we find an order for the ticket with a status that is not OrderStatus.Cancelled then it is reserved
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const TicketModel = model<ITicketDoc>('Ticket', ticketSchema);

export class Ticket extends TicketModel {
  constructor(attrs: ITicket) {
    super(attrs);
  }
}
