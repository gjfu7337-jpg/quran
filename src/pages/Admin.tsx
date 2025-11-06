import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FAMILY_MEMBERS } from "@/components/FamilyMemberSelector";

interface MemberProgress {
  name: string;
  juz: number;
  surah: number;
  ayah: number;
  lastUpdated?: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState("");

  const ADMIN_PASSWORD = "qurayshi2024"; // You can change this

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      generateReport();
      toast({
        title: "Welcome Admin",
        description: "Weekly report generated successfully",
      });
    } else {
      toast({
        title: "Invalid Password",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getInactiveDays = (lastUpdated?: number) => {
    if (!lastUpdated) return 999;
    return Math.floor((Date.now() - lastUpdated) / (1000 * 60 * 60 * 24));
  };

  const generateReport = () => {
    const memberData: MemberProgress[] = FAMILY_MEMBERS.map((name) => {
      const key = `progress_${name.replace(/\s+/g, "_")}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
      return { name, juz: 0, surah: 1, ayah: 1, lastUpdated: Date.now() };
    });

    // Sort by progress
    const sorted = memberData.sort((a, b) => {
      if (b.juz !== a.juz) return b.juz - a.juz;
      if (b.surah !== a.surah) return b.surah - a.surah;
      return b.ayah - a.ayah;
    });

    const activeMembers = memberData.filter((m) => getInactiveDays(m.lastUpdated) < 7);
    const inactiveMembers = memberData.filter((m) => getInactiveDays(m.lastUpdated) >= 7);
    const behindMembers = memberData.filter((m) => m.juz < 10);
    const topPerformers = sorted.slice(0, 3);

    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let report = `📖 *Noor Journey - Weekly Progress Report*\n`;
    report += `🗓️ ${date}\n\n`;
    report += `═══════════════════════\n\n`;

    // Top Performers
    report += `🏆 *TOP PERFORMERS* 🌟\n\n`;
    topPerformers.forEach((member, index) => {
      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
      report += `${medal} *${member.name}*\n`;
      report += `   └ ${member.juz} Juz | Surah ${member.surah}, Ayah ${member.ayah}\n\n`;
    });

    // Active Members
    report += `\n✅ *ACTIVE THIS WEEK* (${activeMembers.length} members)\n\n`;
    activeMembers.forEach((member) => {
      const days = getInactiveDays(member.lastUpdated);
      const status = days === 0 ? "📍 Updated today" : `📅 ${days}d ago`;
      report += `• ${member.name} - ${status}\n`;
    });

    // Inactive Members
    if (inactiveMembers.length > 0) {
      report += `\n\n⚠️ *NEEDS ENCOURAGEMENT* (${inactiveMembers.length} members)\n\n`;
      inactiveMembers.forEach((member) => {
        const days = getInactiveDays(member.lastUpdated);
        report += `• ${member.name} - ${days} days inactive\n`;
      });
    }

    // Behind in Progress
    if (behindMembers.length > 0) {
      report += `\n\n📚 *BEHIND IN PROGRESS*\n\n`;
      behindMembers.slice(0, 5).forEach((member) => {
        report += `• ${member.name} - ${member.juz} Juz completed\n`;
      });
    }

    report += `\n\n═══════════════════════\n`;
    report += `💡 *Keep going! Every ayah counts!*\n`;
    report += `🤲 May Allah make it easy for all of us.`;

    setWeeklyReport(report);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(weeklyReport);
    toast({
      title: "Copied!",
      description: "Report copied to clipboard. Ready to paste in WhatsApp!",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="container max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Calendar className="w-8 h-8 text-primary" />
              Weekly Progress Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={generateReport} className="flex-1">
                Generate New Report
              </Button>
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>

            <div>
              <Label htmlFor="report">WhatsApp Message</Label>
              <Textarea
                id="report"
                value={weeklyReport}
                readOnly
                className="min-h-[500px] font-mono text-sm"
              />
            </div>

            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
              <p className="text-sm text-foreground/80">
                <strong>How to use:</strong> Click "Copy" and paste directly into your
                WhatsApp group. The report includes top performers, active members,
                and those who need encouragement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
