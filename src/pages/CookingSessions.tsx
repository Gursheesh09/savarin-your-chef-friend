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
      case "Beginner": return "bg-green-100 text-green-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={leaveSession} className="border-gray-300 text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Leave Session
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{activeSession.title}</h1>
                  <p className="text-sm text-gray-600">with {activeSession.host.name}</p>
                </div>
              </div>
              <Badge className={getDifficultyColor(activeSession.difficulty)}>
                {activeSession.difficulty}
              </Badge>
            </div>
          </div>
        </header>

        {/* Active Session Interface */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video/Recipe Area */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={activeSession.host.avatar} />
                        <AvatarFallback>{activeSession.host.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-gray-900">{activeSession.host.name}</CardTitle>
                        <CardDescription className="text-gray-600">{activeSession.host.level}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeSession.isLive && (
                        <Badge variant="destructive" className="animate-pulse">
                          🔴 LIVE
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {activeSession.participants}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Cooking Session</h3>
                    <p className="text-gray-600">Join the live cooking session with {activeSession.host.name}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 mb-4">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{message.sender}</span>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                              {message.type !== "message" && (
                                <span className="text-xs">{getMessageTypeIcon(message.type)}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border-gray-300"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Sessions List
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Cooking Sessions</h1>
              <p className="text-gray-600">Join live cooking classes with professional chefs</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Sessions Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSessions.map((session) => (
            <Card key={session.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getDifficultyColor(session.difficulty)}>
                    {session.difficulty}
                  </Badge>
                  {session.isLive && (
                    <Badge variant="destructive" className="animate-pulse">
                      🔴 LIVE
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-lg text-gray-900 mb-2">{session.title}</CardTitle>
                <CardDescription className="text-gray-600 mb-3">{session.description}</CardDescription>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {session.cuisine}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session.host.avatar} />
                      <AvatarFallback>{session.host.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.host.name}</p>
                      <p className="text-xs text-gray-500">{session.host.level}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{session.startTime}</p>
                    <p className="text-xs text-gray-500">
                      {session.participants}/{session.maxParticipants} participants
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => joinSession(session)}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Join Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};