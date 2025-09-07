const steps = [
  {
    number: "1",
    title: "Tell Savarin your mood",
    description: "Share how you're feeling or what you're craving"
  },
  {
    number: "2", 
    title: "Get a personalized plan",
    description: "Receive a tailored recipe matching your preferences"
  },
  {
    number: "3",
    title: "Cook hands-free",
    description: "Follow voice guidance with smart timing and tips"
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How it works
          </h2>
          <p className="text-xl text-gray-600">
            Get started in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Step Number */}
              <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {step.number}
                </span>
              </div>
              
              {/* Connecting Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-300 transform translate-x-8" />
              )}
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};