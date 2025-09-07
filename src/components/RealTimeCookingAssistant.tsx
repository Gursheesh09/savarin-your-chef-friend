import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  CameraOff, 
  Eye, 
  Brain, 
  ChefHat, 
  Clock, 
  Thermometer, 
  Scale, 
  Target, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CookingInsight {
  id: string;
  type: 'ingredient' | 'technique' | 'timing' | 'temperature' | 'safety' | 'quality';
  message: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: number;
  confidence: number;
  action?: string;
}

interface IngredientAnalysis {
  name: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  freshness: number;
  ripeness: number;
  recommendations: string[];
}

export const RealTimeCookingAssistant = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isWatching, setIsWatching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentInsights, setCurrentInsights] = useState<CookingInsight[]>([]);
  const [recognizedIngredients, setRecognizedIngredients] = useState<IngredientAnalysis[]>([]);
  const [cookingStage, setCookingStage] = useState<'prep' | 'cooking' | 'plating' | 'complete'>('prep');
  const [currentTechnique, setCurrentTechnique] = useState<string>('');
  const [confidence, setConfidence] = useState(0);

  // Simulated AI analysis (replace with real computer vision)
  const simulateVisionAnalysis = () => {
    const mockIngredients = [
      { name: "Red Onion", quality: "excellent" as const, freshness: 95, ripeness: 90, recommendations: ["Perfect for caramelizing", "Slice thinly for even cooking"] },
      { name: "Garlic", quality: "good" as const, freshness: 88, ripeness: 85, recommendations: ["Mince finely for maximum flavor", "Add towards the end to avoid burning"] },
      { name: "Bell Pepper", quality: "excellent" as const, freshness: 92, ripeness: 88, recommendations: ["Great color and texture", "Perfect for stir-frying"] }
    ];

    const mockInsights: CookingInsight[] = [
      {
        id: "1",
        type: "quality",
        message: "Your red onion is perfectly fresh - excellent choice for caramelizing!",
        urgency: "low",
        timestamp: Date.now(),
        confidence: 0.95,
        action: "Continue with current prep"
      },
      {
        id: "2",
        type: "technique",
        message: "Your knife work is solid! Keep those cuts consistent for even cooking.",
        urgency: "medium",
        timestamp: Date.now(),
        confidence: 0.87,
        action: "Maintain current technique"
      },
      {
        id: "3",
        type: "timing",
        message: "Onions are ready for the next step - they've reached perfect translucency.",
        urgency: "high",
        timestamp: Date.now(),
        confidence: 0.92,
        action: "Proceed to next ingredient"
      }
    ];

    setRecognizedIngredients(mockIngredients);
    setCurrentInsights(mockInsights);
    setConfidence(0.91);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'environment'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsWatching(true);
        
        // Start continuous analysis
        startContinuousAnalysis();
        
        toast({
          title: "👁️ Chef Vision Activated",
          description: "I can now see your kitchen and provide real-time guidance!"
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
      setIsWatching(false);
      setIsAnalyzing(false);
      
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      
      toast({
        title: "Vision Stopped",
        description: "I'm no longer watching, but I'm still here to help!"
      });
    }
  };

  const startContinuousAnalysis = () => {
    // Simulate real-time AI analysis every 3 seconds
    analysisIntervalRef.current = setInterval(() => {
      setIsAnalyzing(true);
      setTimeout(() => {
        simulateVisionAnalysis();
        setIsAnalyzing(false);
      }, 1000);
    }, 3000);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Simulate AI analysis
        setIsAnalyzing(true);
        setTimeout(() => {
          simulateVisionAnalysis();
          setIsAnalyzing(false);
        }, 1000);
        
        toast({
          title: "📸 Frame Captured",
          description: "Analyzing your cooking progress..."
        });
      }
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ingredient': return <Scale className="w-4 h-4" />;
      case 'technique': return <ChefHat className="w-4 h-4" />;
      case 'timing': return <Clock className="w-4 h-4" />;
      case 'temperature': return <Thermometer className="w-4 h-4" />;
      case 'safety': return <AlertTriangle className="w-4 h-4" />;
      case 'quality': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Vision Control */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Chef Vision - Real-Time Analysis</CardTitle>
                <p className="text-slate-300 text-sm">AI-powered cooking guidance and ingredient recognition</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isWatching ? (
                <Button onClick={startCamera} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Vision
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Vision
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Camera Feed */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm overflow-hidden">
        <div className="relative">
          {isWatching ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover bg-black"
              />
              
              {/* Live Analysis Overlay */}
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 border border-green-500/30">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  LIVE ANALYSIS
                </div>
              </div>
              
              {/* Confidence Indicator */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 border border-blue-500/30">
                <div className="text-blue-400 text-sm font-mono">
                  AI Confidence: {(confidence * 100).toFixed(0)}%
                </div>
              </div>
              
              {/* Cooking Stage */}
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 border border-orange-500/30">
                <div className="text-orange-400 text-sm font-medium">
                  Stage: {cookingStage.toUpperCase()}
                </div>
              </div>
              
              {/* Analysis Status */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <div className="text-white font-medium">Analyzing...</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 font-medium">Camera will show your cooking</p>
                <p className="text-slate-400 text-sm">I'll watch and guide you in real-time!</p>
              </div>
            </div>
          )}
          
          {/* Manual Capture Button */}
          {isWatching && (
            <div className="p-4 flex justify-center">
              <Button onClick={captureFrame} variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                <Eye className="w-4 h-4 mr-2" />
                Analyze Current Frame
              </Button>
            </div>
          )}
        </div>
        
        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </Card>

      {/* Real-Time Insights */}
      {currentInsights.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-white">AI Chef Insights</CardTitle>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentInsights.map((insight) => (
                <div key={insight.id} className={`p-3 rounded-lg border ${getUrgencyColor(insight.urgency)}`}>
                  <div className="flex items-start gap-3">
                    {getTypeIcon(insight.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.message}</p>
                      {insight.action && (
                        <p className="text-xs opacity-70 mt-1">💡 {insight.action}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                        <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                        <span>•</span>
                        <span>{new Date(insight.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ingredient Analysis */}
      {recognizedIngredients.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-white">Ingredient Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {recognizedIngredients.map((ingredient, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{ingredient.name}</h4>
                    <Badge className={`${
                      ingredient.quality === 'excellent' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      ingredient.quality === 'good' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      ingredient.quality === 'fair' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {ingredient.quality}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Freshness</div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${ingredient.freshness}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">{ingredient.freshness}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Ripeness</div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${ingredient.ripeness}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">{ingredient.ripeness}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Recommendations</div>
                    <div className="space-y-1">
                      {ingredient.recommendations.map((rec, recIndex) => (
                        <div key={recIndex} className="text-xs text-slate-300 flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
