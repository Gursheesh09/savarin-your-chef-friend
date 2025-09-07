import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Clock, Users, Globe } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: ChefHat,
      title: "Step-by-Step Guidance",
      description: "Get clear, easy-to-follow instructions from professional chefs. No more guessing or second-guessing your cooking steps."
    },
    {
      icon: Clock,
      title: "Save Time & Money",
      description: "Learn efficient techniques and avoid common mistakes that waste ingredients. Cook with confidence every time."
    },
    {
      icon: Users,
      title: "Build Your Skills",
      description: "Start with simple recipes and gradually master more complex dishes. Track your progress and celebrate your achievements."
    },
    {
      icon: Globe,
      title: "Explore New Cuisines",
      description: "Try dishes from around the world with authentic recipes and helpful tips for unfamiliar ingredients and techniques."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Simple Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Chef Savarin?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make cooking easier, more enjoyable, and less intimidating for everyone.
          </p>
        </div>

        {/* Simple Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gray-50 hover:bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simple CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Ready to start your cooking journey?
          </p>
          <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            Start Cooking Today
          </button>
        </div>
      </div>
    </section>
  );
};