const express = require('express');
const router = express.Router();
const {
  getChefs,
  getChef,
  updateChefProfile,
  updateAvailability,
  updateOnlineStatus,
  getChefSessions,
  getChefAnalytics,
  searchChefs,
  getFeaturedChefs
} = require('../controllers/chefController');

const { protect, authorize, requireChefVerification } = require('../middleware/auth');

// Public routes
router.get('/', getChefs);
router.get('/search', searchChefs);
router.get('/featured', getFeaturedChefs);
router.get('/:id', getChef);

// Protected routes
router.use(protect); // All routes after this middleware are protected

// Chef-only routes
router.put('/profile', authorize('chef'), updateChefProfile);
router.put('/availability', authorize('chef'), updateAvailability);
router.put('/status', authorize('chef'), updateOnlineStatus);
router.get('/sessions', authorize('chef'), getChefSessions);
router.get('/analytics', authorize('chef'), getChefAnalytics);

module.exports = router;
