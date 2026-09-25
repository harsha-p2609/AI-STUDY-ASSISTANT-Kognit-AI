const Session = require('../models/Session');

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .select('title type prompt createdAt updatedAt')
      .sort({ updatedAt: -1 });

    return res.status(200).json({ sessions });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve saved sessions.' });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }
    return res.status(200).json({ session });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch session details.' });
  }
};

exports.updateSessionProgress = async (req, res) => {
  try {
    const { userProgress } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { userProgress, updatedAt: Date.now() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    return res.status(200).json({ session });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update session progress.' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }
    return res.status(200).json({ message: 'Session deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete session.' });
  }
};
