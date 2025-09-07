// Simple in-memory data store for development
// This replaces MongoDB temporarily so we can test the API

class InMemoryStore {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.chefs = new Map();
    this.nextUserId = 1;
    this.nextSessionId = 1;
    this.nextChefId = 1;
    
    // Add some sample data
    this.initializeSampleData();
  }
  
  initializeSampleData() {
    // Sample Chef
    const chef1 = {
      id: this.nextChefId++,
      firstName: "Isabella",
      lastName: "Rossi",
      email: "chef.isabella@example.com",
      role: "chef",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=isabella",
      city: "Rome",
      country: "Italy",
      skillLevel: "Intermediate",
      preferredCuisines: ["Italian"],
      chefProfile: {
        bio: "Authentic Italian chef from Rome, specializing in traditional pasta and pizza.",
        experience: "15+ years",
        specialties: ["Pasta", "Pizza", "Risotto", "Tiramisu"],
        hourlyRate: 85,
        rating: 4.9,
        reviewCount: 127,
        isOnline: true,
        nextAvailable: "2:00 PM",
        totalSessions: 342,
        isVerifiedChef: true
      }
    };
    
    // Sample Session
    const session1 = {
      id: this.nextSessionId++,
      title: "Perfect Homemade Pasta",
      description: "Learn to make authentic Italian pasta from scratch with Chef Isabella",
      chef: chef1.id,
      cuisine: "Italian",
      difficulty: "Intermediate",
      skillLevel: "Intermediate",
      learningGoals: ["Master pasta dough", "Learn traditional techniques", "Cultural understanding"],
      personalization: ["Dietary restrictions", "Time management", "Equipment alternatives"],
      sessionType: "group",
      maxParticipants: 8,
      currentParticipants: 3,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 3.5 * 60 * 60 * 1000), // 3.5 hours from now
      duration: 90,
      price: 45,
      status: "published",
      isLive: false,
      views: 156,
      tags: ["pasta", "italian", "homemade"],
      categories: ["cooking-basics", "italian-cuisine"]
    };
    
    this.chefs.set(chef1.id, chef1);
    this.sessions.set(session1.id, session1);
  }
  
  // User methods
  createUser(userData) {
    const user = {
      id: this.nextUserId++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  
  findUserByEmail(email) {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  findUserById(id) {
    return this.users.get(parseInt(id));
  }
  
  updateUser(id, updates) {
    const user = this.users.get(parseInt(id));
    if (user) {
      Object.assign(user, updates, { updatedAt: new Date() });
      this.users.set(parseInt(id), user);
    }
    return user;
  }
  
  // Chef methods
  getAllChefs() {
    return Array.from(this.chefs.values());
  }
  
  findChefById(id) {
    return this.chefs.get(parseInt(id));
  }
  
  // Session methods
  getAllSessions() {
    return Array.from(this.sessions.values());
  }
  
  findSessionById(id) {
    return this.sessions.get(parseInt(id));
  }
  
  createSession(sessionData) {
    const session = {
      id: this.nextSessionId++,
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sessions.set(session.id, session);
    return session;
  }
  
  updateSession(id, updates) {
    const session = this.sessions.get(parseInt(id));
    if (session) {
      Object.assign(session, updates, { updatedAt: new Date() });
      this.sessions.set(parseInt(id), session);
    }
    return session;
  }
  
  // Search methods
  searchChefs(query) {
    const chefs = Array.from(this.chefs.values());
    if (!query) return chefs;
    
    return chefs.filter(chef => 
      chef.firstName.toLowerCase().includes(query.toLowerCase()) ||
      chef.lastName.toLowerCase().includes(query.toLowerCase()) ||
      chef.chefProfile.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))
    );
  }
  
  searchSessions(query) {
    const sessions = Array.from(this.sessions.values());
    if (!query) return sessions;
    
    return sessions.filter(session => 
      session.title.toLowerCase().includes(query.toLowerCase()) ||
      session.description.toLowerCase().includes(query.toLowerCase()) ||
      session.cuisine.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = new InMemoryStore();
