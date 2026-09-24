const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('⚠️ MONGO_URI environment variable is missing in environment!');
    } else {
      // Log masked URI for debugging deployment environment variables safely
      const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
      console.log(`📡 Connecting to MongoDB: ${maskedUri}`);
    }

    const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/habittrackerdb');
    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('bad auth')) {
      console.error('👉 TIP: Check your MongoDB Atlas Database Access user credentials and ensure MONGO_URI on Render is exact with no quotes or spaces.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
