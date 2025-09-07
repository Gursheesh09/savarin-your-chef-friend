import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  ChefHat, 
  Clock, 
  Users, 
  Star, 
  Globe, 
  Video, 
  Calendar,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Clock3,
  Target,
  BookOpen,
  Heart,
  Zap,
  UserCheck,
  ArrowUp
} from "lucide-react";
import { LiveVideoSession } from "./LiveVideoSession";

interface Chef {
  id: string;
  name: string;
  avatar: string;
  cuisine: string;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  specialties: string[];
  hourlyRate: number;
  languages: string[];
  isOnline: boolean;
  nextAvailable: string;
  totalSessions: number;
  bio: string;
  teachingStyle: string[];
  skillLevels: string[];
  personalization: string[];
}

interface Session {
  id: string;
  chefId: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  startTime: string;
  cuisine: string;
  difficulty: string;
  isLive: boolean;
  skillLevel: string;
  learningGoals: string[];
  personalization: string[];
}

const mockChefs: Chef[] = [
  {
    id: "1",
    name: "Chef Isabella Rossi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=isabella",
    cuisine: "Italian",
    location: "Rome, Italy",
    rating: 4.9,
    reviews: 127,
    experience: "15+ years",
    specialties: ["Pasta", "Pizza", "Risotto", "Tiramisu"],
    hourlyRate: 85,
    languages: ["English", "Italian", "Spanish"],
    isOnline: true,
    nextAvailable: "2:00 PM",
    totalSessions: 342,
    bio: "Authentic Italian chef from Rome, specializing in traditional pasta and pizza. Learn the secrets of Italian cooking from a native chef!",
    teachingStyle: ["Patient", "Step-by-step", "Cultural stories", "Family recipes"],
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    personalization: ["Dietary restrictions", "Time constraints", "Cultural background", "Learning pace"]
  },
  {
    id: "2",
    name: "Chef Raj Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=raj",
    cuisine: "Indian",
    location: "Mumbai, India",
    rating: 4.8,
    reviews: 89,
    experience: "12+ years",
    specialties: ["Curry", "Biryani", "Tandoori", "Naan"],
    hourlyRate: 65,
    languages: ["English", "Hindi", "Gujarati"],
    isOnline: true,
    nextAvailable: "3:30 PM",
    totalSessions: 256,
    bio: "Expert in authentic Indian cuisine, from street food to royal dishes. Discover the rich flavors of India!",
    teachingStyle: ["Interactive", "Spice education", "Regional variations", "Health-focused"],
    skillLevels: ["Beginner", "Intermediate"],
    personalization: ["Spice tolerance", "Regional preferences", "Health goals", "Family size"]
  },
  {
    id: "3",
    name: "Chef Marie Dubois",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie",
    cuisine: "French",
    location: "Paris, France",
    rating: 4.9,
    reviews: 203,
    experience: "20+ years",
    specialties: ["Sauces", "Pastries", "Bouillabaisse", "Coq au Vin"],
    hourlyRate: 120,
    languages: ["English", "French"],
    isOnline: false,
    nextAvailable: "Tomorrow 10:00 AM",
    totalSessions: 567,
    bio: "Classically trained French chef with experience in Michelin-starred restaurants. Master the art of French cooking!",
    teachingStyle: ["Classical technique", "Precision-focused", "Elegant presentation", "Wine pairing"],
    skillLevels: ["Intermediate", "Advanced"],
    personalization: ["Technique focus", "Presentation skills", "Wine knowledge", "Special occasions"]
  },
  {
    id: "4",
    name: "Chef Takashi Yamamoto",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=takashi",
    cuisine: "Japanese",
    location: "Tokyo, Japan",
    rating: 4.7,
    reviews: 156,
    experience: "18+ years",
    specialties: ["Sushi", "Ramen", "Tempura", "Miso"],
    hourlyRate: 95,
    languages: ["English", "Japanese"],
    isOnline: true,
    nextAvailable: "4:00 PM",
    totalSessions: 289,
    bio: "Master of Japanese cuisine, from traditional sushi to modern fusion. Learn the precision and artistry of Japanese cooking!",
    teachingStyle: ["Zen approach", "Precision technique", "Seasonal focus", "Cultural philosophy"],
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    personalization: ["Knife skills", "Seasonal ingredients", "Cultural understanding", "Meditation through cooking"]
  }
];

const mockSessions: Session[] = [
  {
    id: "1",
    chefId: "1",
    title: "Perfect Homemade Pasta",
    description: "Learn to make authentic Italian pasta from scratch with Chef Isabella",
    duration: 90,
    price: 45,
    maxParticipants: 8,
    currentParticipants: 3,
    startTime: "2:00 PM",
    cuisine: "Italian",
    difficulty: "Intermediate",
    isLive: false,
    skillLevel: "Intermediate",
    learningGoals: ["Master pasta dough", "Learn traditional techniques", "Cultural understanding"],
    personalization: ["Dietary restrictions", "Time management", "Equipment alternatives"]
  },
  {
    id: "2",
    chefId: "2",
    title: "Butter Chicken Masterclass",
    description: "Master the iconic Indian dish with Chef Raj's secret recipe",
    duration: 75,
    price: 35,
    maxParticipants: 6,
    currentParticipants: 4,
    startTime: "3:30 PM",
    cuisine: "Indian",
    difficulty: "Beginner",
    isLive: false,
    skillLevel: "Beginner",
    learningGoals: ["Basic Indian cooking", "Spice management", "Quick weeknight meals"],
    personalization: ["Spice tolerance", "Family portions", "Leftover ideas"]
  },
  {
    id: "3",
    chefId: "4",
    title: "Sushi Making Basics",
    description: "Learn sushi fundamentals with Chef Takashi",
    duration: 120,
    price: 60,
    maxParticipants: 4,
    currentParticipants: 2,
    startTime: "4:00 PM",
    cuisine: "Japanese",
    difficulty: "Beginner",
    isLive: false,
    skillLevel: "Beginner",
    learningGoals: ["Sushi fundamentals", "Knife skills", "Japanese culture"],
    personalization: ["Fish alternatives", "Equipment setup", "Cultural context"]
  }
];

export const LiveChefMarketplace = () => {
  const [chefs, setChefs] = useState<Chef[]>(mockChefs);
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("");
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isInSession, setIsInSession] = useState(false);
  const [currentSessionChef, setCurrentSessionChef] = useState<Chef | null>(null);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const cuisines = ["All", "Italian", "Indian", "French", "Japanese", "Mexican", "Thai", "Chinese", "Mediterranean"];
  const skillLevels = ["All", "Beginner", "Intermediate", "Advanced"];

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredChefs = chefs.filter(chef => {
    const matchesSearch = chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chef.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCuisine = selectedCuisine === "" || selectedCuisine === "All" || chef.cuisine === selectedCuisine;
    const matchesSkill = selectedSkillLevel === "" || selectedSkillLevel === "All" || chef.skillLevels.includes(selectedSkillLevel);
    return matchesSearch && matchesCuisine && matchesSkill;
  });

  const handleChefSelect = (chef: Chef) => {
    setSelectedChef(chef);
    setSelectedSession(null);
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    setSelectedChef(null);
  };

  const handleBookSession = (session: Session) => {
    const chef = chefs.find(c => c.id === session.chefId);
    if (chef) {
      setCurrentSessionChef(chef);
      setIsInSession(true);
    }
  };

  const handleBookChef = (chef: Chef) => {
    setCurrentSessionChef(chef);
    setIsInSession(true);
  };

  const handleEndSession = () => {
    setIsInSession(false);
    setCurrentSessionChef(null);
  };

  // If in a live session, show the video interface
  if (isInSession && currentSessionChef) {
    return (
      <LiveVideoSession 
        chef={currentSessionChef} 
        onEndSession={handleEndSession} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Live Chef Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn to cook with professional chefs from around the world in live, interactive sessions
            </p>
            
            {/* Personalization Banner */}
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">Personalized Learning Experience</span>
              </div>
              <p className="text-sm text-orange-700">
                Unlike YouTube, we match you with chefs based on your skill level, learning goals, and personal preferences. 
                Get one-on-one guidance tailored just for you!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search chefs, cuisines, or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            <div className="flex gap-2">
              {cuisines.map((cuisine) => (
                <Button
                  key={cuisine}
                  variant={selectedCuisine === cuisine ? "default" : "outline"}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={selectedCuisine === cuisine ? "bg-orange-500 hover:bg-orange-600" : "border-gray-300"}
                >
                  {cuisine}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Skill Level Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Skill Level:</h3>
            <div className="flex gap-2">
              {skillLevels.map((level) => (
                <Button
                  key={level}
                  variant={selectedSkillLevel === level ? "default" : "outline"}
                  onClick={() => setSelectedSkillLevel(level)}
                  className={selectedSkillLevel === level ? "bg-orange-500 hover:bg-orange-600" : "border-gray-300"}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Sessions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Sessions Starting Soon</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => {
              const chef = chefs.find(c => c.id === session.chefId);
              return (
                <Card 
                  key={session.id} 
                  className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => handleSessionSelect(session)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-green-100 text-green-700">
                        {session.isLive ? "🔴 LIVE" : "Starting Soon"}
                      </Badge>
                      <Badge className="bg-orange-100 text-orange-700">
                        ${session.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-900 mb-2">{session.title}</CardTitle>
                    <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                    
                    {/* Learning Goals */}
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-700 mb-2">Learning Goals:</div>
                      <div className="flex flex-wrap gap-1">
                        {session.learningGoals.slice(0, 2).map((goal) => (
                          <Badge key={goal} variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {session.currentParticipants}/{session.maxParticipants}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {session.skillLevel}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={chef?.avatar} />
                          <AvatarFallback>{chef?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{chef?.name}</p>
                          <p className="text-xs text-gray-500">{chef?.location}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{session.startTime}</p>
                        <p className="text-xs text-gray-500">{session.difficulty}</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookSession(session);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Chefs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Chefs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChefs.map((chef) => (
              <Card 
                key={chef.id} 
                className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => handleChefSelect(chef)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={chef.avatar} />
                        <AvatarFallback>{chef.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{chef.name}</h3>
                        <p className="text-sm text-gray-600">{chef.cuisine} Cuisine</p>
                      </div>
                    </div>
                    {chef.isOnline && (
                      <Badge className="bg-green-100 text-green-700">
                        🔴 Online
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{chef.rating}</span>
                      <span className="text-xs text-gray-500">({chef.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{chef.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{chef.bio}</p>
                  
                  {/* Teaching Style */}
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">Teaching Style:</div>
                    <div className="flex flex-wrap gap-1">
                      {chef.teachingStyle.slice(0, 2).map((style) => (
                        <Badge key={style} variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Skill Levels */}
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">Teaches:</div>
                    <div className="flex flex-wrap gap-1">
                      {chef.skillLevels.map((level) => (
                        <Badge key={level} variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {chef.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs border-gray-300">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600">${chef.hourlyRate}</p>
                      <p className="text-xs text-gray-500">per hour</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{chef.totalSessions}</p>
                      <p className="text-xs text-gray-500">sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{chef.experience}</p>
                      <p className="text-xs text-gray-500">experience</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookChef(chef);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Book Private Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chef Detail Modal */}
        {selectedChef && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900">{selectedChef.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedChef(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={selectedChef.avatar} />
                      <AvatarFallback>{selectedChef.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedChef.cuisine} Cuisine</h3>
                      <p className="text-gray-600">{selectedChef.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-medium">{selectedChef.rating}</span>
                        <span className="text-gray-500">({selectedChef.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-gray-600">{selectedChef.bio}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Teaching Style</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChef.teachingStyle.map((style) => (
                        <Badge key={style} className="bg-purple-100 text-purple-700">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Skill Levels</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChef.skillLevels.map((level) => (
                        <Badge key={level} className="bg-green-100 text-green-700">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Personalization</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChef.personalization.map((item) => (
                        <Badge key={item} variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChef.specialties.map((specialty) => (
                        <Badge key={specialty} className="bg-orange-100 text-orange-700">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Languages</h4>
                    <div className="flex gap-2">
                      {selectedChef.languages.map((language) => (
                        <Badge key={language} variant="outline" className="border-gray-300">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">${selectedChef.hourlyRate}</p>
                      <p className="text-sm text-gray-600">per hour</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedChef.totalSessions}</p>
                      <p className="text-sm text-gray-600">sessions completed</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={() => {
                        setSelectedChef(null);
                        handleBookChef(selectedChef);
                      }}
                    >
                      Book Private Session
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-300">
                      View Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Session Detail Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900">{selectedSession.title}</CardTitle>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedSession(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-gray-800">{selectedSession.description}</p>
                  </div>
                  
                  {/* Learning Goals */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What You'll Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSession.learningGoals.map((goal) => (
                        <Badge key={goal} className="bg-blue-100 text-blue-700">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Personalization */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Personalized For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSession.personalization.map((item) => (
                        <Badge key={item} variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock3 className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <p className="font-medium">{selectedSession.duration} minutes</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Users className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <p className="font-medium">{selectedSession.currentParticipants}/{selectedSession.maxParticipants}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <p className="font-medium">{selectedSession.cuisine}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Target className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <p className="font-medium">{selectedSession.skillLevel}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600 mb-2">${selectedSession.price}</p>
                    <p className="text-gray-600">per person</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3"
                    onClick={() => {
                      setSelectedSession(null);
                      handleBookSession(selectedSession);
                    }}
                  >
                    Book This Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg z-40"
          size="sm"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};
