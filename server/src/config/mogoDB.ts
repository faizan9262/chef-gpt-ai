import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoDBConnect = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    mongoose.connection.on('connected', () => {
      console.log('✅ Database connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
  }

  await mongoose.connect(process.env.MONGODB_URI as string);
};

export default mongoDBConnect;
