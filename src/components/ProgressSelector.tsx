import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Save, Trash2 } from "lucide-react";

interface ProgressData {
  juz: number;
  surah: number;
  ayah: number;
  name: string;
  lastUpdated: number;
}

interface ProgressSelectorProps {
  selectedMember: string;
}

const ProgressSelector = ({ selectedMember }: ProgressSelectorProps) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState<ProgressData>({
    juz: 0,
    surah: 1,
    ayah: 1,
    name: selectedMember,
    lastUpdated: Date.now(),
  });

  useEffect(() => {
    const key = `progress_${selectedMember.replace(/\s+/g, "_")}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setProgress(JSON.parse(saved));
    } else {
      setProgress({
        juz: 0,
        surah: 1,
        ayah: 1,
        name: selectedMember,
        lastUpdated: Date.now(),
      });
    }
  }, [selectedMember]);

  const handleSave = () => {
    const updatedProgress = {
      ...progress,
      lastUpdated: Date.now(),
    };

    const key = `progress_${selectedMember.replace(/\s+/g, "_")}`;
    localStorage.setItem(key, JSON.stringify(updatedProgress));

    // Trigger storage event for leaderboard update
    window.dispatchEvent(new Event("storage"));

    toast({
      title: "Progress Updated! 🌟",
      description: `${selectedMember}: Juz ${progress.juz}, Surah ${progress.surah}, Ayah ${progress.ayah}`,
    });
  };

  const handleDelete = () => {
    const key = `progress_${selectedMember.replace(/\s+/g, "_")}`;
    localStorage.removeItem(key);
    
    setProgress({
      juz: 0,
      surah: 1,
      ayah: 1,
      name: selectedMember,
      lastUpdated: Date.now(),
    });

    window.dispatchEvent(new Event("storage"));

    toast({
      title: "Progress Deleted",
      description: `${selectedMember}'s progress has been reset.`,
      variant: "destructive",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <BookOpen className="w-5 h-5 text-primary" />
          Update Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="juz">Juz</Label>
            <Input
              id="juz"
              type="number"
              min="0"
              max="30"
              value={progress.juz}
              onChange={(e) => setProgress({ ...progress, juz: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surah">Surah</Label>
            <Input
              id="surah"
              type="number"
              min="1"
              max="114"
              value={progress.surah}
              onChange={(e) => setProgress({ ...progress, surah: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ayah">Ayah</Label>
            <Input
              id="ayah"
              type="number"
              min="1"
              value={progress.ayah}
              onChange={(e) => setProgress({ ...progress, ayah: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Progress
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="px-4"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSelector;
