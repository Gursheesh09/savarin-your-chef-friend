const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  publishSession,
  joinSession,
  leaveSession,
  startSession,
  endSession,
  getAvailableSessions,
  searchSessions
} = require('../controllers/sessionController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getSessions);
router.get('/available', getAvailableSessions);
router.get('/search', searchSessions);
router.get('/:id', getSession);

// Protected routes
router.use(protect); // All routes after this middleware are protected

// Chef-only routes
router.post('/', authorize('chef'), createSession);
router.put('/:id', authorize('chef'), updateSession);
router.delete('/:id', authorize('chef'), deleteSession);
router.put('/:id/publish', authorize('chef'), publishSession);
router.put('/:id/start', authorize('chef'), startSession);
router.put('/:id/end', authorize('chef'), endSession);

// User routes (both students and chefs can join/leave)
router.post('/:id/join', joinSession);
router.post('/:id/leave', leaveSession);

module.exports = router;
