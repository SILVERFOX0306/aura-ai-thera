
import React, { useEffect, useRef, useState } from 'react';
import { useEmotion } from '@/contexts/EmotionContext';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface UserAvatarProps {
  speaking?: boolean;
  className?: string;
}

const UserAvatar = ({ speaking = false, className }: UserAvatarProps) => {
  const { emotionState } = useEmotion();
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // This is a placeholder for the 3D avatar implementation
  // In a real implementation, you would use a library like Ready Player Me SDK,
  // Three.js, or a similar solution to render the 3D avatar
  
  useEffect(() => {
    // Simulate loading the avatar
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Use emotionState.currentEmotion to update avatar expression
  useEffect(() => {
    if (!loading) {
      console.log(`Avatar should express ${emotionState.currentEmotion} with intensity ${emotionState.intensity}`);
      // This is where you would update the avatar's expression based on detected emotion
    }
  }, [emotionState.currentEmotion, emotionState.intensity, loading]);
  
  // Handle speaking animation
  useEffect(() => {
    if (!loading) {
      console.log(`Avatar speaking state: ${speaking}`);
      // This is where you would update the avatar's mouth movement based on speaking state
    }
  }, [speaking, loading]);
  
  return (
    <Card className={`overflow-hidden bg-gradient-to-br from-thera-purple/20 to-thera-blue/20 ${className}`}>
      <div className="relative h-64 w-full flex items-center justify-center" ref={avatarContainerRef}>
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-thera-purple animate-spin mb-2" />
            <p className="text-sm text-thera-purple">Loading your avatar...</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* Placeholder for the actual 3D avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-thera-purple to-thera-blue flex items-center justify-center text-white">
              <div className={`text-center ${speaking ? 'animate-pulse' : ''}`}>
                <div className="text-2xl">
                  {emotionState.currentEmotion === 'happy' && '😊'}
                  {emotionState.currentEmotion === 'sad' && '😢'}
                  {emotionState.currentEmotion === 'angry' && '😡'}
                  {emotionState.currentEmotion === 'neutral' && '😐'}
                  {emotionState.currentEmotion === 'anxious' && '😰'}
                  {emotionState.currentEmotion === 'calm' && '😌'}
                  {emotionState.currentEmotion === 'surprised' && '😮'}
                </div>
                <p className="text-xs mt-1">
                  {speaking ? "Speaking..." : "Ready"}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Emotion indicator */}
        <div className="absolute top-2 right-2 text-sm bg-white/80 px-2 py-1 rounded-md">
          {emotionState.currentEmotion} ({emotionState.intensity}/10)
        </div>
      </div>
    </Card>
  );
};

export default UserAvatar;
