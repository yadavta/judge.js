const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  entryStudentId: {type: String},
  entryStudentName: {type: String},
  entryTournamentId: {type: String},
  entryTournamentName: {type: String},
  entryEvent: {type: String},
  entryStatus: {type: String}, // "requested", "approved"
  entryNotes: {type: String},
  entryApplicationDate: {type: String}
});

module.exports = mongoose.model('Entry', entrySchema);