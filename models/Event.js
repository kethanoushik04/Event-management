const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
  profiles: [{ type: Schema.Types.ObjectId, ref: 'Profile', required: true }],
  timezone: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
