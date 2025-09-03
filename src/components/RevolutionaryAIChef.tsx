import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, MicOff, Camera, CameraOff, Volume2, VolumeX,
  ChefHat, Eye, Brain, Sparkles, Play, Pause
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useConversation } from "@11labs/react";
import { pipeline } from "@huggingface/transformers";

interface AIChefState {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  isWatching: boolean;
  emotion: 'neutral' | 'excited' | 'concerned' | 'proud' | 'encouraging';
  currentMessage: string;
  cookingStage: 'prep' | 'cooking' | 'plating' | 'complete';
  confidence: number;
}

interface CookingInsight {
  type: 'ingredient' | 'technique' | 'timing' | 'temperature' | 'safety';
  message: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: number;
}

export const RevolutionaryAIChef = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [chefState, setChefState] = useState<AIChefState>({
    isListening: false,
    isSpeaking: false,
    isThinking: false,
    isWatching: false,
    emotion: 'neutral',
    currentMessage: "Hello! I'm your AI sous chef. Let me watch and guide you through cooking.",
    cookingStage: 'prep',
    confidence: 0
  });

  const [insights, setInsights] = useState<CookingInsight[]>([]);
  const [recognizedItems, setRecognizedItems] = useState<string[]>([]);
  const [imageClassifier, setImageClassifier] = useState<any>(null);
  const [conversationStarted, setConversationStarted] = useState(false);

  // ElevenLabs conversation hook with enhanced settings
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to AI chef");
      updateChefState({ isListening: true, emotion: 'excited' });
      toast({
        title: "🔊 Chef Connected!",
        description: "I can now hear and speak with you in real-time!"
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from AI chef");
      updateChefState({ isListening: false, emotion: 'neutral' });
    },
    onMessage: (message) => {
      console.log("Chef message:", message);
      // Handle different message sources
      if (message.source === 'user') {
        updateChefState({ 
          currentMessage: `You said: "${message.message}"`,
          isThinking: true,
          emotion: 'neutral'
        });
      } else if (message.source === 'ai') {
        updateChefState({ 
          currentMessage: message.message,
          isSpeaking: true,
          isThinking: false,
          emotion: 'encouraging'
        });
        
        // Send vision context if we have insights
        if (recognizedItems.length > 0) {
          const contextMessage = `I can see: ${recognizedItems.join(', ')}. ${message.message}`;
          setTimeout(() => {
            updateChefState({ currentMessage: contextMessage });
          }, 100);
        }
      }
    },
    onError: (error) => {
      console.error("AI chef error:", error);
      toast({
        title: "Chef Connection Error",
        description: "Having trouble with voice connection. Please check your microphone and try again.",
        variant: "destructive"
      });
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are Chef Savarin, an expert AI sous chef with computer vision and real-time voice capabilities. You help users cook by:

1. Watching their cooking through computer vision and commenting on what you see
2. Providing step-by-step cooking guidance with professional techniques
3. Responding to their questions about ingredients, techniques, and timing
4. Being encouraging, professional, but friendly and approachable
5. Giving concise, actionable advice

When you receive vision context about ingredients or tools the user is using, incorporate that into your responses. Always be specific and helpful. Keep responses conversational but informative.

Current cooking context: The user is in their kitchen and I can see their ingredients and cooking tools through my computer vision system.`
        },
        firstMessage: "Hey there! I'm Chef Savarin, your AI sous chef. I can see your kitchen and talk with you in real-time. What are we cooking today?",
        language: "en"
      },
      tts: {
        voiceId: "onwK4e9ZLuTAKqWW03F9" // Daniel voice - professional male chef voice
      }
    }
  });

  // Initialize computer vision
  useEffect(() => {
    const initializeVision = async () => {
      try {
        console.log("Initializing computer vision...");
        const classifier = await pipeline(
          "image-classification", 
          "google/vit-base-patch16-224",
          { device: "webgpu" }
        );
        setImageClassifier(classifier);
        console.log("Computer vision ready!");
      } catch (error) {
        console.error("Failed to initialize vision:", error);
        // Fallback to CPU if WebGPU fails
        try {
          const classifier = await pipeline(
            "image-classification", 
            "google/vit-base-patch16-224"
          );
          setImageClassifier(classifier);
        } catch (fallbackError) {
          console.error("Vision initialization failed completely:", fallbackError);
        }
      }
    };

    initializeVision();
  }, []);

  const updateChefState = useCallback((updates: Partial<AIChefState>) => {
    setChefState(prev => ({ ...prev, ...updates }));
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        updateChefState({ isWatching: true });
        
        // Start continuous analysis
        startContinuousAnalysis();
        
        toast({
          title: "Chef Vision Activated",
          description: "I can now see your kitchen and ingredients!"
        });
      }
    } catch (error) {
      console.error("Camera access failed:", error);
      toast({
        title: "Camera Access Required",
        description: "I need to see your cooking to provide the best guidance.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    updateChefState({ isWatching: false });
  };

  const startContinuousAnalysis = () => {
    if (analysisIntervalRef.current) return;
    
    analysisIntervalRef.current = setInterval(async () => {
      await analyzeCurrentFrame();
    }, 2000); // Analyze every 2 seconds for more responsive interaction
  };

  const analyzeCurrentFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !imageClassifier) return;
    
    updateChefState({ isThinking: true });
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Capture frame from video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Detect motion by comparing frames
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      detectMotionAndActivity(imageData);
      
      // Convert to blob for AI analysis
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const results = await imageClassifier(blob);
        processVisionResults(results);
      });
      
    } catch (error) {
      console.error("Frame analysis failed:", error);
    } finally {
      updateChefState({ isThinking: false });
    }
  };

  const detectMotionAndActivity = (currentImageData: ImageData) => {
    // Simple motion detection by comparing pixel changes
    // In a real implementation, you'd store previous frame data and compare
    const totalPixels = currentImageData.data.length / 4;
    let changedPixels = 0;
    
    // Simple brightness-based motion detection
    for (let i = 0; i < currentImageData.data.length; i += 16) { // Sample every 4th pixel
      const r = currentImageData.data[i];
      const g = currentImageData.data[i + 1];  
      const b = currentImageData.data[i + 2];
      const brightness = (r + g + b) / 3;
      
      // If we detect significant brightness changes (movement), increment
      if (brightness > 100) { // Threshold for activity
        changedPixels++;
      }
    }
    
    const motionPercentage = (changedPixels / (totalPixels / 4)) * 100;
    
    if (motionPercentage > 15 && conversationStarted) {
      // Send motion context to AI
      setTimeout(() => {
        if (recognizedItems.length > 0) {
          const contextMessage = `I can see you're actively working with: ${recognizedItems.slice(-2).join(', ')}. Looking good!`;
          updateChefState({ 
            currentMessage: contextMessage,
            emotion: 'encouraging'
          });
        }
      }, 500);
    }
  };

  const processVisionResults = (results: any[]) => {
    if (!results || results.length === 0) return;
    
    const topResult = results[0];
    const confidence = topResult.score;
    
    // Update recognized items if confidence is high enough
    if (confidence > 0.3) {
      const item = topResult.label.toLowerCase();
      setRecognizedItems(prev => {
        if (!prev.includes(item)) {
          return [...prev.slice(-4), item]; // Keep last 5 items
        }
        return prev;
      });
      
      // Generate cooking insight based on recognition
      generateCookingInsight(item, confidence);
    }
    
    updateChefState({ confidence });
  };

  const generateCookingInsight = (item: string, confidence: number) => {
    const foodItems = ['banana', 'apple', 'bread', 'egg', 'meat', 'vegetable', 'onion', 'tomato', 'cheese'];
    const cookingTools = ['knife', 'pan', 'pot', 'spoon', 'spatula'];
    
    let insight: CookingInsight | null = null;
    
    if (foodItems.some(food => item.includes(food))) {
      insight = {
        type: 'ingredient',
        message: `I can see ${item}! That's a great choice. Let me know if you need preparation tips.`,
        urgency: 'low',
        timestamp: Date.now()
      };
    } else if (cookingTools.some(tool => item.includes(tool))) {
      insight = {
        type: 'technique',
        message: `Good choice using the ${item}. Remember proper technique for best results!`,
        urgency: 'medium',
        timestamp: Date.now()
      };
    }
    
    if (insight && confidence > 0.6) {
      setInsights(prev => [insight!, ...prev.slice(0, 4)]); // Keep last 5 insights
      
      // Send to conversation AI for contextual response
      if (conversationStarted) {
        sendContextToAI(insight.message);
      }
    }
  };

  const sendContextToAI = async (context: string) => {
    // This would integrate with the conversation AI to provide contextual responses
    console.log("Sending context to AI:", context);
  };

  const startConversation = async () => {
    try {
      updateChefState({ isThinking: true });
      
      // Request microphone access for conversation
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // For now, simulate the conversation since we need a proper ElevenLabs agent setup
      // In production, you would use: conversation.startSession({ signedUrl: "your_signed_url" })
      
      toast({
        title: "🎙️ Voice Ready!",
        description: "Microphone access granted. ElevenLabs agent setup needed for full voice chat.",
      });
      
      setConversationStarted(true);
      updateChefState({ 
        isListening: true,
        emotion: 'excited',
        currentMessage: "Great! I can access your microphone. Once ElevenLabs agent is configured, we can have full voice conversations!"
      });
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Voice Setup Needed",
        description: "Please allow microphone access and configure ElevenLabs agent ID.",
        variant: "destructive"
      });
    } finally {
      updateChefState({ isThinking: false });
    }
  };

  const stopConversation = async () => {
    try {
      if (conversation.status === "connected") {
        await conversation.endSession();
      }
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
    
    setConversationStarted(false);
    updateChefState({ 
      isListening: false, 
      isSpeaking: false, 
      emotion: 'neutral',
      currentMessage: "Voice session ended. Click 'Start Voice Chat' when ready!"
    });
  };

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'excited': return '🤩';
      case 'concerned': return '🤔';
      case 'proud': return '😊';
      case 'encouraging': return '💪';
      default: return '👨‍🍳';
    }
  };

  const getStatusColor = () => {
    if (chefState.isThinking) return 'bg-yellow-500';
    if (chefState.isSpeaking) return 'bg-green-500';
    if (chefState.isListening) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* AI Chef Status Display */}
      <Card className="border-primary shadow-warm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Chef Savarin AI
              <span className="text-2xl">{getEmotionEmoji(chefState.emotion)}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
              <Badge variant={conversation.status === "connected" ? "default" : "secondary"}>
                {conversation.status === "connected" ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chef Message */}
            <div className="bg-gradient-subtle p-4 rounded-lg">
              <p className="text-charcoal font-medium">{chefState.currentMessage}</p>
              {chefState.confidence > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Vision Confidence: {Math.round(chefState.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant={conversationStarted ? "destructive" : "hero"}
                onClick={conversationStarted ? stopConversation : startConversation}
                className="flex items-center gap-2"
                disabled={chefState.isThinking}
              >
                {conversationStarted ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Stop Voice
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Start Voice Chat
                  </>
                )}
              </Button>

              <Button
                variant={chefState.isWatching ? "secondary" : "outline"}
                onClick={chefState.isWatching ? stopCamera : startCamera}
                className="flex items-center gap-2"
              >
                {chefState.isWatching ? (
                  <>
                    <CameraOff className="w-4 h-4" />
                    Stop Vision
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Start Vision
                  </>
                )}
              </Button>

              <Button
                variant={conversation.isSpeaking ? "default" : "outline"}
                disabled={!conversationStarted}
                className="flex items-center gap-2"
                onClick={() => conversation.setVolume({ volume: conversation.isSpeaking ? 0 : 0.8 })}
              >
                {conversation.isSpeaking ? (
                  <>
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    Chef Speaking
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Chef Silent
                  </>
                )}
              </Button>

              <Badge 
                variant={conversation.status === "connected" ? "default" : "secondary"}
                className="flex items-center gap-2 justify-center py-2"
              >
                {conversation.status === "connected" ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live & Listening
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    Disconnected
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Feed & Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Chef's Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full rounded-lg bg-muted"
                style={{ aspectRatio: '4/3' }}
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              {chefState.isThinking && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Brain className="w-3 h-3 animate-pulse" />
                  Analyzing...
                </div>
              )}
              {!chefState.isWatching && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-60" />
                    <p className="text-sm">Camera not active</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Recognized Items */}
              {recognizedItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">I can see:</h4>
                  <div className="flex flex-wrap gap-1">
                    {recognizedItems.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Insights */}
              <div>
                <h4 className="text-sm font-medium mb-2">Live Guidance:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {insights.length > 0 ? (
                    insights.map((insight, idx) => (
                      <div 
                        key={idx}
                        className={`p-2 rounded text-xs ${
                          insight.urgency === 'high' 
                            ? 'bg-red-100 border border-red-200' 
                            : insight.urgency === 'medium'
                            ? 'bg-yellow-100 border border-yellow-200'
                            : 'bg-blue-100 border border-blue-200'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {insight.type}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(insight.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p>{insight.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Start cooking and I'll provide real-time guidance!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};