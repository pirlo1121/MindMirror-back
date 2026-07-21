const jwt = require('jsonwebtoken');
const Subscriber = require('../models/Subscriber');

// @desc    Register a new subscriber
// @route   POST /api/subscribers
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email ya registrado como subscriptor' });
    }

    const subscriber = await Subscriber.create({ name, email });

    res.status(201).json({
      success: true,
      data: {
        id: subscriber._id,
        name: subscriber.name,
        email: subscriber.email,
        status: subscriber.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Unsubscribe a subscriber via emailed link and redirect to the confirmation page
// @route   GET /api/subscribers/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const { token } = req.query;

  if (!token) {
    return res.redirect(`${clientUrl}/unsubscribe?status=error`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== 'unsubscribe' || !decoded.id) {
      return res.redirect(`${clientUrl}/unsubscribe?status=error`);
    }

    const subscriber = await Subscriber.findById(decoded.id);

    if (!subscriber) {
      return res.redirect(`${clientUrl}/unsubscribe?status=error`);
    }

    if (subscriber.status !== 'paused') {
      subscriber.status = 'paused';
      await subscriber.save();
    }

    return res.redirect(`${clientUrl}/unsubscribe?status=success`);
  } catch (error) {
    return res.redirect(`${clientUrl}/unsubscribe?status=error`);
  }
};

// @desc    Pause a subscriber
// @route   PATCH /api/subscribers/:id/pause
// @access  Private/Admin
exports.pause = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriptor no encontrado' });
    }

    if (subscriber.status === 'paused') {
      return res.status(400).json({ success: false, error: 'El subscriptor ya está pausado' });
    }

    subscriber.status = 'paused';
    await subscriber.save();

    res.status(200).json({ success: true, data: subscriber });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Activate a subscriber
// @route   PATCH /api/subscribers/:id/activate
// @access  Private/Admin
exports.activate = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriptor no encontrado' });
    }

    if (subscriber.status === 'active') {
      return res.status(400).json({ success: false, error: 'El subscriptor ya está activo' });
    }

    subscriber.status = 'active';
    await subscriber.save();

    res.status(200).json({ success: true, data: subscriber });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a subscriber
// @route   DELETE /api/subscribers/:id
// @access  Private/Admin
exports.remove = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriptor no encontrado' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().lean();
    res.set('Cache-Control', 'private, no-cache');
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};