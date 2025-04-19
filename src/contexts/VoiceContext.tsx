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

// Define the SpeechRecognition interface
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionClass {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionError) => void) | null;
  onend: (() => void) | null;
}

// Get the correct SpeechRecognition constructor
const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                           (window as any).webkitSpeechRecognition as SpeechRecognitionClass;
const hasSpeechRecognition = !!SpeechRecognitionAPI;

export const VoiceProvider = ({ children }: { children: ReactNode }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(defaultVoiceState);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const [autoRestartListening, setAutoRestartListening] = useState(true);
  const [silenceTimeout, setSilenceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (hasSpeechRecognition) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
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
        
        // Reset silence detection on speech
        if (silenceTimeout) {
          clearTimeout(silenceTimeout);
        }
        
        // Set new silence detection timer
        setSilenceTimeout(setTimeout(() => {
          if (voiceState.isListening) {
            console.log("Silence detected, stopping listening");
            stopListening();
            // Process the complete transcript here
            if (finalTranscript.trim() || interimTranscript.trim()) {
              console.log("Processing transcript:", finalTranscript || interimTranscript);
              // The transcript processing will be handled by the parent component
            }
          }
        }, 2000)); // 2 second silence detection
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error", event.error);
        setVoiceState(prev => ({ ...prev, isListening: false }));
      };
      
      recognitionInstance.onend = () => {
        if (voiceState.isListening && autoRestartListening) {
          // If we still want to listen, restart recognition
          try {
            recognitionInstance.start();
          } catch (e) {
            console.log("Could not restart recognition: ", e);
            setVoiceState(prev => ({ ...prev, isListening: false }));
          }
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
      
      if (silenceTimeout) {
        clearTimeout(silenceTimeout);
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
      
      if (silenceTimeout) {
        clearTimeout(silenceTimeout);
        setSilenceTimeout(null);
      }
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
      
      // Auto start listening after speaking finishes
      if (autoRestartListening) {
        setTimeout(() => {
          clearTranscript();
          startListening();
        }, 300); // Short delay to avoid cutting off the last word
      }
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
