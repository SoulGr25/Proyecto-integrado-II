const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/peliculasdb';
  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB conectado: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
