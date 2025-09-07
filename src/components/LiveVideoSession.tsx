import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageSquare, 
  Send, 
  ChefHat,
  Clock,
  Users,
  Star,
  Heart,
  Share2
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'chef' | 'system';
}

interface Chef {
  id: string;
  name: string;
  avatar: string;
  cuisine: string;
  rating: number;
  isLive: boolean;
}

export const LiveVideoSession = ({ chef, onEndSession }: { chef: Chef; onEndSession: () => void }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Chef Isabella",
      content: "Welcome everyone! I'm so excited to teach you how to make perfect homemade pasta today. Let's start by gathering our ingredients.",
      timestamp: new Date(),
      type: 'chef'
    },
    {
      id: "2",
      sender: "System",
      content: "Sarah joined the session",
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: "3",
      sender: "Sarah",
      content: "Hi Chef! I'm so excited to learn pasta making!",
      timestamp: new Date(),
      type: 'user'
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionTime, setSessionTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(6);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Simulate session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate chef messages
  useEffect(() => {
    const chefMessages = [
      "Now let's add the flour to our eggs. Make sure to create a well in the center.",
      "Perfect! Now we're going to knead the dough for about 10 minutes until it's smooth.",
      "Great job everyone! The dough should feel elastic and not sticky.",
      "Now let's wrap it in plastic and let it rest for 30 minutes.",
      "Excellent! Now we can start rolling out our pasta sheets.",
      "You're all doing amazing! This is exactly how pasta should look."
    ];

    const interval = setInterval(() => {
      if (currentStep <= totalSteps) {
        const message: Message = {
          id: Date.now().toString(),
          sender: chef.name,
          content: chefMessages[currentStep - 1],
          timestamp: new Date(),
          type: 'chef'
        };
        setMessages(prev => [...prev, message]);
        setCurrentStep(prev => prev + 1);
      }
    }, 15000); // New step every 15 seconds

    return () => clearInterval(interval);
  }, [currentStep, totalSteps, chef.name]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date(),
      type: 'user'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={chef.avatar} />
              <AvatarFallback>{chef.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">{chef.name}</h2>
              <p className="text-sm text-gray-600">{chef.cuisine} Cuisine</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{chef.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{formatTime(sessionTime)}</div>
              <div className="text-xs text-gray-500">Session Time</div>
            </div>
            <Badge className="bg-green-100 text-green-700">
              🔴 LIVE
            </Badge>
            <Button 
              variant="outline" 
              onClick={onEndSession}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Main Video */}
          <div className="h-full bg-gray-800 flex items-center justify-center relative">
            {isVideoOn ? (
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ChefHat className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chef {chef.name}</h3>
                <p className="text-orange-300">Live Cooking Session</p>
                <p className="text-sm text-gray-400 mt-2">Step {currentStep} of {totalSteps}</p>
              </div>
            ) : (
              <div className="text-center text-white">
                <VideoOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Video is off</p>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                className={`rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={toggleVideo}
                variant="ghost"
                size="sm"
                className={`rounded-full ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={toggleChat}
                variant="ghost"
                size="sm"
                className={`rounded-full ${isChatOpen ? 'bg-orange-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Session Info */}
          <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-orange-400">{currentStep}</div>
              <div className="text-xs text-gray-300">of {totalSteps} steps</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg">Live Chat</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>12 participants</span>
              </div>
            </CardHeader>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={chatRef}>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-orange-500 text-white' 
                      : message.type === 'chef'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 text-center'
                  }`}>
                    {message.type !== 'system' && (
                      <div className="text-xs opacity-75 mb-1">{message.sender}</div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs opacity-75 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
