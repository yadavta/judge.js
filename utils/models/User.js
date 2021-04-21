const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  emailConfirmed: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  group: { type: String, default:'student', required: true}
});

module.exports = mongoose.model('User', userSchema);