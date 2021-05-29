import { requireAuth, validateRequest } from '@ticketyboo/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const userId = req.currentUser!.id;

    const ticket = new Ticket({ title, price, userId });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
