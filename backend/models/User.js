const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  
  // Role & Status
  role: {
    type: String,
    enum: ['student', 'chef', 'admin'],
    default: 'student'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  
  // Location
  country: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Preferences
  preferredCuisines: [{
    type: String,
    enum: ['Italian', 'Indian', 'French', 'Japanese', 'Mexican', 'Thai', 'Chinese', 'Mediterranean', 'American', 'Other']
  }],
  dietaryRestrictions: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher', 'None']
  }],
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  learningGoals: [{
    type: String,
    maxlength: [100, 'Learning goal cannot exceed 100 characters']
  }],
  
  // Chef-specific fields (only for chef role)
  chefProfile: {
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    experience: {
      type: String,
      enum: ['0-2 years', '3-5 years', '6-10 years', '10+ years']
    },
    specialties: [{
      type: String,
      maxlength: [50, 'Specialty cannot exceed 50 characters']
    }],
    languages: [{
      type: String,
      maxlength: [30, 'Language cannot exceed 30 characters']
    }],
    hourlyRate: {
      type: Number,
      min: [10, 'Hourly rate must be at least $10'],
      max: [500, 'Hourly rate cannot exceed $500']
    },
    availability: {
      monday: { start: String, end: String, available: { type: Boolean, default: false } },
      tuesday: { start: String, end: String, available: { type: Boolean, default: false } },
      wednesday: { start: String, end: String, available: { type: Boolean, default: false } },
      thursday: { start: String, end: String, available: { type: Boolean, default: false } },
      friday: { start: String, end: String, available: { type: Boolean, default: false } },
      saturday: { start: String, end: String, available: { type: Boolean, default: false } },
      sunday: { start: String, end: String, available: { type: Boolean, default: false } }
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    nextAvailable: {
      type: Date
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    verificationDocuments: [{
      type: String,
      required: function() { return this.role === 'chef'; }
    }],
    isVerifiedChef: {
      type: Boolean,
      default: false
    }
  },
  
  // Student-specific fields (only for student role)
  studentProfile: {
    favoriteChefs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    completedSessions: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  
  // Account Settings
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  marketingEmails: {
    type: Boolean,
    default: false
  },
  
  // Security
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  if (this.role === 'chef') {
    return `Chef ${this.firstName} ${this.lastName}`;
  }
  return this.fullName;
});

// Index for search
userSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text',
  'chefProfile.specialties': 'text',
  'chefProfile.bio': 'text'
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
