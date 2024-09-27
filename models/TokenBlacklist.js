const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Automatically remove after 30 days
});

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);