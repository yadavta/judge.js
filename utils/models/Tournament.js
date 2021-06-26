const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  adminAlerts: {type: Array},
  asIndependent: {type: Boolean},
  circuits: {type: Array},
  clubApproved: {type: Boolean},
  startDate: {type: String},
  endDate: {type: String},
  judgeTypes: {type: Array},
  location: {type: String},
  slots: {type: Object},
  tabroomName: {type: String},
  tournamentId: {type: String},
  tournamentName: {type: String},
  internalSignupDeadline: {type: String},
  externalSignupDeadlin: {type: String}
});

module.exports = mongoose.model('Tournament', tournamentSchema);

//SAMPLE TOURNAMENT FROM AWS DYNAMO DB

  /*{
    "adminAlerts": [
      {
        "alertContent": "Autem corporis dolores fuga necessitatibus facilis iure illum aperiam. Et recusandae molestias error non.",
        "alertHeader": "Flights Notice"
      },
      {
        "alertContent": " Maiores reprehenderit ullam iure iure. Consequuntur assumenda dolor velit voluptatibus.",
        "alertHeader": "Payment Deadline"
      }
    ],
    "asIndependent": false,
    "circuits": [
      "national"
    ],
    "clubApproved": true,
    "endDate": "2021-02-15",
    "judgeTypes": [
      "hires"
    ],
    "location": "Berkley, CA",
    "schoolApproved": true,
    "slots": {
      "cx": 6,
      "ld": 4,
      "pf": 8
    },
    "startDate": "2021-02-13",
    "tabroomName": "fancy prestigious annual tournament",
    "tournamentId": "berkley2021",
    "tournamentName": "Berkley"
  }*/
