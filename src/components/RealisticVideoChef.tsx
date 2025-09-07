import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff, 
  Camera,
  Eye,
  Brain,
  Sparkles,
  Crown,
  ChefHat,
  MessageSquare,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RealisticVideoChefProps {}

export const RealisticVideoChef: React.FC<RealisticVideoChefProps> = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [chefEmotion, setChefEmotion] = useState<'neutral' | 'happy' | 'excited' | 'focused' | 'speaking'>('neutral');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const animationRef = useRef<number>();
  
  const { toast } = useToast();

  // Realistic chef video simulation
  const chefVideoFrames = {
    neutral: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjMWUyOTNiIDAlLCAjMzc0MTUxIDEwMCUpIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNmM2U4ZmYiLz4KPHJlY3QgeD0iMTcwIiB5PSIxMDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxODAiIGN5PSIxODAiIHI9IjUiIGZpbGw9IiMyNTY3OGYiLz4KPGNpcmNsZSBjeD0iMjIwIiBjeT0iMTgwIiByPSI1IiBmaWxsPSIjMjU2NzhmIi8+CjxyZWN0IHg9IjE5MCIgeT0iMjEwIiB3aWR0aD0iMjAiIGhlaWdodD0iNSIgZmlsbD0iI2RjMjYyNiIvPgo8cmVjdCB4PSIxNTAiIHk9IjI4MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjE4NSIgY3k9IjMyMCIgcj0iMyIgZmlsbD0iIzZiNzI4MCIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIzNDAiIHI9IjMiIGZpbGw9IiM2Yjcy"ODAiLz4KPGNpcmNsZSBjeD0iMjE1IiBjeT0iMzYwIiByPSIzIiBmaWxsPSIjNmI3MjgwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iNDYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkludGVyIj5DaGVmIE1hcmNvPC90ZXh0Pgo8L3N2Zz4K',
    happy: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjMWUyOTNiIDAlLCAjMzc0MTUxIDEwMCUpIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNmM2U4ZmYiLz4KPHJlY3QgeD0iMTcwIiB5PSIxMDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgcng9IjIwIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxODAiIGN5PSIxODAiIHI9IjUiIGZpbGw9IiMyNTY3OGYiLz4KPGNpcmNsZSBjeD0iMjIwIiBjeT0iMTgwIiByPSI1IiBmaWxsPSIjMjU2NzhmIi8+CjxwYXRoIGQ9Ik0xODAgMjIwIFEyMDAgMjM1IDIyMCAyMjAiIHN0cm9rZT0iI2RjMjYyNiIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CjxyZWN0IHg9IjE1MCIgeT0iMjgwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMTg1IiBjeT0iMzIwIiByPSIzIiBmaWxsPSIjNmI3MjgwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjM0MCIgcj0iMyIgZmlsbD0iIzZiNzI4MCIvPgo8Y2lyY2xlIGN4PSIyMTUiIGN5PSIzNjAiIHI9IjMiIGZpbGw9IiM2Yjcy"DgwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iNDYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9IkludGVyIj5DaGVmIE1hcmNvPC90ZXh0Pgo8L3N2Zz4K'
  };

  useEffect(() => {
    // DISABLED AUTO-SPEECH: No more robotic voice
    // synthRef.current = window.speechSynthesis;
    startVideoAnimation();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
  };

  // Create realistic video animation
  const startVideoAnimation = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 500;
    
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'linear-gradient(180deg, #1e293b 0%, #374151 100%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create realistic chef appearance
      drawRealisticChef(ctx);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const drawRealisticChef = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.001;
    
    // Kitchen background with high-tech displays
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 400, 500);
    
    // High-tech kitchen displays
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(50, 50, 80, 60);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(270, 50, 80, 60);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(160, 30, 80, 40);
    
    // Professional lighting
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 150);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 500);
    
    // Realistic chef body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(150, 280, 100, 180);
    
    // Professional chef coat buttons
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.arc(185, 320, 4, 0, Math.PI * 2);
    ctx.arc(200, 340, 4, 0, Math.PI * 2);
    ctx.arc(215, 360, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Realistic head with proper proportions
    const headY = 200 + Math.sin(time * 0.8) * 2; // Breathing animation
    
    // Head shadow for depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.arc(203, headY + 3, 82, 0, Math.PI * 2);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(200, headY, 80, 0, Math.PI * 2);
    ctx.fill();
    
    // Professional chef hat
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(170, headY - 140, 60, 80);
    ctx.beginPath();
    ctx.arc(200, headY - 140, 30, Math.PI, 0);
    ctx.fill();
    
    // Realistic eyes with depth
    const eyeY = headY - 20;
    const blinkOffset = Math.sin(time * 0.3) > 0.95 ? 8 : 0;
    
    // Eye whites
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(180, eyeY, 12, 8 - blinkOffset, 0, 0, Math.PI * 2);
    ctx.ellipse(220, eyeY, 12, 8 - blinkOffset, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils with tracking
    const pupilOffsetX = isListening ? Math.sin(time * 2) * 3 : Math.sin(time * 0.2) * 2;
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(180 + pupilOffsetX, eyeY, 6, 0, Math.PI * 2);
    ctx.arc(220 + pupilOffsetX, eyeY, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye reflections for realism
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(182 + pupilOffsetX, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.arc(222 + pupilOffsetX, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Professional glasses
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(180, eyeY, 15, 0, Math.PI * 2);
    ctx.arc(220, eyeY, 15, 0, Math.PI * 2);
    ctx.moveTo(195, eyeY);
    ctx.lineTo(205, eyeY);
    ctx.stroke();
    
    // Expressive mouth based on state
    const mouthY = headY + 30;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    if (isSpeaking) {
      // Animated speaking mouth
      const speakOffset = Math.sin(time * 12) * 5;
      ctx.ellipse(200, mouthY, 15 + speakOffset, 8 + speakOffset * 0.5, 0, 0, Math.PI * 2);
    } else if (chefEmotion === 'happy') {
      // Smile
      ctx.arc(200, mouthY - 5, 15, 0.2, Math.PI - 0.2);
    } else {
      // Neutral mouth
      ctx.moveTo(185, mouthY);
      ctx.lineTo(215, mouthY);
    }
    ctx.stroke();
    
    // Professional mustache
    ctx.fillStyle = '#374151';
    ctx.fillRect(175, headY + 15, 50, 12);
    
    // Facial hair for character
    ctx.fillStyle = '#374151';
    ctx.fillRect(190, headY + 45, 20, 25);
    
    // Real-time visual indicators
    if (isListening) {
      // Listening indicator
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(320, 150, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('LISTENING', 320, 175);
    }
    
    if (isSpeaking) {
      // Speaking waveform
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#3b82f6';
        const barHeight = 5 + Math.sin(time * 8 + i) * 8;
        ctx.fillRect(80 + i * 8, 150 - barHeight / 2, 4, barHeight);
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('SPEAKING', 100, 175);
    }
    
    if (isThinking) {
      // Thinking bubbles
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#8b5cf6';
        const bubbleY = 100 + i * 15 + Math.sin(time * 3 + i) * 5;
        ctx.beginPath();
        ctx.arc(200 + i * 12, bubbleY, 4 - i, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Professional name plate
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(50, 430, 300, 50);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Chef Marco Savarin', 200, 450);
    
    ctx.font = '16px Inter';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Michelin Star AI Chef', 200, 470);
  };

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setChefEmotion('focused');
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
        description: "Please use a modern browser for voice interaction.",
        variant: "destructive"
      });
    }
  }, []);

  const handleUserMessage = async (message: string) => {
    setIsThinking(true);
    setChefEmotion('focused');
    
    // Simulate intelligent AI response
    setTimeout(() => {
      let response = "";
      
      if (message.toLowerCase().includes('pasta')) {
        response = "Perfect! Let's create an authentic Italian pasta dish. I'll guide you through every step with professional techniques that will make your pasta restaurant-quality.";
        setChefEmotion('excited');
      } else if (message.toLowerCase().includes('help')) {
        response = "I'm here as your personal culinary mentor! I can teach you any cooking technique, help you create amazing dishes, and guide you step-by-step. What would you like to master today?";
        setChefEmotion('happy');
      } else {
        response = "Excellent question! Let me share the professional approach to that technique. I'll make sure you understand both the how and the why behind great cooking.";
        setChefEmotion('happy');
      }
      
      setIsThinking(false);
      setCurrentMessage(response);
      
      speakMessage(response);
    }, 2000);
  };

  const speakMessage = (message: string) => {
    // DISABLED AUTO-SPEECH: No more robotic voice
    // if (!audioEnabled || !synthRef.current) return;
    // 
    // const utterance = new SpeechSynthesisUtterance(message);
    // utterance.rate = 0.9;
    // utterance.pitch = 1.0;
    // utterance.volume = 0.8;
    // 
    // // Select best voice
    // const voices = synthRef.current.getVoices();
    // const preferredVoice = voices.find(voice => 
    //   voice.name.includes('Daniel') || 
    //   voice.name.includes('Alex') || 
    //   voice.lang.includes('en-US')
    // );
    // if (preferredVoice) {
    //   utterance.voice = preferredVoice;
    // }
    // 
    // utterance.onstart = () => {
    //   setIsSpeaking(true);
    //   setChefEmotion('speaking');
    // };
    // 
    // utterance.onend = () => {
    //   setIsSpeaking(false);
    //   setChefEmotion('neutral');
    //   // Auto-restart listening
    //   setTimeout(() => {
    //     if (isConnected) {
    //       startListening();
    //     }
    //   }, 1000);
    // };
    // 
    // synthRef.current.speak(utterance);
    console.log('RealisticVideoChef speech disabled:', message);
  };

  const startConversation = () => {
    setIsConnected(true);
    setChefEmotion('excited');
    
    const welcomeMessage = "Hello! I'm Chef Marco Savarin, your personal Michelin-star culinary instructor. I'm genuinely excited to teach you professional cooking techniques and create amazing dishes together. What would you like to master today?";
    
    setCurrentMessage(welcomeMessage);
    speakMessage(welcomeMessage);
    
    toast({
      title: "Chef Marco is Ready!",
      description: "Your personal culinary mentor is now active.",
    });
  };

  const endConversation = () => {
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setChefEmotion('neutral');
    setCurrentMessage("");
    setCurrentTranscript("");
    
    cleanup();
    
    toast({
      title: "Session Ended",
      description: "Thank you for cooking with Chef Marco!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 p-6">
      {/* Premium Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Realistic AI Chef</h1>
              <p className="text-gray-300 text-lg">Professional Culinary Experience</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                <Sparkles className="w-3 h-3 mr-1" />
                PREMIUM
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                <Brain className="w-3 h-3 mr-1" />
                AI POWERED
              </Badge>
            </div>
          </div>
          
          <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        </div>
      </div>

      {/* Main Video Interface */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Realistic Chef Video */}
        <div className="lg:col-span-2">
          <Card className="relative overflow-hidden bg-black border-2 border-gray-700 shadow-2xl">
            {/* Video Call Style Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <div>
                    <h3 className="font-bold text-lg">Chef Marco Savarin</h3>
                    <p className="text-sm text-gray-300">Michelin Star Chef • Live</p>
                  </div>
                </div>
                
                {/* Status Badges */}
                <div className="flex gap-2">
                  {isThinking && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Brain className="w-3 h-3 mr-1" />
                      Thinking
                    </Badge>
                  )}
                  {isListening && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Mic className="w-3 h-3 mr-1" />
                      Listening
                    </Badge>
                  )}
                  {isSpeaking && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <Volume2 className="w-3 h-3 mr-1" />
                      Speaking
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Realistic Chef Canvas */}
            <div className="relative w-full h-[500px]">
              <canvas 
                ref={canvasRef}
                className="w-full h-full object-cover"
              />
              <video 
                ref={videoRef}
                className="hidden"
                autoPlay
                playsInline
                muted
              />
            </div>
            
            {/* Connection Quality */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
              {[1,2,3,4].map((bar) => (
                <div
                  key={bar}
                  className={`w-1 bg-green-500`}
                  style={{ height: `${bar * 3 + 6}px` }}
                ></div>
              ))}
            </div>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          
          {/* Chef Status */}
          <Card className="p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-400" />
              Chef Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Mode</span>
                <Badge className={`
                  ${chefEmotion === 'neutral' ? 'bg-gray-500/20 text-gray-400' : ''}
                  ${chefEmotion === 'happy' ? 'bg-green-500/20 text-green-400' : ''}
                  ${chefEmotion === 'excited' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                  ${chefEmotion === 'focused' ? 'bg-blue-500/20 text-blue-400' : ''}
                  ${chefEmotion === 'speaking' ? 'bg-purple-500/20 text-purple-400' : ''}
                `}>
                  {chefEmotion.charAt(0).toUpperCase() + chefEmotion.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Connection</span>
                <Badge className={isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                  {isConnected ? 'Live' : 'Offline'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Audio Quality</span>
                <Badge className="bg-blue-500/20 text-blue-400">HD</Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setCurrentMessage("Let's start with pasta basics - I'll teach you how to make perfect al dente pasta every time!");
                  speakMessage("Let's start with pasta basics - I'll teach you how to make perfect al dente pasta every time!");
                }}
              >
                Pasta Masterclass
              </Button>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setCurrentMessage("Knife skills are fundamental! Let me show you proper techniques for safe, efficient cutting.");
                  speakMessage("Knife skills are fundamental! Let me show you proper techniques for safe, efficient cutting.");
                }}
              >
                Knife Skills
              </Button>
              
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setCurrentMessage("Sauce making is an art! I'll teach you the five mother sauces and how to master them.");
                  speakMessage("Sauce making is an art! I'll teach you the five mother sauces and how to master them.");
                }}
              >
                Sauce Techniques
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Live Communication */}
      <div className="max-w-6xl mx-auto mt-8 space-y-4">
        
        {/* User Transcript */}
        {currentTranscript && (
          <Card className="p-4 bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-emerald-300 text-sm mb-1">You're saying:</p>
                <p className="text-white font-medium">"{currentTranscript}"</p>
              </div>
            </div>
          </Card>
        )}

        {/* Chef Response */}
        {currentMessage && (
          <Card className="p-6 bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-semibold">Chef Marco</span>
                  {isSpeaking && (
                    <Badge className="bg-blue-500/20 text-blue-300 animate-pulse">Speaking</Badge>
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

      {/* Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent backdrop-blur-sm p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-6">
            {!isConnected ? (
              <Button
                onClick={startConversation}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-full shadow-2xl text-lg"
              >
                <Phone className="w-6 h-6 mr-3" />
                Connect with Chef Marco
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
                  onClick={endConversation}
                  className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors"
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};