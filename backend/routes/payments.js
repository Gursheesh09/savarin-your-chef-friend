const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
router.get('/methods', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Payments API - Coming Soon!',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create payment intent
// @route   POST /api/payments/intent
// @access  Private
router.post('/intent', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Payments API - Coming Soon!',
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
