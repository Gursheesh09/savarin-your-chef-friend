import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Will it work with my ingredients?",
    answer: "Yes! Savarin adapts to what you have on hand and suggests smart substitutions when needed. It works with any cuisine and dietary preferences."
  },
  {
    question: "Does it work offline?", 
    answer: "Core cooking guidance works offline once a recipe is loaded. Voice features require internet connection for the best experience."
  },
  {
    question: "How do you handle my data?",
    answer: "Your cooking preferences and data stay private. We never sell your information and only use it to improve your cooking experience."
  },
  {
    question: "Can beginners use this?",
    answer: "Absolutely! Savarin explains techniques step-by-step and adjusts to your skill level. It's perfect for both beginners and experienced cooks."
  },
  {
    question: "What devices does it support?",
    answer: "Savarin works on smartphones, tablets, and smart speakers. The voice interface is optimized for hands-free cooking."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 px-6 bg-gradient-subtle">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about cooking with Savarin
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 px-6"
            >
              <AccordionTrigger className="text-left text-charcoal font-semibold hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};