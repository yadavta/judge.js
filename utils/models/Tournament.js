const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({

  tournamentId: { type: String },
  tournamentName: { type: String },
  tabroomName: { type: String },
  location: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  regDeadline: { type: String },
  feesFreeze: { type: String },
  schoolApproved: { type: Boolean },
  circuits: { type: Array },
  judgeTypes: { type: Array },
  adminAlerts: { type: Array },

});

module.exports = mongoose.model('Tournament', tournamentSchema);