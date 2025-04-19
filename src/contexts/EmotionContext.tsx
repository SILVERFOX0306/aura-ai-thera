
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types for the emotion tracking
type EmotionType = 'happy' | 'sad' | 'angry' | 'neutral' | 'anxious' | 'calm' | 'surprised';

interface EmotionState {
  currentEmotion: EmotionType;
  intensity: number; // 1-10
  timestamp: Date;
}

interface EmotionContextType {
  emotionState: EmotionState;
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  setEmotion: (emotion: EmotionType, intensity: number) => void;
}

const defaultState: EmotionState = {
  currentEmotion: 'neutral',
  intensity: 5,
  timestamp: new Date()
};

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export const EmotionProvider = ({ children }: { children: ReactNode }) => {
  const [emotionState, setEmotionState] = useState<EmotionState>(defaultState);
  const [isTracking, setIsTracking] = useState(false);
  
  const startTracking = () => {
    setIsTracking(true);
    console.log("Emotion tracking started");
  };
  
  const stopTracking = () => {
    setIsTracking(false);
    console.log("Emotion tracking stopped");
  };
  
  const setEmotion = (emotion: EmotionType, intensity: number) => {
    setEmotionState({
      currentEmotion: emotion,
      intensity: intensity,
      timestamp: new Date()
    });
  };
  
  // Maintain tracking state in local storage to persist across refreshes
  useEffect(() => {
    const savedTracking = localStorage.getItem('thera_emotion_tracking');
    if (savedTracking === 'true') {
      startTracking();
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('thera_emotion_tracking', String(isTracking));
  }, [isTracking]);
  
  return (
    <EmotionContext.Provider
      value={{
        emotionState,
        isTracking,
        startTracking,
        stopTracking,
        setEmotion
      }}
    >
      {children}
    </EmotionContext.Provider>
  );
};

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (context === undefined) {
    throw new Error("useEmotion must be used within an EmotionProvider");
  }
  return context;
};
