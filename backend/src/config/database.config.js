/**
 * Database Configuration
 * MongoDB connection via Mongoose with retry logic.
 */

const mongoose = require('mongoose');
const config = require('./index');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Retry after 5 seconds
    console.log('⏳ Retrying connection in 5 seconds...');
    setTimeout(connectDatabase, 5000);
  }
};

// Connection event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

module.exports = connectDatabase;
