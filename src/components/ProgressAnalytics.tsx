import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, AlertTriangle, Clock } from "lucide-react";
import { FAMILY_MEMBERS } from "./FamilyMemberSelector";

interface MemberProgress {
  name: string;
  juz: number;
  surah: number;
  ayah: number;
  lastUpdated?: number;
}

const ProgressAnalytics = () => {
  const [memberData, setMemberData] = useState<MemberProgress[]>([]);

  useEffect(() => {
    loadMemberData();
    const interval = setInterval(loadMemberData, 5000);
    return () => clearInterval(interval);
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
    const days = Math.floor((Date.now() - lastUpdated) / (1000 * 60 * 60 * 24));
    return days;
  };

  const behindMembers = memberData
    .filter((m) => m.juz < 10)
    .sort((a, b) => a.juz - b.juz)
    .slice(0, 5);

  const inactiveMembers = memberData
    .filter((m) => getInactiveDays(m.lastUpdated) >= 7)
    .sort((a, b) => getInactiveDays(b.lastUpdated) - getInactiveDays(a.lastUpdated))
    .slice(0, 5);

  const topPerformers = memberData
    .filter((m) => m.juz > 0)
    .sort((a, b) => {
      if (b.juz !== a.juz) return b.juz - a.juz;
      if (b.surah !== a.surah) return b.surah - a.surah;
      return b.ayah - a.ayah;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Behind Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <TrendingDown className="w-5 h-5 text-destructive" />
              Behind in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {behindMembers.length > 0 ? (
              behindMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/30 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Juz {member.juz}, Surah {member.surah}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-destructive">{member.juz}</p>
                    <p className="text-xs text-muted-foreground">Juz</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Everyone is doing great! 🎉
              </p>
            )}
          </CardContent>
        </Card>

        {/* Inactive Members Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-yellow-500" />
              Inactive Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inactiveMembers.length > 0 ? (
              inactiveMembers.map((member) => {
                const days = getInactiveDays(member.lastUpdated);
                return (
                  <div
                    key={member.name}
                    className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {days} days ago
                      </p>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">
                All members are active! 💪
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Top Performers 🏆</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((member, index) => (
              <div
                key={member.name}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-secondary/10 border border-secondary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Surah {member.surah}, Ayah {member.ayah}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-foreground">{member.juz}</p>
                  <p className="text-sm text-muted-foreground">Juz</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Note */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/30">
        <CardContent className="p-4">
          <p className="text-sm text-foreground/80 text-center italic">
            📊 Analytics automatically update at weekend to identify hopeless cases with AI assistance
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;
