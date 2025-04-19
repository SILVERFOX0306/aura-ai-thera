
import React, { useState } from 'react';
import { useEmotion } from '@/contexts/EmotionContext';
import { useVoice } from '@/contexts/VoiceContext';
import PersistentCamera from './PersistentCamera';
import UserAvatar from './UserAvatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AvatarSideBySideProps {
  className?: string;
}

const AvatarSideBySide = ({ className }: AvatarSideBySideProps) => {
  const { isTracking, startTracking } = useEmotion();
  const { voiceState } = useVoice();
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };
  
  if (!isTracking) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center">
          <h3 className="font-medium mb-2">Webcam and Avatar</h3>
          <p className="text-sm text-gray-500 mb-4">
            Enable camera to see yourself alongside your digital avatar
          </p>
          <Button onClick={startTracking}>
            Enable Camera
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <div className={`${className}`}>
      <div className="relative">
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-2 right-2 z-10 rounded-full bg-white/80"
          onClick={toggleExpanded}
        >
          {expanded ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(!expanded || window.innerWidth >= 768) && (
            <PersistentCamera
              minimized={false}
              className="h-full"
            />
          )}
          
          <UserAvatar 
            speaking={voiceState.isSpeaking}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AvatarSideBySide;
