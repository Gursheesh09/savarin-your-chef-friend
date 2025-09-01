import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, ChefHat, Clock, Thermometer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { VirtualChef } from "@/components/VirtualChef";

interface Recipe {
  name: string;
  ingredients: string[];
  steps: string[];
  cookTime: string;
  difficulty: string;
}

export const Demo = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentMood, setCurrentMood] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const recipes: Record<string, Recipe> = {
    comfort: {
      name: "Creamy Garlic Pasta",
      ingredients: ["400g pasta", "4 cloves garlic", "200ml cream", "50g parmesan", "2 tbsp olive oil", "salt & pepper"],
      steps: [
        "Boil salted water for pasta",
        "Slice garlic thinly - don't rush this",
        "Heat olive oil in large pan over medium heat", 
        "Add garlic, cook until fragrant (30 seconds)",
        "Add cream, simmer gently for 2 minutes",
        "Add cooked pasta with pasta water",
        "Toss with parmesan and seasoning"
      ],
      cookTime: "15 mins",
      difficulty: "Easy"
    },
    light: {
      name: "Lemon Herb Salmon",
      ingredients: ["2 salmon fillets", "1 lemon", "fresh dill", "2 tbsp olive oil", "salt & pepper"],
      steps: [
        "Preheat oven to 400°F (200°C)",
        "Pat salmon dry, season both sides",
        "Heat olive oil in oven-safe pan",
        "Sear salmon skin-side up, 3 minutes",
        "Flip, add lemon slices and dill",
        "Transfer to oven for 8-10 minutes",
        "Rest for 2 minutes before serving"
      ],
      cookTime: "18 mins", 
      difficulty: "Medium"
    },
    quick: {
      name: "Stir-Fried Vegetables",
      ingredients: ["mixed vegetables", "2 tbsp soy sauce", "1 tbsp sesame oil", "2 cloves garlic", "1 tsp ginger"],
      steps: [
        "Heat oil in wok over high heat",
        "Add garlic and ginger, stir 30 seconds",
        "Add hard vegetables first (carrots, broccoli)",
        "Stir-fry 2-3 minutes",
        "Add softer vegetables (peppers, snap peas)",
        "Add soy sauce, toss everything together",
        "Serve immediately while crisp"
      ],
      cookTime: "8 mins",
      difficulty: "Easy"
    }
  };

  const handleMoodSubmit = () => {
    const mood = currentMood.toLowerCase();
    let selectedRecipe: Recipe;

    if (mood.includes('comfort') || mood.includes('cozy') || mood.includes('warm')) {
      selectedRecipe = recipes.comfort;
    } else if (mood.includes('light') || mood.includes('healthy') || mood.includes('fresh')) {
      selectedRecipe = recipes.light;
    } else if (mood.includes('quick') || mood.includes('fast') || mood.includes('busy')) {
      selectedRecipe = recipes.quick;
    } else {
      selectedRecipe = recipes.comfort; // default
    }

    setCurrentRecipe(selectedRecipe);
    setCurrentStep(0);
    toast({
      title: "Recipe matched!",
      description: `Based on your mood, I've selected: ${selectedRecipe.name}`,
    });
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice mode activated",
        description: "Speak naturally - ask about timing, temperature, or techniques",
      });
      
      // Simulate voice recognition
      setTimeout(() => {
        const responses = [
          "The garlic should sizzle gently - if it's browning too fast, lower the heat",
          "Your pasta water should be as salty as the sea - taste it!",
          "For perfect cream sauce, add pasta water gradually while tossing",
          "The salmon is done when it flakes easily with a fork"
        ];
        toast({
          title: "Savarin says:",
          description: responses[Math.floor(Math.random() * responses.length)],
        });
        setIsListening(false);
      }, 3000);
    }
  };

  const nextStep = () => {
    if (currentRecipe && currentStep < currentRecipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-4">
            Savarin AI Demo
          </h1>
          <p className="text-muted-foreground">
            Experience AI-powered cooking with your virtual sous chef
          </p>
        </div>

        {/* Virtual Chef Section */}
        <div className="mb-8">
          <VirtualChef />
        </div>

        {!currentRecipe ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Tell me your mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="e.g., I want something comforting and warm..."
                  value={currentMood}
                  onChange={(e) => setCurrentMood(e.target.value)}
                  className="text-lg"
                />
                <div className="flex gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setCurrentMood("something comforting")}
                  >
                    Comforting
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setCurrentMood("light and healthy")}
                  >
                    Light & Fresh
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setCurrentMood("quick and easy")}
                  >
                    Quick & Easy
                  </Badge>
                </div>
                <Button 
                  onClick={handleMoodSubmit} 
                  className="w-full"
                  disabled={!currentMood.trim()}
                >
                  Find My Recipe
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Recipe Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{currentRecipe.name}</CardTitle>
                    <div className="flex gap-4 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {currentRecipe.cookTime}
                      </Badge>
                      <Badge variant="outline">
                        {currentRecipe.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant={isListening ? "destructive" : "outline"}
                    size="sm"
                    onClick={handleVoiceToggle}
                    className="flex items-center gap-2"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening ? "Listening..." : "Voice Help"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Ingredients:</h3>
                    <ul className="space-y-1">
                      {currentRecipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          • {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Step */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Step {currentStep + 1} of {currentRecipe.steps.length}</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={prevStep}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={nextStep}
                      disabled={currentStep === currentRecipe.steps.length - 1}
                    >
                      {currentStep === currentRecipe.steps.length - 1 ? "Finished!" : "Next Step"}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  {currentRecipe.steps[currentStep]}
                </p>
                <div className="mt-4 p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Pro tip: Use voice help to ask questions like "How do I know when it's ready?" or "What temperature should I use?"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentRecipe(null);
                  setCurrentMood("");
                  setCurrentStep(0);
                }}
              >
                Try Another Recipe
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};