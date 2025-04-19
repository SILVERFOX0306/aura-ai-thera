import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";

interface BreathingExerciseProps {
  duration?: number; // in seconds
  className?: string;
}

const BreathingExercise = ({ 
  duration = 60,
  className 
}: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(duration);
  const [circleSize, setCircleSize] = useState(100);
  
  // Reset the exercise
  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimer(duration);
    setCircleSize(100);
  };
  
  // Toggle the exercise
  const toggleExercise = () => {
    setIsActive(!isActive);
  };
  
  // Handle the breathing phases
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isActive) {
      interval = setInterval(() => {
        // Update timer
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            resetExercise();
            return duration;
          }
          return prevTimer - 1;
        });
        
        // Update phase every 4 seconds
        switch (phase) {
          case 'inhale':
            setCircleSize(prev => Math.min(200, prev + 5));
            if (circleSize >= 195) {
              setPhase('hold');
            }
            break;
          case 'hold':
            // Keep circle size the same during hold
            setTimeout(() => {
              setPhase('exhale');
            }, 4000);
            break;
          case 'exhale':
            setCircleSize(prev => Math.max(100, prev - 5));
            if (circleSize <= 105) {
              setPhase('inhale');
            }
            break;
        }
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, circleSize]);
  
  // Get instruction text
  const getInstructionText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Exhale slowly...';
    }
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <h3 className="text-lg font-medium mb-4">Breathing Exercise</h3>
      
      <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
        {/* Outer circle - static */}
        <div className="absolute inset-0 rounded-full border-2 border-thera-purple/30" />
        
        {/* Inner circle - animated */}
        <div 
          className="rounded-full bg-thera-purple/10 border border-thera-purple/20 flex items-center justify-center text-thera-purple"
          style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            transition: 'all 0.5s ease-in-out'
          }}
        >
          <span className="text-xl font-light">{Math.ceil(timer)}</span>
        </div>
      </div>
      
      <p className="text-center mb-4 h-6">{isActive ? getInstructionText() : 'Press play to start'}</p>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={resetExercise}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button
          className="thera-button"
          onClick={toggleExercise}
        >
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isActive ? ' Pause' : ' Start'}
        </Button>
      </div>
    </div>
  );
};

export default BreathingExercise;
