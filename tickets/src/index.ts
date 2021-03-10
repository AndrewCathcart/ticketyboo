import { DatabaseConnectionError } from '@ticketyboo/common';
import mongoose from 'mongoose';
import { app } from './app';

(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined.');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined.');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (error) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('Tickets service listening on port 3000.');
  });
})();
