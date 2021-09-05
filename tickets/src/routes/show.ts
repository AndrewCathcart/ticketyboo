import { NotFoundError, validateRequest } from '@ticketyboo/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  param('id')
    .custom((idValue) => isValidObjectId(idValue))
    .withMessage('id must be a valid MongoDB ObjectId'),
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).send(ticket);
  }
);

export { router as showTicketRouter };
