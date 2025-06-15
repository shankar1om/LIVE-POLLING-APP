const Poll = require('../models/Poll');

exports.getPollHistory = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const polls = await Poll.find({ createdBy: teacherId }).sort({ createdAt: -1 });
    res.json({ polls });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching poll history' });
  }
};