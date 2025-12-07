const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventLogSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  field: { type: String, required: true },         // e.g. "startDate", "profiles"
  previousValue: { type: Schema.Types.Mixed },     // store previous (string/date/array)
  newValue: { type: Schema.Types.Mixed },          // store new
  editedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventLog', EventLogSchema);
