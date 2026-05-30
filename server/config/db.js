import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
    console.log('MONGO_URI first 30 chars:', process.env.MONGO_URI?.substring(0, 30));

    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learning_dashboard'
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
