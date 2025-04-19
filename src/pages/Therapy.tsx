import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smile, Settings, MessageSquare, Music, Brain 
} from "lucide-react";
import { Link } from "react-router-dom";
import EmotionBubble from "@/components/EmotionBubble";
import TherapyTip from "@/components/TherapyTip";
import BreathingExercise from "@/components/BreathingExercise";
import PersistentCamera from "@/components/PersistentCamera";
import VoiceControl from "@/components/VoiceControl";
import AutoConversation from "@/components/AutoConversation";
import AvatarSideBySide from "@/components/AvatarSideBySide";
import { useEmotion } from "@/contexts/EmotionContext";
import { useVoice } from "@/contexts/VoiceContext";

// Avatar component with emotion awareness
const TheraAvatar = ({ emotion = 'neutral' }: { emotion?: string }) => {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-thera-pink/50 to-thera-blue/30 rounded-xl flex items-center justify-center relative">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full bg-thera-purple/20 animate-pulse-slow"></div>
        <div className="absolute inset-2 rounded-full bg-thera-purple/30"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-thera-purple to-blue-400 flex items-center justify-center text-white text-xl font-bold">
          THERA
        </div>
      </div>
      
      {/* Emotion indicator */}
      <div className="absolute top-4 right-4">
        <EmotionBubble 
          emotion={emotion as any} 
          size="md" 
          intensity={7}
        />
      </div>
    </div>
  );
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'thera';
  timestamp: Date;
}

const Therapy = () => {
  const { emotionState, isTracking } = useEmotion();
  const { voiceState } = useVoice();
  
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Handle scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Handle new messages from auto conversation
  const handleMessageReceived = (message: Message) => {
    setMessages(prev => {
      // Keep only the last 10 messages to avoid performance issues
      const newMessages = [...prev, message];
      if (newMessages.length > 10) {
        return newMessages.slice(-10);
      }
      return newMessages;
    });
  };

  return (
    <div className="min-h-screen thera-gradient flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-thera-purple">THERA AI</Link>
        <div className="flex gap-2">
          <Link to="/mood">
            <Button variant="outline" size="icon" className="rounded-full">
              <Smile className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/journal">
            <Button variant="outline" size="icon" className="rounded-full">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Tabs for different modes */}
      <Tabs defaultValue="therapy" className="w-full px-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="therapy">Therapy</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
          <TabsTrigger value="camera">Camera</TabsTrigger>
          <TabsTrigger value="relax">Relax</TabsTrigger>
        </TabsList>
        
        {/* Therapy Mode */}
        <TabsContent value="therapy" className="mt-4 space-y-4 pb-24">
          {/* Main Content - Side by Side View */}
          <AvatarSideBySide />
          
          {/* Auto Conversation */}
          <AutoConversation onMessageReceived={handleMessageReceived} />
          
          {/* Therapy Tips */}
          <TherapyTip 
            title="Expressing Your Feelings" 
            content="Try to use 'I' statements when describing your emotions. For example, say 'I feel anxious when...' instead of 'This makes me anxious.'"
            color="purple"
          />
        </TabsContent>
        
        {/* Avatar Mode */}
        <TabsContent value="avatar" className="mt-4 space-y-4 pb-24">
          <Card className="glass-card p-4">
            <h2 className="text-lg font-medium mb-4">Your Digital Avatar</h2>
            <p className="mb-4">
              Your avatar reflects your emotions and responds to your interactions. As you speak with THERA, your avatar will animate and express emotions.
            </p>
            
            <TheraAvatar emotion={emotionState.currentEmotion} />
            
            <div className="mt-4">
              <h3 className="font-medium">Current Emotion</h3>
              <div className="flex items-center gap-3 mt-2">
                <EmotionBubble emotion={emotionState.currentEmotion as any} size="md" intensity={emotionState.intensity} />
                <div>
                  <p className="capitalize font-medium">{emotionState.currentEmotion}</p>
                  <p className="text-sm text-gray-500">Intensity: {emotionState.intensity}/10</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Camera Mode */}
        <TabsContent value="camera" className="mt-4 space-y-4 pb-24">
          <PersistentCamera />
          <TherapyTip 
            title="Emotion Tracking" 
            content="Your facial expressions help THERA understand how you're feeling. This information is used to personalize your therapy experience."
            color="purple"
          />
        </TabsContent>
        
        {/* Relax Mode */}
        <TabsContent value="relax" className="mt-4 space-y-4 pb-24">
          <BreathingExercise />
          <TherapyTip 
            title="Take a Moment" 
            content="Deep breathing activates your parasympathetic nervous system, helping calm anxiety and reduce stress."
            color="blue"
          />
        </TabsContent>
      </Tabs>
      
      {/* Persistent controls (minimized versions) - only visible on small screens */}
      <div className="md:hidden">
        <PersistentCamera minimized />
        <VoiceControl minimized />
      </div>
    </div>
  );
};

export default Therapy;
