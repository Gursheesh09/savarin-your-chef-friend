import { ArrowLeft, ChefHat, Users, Globe, Star, Video, Heart, BookOpen, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LiveChefMarketplace } from "@/components/LiveChefMarketplace";

export const LiveChefMarketplacePage = () => {
  const navigate = useNavigate();

  const scrollToChefs = () => {
    const chefsSection = document.getElementById('chefs-section');
    if (chefsSection) {
      chefsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full mb-6">
              <ChefHat className="w-5 h-5" />
              <span className="font-medium">Live Chef Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn to Cook with{" "}
              <span className="text-orange-600">World-Class Chefs</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Join live cooking sessions with professional chefs from around the world. 
              Get real-time guidance, ask questions, and master new cuisines from the comfort of your kitchen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Video className="w-5 h-5 mr-2" />
                Browse Live Sessions
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={scrollToChefs}
                className="px-8 py-4 text-lg font-semibold border-2 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300"
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Meet Our Chefs
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Professional Chefs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-600">Global Cuisines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
              <div className="text-gray-600">Happy Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Nostalgia & Heritage Section */}
      <div className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Cultural Heritage & Nostalgia</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Rediscover Your{" "}
              <span className="text-blue-600">Cultural Roots</span>{" "}
              Through Food
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlike generic YouTube videos, our chefs teach you the authentic techniques, 
              cultural stories, and family secrets that make each dish special.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm bg-white">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Family Traditions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn recipes passed down through generations. 
                  Our chefs share the stories behind each dish and why they matter.
                </p>
              </div>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cultural Context</h3>
                <p className="text-gray-600 leading-relaxed">
                  Understand the history, geography, and traditions that shaped each cuisine. 
                  It's not just cooking—it's cultural immersion.
                </p>
              </div>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Techniques</h3>
                <p className="text-gray-600 leading-relaxed">
                  Master traditional methods that have been perfected over centuries. 
                  Learn the "why" behind every technique, not just the "how."
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Chef</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse our curated selection of professional chefs from around the world. 
                Filter by cuisine, experience level, or availability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Your Session</h3>
              <p className="text-gray-600 leading-relaxed">
                Select from live group sessions or book private one-on-one lessons. 
                Choose the time that works best for your schedule.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cook & Learn</h3>
              <p className="text-gray-600 leading-relaxed">
                Join the live video session and cook alongside your chef. 
                Ask questions, get real-time feedback, and master new techniques.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Live Chef Marketplace?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The future of culinary education is here
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl mb-4 flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Learning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Unlike YouTube's one-size-fits-all approach, we match you with chefs based on your skill level, 
                  learning goals, and personal preferences. Get guidance tailored just for you.
                </p>
              </div>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl mb-4 flex items-center justify-center">
                  <Video className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Interaction</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ask questions in real-time, get instant feedback, and see exactly how techniques should look. 
                  It's like having a chef right in your kitchen.
                </p>
              </div>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl mb-4 flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Learning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Join group sessions and learn alongside other cooking enthusiasts. 
                  Share tips, ask questions, and make new friends who love food.
                </p>
              </div>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl mb-4 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Immediate Feedback</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get real-time corrections and suggestions. No more wondering if you're doing it right— 
                  your chef will guide you every step of the way.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-orange-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Culinary Journey?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks who are already learning from world-class chefs. 
            Your next cooking adventure starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={scrollToChefs}
              className="px-8 py-4 text-lg font-semibold bg-white text-orange-600 hover:bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Browse Chefs Now
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-orange-600 rounded-xl transition-all duration-300"
            >
              <Video className="w-5 h-5 mr-2" />
              View Live Sessions
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Live Chef Marketplace</h3>
              <p className="text-sm text-gray-600">The future of culinary education</p>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Marketplace Component */}
      <div id="chefs-section">
        <LiveChefMarketplace />
      </div>
    </div>
  );
};
