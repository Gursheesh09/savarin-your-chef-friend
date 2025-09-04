import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, Clock, ChefHat, Globe, MessageCircle, Send, ArrowLeft, Play, Pause } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CookingSession {
  id: string;
  title: string;
  host: {
    name: string;
    avatar: string;
    level: string;
  };
  recipe: string;
  participants: number;
  maxParticipants: number;
  startTime: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  cuisine: string;
  isLive: boolean;
  description: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: "message" | "tip" | "timing";
}

const mockSessions: CookingSession[] = [
  {
    id: "1",
    title: "Perfect Pasta Carbonara",
    host: { name: "Chef Maria", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria", level: "Master Chef" },
    recipe: "Traditional Italian Carbonara",
    participants: 12,
    maxParticipants: 20,
    startTime: "2:00 PM",
    duration: "45 min",
    difficulty: "Intermediate",
    cuisine: "Italian",
    isLive: true,
    description: "Learn the authentic way to make creamy carbonara without cream!"
  },
  {
    id: "2", 
    title: "Beginner's Bread Baking",
    host: { name: "Baker Tom", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom", level: "Bread Expert" },
    recipe: "Classic Sourdough Loaf",
    participants: 8,
    maxParticipants: 15,
    startTime: "3:30 PM",
    duration: "2 hours",
    difficulty: "Beginner",
    cuisine: "French",
    isLive: true,
    description: "Master the basics of bread making with step-by-step guidance"
  },
  {
    id: "3",
    title: "Thai Curry Masterclass",
    host: { name: "Chef Anong", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anong", level: "Cuisine Specialist" },
    recipe: "Green Curry with Chicken",
    participants: 15,
    maxParticipants: 25,
    startTime: "4:15 PM", 
    duration: "1 hour",
    difficulty: "Advanced",
    cuisine: "Thai",
    isLive: false,
    description: "Authentic Thai flavors with homemade curry paste"
  }
];

const mockChatMessages: ChatMessage[] = [
  { id: "1", sender: "Chef Maria", message: "Welcome everyone! Let's start by gathering our ingredients", timestamp: "2:02 PM", type: "message" },
  { id: "2", sender: "CookingBot", message: "💡 Pro tip: Room temperature eggs work best for carbonara", timestamp: "2:05 PM", type: "tip" },
  { id: "3", sender: "Sarah_Cooks", message: "My eggs are still cold, should I wait?", timestamp: "2:06 PM", type: "message" },
  { id: "4", sender: "Chef Maria", message: "You can warm them in lukewarm water for 5 minutes", timestamp: "2:07 PM", type: "message" },
  { id: "5", sender: "CookingBot", message: "⏰ Timer: 3 minutes remaining for pasta cooking", timestamp: "2:15 PM", type: "timing" }
];

export const CookingSessions = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<CookingSession | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState("");

  const joinSession = (session: CookingSession) => {
    setActiveSession(session);
    toast({
      title: "Joined Session!",
      description: `You're now cooking ${session.recipe} with ${session.host.name}`,
    });
  };

  const leaveSession = () => {
    setActiveSession(null);
    toast({
      title: "Left Session",
      description: "You can rejoin anytime or browse other sessions",
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: "message"
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300";
      case "Intermediate": return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      case "Advanced": return "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "tip": return "💡";
      case "timing": return "⏰";
      default: return "";
    }
  };

  if (activeSession) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={leaveSession}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Leave Session
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-charcoal">{activeSession.title}</h1>
                  <p className="text-sm text-muted-foreground">with {activeSession.host.name}</p>
                </div>
              </div>
              <Badge className={getDifficultyColor(activeSession.difficulty)}>
                {activeSession.difficulty}
              </Badge>
            </div>
          </div>
        </header>

        {/* Active Session Interface */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video/Recipe Area */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={activeSession.host.avatar} />
                        <AvatarFallback>{activeSession.host.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{activeSession.host.name}</CardTitle>
                        <CardDescription>{activeSession.host.level}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeSession.isLive && (
                        <Badge variant="destructive" className="animate-pulse">
                          🔴 LIVE
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        {activeSession.participants}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mock Video Player */}
                  <div className="aspect-video bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-primary-foreground">
                      <Play className="w-16 h-16 mx-auto mb-2 opacity-75" />
                      <p className="text-lg font-medium">Live Cooking Stream</p>
                      <p className="text-sm opacity-75">Making {activeSession.recipe}</p>
                    </div>
                  </div>
                  
                  {/* Session Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">{activeSession.duration}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div>
                      <Globe className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">{activeSession.cuisine}</p>
                      <p className="text-xs text-muted-foreground">Cuisine</p>
                    </div>
                    <div>
                      <ChefHat className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">{activeSession.difficulty}</p>
                      <p className="text-xs text-muted-foreground">Level</p>
                    </div>
                    <div>
                      <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">{activeSession.participants}/{activeSession.maxParticipants}</p>
                      <p className="text-xs text-muted-foreground">Cooks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-1">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-4">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-charcoal">
                              {getMessageTypeIcon(msg.type)} {msg.sender}
                            </span>
                            <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                          </div>
                          <p className={`text-sm ${msg.type === 'tip' ? 'text-primary' : msg.type === 'timing' ? 'text-amber-600' : 'text-muted-foreground'}`}>
                            {msg.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <Separator />
                  
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question or share a tip..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-charcoal mb-2">Live Cooking Sessions</h1>
              <p className="text-muted-foreground">Join live cooking classes with expert chefs from around the world</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back Home
              </Button>
              <Button onClick={() => navigate('/demo')}>
                🎤 Start Voice Chef
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sessions Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSessions.map((session) => (
            <Card key={session.id} className="group hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={session.host.avatar} />
                      <AvatarFallback>{session.host.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-charcoal">{session.host.name}</p>
                      <p className="text-xs text-muted-foreground">{session.host.level}</p>
                    </div>
                  </div>
                  {session.isLive && (
                    <Badge variant="destructive" className="animate-pulse">
                      🔴 LIVE
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {session.title}
                </CardTitle>
                <CardDescription>{session.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{session.startTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{session.participants}/{session.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(session.difficulty)}>
                        {session.difficulty}
                      </Badge>
                      <Badge variant="outline">{session.cuisine}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{session.duration}</span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={session.isLive ? "default" : "outline"}
                    onClick={() => joinSession(session)}
                    disabled={session.participants >= session.maxParticipants}
                  >
                    {session.participants >= session.maxParticipants ? 'Session Full' : 
                     session.isLive ? 'Join Live Session' : 'Join When Live'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Community Stats */}
        <div className="mt-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Community Cooking Stats</CardTitle>
              <CardDescription>Join thousands of passionate home cooks learning together</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">2,547</p>
                  <p className="text-sm text-muted-foreground">Active Cooks Today</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">18</p>
                  <p className="text-sm text-muted-foreground">Live Sessions Now</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">156</p>
                  <p className="text-sm text-muted-foreground">Recipes Mastered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">4.9</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};