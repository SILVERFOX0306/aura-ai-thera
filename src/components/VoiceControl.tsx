
import React, { useEffect, useState } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface VoiceControlProps {
  minimized?: boolean;
  onTranscriptUpdate?: (transcript: string) => void;
}

const VoiceControl = ({
  minimized = false,
  onTranscriptUpdate
}: VoiceControlProps) => {
  const { voiceState, startListening, stopListening, clearTranscript } = useVoice();
  const [lastTranscript, setLastTranscript] = useState("");

  useEffect(() => {
    // If transcript has updated and contains a complete sentence
    if (voiceState.transcript && voiceState.transcript !== lastTranscript) {
      setLastTranscript(voiceState.transcript);
      
      // If any external component needs the transcript
      if (onTranscriptUpdate) {
        onTranscriptUpdate(voiceState.transcript);
      }
    }
  }, [voiceState.transcript]);

  const toggleListening = () => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      clearTranscript();
      startListening();
    }
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${voiceState.isListening ? 'bg-thera-pink text-white' : ''}`}
          onClick={toggleListening}
        >
          {voiceState.isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
      </div>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Voice Input</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${voiceState.isListening ? 'bg-thera-pink text-white' : ''}`}
              onClick={toggleListening}
            >
              {voiceState.isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        <div className="min-h-24 max-h-36 overflow-y-auto p-3 bg-white/60 rounded-md text-sm">
          {voiceState.isListening && (
            <div className="flex gap-2 items-center text-thera-purple mb-2">
              <span className="inline-block w-2 h-2 bg-thera-pink rounded-full animate-pulse"></span>
              <span>Listening...</span>
            </div>
          )}
          
          {voiceState.transcript && (
            <div className="mb-2">
              <p>{voiceState.transcript}</p>
            </div>
          )}
          
          {voiceState.partialTranscript && (
            <div className="text-gray-400 italic">
              {voiceState.partialTranscript}
            </div>
          )}
          
          {!voiceState.isListening && !voiceState.transcript && (
            <div className="text-gray-400 text-center py-4">
              Click the microphone to start speaking
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VoiceControl;
