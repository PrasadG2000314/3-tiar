const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_management';
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000 // Quick timeout to fallback cleanly if MongoDB is not running locally
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`MongoDB Connection Failed (${error.message}). Running backend in in-memory fallback mode.`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
