const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Session description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Chef Information
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Chef is required']
  },
  
  // Session Details
  cuisine: {
    type: String,
    required: [true, 'Cuisine is required'],
    enum: ['Italian', 'Indian', 'French', 'Japanese', 'Mexican', 'Thai', 'Chinese', 'Mediterranean', 'American', 'Other']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  skillLevel: {
    type: String,
    required: [true, 'Skill level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  
  // Learning Goals
  learningGoals: [{
    type: String,
    maxlength: [100, 'Learning goal cannot exceed 100 characters']
  }],
  
  // Personalization
  personalization: [{
    type: String,
    enum: ['Dietary restrictions', 'Time management', 'Equipment alternatives', 'Cultural context', 'Spice tolerance', 'Family portions', 'Leftover ideas', 'Fish alternatives', 'Equipment setup']
  }],
  
  // Session Type & Capacity
  sessionType: {
    type: String,
    enum: ['group', 'private', 'workshop'],
    default: 'group'
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Maximum participants is required'],
    min: [1, 'Minimum 1 participant'],
    max: [20, 'Maximum 20 participants']
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  
  // Timing & Duration
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [30, 'Minimum duration is 30 minutes'],
    max: [480, 'Maximum duration is 8 hours']
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [5, 'Minimum price is $5'],
    max: [500, 'Maximum price is $500']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Status & State
  status: {
    type: String,
    enum: ['draft', 'published', 'booking', 'full', 'in-progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  isLive: {
    type: Boolean,
    default: false
  },
  
  // Content & Materials
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    quantity: String,
    unit: String,
    optional: {
      type: Boolean,
      default: false
    }
  }],
  
  equipment: [{
    name: String,
    optional: {
      type: Boolean,
      default: false
    }
  }],
  
  recipe: {
    steps: [{
      stepNumber: Number,
      description: String,
      duration: Number, // in minutes
      tips: String
    }],
    totalPrepTime: Number,
    totalCookTime: Number,
    servings: Number
  },
  
  // Session Flow
  sessionFlow: [{
    phase: {
      type: String,
      enum: ['introduction', 'ingredient-prep', 'cooking', 'plating', 'tasting', 'cleanup', 'q&a']
    },
    title: String,
    description: String,
    duration: Number,
    order: Number
  }],
  
  // Real-time Features
  chatEnabled: {
    type: Boolean,
    default: true
  },
  videoEnabled: {
    type: Boolean,
    default: true
  },
  recordingEnabled: {
    type: Boolean,
    default: false
  },
  
  // Room & Connection
  roomId: {
    type: String,
    unique: true,
    sparse: true
  },
  meetingLink: String,
  meetingPassword: String,
  
  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ['student', 'observer'],
      default: 'student'
    }
  }],
  
  // Reviews & Ratings
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  bookings: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Tags & Categories
  tags: [String],
  categories: [String],
  
  // SEO & Discovery
  metaTitle: String,
  metaDescription: String,
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Moderation
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  
  // Cancellation Policy
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'moderate'
  },
  cancellationDeadline: {
    type: Date
  },
  
  // Special Features
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredUntil: Date,
  
  // Language
  language: {
    type: String,
    default: 'English'
  },
  
  // Accessibility
  accessibility: [{
    type: String,
    enum: ['closed-captions', 'sign-language', 'audio-description', 'wheelchair-accessible']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for session status
sessionSchema.virtual('isUpcoming').get(function() {
  return this.startTime > new Date() && this.status === 'booking';
});

sessionSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return this.startTime <= now && this.endTime >= now && this.status === 'in-progress';
});

sessionSchema.virtual('isCompleted').get(function() {
  return this.endTime < new Date() && this.status === 'completed';
});

sessionSchema.virtual('isCancelled').get(function() {
  return this.status === 'cancelled';
});

// Virtual for availability
sessionSchema.virtual('isAvailable').get(function() {
  return this.status === 'booking' && this.currentParticipants < this.maxParticipants;
});

sessionSchema.virtual('spotsLeft').get(function() {
  return Math.max(0, this.maxParticipants - this.currentParticipants);
});

// Virtual for average rating
sessionSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / this.reviews.length).toFixed(1);
});

// Indexes for performance
sessionSchema.index({ chef: 1, startTime: 1 });
sessionSchema.index({ status: 1, startTime: 1 });
sessionSchema.index({ cuisine: 1, difficulty: 1, skillLevel: 1 });
sessionSchema.index({ 
  title: 'text', 
  description: 'text', 
  'learningGoals': 'text',
  tags: 'text'
});

// Pre-save middleware
sessionSchema.pre('save', function(next) {
  // Auto-generate room ID if not provided
  if (!this.roomId && this.status === 'published') {
    this.roomId = `session_${this._id}_${Date.now()}`;
  }
  
  // Auto-generate slug if not provided
  if (!this.slug) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  next();
});

// Method to check if user can join
sessionSchema.methods.canJoin = function(userId) {
  if (this.status !== 'booking') return false;
  if (this.currentParticipants >= this.maxParticipants) return false;
  
  // Check if user is already a participant
  const isParticipant = this.participants.some(p => 
    p.user.toString() === userId.toString() && p.isActive
  );
  
  return !isParticipant;
};

// Method to add participant
sessionSchema.methods.addParticipant = function(userId, role = 'student') {
  if (!this.canJoin(userId)) {
    throw new Error('Cannot join this session');
  }
  
  this.participants.push({
    user: userId,
    role: role,
    joinedAt: new Date(),
    isActive: true
  });
  
  this.currentParticipants += 1;
  
  // Check if session is now full
  if (this.currentParticipants >= this.maxParticipants) {
    this.status = 'full';
  }
  
  return this.save();
};

// Method to remove participant
sessionSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(p => 
    p.user.toString() === userId.toString() && p.isActive
  );
  
  if (participant) {
    participant.isActive = false;
    participant.leftAt = new Date();
    this.currentParticipants = Math.max(0, this.currentParticipants - 1);
    
    // If session was full and now has space, reopen booking
    if (this.status === 'full' && this.currentParticipants < this.maxParticipants) {
      this.status = 'booking';
    }
    
    return this.save();
  }
  
  return this;
};

// Static method to find available sessions
sessionSchema.statics.findAvailable = function(filters = {}) {
  const query = {
    status: 'booking',
    startTime: { $gt: new Date() }
  };
  
  if (filters.cuisine) query.cuisine = filters.cuisine;
  if (filters.difficulty) query.difficulty = filters.difficulty;
  if (filters.skillLevel) query.skillLevel = filters.skillLevel;
  if (filters.chef) query.chef = filters.chef;
  
  return this.find(query)
    .populate('chef', 'firstName lastName avatar chefProfile.rating chefProfile.reviewCount')
    .sort({ startTime: 1 });
};

module.exports = mongoose.model('Session', sessionSchema);
