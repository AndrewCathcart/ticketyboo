import { Document, model, Schema } from 'mongoose';

interface ITicket {
  title: string;
  price: number;
  userId: string;
}

interface ITicketDoc extends Document, ITicket {}

const TicketModel = model<ITicketDoc>(
  'Ticket',
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      userId: {
        type: String,
        required: true,
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
  )
);

export class Ticket extends TicketModel {
  constructor(attrs: ITicket) {
    super(attrs);
  }
}
