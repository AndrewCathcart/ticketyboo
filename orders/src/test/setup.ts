import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

jest.mock('../nats-wrapper');

let mongodb: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_SECRET = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongodb = new MongoMemoryServer();
  const mongoUri = await mongodb.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteOne({});
  }
});

afterAll(async () => {
  await mongodb.stop();
  await mongoose.connection.close();
});
