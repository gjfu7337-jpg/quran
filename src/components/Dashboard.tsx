import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressCircle from "./ProgressCircle";
import { BookOpen, Mic, Heart, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const navigate = useNavigate();
  const userName = user.displayName || "User";
  const [juzCompleted, setJuzCompleted] = useState(0);
  const totalJuz = 30;
  const ayahsMemorized = 245;
  const currentStreak = 12;

  useEffect(() => {
    const progress = localStorage.getItem("quranProgress");
    if (progress) {
      const data = JSON.parse(progress);
      setJuzCompleted(data.juz || 0);
    }

    const handleStorageChange = () => {
      const updatedProgress = localStorage.getItem("quranProgress");
      if (updatedProgress) {
        const data = JSON.parse(updatedProgress);
        setJuzCompleted(data.juz || 0);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container max-w-6xl mx-auto">
        {/* Greeting & Settings */}
        <div className="mb-12 text-center animate-fade-in relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-0"
            onClick={() => navigate("/profile")}
            aria-label="Profile settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold mb-2 text-foreground">
            As-salamu alaikum, {userName}! 🌙
          </h2>
          <p className="text-muted-foreground">
            Ready to light up your journey today?
          </p>
        </div>

        {/* Note: Progress selector moved to Profile page */}

        {/* Main stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Circle Card */}
          <Card className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ProgressCircle 
                current={juzCompleted} 
                total={totalJuz} 
                label="Juz"
                size={180}
              />
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="bg-card border-border hover:border-secondary/50 transition-all">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <BookOpen className="w-5 h-5 text-secondary" aria-hidden="true" />
                Ayahs Memorized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-foreground mb-2">
                {ayahsMemorized}
              </p>
              <p className="text-sm text-muted-foreground">
                That's like {Math.floor(ayahsMemorized / 60)} full Juz! 🌟
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Heart className="w-5 h-5 text-primary" aria-hidden="true" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-foreground mb-2">
                {currentStreak}
              </p>
              <p className="text-sm text-muted-foreground">
                days of consistent practice
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow transition-all hover:scale-105 font-semibold"
            aria-label="Start new recitation session"
          >
            <Mic className="mr-2 h-5 w-5" aria-hidden="true" />
            Start Recitation
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary transition-all hover:scale-105 font-semibold"
            aria-label="View your detailed progress"
          >
            <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
            View Details
          </Button>
        </div>

        {/* Encouragement message */}
        <div className="mt-12 text-center p-6 bg-card/50 border border-primary/30 rounded-lg">
          <p className="text-lg text-foreground italic">
            "The best among you are those who learn the Quran and teach it."
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            — Prophet Muhammad ﷺ
          </p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
