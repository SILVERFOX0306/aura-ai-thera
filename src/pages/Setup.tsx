
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Camera, Mic, Check, X, Brain, User, AlertCircle } from "lucide-react";
import TheraIcon from "@/components/TheraIcon";
import { useEmotion } from "@/contexts/EmotionContext";
import { useVoice } from "@/contexts/VoiceContext";

// Permission status type
type PermissionStatus = "pending" | "granted" | "denied" | "prompt";

// Main component
const Setup = () => {
  const navigate = useNavigate();
  const { startTracking } = useEmotion();
  const { startListening, stopListening } = useVoice();
  
  // User profile state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [preferences, setPreferences] = useState("");
  
  // Permissions state
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>("pending");
  const [microphonePermission, setMicrophonePermission] = useState<PermissionStatus>("pending");
  
  // Face capture state
  const [faceDataCaptured, setFaceDataCaptured] = useState(false);
  const [faceDataProgress, setFaceDataProgress] = useState(0);
  
  // Voice sample state
  const [voiceSampleRecorded, setVoiceSampleRecorded] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  // Check for existing permissions on component mount
  useEffect(() => {
    const checkExistingPermissions = async () => {
      try {
        const cameras = await navigator.mediaDevices.enumerateDevices();
        const hasCameras = cameras.some(device => device.kind === 'videoinput');
        
        if (hasCameras) {
          // Try to determine permission status
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraPermission("granted");
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
          } catch (err) {
            setCameraPermission("denied");
          }
        }
        
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicrophonePermission("granted");
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          setMicrophonePermission("denied");
        }
      } catch (err) {
        console.error("Error checking permissions:", err);
      }
    };
    
    checkExistingPermissions();
    
    // Check for saved profile data
    const savedProfile = localStorage.getItem('thera_user_profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setName(profile.name || "");
      setAge(profile.age || "");
      setGender(profile.gender || "");
      setPreferences(profile.preferences || "");
    }
  }, []);
  
  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission("granted");
      
      // Stop all tracks to release the camera
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Error requesting camera permission:", err);
      setCameraPermission("denied");
    }
  };
  
  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophonePermission("granted");
      
      // Stop all tracks to release the microphone
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Error requesting microphone permission:", err);
      setMicrophonePermission("denied");
    }
  };
  
  // Simulate face data capture
  const captureFaceData = () => {
    // In a real app, we would use face-api.js or MediaPipe to capture face data
    setFaceDataProgress(0);
    
    const interval = setInterval(() => {
      setFaceDataProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFaceDataCaptured(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // Simulate voice sample recording
  const recordVoiceSample = () => {
    if (isRecordingVoice) {
      // Stop recording
      setIsRecordingVoice(false);
      stopListening();
      setVoiceSampleRecorded(true);
    } else {
      // Start recording
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      startListening();
      
      // Count seconds
      const interval = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 10) {
            clearInterval(interval);
            setIsRecordingVoice(false);
            stopListening();
            setVoiceSampleRecorded(true);
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };
  
  // Save profile and proceed to therapy
  const handleSaveProfile = () => {
    // Save user profile data to local storage
    const userProfile = {
      name,
      age,
      gender,
      preferences
    };
    
    localStorage.setItem('thera_user_profile', JSON.stringify(userProfile));
    
    // Start emotion tracking
    startTracking();
    
    // Navigate to therapy screen
    navigate('/therapy');
  };
  
  // Determine if all necessary steps are completed
  const isSetupComplete = 
    name.trim() !== "" && 
    age.trim() !== "" && 
    cameraPermission === "granted" && 
    microphonePermission === "granted";
  
  return (
    <div className="min-h-screen thera-gradient flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <TheraIcon size={80} />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Welcome to THERA AI</h1>
        <p className="text-center text-gray-600 mb-8">
          Let's set up your personalized therapy experience
        </p>
        
        {/* User Profile */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-thera-purple" />
              Your Profile
            </CardTitle>
            <CardDescription>
              Tell us about yourself for a personalized experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Your Age</Label>
              <Input 
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                type="number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input 
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Enter your gender"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferences">Preferences & Goals</Label>
              <Textarea 
                id="preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="What are you hoping to achieve with THERA? Any specific topics you'd like to discuss?"
                className="resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Permissions */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-thera-purple" />
              Required Permissions
            </CardTitle>
            <CardDescription>
              THERA needs camera and microphone access to work properly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-thera-purple" />
                <span>Camera Access</span>
              </div>
              
              {cameraPermission === "granted" ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-1" />
                  Granted
                </div>
              ) : cameraPermission === "denied" ? (
                <div className="flex items-center text-red-500">
                  <X className="h-5 w-5 mr-1" />
                  Denied
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={requestCameraPermission}
                >
                  Enable
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5 text-thera-purple" />
                <span>Microphone Access</span>
              </div>
              
              {microphonePermission === "granted" ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-1" />
                  Granted
                </div>
              ) : microphonePermission === "denied" ? (
                <div className="flex items-center text-red-500">
                  <X className="h-5 w-5 mr-1" />
                  Denied
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={requestMicrophonePermission}
                >
                  Enable
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Face Data */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-thera-purple" />
              Optional Setup
            </CardTitle>
            <CardDescription>
              Enhance your experience with these additional steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Face Data Capture</Label>
                {faceDataCaptured ? (
                  <span className="text-green-600 text-sm flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Captured
                  </span>
                ) : null}
              </div>
              
              {faceDataProgress > 0 && faceDataProgress < 100 ? (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-thera-purple h-2.5 rounded-full" 
                    style={{ width: `${faceDataProgress}%` }}
                  ></div>
                  <p className="text-xs text-gray-500 mt-1">Capturing face data: {faceDataProgress}%</p>
                </div>
              ) : (
                <Button 
                  variant={faceDataCaptured ? "outline" : "secondary"}
                  className="w-full"
                  onClick={captureFaceData}
                  disabled={cameraPermission !== "granted"}
                >
                  {faceDataCaptured ? "Recapture Face Data" : "Capture Face Data"}
                </Button>
              )}
              
              <p className="text-xs text-gray-500">
                This helps THERA understand your expressions better
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Voice Sample</Label>
                {voiceSampleRecorded && !isRecordingVoice ? (
                  <span className="text-green-600 text-sm flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Recorded
                  </span>
                ) : null}
              </div>
              
              {isRecordingVoice ? (
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-thera-pink h-2.5 rounded-full" 
                      style={{ width: `${(recordingSeconds / 10) * 100}%` }}
                    ></div>
                  </div>
                  <Button 
                    variant="secondary"
                    className="w-full bg-thera-pink text-white"
                    onClick={recordVoiceSample}
                  >
                    Recording... {recordingSeconds}s
                  </Button>
                </div>
              ) : (
                <Button 
                  variant={voiceSampleRecorded ? "outline" : "secondary"}
                  className="w-full"
                  onClick={recordVoiceSample}
                  disabled={microphonePermission !== "granted"}
                >
                  {voiceSampleRecorded ? "Record New Sample" : "Record Voice Sample"}
                </Button>
              )}
              
              <p className="text-xs text-gray-500">
                Say a few sentences so THERA can learn your voice
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Continue Button */}
        <Button 
          className="w-full bg-thera-purple hover:bg-thera-purple/80"
          size="lg"
          onClick={handleSaveProfile}
          disabled={!isSetupComplete}
        >
          {isSetupComplete ? "Continue to THERA" : "Complete Required Fields"}
        </Button>
        
        {!isSetupComplete && (
          <p className="text-xs text-center text-gray-500 mt-2">
            Please complete your profile and grant necessary permissions
          </p>
        )}
      </div>
    </div>
  );
};

export default Setup;
