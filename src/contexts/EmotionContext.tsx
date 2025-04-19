
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types for the emotion tracking
type EmotionType = 'happy' | 'sad' | 'angry' | 'neutral' | 'anxious' | 'calm' | 'surprised';

interface EmotionState {
  currentEmotion: EmotionType;
  intensity: number; // 1-10
  timestamp: Date;
  emotionHistory: Array<{
    emotion: EmotionType;
    intensity: number;
    timestamp: Date;
  }>;
}

interface EmotionContextType {
  emotionState: EmotionState;
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  setEmotion: (emotion: EmotionType, intensity: number) => void;
  getDominantEmotion: (timeRange?: number) => EmotionType | null;
  getEmotionIntensity: (emotion: EmotionType, timeRange?: number) => number;
}

const defaultState: EmotionState = {
  currentEmotion: 'neutral',
  intensity: 5,
  timestamp: new Date(),
  emotionHistory: []
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
    const timestamp = new Date();
    
    setEmotionState(prev => ({
      currentEmotion: emotion,
      intensity: intensity,
      timestamp: timestamp,
      emotionHistory: [
        ...prev.emotionHistory,
        { emotion, intensity, timestamp }
      ].slice(-100) // Keep only last 100 emotion records
    }));
  };
  
  // Get dominant emotion within a time range (in milliseconds)
  const getDominantEmotion = (timeRange: number = 30000): EmotionType | null => {
    if (emotionState.emotionHistory.length === 0) return null;
    
    const now = new Date();
    const recentHistory = emotionState.emotionHistory.filter(
      record => now.getTime() - record.timestamp.getTime() < timeRange
    );
    
    if (recentHistory.length === 0) return null;
    
    // Count occurrences of each emotion
    const emotionCounts = recentHistory.reduce((acc, record) => {
      acc[record.emotion] = (acc[record.emotion] || 0) + 1;
      return acc;
    }, {} as Record<EmotionType, number>);
    
    // Find the emotion with highest count
    let maxCount = 0;
    let dominantEmotion: EmotionType | null = null;
    
    for (const [emotion, count] of Object.entries(emotionCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = emotion as EmotionType;
      }
    }
    
    return dominantEmotion;
  };
  
  // Get average intensity of a specific emotion
  const getEmotionIntensity = (emotion: EmotionType, timeRange: number = 30000): number => {
    const now = new Date();
    const relevantHistory = emotionState.emotionHistory.filter(
      record => 
        record.emotion === emotion && 
        now.getTime() - record.timestamp.getTime() < timeRange
    );
    
    if (relevantHistory.length === 0) return 0;
    
    const totalIntensity = relevantHistory.reduce((sum, record) => sum + record.intensity, 0);
    return totalIntensity / relevantHistory.length;
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
        setEmotion,
        getDominantEmotion,
        getEmotionIntensity
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
