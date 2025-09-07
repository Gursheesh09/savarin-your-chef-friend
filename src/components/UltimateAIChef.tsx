import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Plane, Environment, useTexture, Html } from '@react-three/drei';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Eye, 
  Brain, 
  Sparkles, 
  Zap, 
  Crown, 
  Star,
  ChefHat,
  Phone,
  PhoneOff,
  MessageSquare,
  Video,
  Utensils,
  BookOpen,
  Heart,
  Award,
  Settings
} from "lucide-react";
import * as THREE from 'three';
import { useToast } from "@/hooks/use-toast";

interface PhotorealisticChefProps {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  emotion: 'neutral' | 'happy' | 'excited' | 'focused' | 'encouraging' | 'proud';
  cookingMode: 'idle' | 'teaching' | 'observing' | 'guiding';
}

function PhotorealisticChef({ isListening, isSpeaking, isThinking, emotion, cookingMode }: PhotorealisticChefProps) {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const handsRef = useRef<THREE.Group>(null);
  const kitchenRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Ultra-realistic breathing and micro-movements
    const breathScale = 1 + Math.sin(t * 1.1) * 0.012;
    const heartbeat = 1 + Math.sin(t * 3.7) * 0.003;
    const microMovements = Math.sin(t * 0.23) * 0.008;
    
    if (bodyRef.current) {
      bodyRef.current.scale.y = breathScale * heartbeat;
      bodyRef.current.position.y = -0.2 + microMovements;
      bodyRef.current.rotation.z = Math.sin(t * 0.31) * 0.005;
    }
    
    // Advanced head movements based on mode and emotion
    if (headRef.current) {
      let baseRotationY = Math.sin(t * 0.27) * 0.06;
      let baseRotationX = Math.sin(t * 0.33) * 0.02;
      let basePosY = 0.9 + Math.sin(t * 0.83) * 0.006;
      
      // Emotion-based adjustments
      switch (emotion) {
        case 'excited':
          baseRotationY += Math.sin(t * 2.1) * 0.03;
          basePosY += 0.015;
          break;
        case 'focused':
          baseRotationX += 0.08;
          baseRotationY *= 0.5;
          break;
        case 'encouraging':
          basePosY += Math.sin(t * 1.7) * 0.01;
          break;
        case 'proud':
          baseRotationX -= 0.05;
          basePosY += 0.01;
          break;
      }
      
      // Mode-based adjustments
      if (cookingMode === 'teaching') {
        baseRotationY += Math.sin(t * 1.3) * 0.04;
      } else if (cookingMode === 'observing') {
        baseRotationY += Math.sin(t * 0.7) * 0.08;
      }
      
      // Listening behavior
      if (isListening) {
        baseRotationY += Math.sin(t * 2.3) * 0.02;
        baseRotationX += Math.sin(t * 1.8) * 0.015;
      }
      
      headRef.current.rotation.y = baseRotationY;
      headRef.current.rotation.x = baseRotationX;
      headRef.current.position.y = basePosY;
    }
    
    // Hyper-realistic eye tracking and blinking
    if (eyesRef.current) {
      // Natural eye movement patterns
      const eyeTargetX = Math.sin(t * 0.17) * 0.03 + (isListening ? Math.sin(t * 1.9) * 0.02 : 0);
      const eyeTargetY = Math.sin(t * 0.21) * 0.02;
      
      eyesRef.current.position.x = eyeTargetX;
      eyesRef.current.position.y = eyeTargetY;
      
      // Complex blinking patterns
      const blinkPattern = Math.sin(t * 0.31);
      const rapidBlink = isThinking ? Math.sin(t * 4.7) * 0.5 + 0.5 : 0;
      const blinkScale = blinkPattern > 0.97 || rapidBlink > 0.8 ? 0.1 : 1;
      eyesRef.current.scale.y = blinkScale;
    }
    
    // Advanced mouth animation for speech
    if (mouthRef.current && isSpeaking) {
      const speechIntensity = 1 + Math.sin(t * 11) * 0.35 + Math.sin(t * 17) * 0.15;
      const vowelShape = Math.sin(t * 7) * 0.2 + 0.8;
      
      mouthRef.current.scale.x = speechIntensity;
      mouthRef.current.scale.y = vowelShape * speechIntensity * 0.7;
      mouthRef.current.position.z = 0.47 + Math.sin(t * 13) * 0.01;
    }
    
    // Hand gestures based on cooking mode
    if (handsRef.current) {
      switch (cookingMode) {
        case 'teaching':
          handsRef.current.rotation.x = Math.sin(t * 1.5) * 0.3;
          handsRef.current.position.y = -0.5 + Math.sin(t * 1.2) * 0.1;
          break;
        case 'guiding':
          handsRef.current.rotation.y = Math.sin(t * 0.8) * 0.2;
          handsRef.current.position.x = Math.sin(t * 1.1) * 0.05;
          break;
        default:
          handsRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
      }
    }
    
    // Dynamic kitchen environment
    if (kitchenRef.current) {
      kitchenRef.current.rotation.y = t * 0.002;
      // Ambient lighting changes
      kitchenRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (material.emissive) {
            material.emissiveIntensity = 0.1 + Math.sin(t * 0.5) * 0.05;
          }
        }
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Environment preset="studio" />
      
      {/* Ultra-premium kitchen environment */}
      <group ref={kitchenRef}>
        {/* Luxury kitchen backdrop */}
        <Plane args={[15, 10]} position={[0, 0, -5]} rotation={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#0a0a0b" 
            metalness={0.4} 
            roughness={0.1}
            envMapIntensity={0.8}
          />
        </Plane>
        
        {/* High-tech displays with realistic glow */}
        <Box args={[2, 1.5, 0.1]} position={[-4, 3, -4.5]}>
          <meshStandardMaterial 
            color="#0ea5e9" 
            emissive="#0369a1" 
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.1}
          />
        </Box>
        <Box args={[2, 1.5, 0.1]} position={[4, 3, -4.5]}>
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#047857" 
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.1}
          />
        </Box>
        <Box args={[1.8, 1.2, 0.1]} position={[0, 4, -4.5]}>
          <meshStandardMaterial 
            color="#f59e0b" 
            emissive="#d97706" 
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.1}
          />
        </Box>
        
        {/* Luxury marble countertop */}
        <Box args={[12, 0.4, 4]} position={[0, -1.8, -1]}>
          <meshStandardMaterial 
            color="#f8fafc" 
            metalness={0.1} 
            roughness={0.2}
            envMapIntensity={1}
          />
        </Box>
        
        {/* Professional cooking equipment */}
        <Cylinder args={[0.3, 0.3, 1.5]} position={[-3, -0.5, -2]} rotation={[0, 0, Math.PI / 6]}>
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
        </Cylinder>
        <Box args={[0.8, 0.6, 0.4]} position={[3, -0.8, -2]}>
          <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.2} />
        </Box>
      </group>
      
      {/* Photorealistic Chef Body */}
      <group ref={bodyRef} position={[0, -0.2, 0]}>
        {/* Torso with realistic proportions */}
        <Box args={[1.6, 2.2, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.05} 
            roughness={0.4}
            envMapIntensity={0.3}
          />
        </Box>
        
        {/* Chef coat details */}
        {[-0.1, 0.1, 0.3, 0.5].map((y, i) => (
          <Sphere key={i} args={[0.05]} position={[0, y, 0.51]}>
            <meshStandardMaterial 
              color="#6b7280" 
              metalness={0.8} 
              roughness={0.1} 
            />
          </Sphere>
        ))}
        
        {/* Realistic hands */}
        <group ref={handsRef}>
          <Sphere args={[0.15, 8, 6]} position={[-0.9, -0.8, 0.2]}>
            <meshStandardMaterial color="#fbbf24" roughness={0.6} />
          </Sphere>
          <Sphere args={[0.15, 8, 6]} position={[0.9, -0.8, 0.2]}>
            <meshStandardMaterial color="#fbbf24" roughness={0.6} />
          </Sphere>
        </group>
      </group>
      
      {/* Photorealistic Head */}
      <group ref={headRef} position={[0, 0.9, 0]}>
        {/* Head with skin texture */}
        <Sphere args={[0.6, 32, 32]}>
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.02} 
            roughness={0.7}
          />
        </Sphere>
        
        {/* Professional chef hat with realistic fabric */}
        <Cylinder args={[0.55, 0.45, 1.1]} position={[0, 0.8, 0]}>
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.0} 
            roughness={0.8}
            envMapIntensity={0.2}
          />
        </Cylinder>
        
        {/* Hyper-realistic eyes */}
        <group ref={eyesRef}>
          {/* Eye sockets */}
          <Sphere args={[0.12, 16, 16]} position={[-0.2, 0.1, 0.5]}>
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </Sphere>
          <Sphere args={[0.12, 16, 16]} position={[0.2, 0.1, 0.5]}>
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </Sphere>
          
          {/* Pupils with depth */}
          <Sphere args={[0.08, 16, 16]} position={[-0.2, 0.1, 0.55]}>
            <meshStandardMaterial color="#1f2937" />
          </Sphere>
          <Sphere args={[0.08, 16, 16]} position={[0.2, 0.1, 0.55]}>
            <meshStandardMaterial color="#1f2937" />
          </Sphere>
          
          {/* Eye reflections */}
          <Sphere args={[0.02]} position={[-0.18, 0.12, 0.6]}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </Sphere>
          <Sphere args={[0.02]} position={[0.22, 0.12, 0.6]}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </Sphere>
        </group>
        
        {/* Designer glasses with realistic materials */}
        <group>
          <Cylinder args={[0.16, 0.16, 0.02]} position={[-0.2, 0.1, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial 
              color="#1f2937" 
              transparent 
              opacity={0.15} 
              metalness={0.9} 
              roughness={0.1}
            />
          </Cylinder>
          <Cylinder args={[0.16, 0.16, 0.02]} position={[0.2, 0.1, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial 
              color="#1f2937" 
              transparent 
              opacity={0.15} 
              metalness={0.9} 
              roughness={0.1}
            />
          </Cylinder>
          <Box args={[0.15, 0.03, 0.03]} position={[0, 0.1, 0.58]}>
            <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.1} />
          </Box>
        </group>
        
        {/* Expressive mouth with realistic animation */}
        <Box 
          ref={mouthRef} 
          args={[0.2, 0.08, 0.04]} 
          position={[0, -0.25, 0.47]}
        >
          <meshStandardMaterial 
            color="#dc2626" 
            roughness={0.8}
            metalness={0.1}
          />
        </Box>
        
        {/* Professional mustache */}
        <Box args={[0.32, 0.12, 0.04]} position={[0, -0.15, 0.47]}>
          <meshStandardMaterial color="#374151" roughness={0.9} />
        </Box>
        
        {/* Facial hair details */}
        <Box args={[0.15, 0.25, 0.03]} position={[0, -0.4, 0.46]}>
          <meshStandardMaterial color="#374151" roughness={0.9} />
        </Box>
      </group>
      
      {/* Advanced status indicators */}
      {isListening && (
        <group position={[1, 1.5, 0]}>
          <Sphere args={[0.08]}>
            <meshStandardMaterial 
              color="#10b981" 
              emissive="#047857" 
              emissiveIntensity={0.6}
            />
          </Sphere>
          <Html position={[0, -0.3, 0]} center>
            <div className="text-green-400 text-xs font-bold animate-pulse">LISTENING</div>
          </Html>
        </group>
      )}
      
      {isSpeaking && (
        <group position={[-1, 1.2, 0]}>
          {[0, 0.12, 0.24].map((offset, i) => (
            <Sphere key={i} args={[0.05]} position={[offset, 0, 0]}>
              <meshStandardMaterial 
                color="#3b82f6" 
                emissive="#1d4ed8" 
                emissiveIntensity={0.4 + Math.sin(Date.now() * 0.01 + i) * 0.3}
              />
            </Sphere>
          ))}
          <Html position={[0.12, -0.2, 0]} center>
            <div className="text-blue-400 text-xs font-bold">SPEAKING</div>
          </Html>
        </group>
      )}
      
      {isThinking && (
        <group position={[0, 2.5, 0]}>
          {[0, 0.1, 0.18].map((offset, i) => (
            <Sphere key={i} args={[0.06 - i * 0.01]} position={[offset, offset * 0.6, 0]}>
              <meshStandardMaterial 
                color="#8b5cf6" 
                emissive="#7c3aed" 
                emissiveIntensity={0.5}
              />
            </Sphere>
          ))}
          <Html position={[0.09, -0.3, 0]} center>
            <div className="text-purple-400 text-xs font-bold animate-pulse">PROCESSING</div>
          </Html>
        </group>
      )}
      
      {/* Premium floating UI */}
      <Html position={[0, -2, 1]} center>
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-1">Chef Marco Savarin</h3>
          <p className="text-lg text-gray-300 mb-2">Michelin Star AI Chef</p>
          <div className="flex justify-center gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              <Crown className="w-3 h-3 mr-1" />
              Master Chef
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Brain className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
        </div>
      </Html>
    </group>
  );
}

interface IngredientRecognition {
  name: string;
  confidence: number;
  freshness?: 'fresh' | 'good' | 'use_soon' | 'expired';
  suggestions?: string[];
}

interface CookingStep {
  id: string;
  instruction: string;
  timeEstimate: number;
  temperature?: number;
  techniques: string[];
  tips: string[];
  warnings?: string[];
}

export const UltimateAIChef: React.FC = () => {
  // Core state
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'excited' | 'focused' | 'encouraging' | 'proud'>('neutral');
  const [cookingMode, setCookingMode] = useState<'idle' | 'teaching' | 'observing' | 'guiding'>('idle');
  
  // Communication state
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  
  // Cooking state
  const [recognizedIngredients, setRecognizedIngredients] = useState<IngredientRecognition[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<string>("");
  const [cookingSteps, setCookingSteps] = useState<CookingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [cookingProgress, setCookingProgress] = useState(0);
  
  // User preferences
  const [userProfile, setUserProfile] = useState({
    name: "",
    skillLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    dietaryRestrictions: [] as string[],
    favoritesCuisines: [] as string[],
    cookingGoals: [] as string[]
  });
  
  // Technical state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const elevenLabsRef = useRef<any>(null);
  
  const { toast } = useToast();

  // Initialize systems
  useEffect(() => {
    // DISABLED AUTO-SPEECH: No more robotic voice
    // synthRef.current = window.speechSynthesis;
    initializeCamera();
    
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    // DISABLED AUTO-SPEECH: No more robotic voice
    // if (synthRef.current) {
    //   synthRef.current.cancel();
    // }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 },
        audio: false 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
    }
  };

  // Advanced ingredient recognition
  const recognizeIngredients = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    
    // Simulate advanced ingredient recognition
    const mockIngredients: IngredientRecognition[] = [
      { name: 'Tomatoes', confidence: 0.95, freshness: 'fresh', suggestions: ['Perfect for pasta sauce', 'Great for salads'] },
      { name: 'Onions', confidence: 0.88, freshness: 'good', suggestions: ['Essential for base flavors', 'Caramelize for sweetness'] },
      { name: 'Garlic', confidence: 0.92, freshness: 'fresh', suggestions: ['Adds aromatic depth', 'Roast for mellow flavor'] }
    ];
    
    setRecognizedIngredients(mockIngredients);
    setCookingMode('observing');
    setEmotion('focused');
    
    // Generate cooking suggestions
    setTimeout(() => {
      setCurrentMessage("I can see you have fresh tomatoes, onions, and garlic! Those are perfect for a classic marinara sauce or a beautiful ratatouille. What would you like to create today?");
      speakMessage("I can see you have fresh tomatoes, onions, and garlic! Those are perfect for a classic marinara sauce or a beautiful ratatouille. What would you like to create today?");
    }, 1000);
  }, []);

  // Premium speech recognition
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
    }
  }, []);

  // Advanced AI conversation
  const handleUserMessage = async (message: string) => {
    setIsThinking(true);
    setEmotion('focused');
    setCookingMode('teaching');
    
    // Add to conversation history
    const newHistory = [...conversationHistory, { role: 'user' as const, content: message, timestamp: new Date() }];
    setConversationHistory(newHistory);
    
    // Simulate advanced AI processing
    setTimeout(() => {
      let response = "";
      let steps: CookingStep[] = [];
      
      // Intelligent response generation based on context
      if (message.toLowerCase().includes('pasta') || message.toLowerCase().includes('marinara')) {
        response = "Excellent choice! Let's create an authentic Italian marinara sauce. I'll guide you through each step with perfect timing and technique.";
        steps = [
          {
            id: '1',
            instruction: 'Heat 3 tablespoons of extra virgin olive oil in a heavy-bottomed pan over medium heat',
            timeEstimate: 120,
            temperature: 325,
            techniques: ['Temperature control', 'Oil heating'],
            tips: ['The oil should shimmer but not smoke', 'Use a wooden spoon to test - it should sizzle gently']
          },
          {
            id: '2', 
            instruction: 'Add diced onions and cook until translucent, about 5-7 minutes',
            timeEstimate: 420,
            techniques: ['Sweating', 'Aromatics'],
            tips: ['Stir occasionally to prevent browning', 'Add a pinch of salt to draw out moisture'],
            warnings: ['Don\'t let them brown - we want sweetness, not caramelization']
          }
        ];
        setCookingSteps(steps);
        setCurrentRecipe("Authentic Italian Marinara Sauce");
      } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('what')) {
        response = "I'm here to be your personal cooking mentor! I can see your ingredients, guide you through recipes step-by-step, teach you professional techniques, and adapt to your skill level. What would you like to cook today?";
      } else {
        response = "That's a great question! Let me think about the best approach for your skill level and the ingredients we have available.";
      }
      
      setIsThinking(false);
      setCurrentMessage(response);
      setEmotion('encouraging');
      
      // Add AI response to history
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
      
      speakMessage(response);
    }, 2000);
  };

  // DISABLED AUTO-SPEECH: No more robotic voice
  // Premium text-to-speech
  const speakMessage = (message: string) => {
    // if (!audioEnabled) return;
    // 
    // if (synthRef.current) {
    //   const utterance = new SpeechSynthesisUtterance(message);
    //   utterance.rate = 0.9;
    //   utterance.pitch = 1.0;
    //   utterance.volume = 0.8;
    //   
    //   // Select the best available voice
    //   const voices = synthRef.current.getVoices();
    //   const preferredVoice = voices.find(voice => 
    //     voice.name.includes('Daniel') || 
    //     voice.name.includes('Alex') || 
    //     voice.lang.includes('en-US')
    //   );
    //   if (preferredVoice) {
    //     utterance.voice = preferredVoice;
    //   }
    //   
    //   utterance.onstart = () => {
    //     setIsSpeaking(true);
    //     setEmotion('happy');
    //   };
    //   
    //   utterance.onend = () => {
    //     setIsSpeaking(false);
    //     setEmotion('neutral');
    //     // Auto-restart listening for continuous conversation
    //     setTimeout(() => {
    //       if (isConnected && !isListening) {
    //         startListening();
    //       }
    //     }, 1000);
    //   };
    //   
    //   synthRef.current.speak(utterance);
    // }
    console.log('UltimateAIChef speech disabled:', message);
  };

  const startConversation = () => {
    setIsConnected(true);
    setEmotion('excited');
    setCookingMode('teaching');
    
    const welcomeMessage = `Hello! I'm Chef Marco Savarin, your personal AI culinary mentor. I can see your ingredients, guide you through recipes with professional techniques, and adapt to your cooking style. I'm genuinely excited to cook with you today! What culinary adventure shall we begin?`;
    
    setCurrentMessage(welcomeMessage);
    speakMessage(welcomeMessage);
  };

  const endConversation = () => {
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setEmotion('neutral');
    setCookingMode('idle');
    setCurrentMessage("");
    setCurrentTranscript("");
    
    cleanup();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800">
      {/* Premium Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/95 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
              <div>
                <h1 className="text-3xl font-bold text-white">Ultimate AI Chef</h1>
                <p className="text-gray-300">World's Most Advanced Culinary AI</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                <Sparkles className="w-3 h-3 mr-1" />
                PREMIUM
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
                <Zap className="w-3 h-3 mr-1" />
                AI POWERED
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
                <Eye className="w-3 h-3 mr-1" />
                VISION ENABLED
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse shadow-lg`}></div>
          </div>
        </div>
        
        {/* Premium status bar */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            {isThinking && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                AI Processing...
              </Badge>
            )}
            {isListening && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                <Mic className="w-4 h-4 mr-2 animate-pulse" />
                Listening Actively
              </Badge>
            )}
            {isSpeaking && (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                <Volume2 className="w-4 h-4 mr-2 animate-bounce" />
                Chef Speaking
              </Badge>
            )}
            {cookingMode !== 'idle' && (
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-4 py-2">
                <ChefHat className="w-4 h-4 mr-2" />
                {cookingMode.charAt(0).toUpperCase() + cookingMode.slice(1)} Mode
              </Badge>
            )}
          </div>
          
          {currentRecipe && (
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">{currentRecipe}</span>
              {cookingSteps.length > 0 && (
                <Badge className="bg-white/20">
                  Step {currentStep + 1} of {cookingSteps.length}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Premium 3D Chef - Main Focus */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-slate-900 border border-gray-700 shadow-2xl h-[600px]">
              <Canvas camera={{ position: [0, 0, 7], fov: 40 }} shadows>
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
                <pointLight position={[-8, 8, 8]} intensity={0.6} color="#3b82f6" />
                <pointLight position={[8, -8, 8]} intensity={0.6} color="#f59e0b" />
                <pointLight position={[0, 0, 10]} intensity={0.4} color="#10b981" />
                <spotLight position={[0, 15, 0]} intensity={1} angle={0.2} penumbra={0.1} color="#ffffff" castShadow />
                
                <PhotorealisticChef 
                  isListening={isListening} 
                  isSpeaking={isSpeaking} 
                  isThinking={isThinking}
                  emotion={emotion}
                  cookingMode={cookingMode}
                />
              </Canvas>
            </Card>
          </div>

          {/* Side Panel - Controls & Information */}
          <div className="space-y-6">
            
            {/* Camera Feed & Ingredient Recognition */}
            <Card className="p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  AI Vision
                </h3>
                <Button
                  onClick={recognizeIngredients}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Ingredients
                </Button>
              </div>
              
              <div className="relative mb-4">
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-32 object-cover rounded-lg border border-gray-600"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              {recognizedIngredients.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300">Recognized Ingredients:</h4>
                  {recognizedIngredients.map((ingredient, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                      <span className="text-white">{ingredient.name}</span>
                      <Badge className={`
                        ${ingredient.freshness === 'fresh' ? 'bg-green-500/20 text-green-300' : ''}
                        ${ingredient.freshness === 'good' ? 'bg-yellow-500/20 text-yellow-300' : ''}
                        ${ingredient.freshness === 'use_soon' ? 'bg-orange-500/20 text-orange-300' : ''}
                      `}>
                        {Math.round(ingredient.confidence * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Cooking Progress */}
            {cookingSteps.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-400" />
                  Cooking Progress
                </h3>
                
                <div className="space-y-4">
                  <Progress value={(currentStep / cookingSteps.length) * 100} className="w-full" />
                  
                  {cookingSteps[currentStep] && (
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">
                        Step {currentStep + 1}: {cookingSteps[currentStep].instruction}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>⏱️ {Math.floor(cookingSteps[currentStep].timeEstimate / 60)}:{(cookingSteps[currentStep].timeEstimate % 60).toString().padStart(2, '0')}</span>
                        {cookingSteps[currentStep].temperature && (
                          <span>🌡️ {cookingSteps[currentStep].temperature}°F</span>
                        )}
                      </div>
                      <div className="mt-2">
                        {cookingSteps[currentStep].tips.map((tip, i) => (
                          <p key={i} className="text-blue-300 text-xs">💡 {tip}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* User Profile */}
            <Card className="p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Your Culinary Journey
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Skill Level</span>
                  <Badge className="bg-blue-500/20 text-blue-300">
                    {userProfile.skillLevel.charAt(0).toUpperCase() + userProfile.skillLevel.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Sessions Completed</span>
                  <Badge className="bg-green-500/20 text-green-300">
                    <Award className="w-3 h-3 mr-1" />
                    {conversationHistory.length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Chef Rating</span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Conversation Interface */}
        <div className="max-w-7xl mx-auto mt-8">
          
          {/* Live Transcript */}
          {currentTranscript && (
            <Card className="p-4 mb-4 bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <p className="text-emerald-300 text-sm font-medium mb-1">You're saying:</p>
                  <p className="text-white font-medium">"{currentTranscript}"</p>
                </div>
              </div>
            </Card>
          )}

          {/* Chef Response */}
          {currentMessage && (
            <Card className="p-6 mb-4 bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300 font-semibold">Chef Marco Savarin</span>
                    {isSpeaking && (
                      <Badge className="bg-blue-500/20 text-blue-300 animate-pulse">
                        Speaking
                      </Badge>
                    )}
                  </div>
                  <p className="text-white font-medium leading-relaxed">{currentMessage}</p>
                  {isSpeaking && (
                    <div className="flex items-center gap-1 mt-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Premium Control Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-6">
            {!isConnected ? (
              <Button
                onClick={startConversation}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-full shadow-2xl text-lg"
              >
                <Phone className="w-6 h-6 mr-3" />
                Start Ultimate Cooking Experience
              </Button>
            ) : (
              <>
                <Button
                  onClick={isListening ? () => recognitionRef.current?.stop() : startListening}
                  className={`p-4 rounded-full transition-all duration-300 shadow-lg ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                
                <Button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-4 rounded-full transition-colors shadow-lg ${
                    audioEnabled 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  } text-white`}
                >
                  {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </Button>
                
                <Button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`p-4 rounded-full transition-colors shadow-lg ${
                    videoEnabled 
                      ? 'bg-purple-500 hover:bg-purple-600' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  } text-white`}
                >
                  {videoEnabled ? <Video className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </Button>
                
                <Button
                  onClick={recognizeIngredients}
                  className="p-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-colors"
                >
                  <Camera className="w-6 h-6" />
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
          
          {!isConnected && (
            <p className="text-center text-gray-400 text-sm mt-4">
              🌟 Experience the world's most advanced AI culinary assistant
            </p>
          )}
        </div>
      </div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/3 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-green-500/3 rounded-full animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};