import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, CameraOff, Eye, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraFeedProps {
  onCapture?: (imageData: string) => void;
  isAnalyzing?: boolean;
}

export const CameraFeed = ({ onCapture, isAnalyzing }: CameraFeedProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<string>("");

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
        
        toast({
          title: "Camera Ready! 📷",
          description: "Now I can see what you're cooking! Let's start the magic!",
        });
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera Access Needed",
        description: "Please allow camera access so I can guide you while cooking!",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
      
      toast({
        title: "Camera Stopped",
        description: "I'm no longer watching, but I'm still here to help!",
      });
    }
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
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture?.(imageData);
        
        // Simulate AI analysis for now
        const analysisResponses = [
          "I can see your onions are getting golden - perfect! 🧅",
          "That pan looks hot and ready for the next ingredient! 🔥",
          "Nice knife work! Your cuts are looking consistent 🔪",
          "The color is developing beautifully - just like your Nani would make! ✨",
          "I see the spices blooming - smell that aroma! 🌟",
          "Perfect timing! Your ingredients are ready for the next step 👨‍🍳"
        ];
        
        const randomResponse = analysisResponses[Math.floor(Math.random() * analysisResponses.length)];
        setLastAnalysis(randomResponse);
        
        toast({
          title: "AI Chef Watching 👁️",
          description: randomResponse,
        });
      }
    }
  };

  useEffect(() => {
    // Auto-analyze every 10 seconds when streaming
    if (isStreaming && onCapture) {
      const interval = setInterval(() => {
        captureFrame();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isStreaming, onCapture]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="p-4 bg-gradient-subtle border-primary/20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-charcoal">AI Chef Vision</h3>
          {isAnalyzing && <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />}
        </div>
        
        <div className="flex gap-2">
          {!isStreaming ? (
            <Button onClick={startCamera} size="sm" className="bg-primary hover:bg-primary/90">
              <Camera className="w-4 h-4 mr-1" />
              Start Watching
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="outline" size="sm">
              <CameraOff className="w-4 h-4 mr-1" />
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Camera Preview */}
      <div className="relative mb-4">
        {isStreaming ? (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover rounded-lg bg-black"
            />
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>
            {lastAnalysis && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white p-2 rounded text-sm">
                {lastAnalysis}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Camera will show your cooking</p>
              <p className="text-xs text-muted-foreground">I'll watch and guide you in real-time!</p>
            </div>
          </div>
        )}
      </div>

      {/* Manual Capture Button */}
      {isStreaming && (
        <div className="flex justify-center">
          <Button onClick={captureFrame} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            Ask "What do you see?"
          </Button>
        </div>
      )}

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
};