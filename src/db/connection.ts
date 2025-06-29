import mongoose from 'mongoose';

const mongoURI = process.env.DB_CONNECTION;

mongoose.set('strictQuery', false);

export async function connectDB() {
  if (!mongoURI) {
    throw new Error('[-] MongoDB connection string (DB_CONNECTION) is not defined in environment variables');
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('[+] MongoDB connected');
  } catch (error) {
    console.error('[-] MongoDB connection error:', error);
    process.exit(1);
  }
}

