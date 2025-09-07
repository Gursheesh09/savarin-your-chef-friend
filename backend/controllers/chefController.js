const dataStore = require('../dataStore');

// @desc    Get all chefs
// @route   GET /api/chefs
// @access  Public
exports.getChefs = async (req, res, next) => {
  try {
    const { cuisine, skillLevel, rating, location, isOnline, page = 1, limit = 10 } = req.query;
    
    // Get all chefs from data store
    let chefs = dataStore.getAllChefs();
    
    // Apply filters
    if (cuisine) {
      chefs = chefs.filter(chef => 
        chef.chefProfile.specialties.includes(cuisine)
      );
    }
    
    if (skillLevel) {
      chefs = chefs.filter(chef => chef.skillLevel === skillLevel);
    }
    
    if (rating) {
      chefs = chefs.filter(chef => chef.chefProfile.rating >= parseFloat(rating));
    }
    
    if (location) {
      chefs = chefs.filter(chef => 
        chef.city.toLowerCase().includes(location.toLowerCase()) ||
        chef.country.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (isOnline !== undefined) {
      chefs = chefs.filter(chef => chef.chefProfile.isOnline === (isOnline === 'true'));
    }
    
    // Pagination
    const total = chefs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedChefs = chefs.slice(startIndex, endIndex);
    
    // Sort by rating and total sessions
    paginatedChefs.sort((a, b) => {
      if (b.chefProfile.rating !== a.chefProfile.rating) {
        return b.chefProfile.rating - a.chefProfile.rating;
      }
      return b.chefProfile.totalSessions - a.chefProfile.totalSessions;
    });
    
    res.status(200).json({
      success: true,
      count: paginatedChefs.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: paginatedChefs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chef
// @route   GET /api/chefs/:id
// @access  Public
exports.getChef = async (req, res, next) => {
  try {
    const chef = dataStore.findChefById(parseInt(req.params.id));
    
    if (!chef || chef.role !== 'chef') {
      return res.status(404).json({
        success: false,
        error: 'Chef not found'
      });
    }
    
    // Get chef's upcoming sessions
    const allSessions = dataStore.getAllSessions();
    const upcomingSessions = allSessions.filter(session => 
      session.chef === chef.id && 
      ['published', 'booking'].includes(session.status) &&
      new Date(session.startTime) > new Date()
    );
    
    // Get chef's completed sessions count
    const completedSessions = allSessions.filter(session => 
      session.chef === chef.id && session.status === 'completed'
    ).length;
    
    res.status(200).json({
      success: true,
      data: {
        chef,
        upcomingSessions,
        completedSessions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chef profile
// @route   PUT /api/chefs/profile
// @access  Private (Chef only)
exports.updateChefProfile = async (req, res, next) => {
  try {
    const {
      bio,
      experience,
      specialties,
      languages,
      hourlyRate,
      availability,
      verificationDocuments
    } = req.body;
    
    // Check if user is a chef
    if (req.user.role !== 'chef') {
      return res.status(403).json({
        success: false,
        error: 'Only chefs can update chef profiles'
      });
    }
    
    const updateFields = {};
    
    if (bio !== undefined) updateFields['chefProfile.bio'] = bio;
    if (experience !== undefined) updateFields['chefProfile.experience'] = experience;
    if (specialties !== undefined) updateFields['chefProfile.specialties'] = specialties;
    if (languages !== undefined) updateFields['chefProfile.languages'] = languages;
    if (hourlyRate !== undefined) updateFields['chefProfile.hourlyRate'] = hourlyRate;
    if (availability !== undefined) updateFields['chefProfile.availability'] = availability;
    if (verificationDocuments !== undefined) updateFields['chefProfile.verificationDocuments'] = verificationDocuments;
    
    const chef = dataStore.updateUser(req.user.id, updateFields);
    
    if (!chef) {
      return res.status(404).json({
        success: false,
        error: 'Chef not found'
      });
    }
    
    // Remove password from response
    const { password: _, ...chefWithoutPassword } = chef;
    
    res.status(200).json({
      success: true,
      data: chefWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chef availability
// @route   PUT /api/chefs/availability
// @access  Private (Chef only)
exports.updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    
    if (req.user.role !== 'chef') {
      return res.status(403).json({
        success: false,
        error: 'Only chefs can update availability'
      });
    }
    
    const chef = dataStore.updateUser(req.user.id, { 'chefProfile.availability': availability });
    
    if (!chef) {
      return res.status(404).json({
        success: false,
        error: 'Chef not found'
      });
    }
    
    // Remove password from response
    const { password: _, ...chefWithoutPassword } = chef;
    
    res.status(200).json({
      success: true,
      data: chefWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set chef online/offline status
// @route   PUT /api/chefs/status
// @access  Private (Chef only)
exports.updateOnlineStatus = async (req, res, next) => {
  try {
    const { isOnline, nextAvailable } = req.body;
    
    if (req.user.role !== 'chef') {
      return res.status(403).json({
        success: false,
        error: 'Only chefs can update online status'
      });
    }
    
    const updateFields = {};
    if (isOnline !== undefined) updateFields['chefProfile.isOnline'] = isOnline;
    if (nextAvailable !== undefined) updateFields['chefProfile.nextAvailable'] = nextAvailable;
    
    const chef = dataStore.updateUser(req.user.id, updateFields);
    
    if (!chef) {
      return res.status(404).json({
        success: false,
        error: 'Chef not found'
      });
    }
    
    // Remove password from response
    const { password: _, ...chefWithoutPassword } = chef;
    
    res.status(200).json({
      success: true,
      data: chefWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chef sessions
// @route   GET /api/chefs/sessions
// @access  Private (Chef only)
exports.getChefSessions = async (req, res, next) => {
  try {
    if (req.user.role !== 'chef') {
      return res.status(403).json({
        success: false,
        error: 'Only chefs can access this route'
      });
    }
    
    const { status, page = 1, limit = 10 } = req.query;
    
    // Get all sessions for this chef
    let sessions = dataStore.getAllSessions().filter(session => session.chef === req.user.id);
    
    if (status) {
      sessions = sessions.filter(session => session.status === status);
    }
    
    // Sort by start time (newest first)
    sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
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

// @desc    Get chef analytics
// @route   GET /api/chefs/analytics
// @access  Private (Chef only)
exports.getChefAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== 'chef') {
      return res.status(403).json({
        success: false,
        error: 'Only chefs can access this route'
      });
    }
    
    const chefId = req.user.id;
    const allSessions = dataStore.getAllSessions();
    
    // Get total sessions
    const totalSessions = allSessions.filter(session => session.chef === chefId).length;
    
    // Get completed sessions
    const completedSessions = allSessions.filter(session => 
      session.chef === chefId && session.status === 'completed'
    ).length;
    
    // Get total earnings
    const earnings = allSessions
      .filter(session => session.chef === chefId && session.status === 'completed')
      .reduce((total, session) => total + session.price, 0);
    
    // Get average rating (placeholder for now)
    const averageRating = 4.8; // This would come from reviews in a real system
    
    // Get monthly stats (simplified)
    const monthlyStats = [
      { month: 'September 2024', sessions: 12, earnings: 540 },
      { month: 'August 2024', sessions: 15, earnings: 675 },
      { month: 'July 2024', sessions: 18, earnings: 810 }
    ];
    
    res.status(200).json({
      success: true,
      data: {
        totalSessions,
        completedSessions,
        completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
        totalEarnings: earnings,
        averageRating,
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search chefs
// @route   GET /api/chefs/search
// @access  Public
exports.searchChefs = async (req, res, next) => {
  try {
    const { q, cuisine, location, skillLevel, priceRange, page = 1, limit = 10 } = req.query;
    
    let chefs = dataStore.getAllChefs();
    
    // Text search
    if (q) {
      chefs = chefs.filter(chef => 
        chef.firstName.toLowerCase().includes(q.toLowerCase()) ||
        chef.lastName.toLowerCase().includes(q.toLowerCase()) ||
        chef.chefProfile.specialties.some(s => s.toLowerCase().includes(q.toLowerCase()))
      );
    }
    
    // Filters
    if (cuisine) {
      chefs = chefs.filter(chef => chef.chefProfile.specialties.includes(cuisine));
    }
    
    if (location) {
      chefs = chefs.filter(chef => 
        chef.city.toLowerCase().includes(location.toLowerCase()) ||
        chef.country.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (skillLevel) {
      chefs = chefs.filter(chef => chef.skillLevel === skillLevel);
    }
    
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      chefs = chefs.filter(chef => 
        chef.chefProfile.hourlyRate >= min && chef.chefProfile.hourlyRate <= max
      );
    }
    
    // Sort by rating and total sessions
    chefs.sort((a, b) => {
      if (b.chefProfile.rating !== a.chefProfile.rating) {
        return b.chefProfile.rating - a.chefProfile.rating;
      }
      return b.chefProfile.totalSessions - a.chefProfile.totalSessions;
    });
    
    const total = chefs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedChefs = chefs.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: paginatedChefs.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: paginatedChefs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured chefs
// @route   GET /api/chefs/featured
// @access  Public
exports.getFeaturedChefs = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    
    const featuredChefs = dataStore.getAllChefs()
      .filter(chef => 
        chef.chefProfile.isVerifiedChef && 
        chef.chefProfile.rating >= 4.5
      )
      .sort((a, b) => b.chefProfile.rating - a.chefProfile.rating)
      .slice(0, parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: featuredChefs.length,
      data: featuredChefs
    });
  } catch (error) {
    next(error);
  }
};
