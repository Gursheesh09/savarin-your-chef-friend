import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, Users, ChefHat, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'chef';
  chef: string;
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface Chef {
  id: string;
  name: string;
  personality: string;
  specialty: string;
  avatar: string;
  color: string;
}

export const GroqChefAvatars = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChef, setActiveChef] = useState<string>('marco');
  const [isLoading, setIsLoading] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Three chef personalities
  const chefs: Chef[] = [
    {
      id: 'marco',
      name: 'Chef Marco',
      personality: 'Passionate Italian chef with 20+ years experience. Warm, encouraging, and loves teaching traditional Italian techniques.',
      specialty: 'Italian Cuisine',
      avatar: '👨‍🍳',
      color: 'bg-orange-500'
    },
    {
      id: 'sophie',
      name: 'Chef Sophie',
      personality: 'Modern French chef who combines traditional techniques with contemporary flair. Elegant, precise, and innovative.',
      specialty: 'French Cuisine',
      avatar: '👩‍🍳',
      color: 'bg-blue-500'
    },
    {
      id: 'kenji',
      name: 'Chef Kenji',
      personality: 'Japanese-American chef specializing in fusion cuisine. Methodical, scientific approach to cooking with deep knowledge of techniques.',
      specialty: 'Japanese Fusion',
      avatar: '🧑‍🍳',
      color: 'bg-green-500'
    }
  ];

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

  // GROQ API call
  const callGroqAPI = async (userInput: string, chef: Chef): Promise<string> => {
    const systemPrompt = `You are ${chef.name}, a ${chef.personality}. You are having a natural conversation about cooking. Respond as this chef would - with their personality, expertise, and style. Keep responses conversational and helpful, around 2-3 sentences.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY || 'gsk_your_groq_api_key_here'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          max_tokens: 150,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`GROQ API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('GROQ API Error:', error);
      // Fallback response
      return `I'd love to help you with that! As ${chef.name}, I specialize in ${chef.specialty}. Could you tell me more about what you're trying to cook?`;
    }
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      chef: 'user',
      content: text,
      timestamp: new Date(),
      isVoice: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Get the active chef
    const chef = chefs.find(c => c.id === activeChef) || chefs[0];

    try {
      // Call GROQ API
      const chefResponse = await callGroqAPI(text, chef);
      
      const chefMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'chef',
        chef: chef.id,
        content: chefResponse,
        timestamp: new Date(),
        isVoice: true
      };

      setMessages(prev => [...prev, chefMessage]);

      // Speak the response
      if (!isMuted && synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(chefResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        synthRef.current.speak(utterance);
      }

      // Sometimes other chefs chime in
      if (Math.random() < 0.3) {
        setTimeout(async () => {
          const otherChefs = chefs.filter(c => c.id !== activeChef);
          const randomChef = otherChefs[Math.floor(Math.random() * otherChefs.length)];
          
          const followUpResponse = await callGroqAPI(`The user said: "${text}" and ${chef.name} responded: "${chefResponse}". As ${randomChef.name}, add your perspective or expertise to this cooking conversation.`, randomChef);
          
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'chef',
            chef: randomChef.id,
            content: followUpResponse,
            timestamp: new Date(),
            isVoice: true
          };

          setMessages(prev => [...prev, followUpMessage]);

          // Speak the follow-up
          if (!isMuted && synthRef.current) {
            const utterance = new SpeechSynthesisUtterance(followUpResponse);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 0.8;
            synthRef.current.speak(utterance);
          }
        }, 2000);
      }

    } catch (error) {
      console.error('Error getting chef response:', error);
      toast({
        title: "Error",
        description: "Sorry, I'm having trouble responding right now. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synthRef.current && !isMuted) {
      synthRef.current.cancel();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleUserMessage(inputText);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Chef Avatars</h1>
        <p className="text-gray-600">Talk to our AI chefs powered by GROQ</p>
        <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
          <span>⚡</span>
          <span>Lightning fast responses</span>
          <span>•</span>
          <span>Multiple personalities</span>
          <span>•</span>
          <span>Real conversations</span>
        </div>
      </div>

      {/* Chef Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chefs.map((chef) => (
          <Card 
            key={chef.id} 
            className={`cursor-pointer transition-all duration-300 ${
              activeChef === chef.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setActiveChef(chef.id)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${chef.color} flex items-center justify-center text-2xl`}>
                {chef.avatar}
              </div>
              <h3 className="font-semibold text-gray-900">{chef.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{chef.specialty}</p>
              <p className="text-xs text-gray-500">{chef.personality}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Interface */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Chat with {chefs.find(c => c.id === activeChef)?.name}
          </CardTitle>
          <p className="text-blue-100 text-sm">Powered by GROQ for lightning-fast responses!</p>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Voice Controls */}
          <div className="flex justify-center gap-4 mb-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-3 rounded-full`}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
              {isListening ? 'Stop Talking' : 'Start Talking'}
            </Button>
            
            <Button
              onClick={toggleMute}
              className={`${isMuted ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-6 py-3 rounded-full`}
            >
              {isMuted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
          </div>

          {/* Status */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-gray-600">
                {isListening ? 'Listening...' : isLoading ? 'Chef is thinking...' : 'Ready to talk or type'}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">👋 Hi! I'm {chefs.find(c => c.id === activeChef)?.name}!</p>
                <p className="text-sm mt-2">Click "Start Talking" to use voice, or type your message below!</p>
                <p className="text-xs mt-1 text-blue-600">Ask me anything about cooking - I'll respond instantly!</p>
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
                    {message.role === 'chef' && (
                      <span className="text-lg">
                        {chefs.find(c => c.id === message.chef)?.avatar}
                      </span>
                    )}
                    <span className="text-xs font-medium">
                      {message.role === 'user' ? 'You' : chefs.find(c => c.id === message.chef)?.name}
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

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask me about cooking or click 'Start Talking' to use voice..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            />
            <Button
              onClick={() => handleUserMessage(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-center text-gray-700 text-sm">
            💡 <strong>GROQ Tip:</strong> Switch between chefs to get different perspectives! Try asking: "How do I make pasta?" and see how each chef responds differently!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};


