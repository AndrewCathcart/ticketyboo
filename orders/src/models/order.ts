import { OrderStatus } from '@ticketyboo/common';
import { Document, model, Schema } from 'mongoose';
import { ITicketDoc } from './ticket';

export { OrderStatus };

interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDoc;
}

interface IOrderDoc extends Document, IOrder {}

const OrderSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
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

const OrderModel = model<IOrderDoc>('Order', OrderSchema);

export class Order extends OrderModel {
  constructor(attrs: IOrder) {
    super(attrs);
  }
}
