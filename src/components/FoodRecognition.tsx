import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecognizedIngredient {
  name: string;
  confidence: number;
  suggestions: string[];
}

export const FoodRecognition = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognizedIngredients, setRecognizedIngredients] = useState<RecognizedIngredient[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock food recognition (replace with actual AI when backend is connected)
  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results - in production, this would call your AI service
    const mockIngredients: RecognizedIngredient[] = [
      {
        name: "Tomatoes",
        confidence: 0.94,
        suggestions: ["Caprese Salad", "Pasta Arrabbiata", "Fresh Salsa"]
      },
      {
        name: "Fresh Basil",
        confidence: 0.87,
        suggestions: ["Pesto", "Margherita Pizza", "Caprese Salad"]
      },
      {
        name: "Mozzarella",
        confidence: 0.91,
        suggestions: ["Caprese Stack", "Pizza Margherita", "Stuffed Chicken"]
      }
    ];
    
    setRecognizedIngredients(mockIngredients);
    setIsAnalyzing(false);
    
    toast({
      title: "Ingredients Recognized!",
      description: `Found ${mockIngredients.length} ingredients. Check out the recipe suggestions!`,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
      analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Camera className="w-6 h-6 text-primary" />
          Smart Fridge Scanner
        </CardTitle>
        <p className="text-muted-foreground">
          Upload a photo of your ingredients and get personalized recipe suggestions
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          {selectedImage ? (
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Uploaded ingredients" 
                className="max-w-full h-64 object-cover rounded-lg shadow-md"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Analyzing ingredients...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div 
              onClick={triggerFileInput}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Upload Photo of Your Ingredients</p>
              <p className="text-muted-foreground mt-2">or drag and drop an image here</p>
            </div>
          )}
          
          <Button onClick={triggerFileInput} variant="outline" className="w-full max-w-sm">
            <Upload className="w-4 h-4 mr-2" />
            Choose Different Photo
          </Button>
        </div>

        {recognizedIngredients.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Recognized Ingredients
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recognizedIngredients.map((ingredient, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{ingredient.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(ingredient.confidence * 100)}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Recipe Ideas:</p>
                      <div className="space-y-1">
                        {ingredient.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            className="text-sm text-primary hover:underline block text-left"
                            onClick={() => toast({
                              title: "Recipe Selected!",
                              description: `Let's cook ${suggestion} together!`,
                            })}
                          >
                            • {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};