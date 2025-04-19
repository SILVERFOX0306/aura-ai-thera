
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface VoiceState {
  isListening: boolean;
  transcript: string;
  partialTranscript: string;
  isSpeaking: boolean;
  volume: number; // 0-1
}

interface VoiceContextType {
  voiceState: VoiceState;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
}

const defaultVoiceState: VoiceState = {
  isListening: false,
  transcript: "",
  partialTranscript: "",
  isSpeaking: false,
  volume: 1
};

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

// Speech recognition interface
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const hasSpeechRecognition = !!SpeechRecognition;

export const VoiceProvider = ({ children }: { children: ReactNode }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(defaultVoiceState);
  const [recognition, setRecognition] = useState<any>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if (hasSpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";
      
      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = voiceState.transcript;
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += ' ' + transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setVoiceState(prev => ({
          ...prev,
          transcript: finalTranscript.trim(),
          partialTranscript: interimTranscript
        }));
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };
      
      recognitionInstance.onend = () => {
        if (voiceState.isListening) {
          // If we still want to listen, restart recognition
          recognitionInstance.start();
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn("Speech recognition not supported in this browser");
    }
    
    return () => {
      if (recognition) {
        recognition.onend = null;
        recognition.onresult = null;
        recognition.onerror = null;
        if (voiceState.isListening) {
          recognition.stop();
        }
      }
    };
  }, []);
  
  const startListening = () => {
    if (recognition && !voiceState.isListening) {
      try {
        recognition.start();
        setVoiceState(prev => ({ ...prev, isListening: true }));
        console.log("Started listening");
      } catch (error) {
        console.error("Error starting speech recognition", error);
      }
    }
  };
  
  const stopListening = () => {
    if (recognition && voiceState.isListening) {
      recognition.stop();
      setVoiceState(prev => ({ ...prev, isListening: false }));
      console.log("Stopped listening");
    }
  };
  
  const clearTranscript = () => {
    setVoiceState(prev => ({ ...prev, transcript: "", partialTranscript: "" }));
  };
  
  // Speech synthesis for speaking responses
  const speak = async (text: string) => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      return;
    }
    
    // Cancel any ongoing speech
    stopSpeaking();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = voiceState.volume;
    utterance.rate = 1;
    utterance.pitch = 1;
    
    // Find a good voice (prefer female voices for therapy)
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Google UK English Female')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    setSpeechSynthesis(utterance);
    setVoiceState(prev => ({ ...prev, isSpeaking: true }));
    
    utterance.onend = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
      setSpeechSynthesis(null);
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    if (voiceState.isSpeaking) {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    }
    
    setSpeechSynthesis(null);
  };
  
  return (
    <VoiceContext.Provider
      value={{
        voiceState,
        startListening,
        stopListening,
        clearTranscript,
        speak,
        stopSpeaking
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
};
