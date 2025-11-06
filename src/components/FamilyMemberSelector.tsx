import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const FAMILY_MEMBERS = [
  "Bilal Qureshi",
  "Umar Qureshi",
  "Abdullah Qureshi",
  "Abir Qureshi",
  "Ammar Qureshi",
  "Arif Qureshi",
  "Hoorab",
  "Amna",
  "Lareb",
  "Mama",
];

interface FamilyMemberSelectorProps {
  onAuthenticated: (memberName: string) => void;
}

const FamilyMemberSelector = ({ onAuthenticated }: FamilyMemberSelectorProps) => {
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState<string>("");

  const getPinKey = (memberName: string) => `pin_${memberName.replace(/\s+/g, "_")}`;

  const handleAuthenticate = async () => {
    if (!selectedMember) {
      toast({
        title: "Please select a family member",
        variant: "destructive",
      });
      return;
    }

    try {
      const pinKey = getPinKey(selectedMember);
      const pinDoc = await getDoc(doc(db, "family_pins", pinKey));
      
      if (!pinDoc.exists()) {
        setIsSettingPin(true);
        toast({
          title: "First Time Setup",
          description: `Please set a PIN for ${selectedMember}`,
        });
        return;
      }

      const storedPin = pinDoc.data().pin;
      if (pin === storedPin) {
        toast({
          title: "Access Granted ✅",
          description: `Welcome, ${selectedMember}!`,
        });
        onAuthenticated(selectedMember);
      } else {
        toast({
          title: "Invalid PIN ❌",
          description: "Please try again.",
          variant: "destructive",
        });
        setPin("");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSetPin = async () => {
    if (pin.length < 4) {
      toast({
        title: "PIN too short",
        description: "Please use at least 4 digits",
        variant: "destructive",
      });
      return;
    }

    if (pin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure both PINs are the same",
        variant: "destructive",
      });
      return;
    }

    try {
      const pinKey = getPinKey(selectedMember);
      await setDoc(doc(db, "family_pins", pinKey), {
        memberName: selectedMember,
        pin: pin,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "PIN Set Successfully! 🔐",
        description: `PIN created for ${selectedMember}`,
      });

      onAuthenticated(selectedMember);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/30 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center gap-3 text-foreground">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          Qurayshi Family Portal
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Select your name and authenticate to track your progress
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="member" className="text-base font-semibold">
            Family Member
          </Label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger className="h-12 text-base border-primary/20 focus:border-primary">
              <SelectValue placeholder="Choose your name from the list" />
            </SelectTrigger>
            <SelectContent>
              {FAMILY_MEMBERS.map((member) => (
                <SelectItem key={member} value={member} className="text-base py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {member}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMember && (
          <div className="space-y-4 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
            <div className="space-y-3">
              <Label htmlFor="pin" className="flex items-center gap-2 text-base font-semibold">
                <div className="p-1 bg-primary/10 rounded">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                {isSettingPin ? "Create Your PIN" : "Enter Your PIN"}
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder={isSettingPin ? "Create a secure PIN (min 4 digits)" : "Enter your PIN"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={8}
                className="h-12 text-lg border-primary/20 focus:border-primary"
              />
            </div>

            {isSettingPin && (
              <div className="space-y-3">
                <Label htmlFor="confirmPin" className="text-base font-semibold">
                  Confirm PIN
                </Label>
                <Input
                  id="confirmPin"
                  type="password"
                  placeholder="Re-enter your PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  maxLength={8}
                  className="h-12 text-lg border-primary/20 focus:border-primary"
                />
              </div>
            )}

            <Button
              onClick={isSettingPin ? handleSetPin : handleAuthenticate}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Lock className="mr-2 h-5 w-5" />
              {isSettingPin ? "Create PIN & Continue" : "Authenticate"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyMemberSelector;
