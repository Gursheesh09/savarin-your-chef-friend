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
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            How it works
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Step Number */}
              <div className="w-16 h-16 bg-gradient-hero rounded-full mx-auto mb-6 flex items-center justify-center shadow-warm">
                <span className="text-2xl font-bold text-primary-foreground">
                  {step.number}
                </span>
              </div>
              
              {/* Connecting Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-primary/30 transform translate-x-8" />
              )}
              
              <h3 className="text-xl font-semibold text-charcoal mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};