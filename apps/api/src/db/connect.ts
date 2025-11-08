import mongoose from 'mongoose';
import config from '../config';

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(config.mongoUrl);
}

export default mongoose;
