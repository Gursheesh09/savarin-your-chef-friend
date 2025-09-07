const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const dataStore = require('../dataStore');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      country,
      city,
      timezone,
      preferredCuisines,
      dietaryRestrictions,
      skillLevel,
      learningGoals
    } = req.body;
    
    const updateFields = {};
    
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (phone !== undefined) updateFields.phone = phone;
    if (country !== undefined) updateFields.country = country;
    if (city !== undefined) updateFields.city = city;
    if (timezone !== undefined) updateFields.timezone = timezone;
    if (preferredCuisines !== undefined) updateFields.preferredCuisines = preferredCuisines;
    if (dietaryRestrictions !== undefined) updateFields.dietaryRestrictions = dietaryRestrictions;
    if (skillLevel !== undefined) updateFields.skillLevel = skillLevel;
    if (learningGoals !== undefined) updateFields.learningGoals = learningGoals;
    
    const updatedUser = dataStore.updateUser(req.user.id, updateFields);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
