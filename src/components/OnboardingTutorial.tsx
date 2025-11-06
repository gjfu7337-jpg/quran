import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Trophy, TrendingUp, ChevronRight, Sparkles } from "lucide-react";

const OnboardingTutorial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    
    // Check if user just logged in
    const checkAuthAndShowTutorial = () => {
      const justLoggedIn = sessionStorage.getItem("justLoggedIn");
      if (justLoggedIn) {
        setIsOpen(true);
        sessionStorage.removeItem("justLoggedIn");
      } else if (!hasSeenTutorial) {
        setIsOpen(true);
      }
    };

    checkAuthAndShowTutorial();
  }, []);

  const steps = [
    {
      icon: <BookOpen className="w-12 h-12 text-primary" />,
      title: "Welcome to Noor Journey! 🌟",
      description:
        "Track your Quran learning progress together as the Qurayshi family. Let's light up the path with noor!",
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Family Member Access",
      description:
        "Select your name from the family list and set up your personal PIN. This keeps everyone's progress secure and personalized.",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: "Update Your Progress",
      description:
        "After authenticating, update how much you've learned - Juz, Surah, and Ayah. Your progress updates the leaderboard instantly!",
    },
    {
      icon: <Trophy className="w-12 h-12 text-primary" />,
      title: "Compete & Inspire",
      description:
        "See who's leading the race and motivate each other! Analytics show who needs encouragement and who's excelling.",
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("hasSeenTutorial", "true");
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl border-2 border-primary/30 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />
        
        <DialogHeader className="space-y-6">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-primary/20 animate-pulse" />
            </div>
            <div className="relative z-10 p-6 bg-primary/10 rounded-full border-2 border-primary/30 animate-gentle-pulse">
              {currentStep.icon}
            </div>
          </div>
          
          <DialogTitle className="text-center text-3xl font-bold bg-gradient-shine bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            {currentStep.title}
          </DialogTitle>
          
          <DialogDescription className="text-center text-lg pt-2 text-foreground/90 leading-relaxed px-4">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicators */}
        <div className="flex justify-center gap-3 my-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                index === step 
                  ? "bg-gradient-to-r from-primary to-secondary w-12 shadow-glow" 
                  : index < step
                  ? "bg-primary/50 w-8"
                  : "bg-muted w-8"
              }`}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={handleSkip} 
            className="flex-1 border-2 border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all"
          >
            Skip Tutorial
          </Button>
          <Button 
            onClick={handleNext} 
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold shadow-glow transition-all hover:scale-105"
          >
            {step < steps.length - 1 ? (
              <>
                Continue
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Begin Journey
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTutorial;
