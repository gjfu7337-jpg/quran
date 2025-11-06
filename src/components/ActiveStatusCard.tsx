import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock } from "lucide-react";
import { FAMILY_MEMBERS } from "./FamilyMemberSelector";

interface MemberProgress {
  name: string;
  juz: number;
  surah: number;
  ayah: number;
  lastUpdated?: number;
}

const ActiveStatusCard = () => {
  const [memberData, setMemberData] = useState<MemberProgress[]>([]);

  useEffect(() => {
    loadMemberData();
    const interval = setInterval(loadMemberData, 5000);
    window.addEventListener("storage", loadMemberData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", loadMemberData);
    };
  }, []);

  const loadMemberData = () => {
    const data: MemberProgress[] = FAMILY_MEMBERS.map((name) => {
      const key = `progress_${name.replace(/\s+/g, "_")}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
      return { name, juz: 0, surah: 1, ayah: 1, lastUpdated: Date.now() };
    });
    setMemberData(data);
  };

  const getInactiveDays = (lastUpdated?: number) => {
    if (!lastUpdated) return 0;
    return Math.floor((Date.now() - lastUpdated) / (1000 * 60 * 60 * 24));
  };

  const activeMembers = memberData.filter((m) => getInactiveDays(m.lastUpdated) < 7);
  const inactiveMembers = memberData.filter((m) => getInactiveDays(m.lastUpdated) >= 7);

  return (
    <section className="py-16 px-6 bg-background">
      <div className="container max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Members */}
          <Card className="bg-gradient-to-br from-card to-secondary/5 border-2 border-secondary/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                <Activity className="w-6 h-6 text-secondary" />
                Active Members
                <span className="ml-auto text-2xl font-bold text-secondary">
                  {activeMembers.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeMembers.length > 0 ? (
                  activeMembers.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between p-3 bg-secondary/10 border border-secondary/30 rounded-lg"
                    >
                      <span className="font-medium text-foreground">{member.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {getInactiveDays(member.lastUpdated) === 0
                          ? "Today"
                          : `${getInactiveDays(member.lastUpdated)}d ago`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No active members this week
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inactive Members */}
          <Card className="bg-gradient-to-br from-card to-destructive/5 border-2 border-destructive/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                <Clock className="w-6 h-6 text-destructive" />
                Inactive Members
                <span className="ml-auto text-2xl font-bold text-destructive">
                  {inactiveMembers.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {inactiveMembers.length > 0 ? (
                  inactiveMembers.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/30 rounded-lg"
                    >
                      <span className="font-medium text-foreground">{member.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {getInactiveDays(member.lastUpdated)}d inactive
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Everyone is active! 🎉
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ActiveStatusCard;
