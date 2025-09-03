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

  // ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to AI chef");
      updateChefState({ isListening: true, emotion: 'excited' });
    },
    onDisconnect: () => {
      console.log("Disconnected from AI chef");
      updateChefState({ isListening: false, emotion: 'neutral' });
    },
    onMessage: (message) => {
      console.log("Chef message:", message);
      // Process incoming messages when voice integration is fully set up
      updateChefState({ 
        currentMessage: `Voice message received: ${message.message}`,
        isSpeaking: true,
        isThinking: false,
        emotion: 'encouraging'
      });
    },
    onError: (error) => {
      console.error("AI chef error:", error);
      toast({
        title: "Chef Connection Error",
        description: "Having trouble connecting to your AI chef. Please check your connection.",
        variant: "destructive"
      });
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
    }, 3000); // Analyze every 3 seconds
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
      
      // Convert to blob for analysis
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
      
      // For now, simulate AI chef connection
      // In production, you'd get a conversationToken from your backend
      toast({
        title: "AI Chef Ready!",
        description: "Voice integration coming soon. For now, use camera vision for cooking guidance.",
      });
      
      setConversationStarted(true);
      updateChefState({ 
        isListening: true,
        emotion: 'excited',
        currentMessage: "I'm ready to help! Turn on my vision so I can see your cooking."
      });
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Connection Failed",
        description: "Couldn't connect to AI chef. Please try again.",
        variant: "destructive"
      });
    } finally {
      updateChefState({ isThinking: false });
    }
  };

  const stopConversation = async () => {
    setConversationStarted(false);
    updateChefState({ 
      isListening: false, 
      isSpeaking: false, 
      emotion: 'neutral',
      currentMessage: "Session ended. Start again when you're ready to cook!"
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
                variant={conversationStarted ? "destructive" : "default"}
                onClick={conversationStarted ? stopConversation : startConversation}
                className="flex items-center gap-2"
                disabled={chefState.isThinking}
              >
                {conversationStarted ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Stop Chef
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start Chef
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
                variant={chefState.isListening ? "default" : "outline"}
                disabled={!conversationStarted}
                className="flex items-center gap-2"
              >
                {chefState.isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Listening...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Mic Off
                  </>
                )}
              </Button>

              <Button
                variant={chefState.isSpeaking ? "default" : "outline"}
                disabled={!conversationStarted}
                className="flex items-center gap-2"
              >
                {chefState.isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Speaking...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Silent
                  </>
                )}
              </Button>
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