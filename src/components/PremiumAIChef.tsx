import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Plane, Environment } from '@react-three/drei';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff, 
  Settings, 
  Sparkles,
  Zap,
  Brain,
  MessageSquare
} from "lucide-react";
import * as THREE from 'three';
import { useToast } from "@/hooks/use-toast";

interface ChefAvatarProps {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  emotion: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'excited';
}

function PremiumChefAvatar({ isListening, isSpeaking, isThinking, emotion }: ChefAvatarProps) {
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const environmentRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Advanced breathing and micro-movements
    const breathScale = 1 + Math.sin(t * 1.2) * 0.015;
    const heartbeat = 1 + Math.sin(t * 4) * 0.005;
    
    if (bodyRef.current) {
      bodyRef.current.scale.y = breathScale * heartbeat;
      bodyRef.current.position.y = -0.3 + Math.sin(t * 0.8) * 0.01;
    }
    
    // Natural head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.3) * 0.08 + (isListening ? Math.sin(t * 2) * 0.02 : 0);
      headRef.current.rotation.x = Math.sin(t * 0.4) * 0.03;
      headRef.current.position.y = 0.8 + Math.sin(t * 0.9) * 0.008;
      
      // Emotion-based positioning
      switch (emotion) {
        case 'thinking':
          headRef.current.rotation.x += 0.1;
          break;
        case 'excited':
          headRef.current.position.y += 0.02;
          headRef.current.rotation.z = Math.sin(t * 3) * 0.02;
          break;
        case 'explaining':
          headRef.current.rotation.y += Math.sin(t * 1.5) * 0.05;
          break;
      }
    }
    
    // Advanced speaking animation
    if (isSpeaking && mouthRef.current) {
      const intensity = 1 + Math.sin(t * 12) * 0.4;
      mouthRef.current.scale.set(intensity, intensity * 0.8, 1);
      if (mouthRef.current.material && 'color' in mouthRef.current.material) {
        (mouthRef.current.material as any).color.setHSL(0.02, 0.8, 0.3 + Math.sin(t * 8) * 0.1);
      }
    }
    
    // Eye animations
    if (eyeLeftRef.current && eyeRightRef.current) {
      // Natural blinking
      const blinkCycle = Math.sin(t * 0.5) > 0.95 ? 0.2 : 1;
      eyeLeftRef.current.scale.y = blinkCycle;
      eyeRightRef.current.scale.y = blinkCycle;
      
      // Eye tracking and emotion
      const eyeTarget = isListening ? Math.sin(t * 2) * 0.1 : Math.sin(t * 0.2) * 0.05;
      eyeLeftRef.current.position.x = -0.15 + eyeTarget;
      eyeRightRef.current.position.x = 0.15 + eyeTarget;
    }
    
    // Environment animation
    if (environmentRef.current) {
      environmentRef.current.rotation.y = t * 0.01;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Environment preset="studio" />
      
      {/* Premium Kitchen Environment */}
      <group ref={environmentRef}>
        <Plane args={[12, 8]} position={[0, 0, -4]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.1} />
        </Plane>
        
        {/* High-tech displays */}
        <Box args={[1.5, 1, 0.1]} position={[-3, 2, -3.5]}>
          <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.3} />
        </Box>
        <Box args={[1.5, 1, 0.1]} position={[3, 2, -3.5]}>
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} />
        </Box>
        <Box args={[1, 0.8, 0.1]} position={[0, 3, -3.5]}>
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.3} />
        </Box>
        
        {/* Premium countertop */}
        <Box args={[8, 0.3, 3]} position={[0, -1.6, -1]}>
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.1} />
        </Box>
      </group>
      
      {/* Premium Chef Body */}
      <Box ref={bodyRef} args={[1.4, 1.8, 0.9]} position={[0, -0.3, 0]}>
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
      </Box>
      
      {/* Realistic Head */}
      <Sphere ref={headRef} args={[0.55]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.0} roughness={0.4} />
      </Sphere>
      
      {/* Professional Chef Hat */}
      <Cylinder args={[0.5, 0.4, 0.9]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.2} />
      </Cylinder>
      
      {/* Expressive Eyes */}
      <Sphere ref={eyeLeftRef} args={[0.09]} position={[-0.18, 0.9, 0.45]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      <Sphere ref={eyeRightRef} args={[0.09]} position={[0.18, 0.9, 0.45]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      
      {/* Professional glasses */}
      <group>
        <Cylinder args={[0.14, 0.14, 0.02]} position={[-0.18, 0.9, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#1f2937" transparent opacity={0.2} metalness={0.8} />
        </Cylinder>
        <Cylinder args={[0.14, 0.14, 0.02]} position={[0.18, 0.9, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#1f2937" transparent opacity={0.2} metalness={0.8} />
        </Cylinder>
        <Box args={[0.12, 0.02, 0.02]} position={[0, 0.9, 0.5]}>
          <meshStandardMaterial color="#1f2937" metalness={0.8} />
        </Box>
      </group>
      
      {/* Expressive Mouth */}
      <Box ref={mouthRef} args={[0.18, 0.06, 0.03]} position={[0, 0.65, 0.45]}>
        <meshStandardMaterial color="#dc2626" />
      </Box>
      
      {/* Professional mustache */}
      <Box args={[0.28, 0.09, 0.03]} position={[0, 0.75, 0.45]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Premium Chef Coat Details */}
      <group>
        <Sphere args={[0.04]} position={[0, 0.1, 0.46]}>
          <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.1} />
        </Sphere>
        <Sphere args={[0.04]} position={[0, -0.1, 0.46]}>
          <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.1} />
        </Sphere>
        <Sphere args={[0.04]} position={[0, -0.3, 0.46]}>
          <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.1} />
        </Sphere>
      </group>
      
      {/* Real-time status indicators */}
      {isListening && (
        <group position={[0.8, 1.3, 0]}>
          <Sphere args={[0.06]}>
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.5} />
          </Sphere>
          <Text position={[0, -0.2, 0]} fontSize={0.1} color="#10b981">LISTENING</Text>
        </group>
      )}
      
      {isSpeaking && (
        <group position={[-0.8, 1.1, 0]}>
          {[0, 0.1, 0.2].map((offset, i) => (
            <Sphere key={i} args={[0.04]} position={[offset, 0, 0]}>
              <meshStandardMaterial 
                color="#3b82f6" 
                emissive="#1d4ed8" 
                emissiveIntensity={0.3 + Math.sin(Date.now() * 0.01 + i) * 0.2} 
              />
            </Sphere>
          ))}
          <Text position={[0.1, -0.15, 0]} fontSize={0.08} color="#3b82f6">SPEAKING</Text>
        </group>
      )}
      
      {isThinking && (
        <group position={[0, 2.2, 0]}>
          {[0, 0.1, 0.15].map((offset, i) => (
            <Sphere key={i} args={[0.05 - i * 0.01]} position={[offset, offset * 0.5, 0]}>
              <meshStandardMaterial 
                color="#8b5cf6" 
                emissive="#7c3aed" 
                emissiveIntensity={0.4} 
              />
            </Sphere>
          ))}
        </group>
      )}
      
      {/* Floating name and title */}
      <Text
        position={[0, -1.4, 1]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Chef Marco Savarin AI
      </Text>
      <Text
        position={[0, -1.7, 1]}
        fontSize={0.15}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        Premium Culinary Intelligence
      </Text>
    </group>
  );
}

interface PremiumAIChefProps {
  onStartConversation?: () => void;
}

export const PremiumAIChef: React.FC<PremiumAIChefProps> = ({ onStartConversation }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'explaining' | 'excited'>('neutral');
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setEmotion('neutral');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        setCurrentTranscript(interimTranscript || finalTranscript);
        
        if (finalTranscript.trim()) {
          handleUserMessage(finalTranscript.trim());
        }
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setCurrentTranscript("");
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setCurrentTranscript("");
      };
      
      recognitionRef.current.start();
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use a modern browser.",
        variant: "destructive"
      });
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setCurrentTranscript("");
  }, []);

  const handleUserMessage = async (message: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key in settings to start conversing.",
        variant: "destructive"
      });
      return;
    }

    setIsThinking(true);
    setEmotion('thinking');
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are Chef Marco Savarin, a world-renowned culinary expert and AI assistant. You have a warm, passionate personality and speak with genuine enthusiasm about cooking. You're helping users learn to cook through interactive voice conversations. Keep responses conversational, encouraging, and under 100 words. Always sound like you're genuinely excited to help them cook and learn.`
            },
            ...conversationHistory,
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.8,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I didn't catch that. Could you repeat?";
      
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]);
      
      setIsThinking(false);
      setCurrentMessage(aiResponse);
      setEmotion('explaining');
      
      // Speak the response
      if (audioEnabled && synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => {
          setIsSpeaking(true);
          setEmotion('happy');
        };
        
        utterance.onend = () => {
          setIsSpeaking(false);
          setEmotion('neutral');
          // Auto-restart listening
          setTimeout(() => {
            if (isConnected) {
              startListening();
            }
          }, 500);
        };
        
        synthRef.current.speak(utterance);
      }
      
    } catch (error) {
      setIsThinking(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI service. Please check your API key.",
        variant: "destructive"
      });
    }
  };

  const startConversation = () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    
    setIsConnected(true);
    setEmotion('excited');
    setCurrentMessage("Hello! I'm Chef Marco, your personal culinary AI assistant. I'm excited to cook with you today! What would you like to learn?");
    
    // Welcome speech
    if (audioEnabled && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance("Hello! I'm Chef Marco, your personal culinary AI assistant. I'm excited to cook with you today! What would you like to learn?");
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setEmotion('neutral');
        setTimeout(() => startListening(), 1000);
      };
      
      synthRef.current.speak(utterance);
    } else {
      setTimeout(() => startListening(), 2000);
    }
    
    onStartConversation?.();
  };

  const endConversation = () => {
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setCurrentMessage("");
    setCurrentTranscript("");
    setEmotion('neutral');
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black border border-gray-700 shadow-2xl">
      {/* Premium Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <h2 className="text-2xl font-bold text-white">Premium AI Chef</h2>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
              <Zap className="w-3 h-3 mr-1" />
              PREMIUM
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center gap-3 mt-4">
          {isThinking && (
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse">
              <Brain className="w-3 h-3 mr-1" />
              Processing with AI
            </Badge>
          )}
          {isListening && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <Mic className="w-3 h-3 mr-1 animate-pulse" />
              Listening to you
            </Badge>
          )}
          {isSpeaking && (
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Volume2 className="w-3 h-3 mr-1 animate-bounce" />
              Chef is speaking
            </Badge>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-6 z-30 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-4 min-w-[300px]">
          <h3 className="text-white font-semibold mb-3">AI Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="text-gray-300 text-sm block mb-1">OpenAI API Key</label>
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="audio"
                checked={audioEnabled}
                onChange={(e) => setAudioEnabled(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="audio" className="text-gray-300 text-sm">Enable voice responses</label>
            </div>
          </div>
        </div>
      )}

      {/* Premium 3D Chef */}
      <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} shadows>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#3b82f6" />
          <pointLight position={[5, -5, 5]} intensity={0.5} color="#f59e0b" />
          <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.3} penumbra={0.1} color="#ffffff" />
          
          <PremiumChefAvatar 
            isListening={isListening} 
            isSpeaking={isSpeaking} 
            isThinking={isThinking}
            emotion={emotion}
          />
        </Canvas>
      </div>

      {/* Live Transcript */}
      {currentTranscript && (
        <div className="absolute bottom-32 left-6 right-6 bg-emerald-500/10 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">You're saying:</span>
          </div>
          <p className="text-white font-medium">"{currentTranscript}"</p>
        </div>
      )}

      {/* AI Response */}
      {currentMessage && (
        <div className="absolute bottom-48 left-6 right-6 bg-blue-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Chef Marco:</span>
          </div>
          <p className="text-white font-medium">{currentMessage}</p>
          {isSpeaking && (
            <div className="flex items-center gap-1 mt-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-150"></div>
            </div>
          )}
        </div>
      )}

      {/* Premium Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-6">
        <div className="flex items-center justify-center gap-6">
          {!isConnected ? (
            <Button
              onClick={startConversation}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-3 rounded-full shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Start AI Conversation
            </Button>
          ) : (
            <>
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`p-4 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 scale-110' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white shadow-lg`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              
              <Button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-4 rounded-full transition-colors ${
                  audioEnabled 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white shadow-lg`}
              >
                {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </Button>
              
              <Button
                onClick={endConversation}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>
        
        {!apiKey && (
          <p className="text-center text-yellow-400 text-sm mt-4">
            ⚠️ Enter your OpenAI API key in settings to enable AI conversations
          </p>
        )}
      </div>

      {/* Premium ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-16 h-16 bg-green-500/5 rounded-full animate-pulse delay-2000"></div>
      </div>
    </Card>
  );
};