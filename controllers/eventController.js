const Event = require('../models/Event');
const EventLog = require('../models/EventLog');
const Profile = require('../models/Profile');
const mongoose = require('mongoose');

exports.createEvent = async (req, res) => {
  try {
    const { profiles, timezone, startDate, endDate } = req.body;
    if (!profiles || !profiles.length) return res.status(400).json({ message: 'At least one profile required' });
    if (new Date(endDate) < new Date(startDate)) return res.status(400).json({ message: 'End date must be after start date' });

    // validate profile ids
    const validProfiles = await Profile.find({ _id: { $in: profiles } });
    if (validProfiles.length !== profiles.length) {
      return res.status(400).json({ message: 'Some profiles not found' });
    }
    const event = new Event({ profiles, timezone, startDate, endDate });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get events where a specific profile participates
exports.getEventsByProfile = async (req, res) => {
  try {
    const profileId = req.params.profileId;
    if (!mongoose.Types.ObjectId.isValid(profileId)) return res.status(400).json({ message: 'Invalid profile id' });

    // we also populate profile names for UI
    const events = await Event.find({ profiles: profileId }).populate('profiles', 'name').sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventLogs = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const logs = await EventLog.find({ event: eventId }).sort({ editedAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit an event and create EventLog entries only for changed fields
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { profiles, timezone, startDate, endDate } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const logsToCreate = [];

    // compare profiles (arrays of ObjectId strings). We'll compare as string sets.
    const oldProfiles = (event.profiles || []).map(String);
    const newProfiles = (profiles || []).map(String);
    const profilesChanged = (oldProfiles.length !== newProfiles.length) ||
      oldProfiles.some(id => !newProfiles.includes(id));
    if (profilesChanged) {
      logsToCreate.push({
        event: event._id,
        field: 'profiles',
        previousValue: oldProfiles,
        newValue: newProfiles
      });
      event.profiles = profiles;
    }

    if (timezone && timezone !== event.timezone) {
      logsToCreate.push({
        event: event._id,
        field: 'timezone',
        previousValue: event.timezone,
        newValue: timezone
      });
      event.timezone = timezone;
    }

    if (startDate && new Date(startDate).toISOString() !== event.startDate.toISOString()) {
      logsToCreate.push({
        event: event._id,
        field: 'startDate',
        previousValue: event.startDate,
        newValue: new Date(startDate)
      });
      event.startDate = new Date(startDate);
    }

    if (endDate && new Date(endDate).toISOString() !== event.endDate.toISOString()) {
      logsToCreate.push({
        event: event._id,
        field: 'endDate',
        previousValue: event.endDate,
        newValue: new Date(endDate)
      });
      event.endDate = new Date(endDate);
    }

    // validate date logic
    if (event.endDate < event.startDate) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    await event.save();
    if (logsToCreate.length) {
      await EventLog.insertMany(logsToCreate.map(l => ({ ...l, editedAt: new Date() })));
    }

    const updated = await Event.findById(eventId).populate('profiles', 'name');
    res.json({ event: updated, logsCreated: logsToCreate.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
