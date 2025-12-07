const Profile = require('../models/Profile');

exports.createProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const profile = new Profile({ name });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
