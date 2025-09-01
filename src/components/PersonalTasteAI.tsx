import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Palette, ThumbsUp, ThumbsDown, Sparkles, TrendingUp, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TasteProfile {
  saltiness: number;
  sweetness: number;
  spiciness: number;
  umami: number;
  acidity: number;
  richness: number;
}

interface CuisinePreference {
  name: string;
  score: number;
  trending: boolean;
  confidence: number;
}

interface FlavorNote {
  ingredient: string;
  preference: 'love' | 'like' | 'neutral' | 'dislike' | 'hate';
  reason?: string;
  frequency: number;
}

interface RecipeAdaptation {
  originalRecipe: string;
  adaptedVersion: string;
  changes: string[];
  tasteMatchScore: number;
  difficulty: string;
}

export const PersonalTasteAI = () => {
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>({
    saltiness: 65,
    sweetness: 45,
    spiciness: 80,
    umami: 70,
    acidity: 55,
    richness: 60
  });

  const [cuisinePreferences, setCuisinePreferences] = useState<CuisinePreference[]>([
    { name: "Mexican", score: 92, trending: true, confidence: 95 },
    { name: "Italian", score: 88, trending: false, confidence: 89 },
    { name: "Thai", score: 85, trending: true, confidence: 87 },
    { name: "Indian", score: 82, trending: false, confidence: 91 },
    { name: "Japanese", score: 78, trending: true, confidence: 84 },
    { name: "French", score: 65, trending: false, confidence: 76 }
  ]);

  const [flavorNotes, setFlavorNotes] = useState<FlavorNote[]>([
    { ingredient: "Cilantro", preference: 'love', reason: "Fresh and citrusy", frequency: 12 },
    { ingredient: "Blue Cheese", preference: 'dislike', reason: "Too pungent", frequency: 3 },
    { ingredient: "Dark Chocolate", preference: 'love', reason: "Rich and complex", frequency: 8 },
    { ingredient: "Coconut", preference: 'like', reason: "Tropical and creamy", frequency: 6 },
    { ingredient: "Anchovies", preference: 'neutral', reason: "Depends on preparation", frequency: 2 }
  ]);

  const [adaptedRecipes, setAdaptedRecipes] = useState<RecipeAdaptation[]>([
    {
      originalRecipe: "Classic Carbonara",
      adaptedVersion: "Spicy Carbonara with Jalapeños",
      changes: ["Added jalapeños for heat", "Increased black pepper", "Added smoked paprika"],
      tasteMatchScore: 94,
      difficulty: "Easy"
    },
    {
      originalRecipe: "Beef Stroganoff",
      adaptedVersion: "Mexican-Style Beef with Crema",
      changes: ["Replaced sour cream with Mexican crema", "Added cumin and chili powder", "Served with corn tortillas"],
      tasteMatchScore: 89,
      difficulty: "Medium"
    }
  ]);

  const [learningInsight, setLearningInsight] = useState("");
  const { toast } = useToast();

  const updateTasteProfile = (flavor: keyof TasteProfile, value: number[]) => {
    setTasteProfile(prev => ({
      ...prev,
      [flavor]: value[0]
    }));
  };

  const rateRecipe = (rating: 'love' | 'dislike', recipeName: string) => {
    // Simulate AI learning from user feedback
    toast({
      title: `Feedback Recorded! ${rating === 'love' ? '❤️' : '👎'}`,
      description: `AI is learning from your ${rating} of ${recipeName}`,
    });

    // Update taste profile based on feedback (simplified simulation)
    if (rating === 'love') {
      setTasteProfile(prev => ({
        ...prev,
        spiciness: Math.min(100, prev.spiciness + 2),
        umami: Math.min(100, prev.umami + 1)
      }));
    }
  };

  const generatePersonalizedRecipe = () => {
    const newRecipe: RecipeAdaptation = {
      originalRecipe: "Chicken Tikka Masala",
      adaptedVersion: "Smoky Chipotle Chicken Bowl",
      changes: [
        "Replaced garam masala with chipotle and cumin",
        "Added extra lime for acidity boost",
        "Increased heat with jalapeños",
        "Served over cilantro-lime rice"
      ],
      tasteMatchScore: 96,
      difficulty: "Medium"
    };

    setAdaptedRecipes(prev => [newRecipe, ...prev]);
    
    toast({
      title: "Recipe Personalized! ✨",
      description: `Created ${newRecipe.adaptedVersion} with ${newRecipe.tasteMatchScore}% taste match`,
    });
  };

  const analyzeNewIngredient = () => {
    setLearningInsight("Based on your love for spicy and umami-rich foods, you might enjoy Korean gochujang! It combines heat with deep, fermented flavors that match your profile perfectly.");
    
    toast({
      title: "New Ingredient Suggestion! 🔍",
      description: "AI found a perfect match for your taste profile",
    });
  };

  const getTasteDescription = () => {
    const dominant = Object.entries(tasteProfile)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([key]) => key);
    
    return `You prefer ${dominant[0]} and ${dominant[1]} flavors with adventurous spice tolerance`;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Palette className="w-6 h-6 text-primary" />
          Personal Taste AI
        </CardTitle>
        <p className="text-muted-foreground">
          AI that learns your unique flavor preferences and adapts every recipe
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Taste Profile Dashboard */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Your Flavor Profile</h3>
            <Button onClick={analyzeNewIngredient} variant="outline">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover New Flavors
            </Button>
          </div>
          
          <Card className="p-4 bg-gradient-subtle">
            <p className="text-center text-muted-foreground mb-4">{getTasteDescription()}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(tasteProfile).map(([flavor, value]) => (
                <div key={flavor} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium capitalize">{flavor}</label>
                    <span className="text-sm text-muted-foreground">{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(val) => updateTasteProfile(flavor as keyof TasteProfile, val)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Cuisine Preferences */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Cuisine Preferences (AI Detected)</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cuisinePreferences.map(cuisine => (
              <Card key={cuisine.name} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{cuisine.name}</h4>
                    {cuisine.trending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Preference Score</span>
                      <span className="font-medium">{cuisine.score}%</span>
                    </div>
                    <Progress value={cuisine.score} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>AI Confidence</span>
                      <span>{cuisine.confidence}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Flavor Notes */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Ingredient Preferences</h3>
          <div className="grid gap-3">
            {flavorNotes.map(note => (
              <Card key={note.ingredient} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      note.preference === 'love' ? 'bg-red-100 text-red-600' :
                      note.preference === 'like' ? 'bg-green-100 text-green-600' :
                      note.preference === 'neutral' ? 'bg-gray-100 text-gray-600' :
                      note.preference === 'dislike' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-200 text-red-700'
                    }`}>
                      {note.preference === 'love' ? '❤️' :
                       note.preference === 'like' ? '👍' :
                       note.preference === 'neutral' ? '😐' :
                       note.preference === 'dislike' ? '👎' : '😱'}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">{note.ingredient}</h4>
                      {note.reason && (
                        <p className="text-sm text-muted-foreground">{note.reason}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      Used {note.frequency}x
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Personalized Recipe Adaptations */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">AI Recipe Adaptations</h3>
            <Button onClick={generatePersonalizedRecipe}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Recipe
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {adaptedRecipes.map((recipe, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          {recipe.originalRecipe} →
                        </h4>
                        <h3 className="font-bold">{recipe.adaptedVersion}</h3>
                      </div>
                      <Badge variant="default" className="ml-2">
                        {recipe.tasteMatchScore}% match
                      </Badge>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">AI Adaptations:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {recipe.changes.map((change, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rateRecipe('love', recipe.adaptedVersion)}
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      Love it
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rateRecipe('dislike', recipe.adaptedVersion)}
                    >
                      <ThumbsDown className="w-3 h-3 mr-1" />
                      Not for me
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Learning Insight */}
        {learningInsight && (
          <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  AI Taste Discovery
                </h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {learningInsight}
                </p>
              </div>
            </div>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};