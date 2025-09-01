import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Users, Video, MessageCircle, Share2, ChefHat, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CookingSession {
  id: string;
  hostName: string;
  hostAvatar: string;
  recipe: string;
  participants: number;
  maxParticipants: number;
  startTime: string;
  duration: string;
  difficulty: string;
  isLive: boolean;
  cuisine: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  currentActivity?: string;
  skillLevel: string;
  favoriteStyle: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'message' | 'tip' | 'timing';
}

export const SocialCookingNetwork = () => {
  const [activeSessions, setActiveSessions] = useState<CookingSession[]>([
    {
      id: "1",
      hostName: "Chef Maria",
      hostAvatar: "/api/placeholder/40/40",
      recipe: "Authentic Italian Risotto",
      participants: 3,
      maxParticipants: 6,
      startTime: "7:00 PM",
      duration: "45 min",
      difficulty: "Intermediate",
      isLive: true,
      cuisine: "Italian"
    },
    {
      id: "2",
      hostName: "David Kim",
      hostAvatar: "/api/placeholder/40/40",
      recipe: "Korean BBQ Tacos",
      participants: 2,
      maxParticipants: 4,
      startTime: "7:30 PM",
      duration: "30 min",
      difficulty: "Beginner",
      isLive: false,
      cuisine: "Korean"
    },
    {
      id: "3",
      hostName: "Sarah Chen",
      hostAvatar: "/api/placeholder/40/40",
      recipe: "French Macarons",
      participants: 1,
      maxParticipants: 3,
      startTime: "8:00 PM",
      duration: "90 min",
      difficulty: "Advanced",
      isLive: false,
      cuisine: "French"
    }
  ]);

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/api/placeholder/32/32",
      isOnline: true,
      currentActivity: "Making pasta",
      skillLevel: "Expert",
      favoriteStyle: "Mediterranean"
    },
    {
      id: "2",
      name: "Emma Wilson",
      avatar: "/api/placeholder/32/32",
      isOnline: true,
      currentActivity: "Baking bread",
      skillLevel: "Intermediate",
      favoriteStyle: "French"
    },
    {
      id: "3",
      name: "Mike Torres",
      avatar: "/api/placeholder/32/32",
      isOnline: false,
      skillLevel: "Beginner",
      favoriteStyle: "Mexican"
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Chef Maria",
      message: "Welcome everyone! Let's start by preparing our mise en place",
      timestamp: "7:02 PM",
      type: "message"
    },
    {
      id: "2",
      sender: "AI Assistant",
      message: "💡 Pro tip: Keep your stock warm in a separate pot for better absorption",
      timestamp: "7:05 PM",
      type: "tip"
    },
    {
      id: "3",
      sender: "Timer Bot",
      message: "🕐 Sauté onions for 2 more minutes",
      timestamp: "7:08 PM",
      type: "timing"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const { toast } = useToast();

  const joinSession = (sessionId: string) => {
    setActiveSession(sessionId);
    const session = activeSessions.find(s => s.id === sessionId);
    
    if (session) {
      setActiveSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, participants: s.participants + 1 }
            : s
        )
      );
      
      toast({
        title: "Joined Cooking Session! 👥",
        description: `You're now cooking ${session.recipe} with ${session.hostName}`,
      });
    }
  };

  const leaveSession = () => {
    if (activeSession) {
      setActiveSessions(prev =>
        prev.map(s =>
          s.id === activeSession
            ? { ...s, participants: Math.max(1, s.participants - 1) }
            : s
        )
      );
      setActiveSession(null);
      toast({
        title: "Left Session",
        description: "You can rejoin anytime or start your own session!",
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeSession) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "message"
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const inviteFriend = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      toast({
        title: "Invitation Sent! 📨",
        description: `${friend.name} has been invited to cook with you`,
      });
    }
  };

  const startNewSession = () => {
    toast({
      title: "Session Starting! 🚀",
      description: "Your cooking session is live. Invite friends to join!",
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Users className="w-6 h-6 text-primary" />
          Social Cooking Network
        </CardTitle>
        <p className="text-muted-foreground">
          Cook together with friends and family from anywhere in the world
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Active Sessions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Live Cooking Sessions</h3>
            <Button onClick={startNewSession}>
              <Video className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeSessions.map(session => (
              <Card key={session.id} className={`p-4 ${session.isLive ? 'border-primary' : ''}`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={session.hostAvatar} />
                      <AvatarFallback>{session.hostName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{session.hostName}</h4>
                      <p className="text-xs text-muted-foreground">{session.cuisine} Cuisine</p>
                    </div>
                    {session.isLive && (
                      <Badge variant="destructive" className="text-xs">
                        LIVE
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <h5 className="font-medium">{session.recipe}</h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{session.startTime} • {session.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{session.participants}/{session.maxParticipants}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {session.difficulty}
                    </Badge>
                  </div>
                  
                  <Button
                    size="sm"
                    className="w-full"
                    variant={activeSession === session.id ? "destructive" : "default"}
                    onClick={() => 
                      activeSession === session.id 
                        ? leaveSession() 
                        : joinSession(session.id)
                    }
                    disabled={session.participants >= session.maxParticipants && activeSession !== session.id}
                  >
                    {activeSession === session.id ? "Leave Session" : "Join Session"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Session Interface */}
        {activeSession && (
          <Card className="p-6 bg-gradient-subtle border-primary">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Active Session
                </h3>
                <Badge variant="destructive">LIVE</Badge>
              </div>
              
              {/* Chat Interface */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div className="h-48 bg-background rounded-lg p-4 overflow-y-auto space-y-2">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`text-sm ${
                        msg.type === 'tip' ? 'bg-blue-50 dark:bg-blue-950 p-2 rounded' :
                        msg.type === 'timing' ? 'bg-yellow-50 dark:bg-yellow-950 p-2 rounded' :
                        ''
                      }`}>
                        <span className="font-medium text-primary">{msg.sender}:</span>
                        <span className="ml-2">{msg.message}</span>
                        <span className="text-xs text-muted-foreground ml-2">{msg.timestamp}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Session Info */}
                <div className="space-y-3">
                  <h4 className="font-medium">Session Info</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>Recipe:</strong> Authentic Italian Risotto</p>
                    <p><strong>Duration:</strong> 45 minutes</p>
                    <p><strong>Participants:</strong> 4/6</p>
                    <p><strong>Stage:</strong> Sautéing onions</p>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Share2 className="w-3 h-3 mr-2" />
                    Share Session
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Friends List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Cooking Friends</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {friends.map(friend => (
              <Card key={friend.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                      friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{friend.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {friend.currentActivity || `${friend.skillLevel} • ${friend.favoriteStyle}`}
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => inviteFriend(friend.id)}
                    disabled={!friend.isOnline}
                  >
                    <ChefHat className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">2,847</div>
              <div className="text-sm text-muted-foreground">Active Cooks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Live Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">8.9k</div>
              <div className="text-sm text-muted-foreground">Recipes Shared</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">42</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};