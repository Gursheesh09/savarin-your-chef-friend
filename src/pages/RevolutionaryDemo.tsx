import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChefHat, Utensils, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RevolutionaryAIChef } from "@/components/RevolutionaryAIChef";

export const RevolutionaryDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:bg-gray-100 text-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/about')}
              className="text-sm border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              My Story
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">AI Chef Demo</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🍳 AI Chef Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience how AI can help you cook better with step-by-step guidance, helpful tips, and real-time assistance.
          </p>
          
          {/* Simple Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="text-center">
                <Utensils className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                <CardTitle className="text-lg text-gray-900">Step-by-Step</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Clear instructions that guide you through each cooking step
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="text-center">
                <Users className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                <CardTitle className="text-lg text-gray-900">Smart Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Get answers to your cooking questions and helpful tips
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="text-center">
                <ChefHat className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                <CardTitle className="text-lg text-gray-900">Learn & Improve</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Build your cooking skills with every recipe you make
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revolutionary AI Chef Component */}
        <RevolutionaryAIChef />

        {/* Instructions */}
        <Card className="mt-12 bg-orange-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              How to Use the Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-50">
              Try asking the AI chef questions about cooking, request recipe help, or get step-by-step guidance for any dish you want to make.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};