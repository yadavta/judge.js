const mongoose = require('mongoose');

//emailConfirmation

const emailConfirmationSchema = new mongoose.Schema({
  userId: { type: String },
  confirmationToken: { type: String },
  expires: { type: Date }
});

module.exports = mongoose.model('EmailConfirmation', emailConfirmationSchema)