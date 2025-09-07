const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Bookings API - Coming Soon!',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Bookings API - Coming Soon!',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
