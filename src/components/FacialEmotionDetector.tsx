
import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";
import EmotionBubble from "./EmotionBubble";

interface FacialEmotionDetectorProps {
  onEmotionDetected?: (emotion: string, intensity: number) => void;
  className?: string;
}

const FacialEmotionDetector = ({
  onEmotionDetected,
  className
}: FacialEmotionDetectorProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'sad' | 'angry' | 'neutral' | 'anxious' | 'calm'>('neutral');
  const [intensity, setIntensity] = useState(5);
  
  // Reference for video element
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Toggle camera
  const toggleCamera = async () => {
    if (isActive) {
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsActive(false);
    } else {
      // Start camera if available
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsActive(true);
        
        // Start simulated emotion detection
        startSimulatedDetection();
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Fallback to simulated mode without camera
        setIsActive(true);
        startSimulatedDetection();
      }
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Simulate emotion detection
  // In a real app, we would use a facial emotion detection library
  const startSimulatedDetection = () => {
    const emotions: ('happy' | 'sad' | 'angry' | 'neutral' | 'anxious' | 'calm')[] = 
      ['happy', 'sad', 'angry', 'neutral', 'anxious', 'calm'];
      
    // Change emotion every 5-15 seconds
    const interval = setInterval(() => {
      if (!isActive) {
        clearInterval(interval);
        return;
      }
      
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomIntensity = Math.floor(Math.random() * 10) + 1; // 1-10
      
      setCurrentEmotion(randomEmotion);
      setIntensity(randomIntensity);
      
      if (onEmotionDetected) {
        onEmotionDetected(randomEmotion, randomIntensity);
      }
    }, 5000 + Math.random() * 10000);
    
    return () => clearInterval(interval);
  };
  
  return (
    <div className={className}>
      <Card className={`glass-card overflow-hidden ${isActive ? 'p-0' : 'p-4'}`}>
        {isActive ? (
          <div className="relative">
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            
            <div className="absolute top-2 right-2">
              <EmotionBubble 
                emotion={currentEmotion}
                intensity={intensity}
                size="md"
                className="animate-float"
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium capitalize">{currentEmotion}</p>
                  <p className="text-xs">Intensity: {intensity}/10</p>
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="bg-black/30 text-white hover:bg-black/50 hover:text-white"
                  onClick={toggleCamera}
                >
                  <CameraOff className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-thera-purple/10 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-thera-purple" />
            </div>
            <h3 className="font-medium mb-1">Emotion Detection</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enable camera to analyze your facial expressions and emotions
            </p>
            <Button className="thera-button" onClick={toggleCamera}>
              Enable Camera
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FacialEmotionDetector;
