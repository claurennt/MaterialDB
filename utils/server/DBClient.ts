import mongoose from 'mongoose';

export default async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB via mongoose');
  } catch (error) {
    throw new Error('Connection failed!');
  }
}
