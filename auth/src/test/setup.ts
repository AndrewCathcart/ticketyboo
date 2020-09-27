import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongodb: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_SECRET = 'asdfasdf';
  mongodb = new MongoMemoryServer();
  const mongoUri = await mongodb.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteOne({});
  }
});

afterAll(async () => {
  await mongodb.stop();
  await mongoose.connection.close();
});
