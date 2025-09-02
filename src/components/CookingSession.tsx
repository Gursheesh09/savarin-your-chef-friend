import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChefHat, 
  Play, 
  Pause, 
  RotateCcw, 
  Camera, 
  Mic, 
  MicOff,
  Clock,
  Users,
  Heart,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CookingStep {
  id: number;
  instruction: string;
  timeEstimate: string;
  culturalTip?: string;
  technique?: string;
  videoHint?: string;
}

interface Recipe {
  name: string;
  cuisine: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: CookingStep[];
  ingredients: string[];
  culturalStory?: string;
}

const SAMPLE_RECIPES: Recipe[] = [
  {
    name: "Butter Chicken",
    cuisine: "Indian",
    difficulty: "Intermediate",
    culturalStory: "Born in the 1950s at Moti Mahal in Delhi, this dish represents the beautiful fusion of Mughlai and Punjabi cooking traditions. Every family has their secret touch - some add kasuri methi, others a hint of jaggery.",
    ingredients: ["Chicken", "Tomatoes", "Cream", "Butter", "Garam Masala", "Ginger-Garlic Paste"],
    steps: [
      {
        id: 1,
        instruction: "Marinate chicken pieces in yogurt, garam masala, and ginger-garlic paste",
        timeEstimate: "30 minutes",
        culturalTip: "Just like Dadi would say - the longer you marinate, the more the chicken absorbs the love and spices!",
        technique: "Cut chicken against the grain for tenderness"
      },
      {
        id: 2,
        instruction: "Heat butter in pan and cook marinated chicken until golden",
        timeEstimate: "8-10 minutes",
        culturalTip: "Listen for the sizzle - that's the sound of flavors awakening, just like in the bustling kitchens of Old Delhi",
        videoHint: "Sanjeev Kapoor's technique: Don't overcrowd the pan"
      },
      {
        id: 3,
        instruction: "Prepare the tomato-cream base with onions and spices",
        timeEstimate: "15 minutes",
        culturalTip: "The secret is patience - let the tomatoes break down completely, like how your mother waited for the perfect masala",
        technique: "Blend to silky smooth consistency"
      }
    ]
  }
];

export const CookingSession = () => {
  const { toast } = useToast();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isSessionActive) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive]);

  const startSession = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsSessionActive(true);
    setCurrentStep(0);
    setSessionTime(0);
    
    toast({
      title: "Cooking Session Started! 👨‍🍳",
      description: `Let's cook ${recipe.name} together with love and tradition`,
    });

    // Speak welcome message
    if ('speechSynthesis' in window) {
      const welcome = `Welcome to your ${recipe.cuisine} cooking journey! We're making ${recipe.name} today. ${recipe.culturalStory}`;
      const utterance = new SpeechSynthesisUtterance(welcome);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const endSession = () => {
    setIsSessionActive(false);
    setSelectedRecipe(null);
    setCurrentStep(0);
    setSessionTime(0);
    
    toast({
      title: "Session Complete! 🎉",
      description: "You've learned with the wisdom of generations. Well done!",
    });
  };

  const nextStep = () => {
    if (selectedRecipe && currentStep < selectedRecipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      const nextStepData = selectedRecipe.steps[currentStep + 1];
      
      // Speak the next step
      if ('speechSynthesis' in window) {
        const instruction = `Step ${currentStep + 2}: ${nextStepData.instruction}. ${nextStepData.culturalTip || ''}`;
        const utterance = new SpeechSynthesisUtterance(instruction);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
      
      toast({
        title: `Step ${currentStep + 2}`,
        description: nextStepData.instruction.slice(0, 60) + "...",
      });
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleVoiceQuestion = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserQuestion(transcript);
        handleQuestionResponse(transcript);
      };
      
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      setIsListening(true);
      recognition.start();
    }
  };

  const handleQuestionResponse = (question: string) => {
    // Simple AI responses for cooking questions
    let response = "";
    const q = question.toLowerCase();
    
    if (q.includes('how long') || q.includes('time')) {
      response = "Take your time, cooking is about patience and love. Trust your senses - the aroma, color, and texture will guide you better than any timer.";
    } else if (q.includes('next') || q.includes('done')) {
      response = "Beautiful! You're doing great. When you're ready, we'll move to the next step together.";
    } else if (q.includes('help') || q.includes('stuck')) {
      response = "Don't worry, every great chef has been there. Take a deep breath. What specifically are you seeing in your pan right now?";
    } else {
      response = "I'm here with you every step of the way. Remember, cooking is about love, patience, and learning from each experience.";
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    toast({
      title: "Chef Savarin",
      description: response.slice(0, 80) + "...",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSessionActive) {
    return (
      <Card className="p-6 bg-gradient-subtle border-primary/20">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center shadow-warm">
            <ChefHat className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Free Culinary School</h2>
          <p className="text-muted-foreground text-sm">Learn to cook with the love of family and wisdom of generations 💖</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-charcoal mb-3">Start Your Cooking Journey</h3>
          
          {SAMPLE_RECIPES.map((recipe, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer border-accent/20" 
                  onClick={() => startSession(recipe)}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-charcoal">{recipe.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {recipe.cuisine}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              </div>
              
              {recipe.culturalStory && (
                <p className="text-sm text-muted-foreground italic">
                  <Heart className="w-3 h-3 inline mr-1" />
                  {recipe.culturalStory.slice(0, 120)}...
                </p>
              )}
            </Card>
          ))}
        </div>
      </Card>
    );
  }

  const currentStepData = selectedRecipe?.steps[currentStep];

  return (
    <Card className="p-6 bg-gradient-subtle border-primary/20">
      {/* Session Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-charcoal">{selectedRecipe?.name}</h2>
          <div className="flex items-center gap-4 mt-1">
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(sessionTime)}
            </Badge>
            <Badge variant="outline">
              Step {currentStep + 1} of {selectedRecipe?.steps.length}
            </Badge>
          </div>
        </div>
        <Button onClick={endSession} variant="outline" size="sm">
          End Session
        </Button>
      </div>

      {/* Current Step */}
      {currentStepData && (
        <div className="mb-6">
          <Card className="p-4 bg-accent/30 border-primary/30">
            <h3 className="font-semibold text-charcoal mb-2">
              Step {currentStep + 1}: {currentStepData.timeEstimate}
            </h3>
            <p className="text-foreground mb-3">{currentStepData.instruction}</p>
            
            {currentStepData.culturalTip && (
              <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg mb-3">
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Cultural Wisdom</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">{currentStepData.culturalTip}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStepData.technique && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <ChefHat className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Pro Technique</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{currentStepData.technique}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          onClick={previousStep} 
          disabled={currentStep === 0}
          variant="outline"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Camera className="w-4 h-4" />
          </Button>
          <Button 
            onClick={handleVoiceQuestion}
            variant={isListening ? "destructive" : "outline"}
            size="sm"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>

        <Button 
          onClick={nextStep}
          disabled={!selectedRecipe || currentStep >= selectedRecipe.steps.length - 1}
          className="bg-primary hover:bg-primary/90"
          size="sm"
        >
          Next Step
          <Play className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Quick Question Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask anything... 'How do I know when it's ready?'"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && userQuestion.trim()) {
              handleQuestionResponse(userQuestion);
              setUserQuestion("");
            }
          }}
          className="flex-1"
        />
        <Button 
          onClick={() => {
            if (userQuestion.trim()) {
              handleQuestionResponse(userQuestion);
              setUserQuestion("");
            }
          }}
          disabled={!userQuestion.trim()}
          size="sm"
        >
          Ask
        </Button>
      </div>
    </Card>
  );
};