import mongoose from 'mongoose';
import { app } from './app';
import { DatabaseConnectionError } from './errors/database-connection-error';

(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined.');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (error) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('Auth service listening on port 3000.');
  });
})();
