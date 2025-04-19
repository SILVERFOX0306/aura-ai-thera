
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EmotionBubbleProps {
  emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'anxious' | 'calm';
  intensity?: number; // 1-10
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmotionBubble = ({ 
  emotion, 
  intensity = 5, 
  size = 'md', 
  className 
}: EmotionBubbleProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Define colors based on emotions
  const getEmotionColors = () => {
    switch (emotion) {
      case 'happy':
        return 'from-yellow-300 to-amber-500';
      case 'sad':
        return 'from-blue-300 to-indigo-500';
      case 'angry':
        return 'from-red-300 to-rose-500';
      case 'anxious':
        return 'from-orange-300 to-red-400';
      case 'calm':
        return 'from-teal-300 to-cyan-500';
      case 'neutral':
      default:
        return 'from-gray-300 to-gray-400';
    }
  };
  
  // Size classes
  const sizeClass = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };
  
  // Trigger animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const intensityScale = 0.7 + (intensity / 10) * 0.6; // 0.7-1.3 scale based on intensity
  
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div 
        className={cn(
          'rounded-full bg-gradient-to-br opacity-70',
          getEmotionColors(),
          sizeClass[size],
          isAnimating ? 'animate-pulse' : ''
        )}
        style={{
          transform: `scale(${intensityScale})`,
          transition: 'transform 1s ease-in-out',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {emotion === 'happy' && '😊'}
        {emotion === 'sad' && '😢'}
        {emotion === 'angry' && '😡'}
        {emotion === 'anxious' && '😰'}
        {emotion === 'calm' && '😌'}
        {emotion === 'neutral' && '😐'}
      </div>
    </div>
  );
};

export default EmotionBubble;
