const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: String },
  token: { type: String },
  expires: { type: Date }
});

module.exports = mongoose.model('Session', sessionSchema);