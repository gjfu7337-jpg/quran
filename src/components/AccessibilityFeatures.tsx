import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Ear, Brain, Hand, Globe } from "lucide-react";

const AccessibilityFeatures = () => {
  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Visual Support",
      description: "Screen reader optimized, high contrast mode, colorblind patterns, resizable text up to 300%",
      color: "text-primary"
    },
    {
      icon: <Ear className="w-8 h-8" />,
      title: "Hearing Support",
      description: "Visual feedback, live captions, silent mode with haptic responses",
      color: "text-secondary"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Cognitive Support",
      description: "Simplified mode, focus mode, predictable navigation, progress explained simply",
      color: "text-primary"
    },
    {
      icon: <Hand className="w-8 h-8" />,
      title: "Motor Support",
      description: "Full keyboard navigation, voice commands, large touch targets, dwell click",
      color: "text-secondary"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Language Support",
      description: "Multilingual interface, transliteration, child mode with voice guidance",
      color: "text-primary"
    },
  ];

  return (
    <section className="py-20 px-6 bg-muted/20">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Built for Every Soul
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Full accessibility suite following WCAG 2.2 AA standards — because technology should serve everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-glow group"
              role="article"
              aria-labelledby={`feature-${index}`}
            >
              <CardHeader>
                <div className={`${feature.color} mb-3 group-hover:animate-glow-pulse`} aria-hidden="true">
                  {feature.icon}
                </div>
                <CardTitle id={`feature-${index}`} className="text-xl text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tagline */}
        <div className="mt-16 text-center">
          <p className="text-2xl font-semibold text-foreground italic">
            "Every heart deserves to hold the Quran."
          </p>
          <p className="text-lg text-primary mt-2">
            Noor Journey lights the way — for all.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AccessibilityFeatures;
