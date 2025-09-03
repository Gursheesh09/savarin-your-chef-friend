import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Eye, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RevolutionaryAIChef } from "@/components/RevolutionaryAIChef";

export const RevolutionaryDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-warm p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/about')}
              className="text-sm"
            >
              My Story
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Revolutionary AI</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-charcoal mb-6">
            🚀 Revolutionary AI Chef
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The world's first AI sous chef that <strong>sees, thinks, and guides</strong> you through cooking in real-time. 
            Using computer vision and conversational AI to revolutionize your kitchen experience.
          </p>
          
          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/20 bg-gradient-subtle">
              <CardHeader className="text-center">
                <Eye className="w-8 h-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Computer Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI watches your cooking and recognizes ingredients, techniques, and progress
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 bg-gradient-subtle">
              <CardHeader className="text-center">
                <Brain className="w-8 h-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Real AI Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Powered by advanced AI models that understand cooking context and provide expert guidance
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 bg-gradient-subtle">
              <CardHeader className="text-center">
                <Sparkles className="w-8 h-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gets smarter about your preferences and cooking style over time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revolutionary AI Chef Component */}
        <RevolutionaryAIChef />

        {/* Instructions */}
        <Card className="mt-12 bg-gradient-accent text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              How to Experience the Revolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🎬 Start the Experience:</h4>
                <ol className="text-sm space-y-1 opacity-90">
                  <li>1. Click "Start Chef" to activate the AI</li>
                  <li>2. Click "Start Vision" to enable camera</li>
                  <li>3. Show ingredients or cooking tools to the camera</li>
                  <li>4. Watch as AI recognizes and provides guidance!</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🧠 What Makes It Revolutionary:</h4>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Real computer vision using Hugging Face AI</li>
                  <li>• Live ingredient and tool recognition</li>
                  <li>• Context-aware cooking guidance</li>
                  <li>• Adaptive AI personality and responses</li>
                  <li>• Built for mobile cooking experiences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};