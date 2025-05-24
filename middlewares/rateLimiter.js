const ContactMessage = require('../models/ContactMessage');

module.exports = async (req, res, next) => {
  const ip = req.ip;

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0); // midnight UTC

  try {
    const count = await ContactMessage.countDocuments({
      ip,
      createdAt: { $gte: startOfDay },
    });

    if (count >= 3) {
      return res.status(429).json({
        message: 'You have reached the maximum number of messages allowed today. Try again after 24 hrs.',
      });
    }

    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
