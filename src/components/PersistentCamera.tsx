import React, { useEffect, useRef, useState } from "react";
import { useEmotion } from "@/contexts/EmotionContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Eye, EyeOff } from "lucide-react";

// In a production app, we would integrate with a real emotion detection library
// like face-api.js, tensorflow.js with blazeface, or MediaPipe
const simulateEmotionDetection = () => {
  const emotions = ['happy', 'sad', 'angry', 'neutral', 'anxious', 'calm', 'surprised'] as const;
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomIntensity = Math.floor(Math.random() * 10) + 1; // 1-10
  return { emotion: randomEmotion, intensity: randomIntensity };
};

interface PersistentCameraProps {
  minimized?: boolean;
  onEmotionDetected?: (emotion: string, intensity: number) => void;
}

const PersistentCamera = ({
  minimized = false,
  onEmotionDetected
}: PersistentCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isTracking, startTracking, stopTracking, setEmotion } = useEmotion();
  const [videoVisible, setVideoVisible] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Start camera when component mounts or tracking state changes
  useEffect(() => {
    if (isTracking) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isTracking]);
  
  // Start the camera stream
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      
      // In a real app, we would start the emotion detection here
      startEmotionDetection();
      setCameraError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Cannot access camera. Please check permissions.");
      stopTracking();
    }
  };
  
  // Stop the camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  // Toggle camera visibility (but keep tracking)
  const toggleCameraVisibility = () => {
    setVideoVisible(prev => !prev);
  };
  
  // Simulate emotion detection (replace with real implementation)
  const startEmotionDetection = () => {
    const intervalId = setInterval(() => {
      if (!isTracking) {
        clearInterval(intervalId);
        return;
      }
      
      const { emotion, intensity } = simulateEmotionDetection();
      setEmotion(emotion, intensity);
      
      if (onEmotionDetected) {
        onEmotionDetected(emotion, intensity);
      }
      
      console.log(`Detected emotion: ${emotion}, intensity: ${intensity}`);
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(intervalId);
  };
  
  // Toggle tracking on/off
  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };
  
  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${isTracking ? 'bg-thera-purple text-white' : ''}`}
          onClick={toggleTracking}
        >
          {isTracking ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="glass-card overflow-hidden">
      <div className="relative">
        {isTracking && videoVisible && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
          />
        )}
        
        {isTracking && !videoVisible && (
          <div className="w-full h-64 bg-thera-purple/10 flex items-center justify-center">
            <p className="text-thera-purple">Camera active but hidden</p>
          </div>
        )}
        
        {!isTracking && (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center flex-col gap-2 p-4 text-center">
            <Camera className="h-12 w-12 text-thera-purple mb-2 opacity-50" />
            <h3 className="text-lg font-medium">Emotion Detection Inactive</h3>
            <p className="text-sm text-gray-500">
              Enable camera to track your emotions during the therapy session
            </p>
            {cameraError && <p className="text-red-500 text-sm">{cameraError}</p>}
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          {isTracking && (
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm"
              onClick={toggleCameraVisibility}
            >
              {videoVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          
          <Button
            variant={isTracking ? "outline" : "default"}
            className={isTracking ? "bg-white/80 backdrop-blur-sm" : "bg-thera-purple"}
            onClick={toggleTracking}
          >
            {isTracking ? "Disable Camera" : "Enable Camera"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PersistentCamera;
