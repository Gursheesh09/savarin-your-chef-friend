const jwt = require('jsonwebtoken');
const dataStore = require('../dataStore');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

    // Check if user still exists
    const user = dataStore.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists'
      });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Optional authentication (user can be authenticated or not)
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
      const user = dataStore.findUserById(decoded.id);
      
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we don't block the request
      console.log('Invalid token in optional auth:', error.message);
    }
  }

  next();
};

// Rate limiting middleware
exports.rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (requests.has(ip)) {
      requests.set(ip, requests.get(ip).filter(timestamp => timestamp > windowStart));
    }

    const currentRequests = requests.get(ip) || [];
    
    if (currentRequests.length >= max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later'
      });
    }

    currentRequests.push(now);
    requests.set(ip, currentRequests);

    next();
  };
};

// Validate request body
exports.validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  };
};

// Check if user is verified (simplified for in-memory storage)
exports.requireVerification = (req, res, next) => {
  // For demo purposes, all users are considered verified
  next();
};

// Check if chef is verified (simplified for in-memory storage)
exports.requireChefVerification = (req, res, next) => {
  if (req.user.role !== 'chef') {
    return res.status(403).json({
      success: false,
      error: 'This route is only for chefs'
    });
  }
  // For demo purposes, all chefs are considered verified
  next();
};

// Check if user is active (simplified for in-memory storage)
exports.requireActiveUser = (req, res, next) => {
  // For demo purposes, all users are considered active
  next();
};
