import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import Leaderboard from "@/components/Leaderboard";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import ActiveStatusCard from "@/components/ActiveStatusCard";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingTutorial />
      <Hero user={user} />
      {user && <Dashboard user={user} />}
      <Leaderboard />
      <ActiveStatusCard />
    </div>
  );
};

export default Index;
