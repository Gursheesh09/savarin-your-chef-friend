const dataStore = require('../dataStore');

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private (Chef only)
exports.createSession = async (req, res, next) => {
  try {
    const {
      title,
      description,
      cuisine,
      difficulty,
      skillLevel,
      learningGoals,
      personalization,
      sessionType,
      maxParticipants,
      startTime,
      endTime,
      duration,
      price,
      ingredients,
      equipment,
      recipe,
      sessionFlow,
      tags,
      categories
    } = req.body;
    
    // Check if user is a chef
    if (req.user.role !== 'chef') {
      return res.status(403).json({
        success: false,
        error: 'Only chefs can create sessions'
      });
    }
    
    // Validate time
    if (new Date(startTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Start time must be in the future'
      });
    }
    
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        success: false,
        error: 'End time must be after start time'
      });
    }
    
    // Create session
    const session = dataStore.createSession({
      title,
      description,
      chef: req.user.id,
      cuisine,
      difficulty,
      skillLevel,
      learningGoals,
      personalization,
      sessionType,
      maxParticipants,
      startTime,
      endTime,
      duration,
      price,
      ingredients,
      equipment,
      recipe,
      sessionFlow,
      tags,
      categories,
      status: 'draft'
    });
    
    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
exports.getSessions = async (req, res, next) => {
  try {
    const { cuisine, difficulty, skillLevel, status, chef, page = 1, limit = 10, sort = 'startTime' } = req.query;
    
    // Get all sessions from data store
    let sessions = dataStore.getAllSessions();
    
    // Apply filters
    if (cuisine) sessions = sessions.filter(s => s.cuisine === cuisine);
    if (difficulty) sessions = sessions.filter(s => s.difficulty === difficulty);
    if (skillLevel) sessions = sessions.filter(s => s.skillLevel === skillLevel);
    if (status) sessions = sessions.filter(s => s.status === status);
    if (chef) sessions = sessions.filter(s => s.chef === parseInt(chef));
    
    // Sort
    if (sort === 'startTime') {
      sessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    } else if (sort === 'price') {
      sessions.sort((a, b) => a.price - b.price);
    }
    
    // Pagination
    const total = sessions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSessions = sessions.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: paginatedSessions.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: paginatedSessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
exports.getSession = async (req, res, next) => {
  try {
    const session = dataStore.findSessionById(parseInt(req.params.id));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Increment views
    session.views += 1;
    dataStore.updateSession(session.id, { views: session.views });
    
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (Chef only)
exports.updateSession = async (req, res, next) => {
  try {
    const session = dataStore.findSessionById(parseInt(req.params.id));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Check if user is the chef who created this session
    if (session.chef !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this session'
      });
    }
    
    // Check if session can be updated
    if (session.status === 'in-progress' || session.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update session that is in progress or completed'
      });
    }
    
    const updatedSession = dataStore.updateSession(parseInt(req.params.id), req.body);
    
    res.status(200).json({
      success: true,
      data: updatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Chef only)
exports.deleteSession = async (req, res, next) => {
  try {
    const session = dataStore.findSessionById(parseInt(req.params.id));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Check if user is the chef who created this session
    if (session.chef !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this session'
      });
    }
    
    // Check if session can be deleted
    if (session.status === 'in-progress' || session.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete session that is in progress or completed'
      });
    }
    
    // Remove from data store
    dataStore.sessions.delete(parseInt(req.params.id));
    
    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish session
// @route   PUT /api/sessions/:id/publish
// @access  Private (Chef only)
exports.publishSession = async (req, res, next) => {
  try {
    const session = dataStore.findSessionById(parseInt(req.params.id));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Check if user is the chef who created this session
    if (session.chef !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to publish this session'
      });
    }
    
    // Check if session is ready to publish
    if (session.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Session is not in draft status'
      });
    }
    
    // Validate required fields
    if (!session.title || !session.description || !session.startTime || !session.endTime) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields before publishing'
      });
    }
    
    const updatedSession = dataStore.updateSession(parseInt(req.params.id), { status: 'published' });
    
    res.status(200).json({
      success: true,
      data: updatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join session
// @route   POST /api/sessions/:id/join
// @access  Private
exports.joinSession = async (req, res, next) => {
  try {
    const session = dataStore.findSessionById(parseInt(req.params.id));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Check if session is available for booking
    if (session.status !== 'published' && session.status !== 'booking') {
      return res.status(400).json({
        success: false,
        error: 'Session is not available for booking'
      });
    }
    
    // Check if user can join
    if (session.currentParticipants >= session.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Session is full'
      });
    }
    
    // Add user to session
    session.currentParticipants += 1;
    if (!session.participants) session.participants = [];
    session.participants.push({ user: req.user.id, joinedAt: new Date() });
    
    // Update session status to booking if it was published
    if (session.status === 'published') {
      session.status = 'booking';
    }
    
    dataStore.updateSession(session.id, session);
    
    res.status(200).json({
      success: true,
      message: 'Successfully joined session',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave session
// @route   POST /api/sessions/:id/leave
// @access  Private
exports.leaveSession = async (req, res, next) => {
  try {
    const session = dataStore.findSessionById(parseInt(req.params.id));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Remove user from session
    if (session.participants) {
      session.participants = session.participants.filter(p => p.user !== req.user.id);
      session.currentParticipants = Math.max(0, session.currentParticipants - 1);
      dataStore.updateSession(session.id, session);
    }
    
    res.status(200).json({
      success: true,
      message: 'Successfully left session',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start session
// @route   PUT /api/sessions/:id/start
// @access  Private (Chef only)
exports.startSession = async (req, res, next) => {
  try {
    const session = dataStore.findSessionById(parseInt(req.params.id));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Check if user is the chef who created this session
    if (session.chef !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to start this session'
      });
    }
    
    // Check if session can be started
    if (session.status !== 'booking' && session.status !== 'full') {
      return res.status(400).json({
        success: false,
        error: 'Session cannot be started'
      });
    }
    
    const updatedSession = dataStore.updateSession(parseInt(req.params.id), {
      status: 'in-progress',
      isLive: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Session started successfully',
      data: updatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End session
// @route   PUT /api/sessions/:id/end
// @access  Private (Chef only)
exports.endSession = async (req, res, next) => {
  try {
    const session = dataStore.findSessionById(parseInt(req.params.id));
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Check if user is the chef who created this session
    if (session.chef !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to end this session'
      });
    }
    
    // Check if session can be ended
    if (session.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        error: 'Session is not in progress'
      });
    }
    
    const updatedSession = dataStore.updateSession(parseInt(req.params.id), {
      status: 'completed',
      isLive: false,
      endTime: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Session ended successfully',
      data: updatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available sessions
// @route   GET /api/sessions/available
// @access  Public
exports.getAvailableSessions = async (req, res, next) => {
  try {
    const { cuisine, difficulty, skillLevel, chef, page = 1, limit = 10 } = req.query;
    
    let sessions = dataStore.getAllSessions().filter(s => 
      s.status === 'published' || s.status === 'booking'
    );
    
    // Apply filters
    if (cuisine) sessions = sessions.filter(s => s.cuisine === cuisine);
    if (difficulty) sessions = sessions.filter(s => s.difficulty === difficulty);
    if (skillLevel) sessions = sessions.filter(s => s.skillLevel === skillLevel);
    if (chef) sessions = sessions.filter(s => s.chef === parseInt(chef));
    
    const total = sessions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSessions = sessions.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: paginatedSessions.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: paginatedSessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search sessions
// @route   GET /api/sessions/search
// @access  Public
exports.searchSessions = async (req, res, next) => {
  try {
    const { q, cuisine, difficulty, skillLevel, priceRange, page = 1, limit = 10 } = req.query;
    
    let sessions = dataStore.getAllSessions().filter(s => 
      s.status === 'published' || s.status === 'booking'
    );
    
    // Text search
    if (q) {
      sessions = sessions.filter(s => 
        s.title.toLowerCase().includes(q.toLowerCase()) ||
        s.description.toLowerCase().includes(q.toLowerCase()) ||
        s.cuisine.toLowerCase().includes(q.toLowerCase())
      );
    }
    
    // Filters
    if (cuisine) sessions = sessions.filter(s => s.cuisine === cuisine);
    if (difficulty) sessions = sessions.filter(s => s.difficulty === difficulty);
    if (skillLevel) sessions = sessions.filter(s => s.skillLevel === skillLevel);
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      sessions = sessions.filter(s => s.price >= min && s.price <= max);
    }
    
    // Sort by start time
    sessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    const total = sessions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSessions = sessions.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: paginatedSessions.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: paginatedSessions
    });
  } catch (error) {
    next(error);
  }
};
