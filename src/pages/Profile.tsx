import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FamilyMemberSelector from "@/components/FamilyMemberSelector";
import ProgressSelector from "@/components/ProgressSelector";
import ProgressAnalytics from "@/components/ProgressAnalytics";

import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [authenticatedMember, setAuthenticatedMember] = useState<string | null>(null);

  const handleAuthenticated = (memberName: string) => {
    setAuthenticatedMember(memberName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none opacity-40" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/20 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container max-w-6xl mx-auto py-12 px-6 relative z-10">
        <Button
          variant="ghost"
          onClick={() => {
            setAuthenticatedMember(null);
            navigate("/");
          }}
          className="mb-8 hover:bg-primary/10 transition-all group"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>

        {!authenticatedMember ? (
          <div className="animate-scale-in">
            <FamilyMemberSelector onAuthenticated={handleAuthenticated} />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Premium Welcome Header */}
            <Card className="bg-gradient-to-br from-card via-primary/5 to-card border-2 border-primary/40 backdrop-blur-sm overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
              <CardHeader className="pb-8 relative">
                <CardTitle className="text-4xl md:text-5xl font-bold text-foreground flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg animate-glow-pulse">
                    <BookOpen className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm md:text-base text-muted-foreground font-normal mb-2 opacity-80">As-salamu alaikum,</div>
                    <div className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                      {authenticatedMember}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Progress Input */}
            <div className="transform hover:scale-[1.01] transition-transform">
              <ProgressSelector selectedMember={authenticatedMember} />
            </div>

            {/* Analytics Dashboard */}
            <div className="transform hover:scale-[1.01] transition-transform">
              <ProgressAnalytics />
            </div>

            {/* Premium Switch Member Button */}
            <Button
              variant="outline"
              onClick={() => setAuthenticatedMember(null)}
              className="w-full border-2 border-primary/40 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:border-primary/60 transition-all text-lg py-7 font-semibold shadow-lg hover:shadow-xl"
            >
              Switch Family Member
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
