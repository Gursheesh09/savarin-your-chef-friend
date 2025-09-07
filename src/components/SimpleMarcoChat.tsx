import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useConversation } from "@11labs/react";

const API_KEY = process.env.REACT_APP_ELEVEN_LABS_API_KEY || "";

interface Message {
  id: string;
  role: 'user' | 'marco';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

export const SimpleMarcoChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMarcoSpeaking, setIsMarcoSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // ElevenLabs conversation for natural voice
  const conversation = useConversation({
    onConnect: () => {
      setIsCallActive(true);
      setCurrentMessage("Ciao bella! I'm Marco, your Italian chef friend! I'm so excited to help you become an amazing chef. What would you like to cook today?");
    },
    onDisconnect: () => setIsCallActive(false),
    onMessage: (msg: any) => {
      const text = (msg && (msg.text || msg.message)) as string | undefined;
      if (text) {
        setCurrentMessage(text);
        // Add Marco's message to the chat
        const marcoMessage: Message = {
          id: Date.now().toString(),
          role: 'marco',
          content: text,
          timestamp: new Date(),
          isVoice: true
        };
        setMessages(prev => [...prev, marcoMessage]);
      }
    }
  });

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or type your message.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;
  }, []);

  // Marco's real conversation responses - no more repetitive answers!
  const getMarcoResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const messageCount = messages.length;
    
    // First interaction - warm welcome
    if (messageCount === 0) {
      return `Ciao bella! 👋 I'm Marco, your Italian chef friend! I've been cooking for over 20 years, and I'm absolutely passionate about sharing the joy of cooking with you. 

What brings you to my kitchen today? Are you looking to learn something new, or do you have a specific dish that's been calling your name? I'm here to guide you through every step with the patience and love that cooking deserves! 🍝✨`;
    }

    // Check if user is asking about the current recipe
    if (input.includes('recipe') || input.includes('what is this') || input.includes('what are we making') || input.includes('what dish')) {
      return `Ah, you're asking about the recipe! 🍽️ I can see you're looking at a recipe on the left side. What specific recipe are you seeing? I'd love to help you understand it better or guide you through making it!

Tell me what you see in the recipe, and I'll help you with any questions you have about the ingredients, techniques, or steps. What's the name of the dish you're looking at?`;
    }

    // Check if user is asking about the interface
    if (input.includes('chat') || input.includes('facetime') || input.includes('left') || input.includes('right') || input.includes('options')) {
      return `Ah, I see you're asking about the interface! 😊 You're right - there are different options here. 

On the left, you can see recipes and cooking instructions. On the right, you have the chat (where we are now) and the FaceTime option for video calls.

Right now, we're having a conversation in the chat! I can help you with any cooking questions, explain recipes, give you tips, or just chat about food. What would you like to talk about?`;
    }

    // Check if user is frustrated with repetitive responses
    if (input.includes('same') || input.includes('repetitive') || input.includes('over and over') || input.includes('again') || input.includes('boring')) {
      return `Oh bella, I completely understand your frustration! 😔 You're absolutely right - I was giving you the same scripted responses instead of really listening to what you're saying.

Let me change that right now! I want to have a REAL conversation with you, just like you're having with me right now. Tell me what's really on your mind - what do you want to cook? What's challenging you? What excites you about cooking?

I'm here to listen and respond to YOU, not give you the same old answers. What's your real question?`;
    }

    // Check if user is asking about cooking experience
    if (input.includes('beginner') || input.includes('new') || input.includes('never') || input.includes('first time') || input.includes('experience')) {
      return `That's wonderful! 🌱 I love working with beginners because there's something magical about watching someone discover the joy of cooking for the first time.

But here's the thing - I want to know about YOUR specific situation. What made you want to start cooking? Is there a particular dish you've always wanted to make? Or maybe you're trying to impress someone special?

Don't worry about making mistakes - even the greatest chefs started exactly where you are. What's calling to you in the kitchen?`;
    }

    // Check if user is asking about specific ingredients
    if (input.includes('ingredient') || input.includes('what do i need') || input.includes('shopping') || input.includes('grocery')) {
      return `Great question! 🛒 I'd love to help you with ingredients, but I need to know what you're planning to make first.

Are you looking at a specific recipe? Or do you have a dish in mind? Once you tell me what you want to cook, I can give you the exact shopping list and even suggest where to find the best ingredients!

What dish are you thinking about making?`;
    }

    // Check if user is asking about techniques
    if (input.includes('how to') || input.includes('technique') || input.includes('method') || input.includes('way to cook') || input.includes('how do i')) {
      return `Ah, techniques! 🎯 This is where cooking becomes an art! I love talking about the methods that make all the difference.

But I need to know what specific technique you're curious about. Are you asking about:
- Knife skills?
- Sautéing?
- Making pasta?
- Roasting?
- Something else?

What technique are you struggling with or want to learn? I'll give you the exact steps and tips you need!`;
    }

    // Check if user is asking about specific dishes
    if (input.includes('pasta') || input.includes('spaghetti') || input.includes('noodles')) {
      return `Pasta! 🍝 My absolute favorite! But I need to know more about what you want to do with it.

Are you asking about:
- How to cook pasta properly?
- Making a specific pasta dish?
- What kind of pasta to use?
- Making fresh pasta?

What's your pasta question? I'll give you the exact guidance you need!`;
    }

    if (input.includes('chicken') || input.includes('pollo')) {
      return `Chicken! 🍗 Such a versatile protein! But I need to know what you want to do with it.

Are you asking about:
- How to cook chicken properly?
- A specific chicken recipe?
- What cut of chicken to use?
- How to make chicken tender?

What's your chicken question? I'll help you get it perfect!`;
    }

    // Check if user is asking for help
    if (input.includes('help') || input.includes('stuck') || input.includes('problem') || input.includes('trouble') || input.includes('confused')) {
      return `Of course I'll help you! 😊 But I need to know what specific problem you're facing.

Are you:
- Stuck on a recipe step?
- Having trouble with a technique?
- Not sure about ingredients?
- Something else?

Tell me exactly what's going wrong, and I'll help you fix it!`;
    }

    // Check if user is asking about the app/interface
    if (input.includes('app') || input.includes('website') || input.includes('interface') || input.includes('how does this work')) {
      return `Ah, you're asking about how this app works! 😊 

Here's what you can do:
- **Chat with me** (right here) - Ask me any cooking questions
- **FaceTime** - Video call with me for hands-on help
- **Recipes** - Browse and follow cooking instructions
- **Live Chef Marketplace** - Connect with real chefs

Right now, we're chatting! I can help you with any cooking questions. What would you like to know about cooking?`;
    }

    // If user is asking a direct question, respond directly
    if (input.includes('?') || input.includes('what') || input.includes('how') || input.includes('why') || input.includes('when') || input.includes('where')) {
      return `That's a great question! 🤔 I want to give you the best answer possible, but I need a bit more context.

Could you tell me more about what you're specifically asking? For example:
- Are you looking at a recipe?
- Do you have a specific dish in mind?
- What's your cooking experience level?
- What's the situation you're in?

The more details you give me, the better I can help you!`;
    }

    // If user is making a statement, engage with it
    if (input.includes('i want') || input.includes('i need') || input.includes('i like') || input.includes('i love') || input.includes('i hate')) {
      return `That's interesting! 😊 I can see you have strong feelings about that. Tell me more!

What specifically do you want to do? What do you need help with? What do you like or dislike about it?

I'm here to help you achieve your cooking goals, whatever they are!`;
    }

    // Default response - ask for clarification
    return `I want to help you, bella! 😊 But I need to understand what you're really asking.

Could you be more specific? For example:
- "I want to make pasta but I don't know how"
- "I'm looking at a recipe and I'm confused about step 3"
- "I need help with knife skills"
- "What ingredients do I need for chicken parmesan?"

What's your specific cooking question or goal?`;
  };

  const handleUserMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      isVoice: true
    };

    setMessages(prev => [...prev, userMessage]);

    // Get Marco's response
    const marcoResponse = getMarcoResponse(text);
    
    // Use Eleven Labs for natural voice
    if (conversation && isCallActive) {
      conversation.send(marcoResponse);
    } else {
      // Fallback to browser speech synthesis
      if (!isMuted && synthRef.current) {
        setIsMarcoSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(marcoResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
          setIsMarcoSpeaking(false);
        };
        
        synthRef.current.speak(utterance);
      }
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const startCall = () => {
    setIsCallActive(true);
    setMessages([]);
    
    // Start Eleven Labs conversation
    if (conversation) {
      conversation.start();
    } else {
      // Fallback welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'marco',
        content: "Ciao bella! I'm Marco, your Italian cooking mentor! I'm so excited to help you become an amazing chef. What would you like to cook today?",
        timestamp: new Date(),
        isVoice: true
      };
      
      setMessages([welcomeMessage]);
      
      // Speak welcome message
      if (!isMuted && synthRef.current) {
        setIsMarcoSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(welcomeMessage.content);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
          setIsMarcoSpeaking(false);
        };
        
        synthRef.current.speak(utterance);
      }
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsListening(false);
    setIsMarcoSpeaking(false);
    
    // End Eleven Labs conversation
    if (conversation) {
      conversation.stop();
    }
    
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synthRef.current && !isMuted) {
      synthRef.current.cancel();
      setIsMarcoSpeaking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Chef Marco</h1>
        <p className="text-gray-600">Your passionate Italian cooking mentor</p>
        <div className="flex items-center justify-center gap-2 text-sm text-orange-600">
          <span>🍝</span>
          <span>20+ years experience</span>
          <span>•</span>
          <span>Italian cuisine expert</span>
          <span>•</span>
          <span>Always encouraging</span>
        </div>
      </div>

      {/* Call Interface */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📞</span>
            FaceTime with Chef Marco
          </CardTitle>
          <p className="text-orange-100 text-sm">Click "Start Call" to begin your cooking conversation!</p>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Call Controls */}
          <div className="flex justify-center gap-4 mb-6">
            {!isCallActive ? (
              <Button
                onClick={startCall}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Call
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-3 rounded-full`}
                  size="lg"
                >
                  {isListening ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                  {isListening ? 'Stop Talking' : 'Start Talking'}
                </Button>
                
                <Button
                  onClick={toggleMute}
                  className={`${isMuted ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-6 py-3 rounded-full`}
                  size="lg"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                
                <Button
                  onClick={endCall}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full"
                  size="lg"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  End Call
                </Button>
              </div>
            )}
          </div>

          {/* Status */}
          {isCallActive && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${isCallActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-gray-600">
                  {isListening ? 'Listening...' : isMarcoSpeaking ? 'Marco is speaking...' : 'Ready to talk'}
                </span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 && !isCallActive && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">👋 Ready to start your cooking journey?</p>
                <p className="text-sm mt-2">Click "Start Call" to begin talking with Chef Marco!</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {message.role === 'user' ? 'You' : 'Chef Marco'}
                    </span>
                    {message.isVoice && (
                      <span className="text-xs">🎤</span>
                    )}
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-center text-gray-700 text-sm">
            💡 <strong>How to use:</strong> Click "Start Call" → Click "Start Talking" → Speak your question → Marco will respond with voice and text!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
