import React, { useEffect, useState, useRef } from 'react';
import { useVoice } from '@/contexts/VoiceContext';
import { useEmotion } from '@/contexts/EmotionContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'thera';
  timestamp: Date;
}

interface AutoConversationProps {
  onMessageReceived?: (message: Message) => void;
  className?: string;
}

const AutoConversation = ({ onMessageReceived, className }: AutoConversationProps) => {
  const { voiceState, startListening, stopListening, clearTranscript, speak, stopSpeaking } = useVoice();
  const { emotionState, isTracking } = useEmotion();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm THERA, your AI therapist. How are you feeling today?",
      sender: 'thera',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isInConversation, setIsInConversation] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);

  const sampleResponses = [
    "How does that make you feel?",
    "Tell me more about that experience.",
    "That sounds challenging. How have you been coping with it?",
    "I'm here to listen. What's been on your mind lately?",
    "Remember that your feelings are valid, no matter what they are.",
    "Have you tried any relaxation techniques when you feel this way?",
    "It's completely normal to feel that way. Many people have similar experiences.",
    "What do you think would help you in this situation?",
    "Thank you for sharing that with me. It takes courage to open up.",
    "Let's explore this a bit more. When did you first notice these feelings?"
  ];

  const getEmotionBasedResponse = (emotion: string) => {
    switch(emotion) {
      case 'sad':
        return "I notice you're feeling down. Let's talk about what's troubling you. Remember, it's okay to feel this way.";
      case 'angry':
        return "I can sense that you're frustrated. Let's take a deep breath together and explore what's causing these strong feelings.";
      case 'anxious':
        return "You seem anxious. We can work through this together. Would you like to try a quick breathing exercise?";
      case 'happy':
        return "Your positive energy is wonderful! What's bringing you joy right now?";
      case 'surprised':
        return "Something seems to have caught you off guard. Would you like to talk about what surprised you?";
      case 'calm':
        return "You appear to be in a peaceful state. This is a good time to reflect on your thoughts.";
      default:
        return "How are you feeling right now? Would you like to explore those feelings together?";
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      
      setTimeout(() => {
        if (isAudioEnabled && messages.length > 0) {
          speak(messages[0].content);
        }
        setIsInConversation(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (voiceState.transcript && !voiceState.isListening) {
      handleSendMessage(voiceState.transcript);
      clearTranscript();
    }
  }, [voiceState.isListening, voiceState.transcript]);

  const handleSendMessage = (content: string = inputMessage) => {
    if (!content.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    if (onMessageReceived) {
      onMessageReceived(newUserMessage);
    }

    setTimeout(() => {
      const emotionBasedResponse = getEmotionBasedResponse(emotionState.currentEmotion);
      
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: emotionBasedResponse,
        sender: 'thera',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMessage]);
      
      if (onMessageReceived) {
        onMessageReceived(newAiMessage);
      }
      
      if (isAudioEnabled) {
        speak(emotionBasedResponse);
      } else {
        setTimeout(() => {
          if (isInConversation) {
            startListening();
          }
        }, 1000);
      }
    }, 1000);
  };

  const toggleAudio = () => {
    if (isAudioEnabled) {
      stopSpeaking();
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleConversation = () => {
    if (isInConversation) {
      stopListening();
      stopSpeaking();
      setIsInConversation(false);
    } else {
      setIsInConversation(true);
      setTimeout(() => startListening(), 500);
    }
  };

  return (
    <Card className={`glass-card ${className}`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Therapy Conversation</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant={isInConversation ? "outline" : "default"}
              className={isInConversation ? "bg-white/80" : "bg-thera-purple"}
              onClick={toggleConversation}
            >
              {isInConversation ? "Pause Conversation" : "Start Conversation"}
            </Button>
          </div>
        </div>

        <div className="bg-white/60 rounded-md h-64 overflow-y-auto p-4">
          <div className="flex flex-col space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user' 
                      ? 'bg-thera-purple text-white rounded-tr-none' 
                      : 'bg-white rounded-tl-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white/60 rounded-md p-3 min-h-16">
          {voiceState.isListening && (
            <div className="flex gap-2 items-center text-thera-purple">
              <span className="inline-block w-2 h-2 bg-thera-pink rounded-full animate-pulse"></span>
              <span>Listening...</span>
            </div>
          )}
          
          {voiceState.isSpeaking && (
            <div className="flex gap-2 items-center text-thera-purple">
              <span>THERA is speaking...</span>
            </div>
          )}
          
          {voiceState.transcript && (
            <div className="text-gray-700">
              <p><strong>You said:</strong> {voiceState.transcript}</p>
            </div>
          )}
          
          {voiceState.partialTranscript && (
            <div className="text-gray-400 italic">
              {voiceState.partialTranscript}
            </div>
          )}
          
          {!voiceState.isListening && !voiceState.isSpeaking && !voiceState.transcript && !voiceState.partialTranscript && (
            <div className="text-gray-500 text-center py-2">
              {isInConversation 
                ? "Waiting for you to speak or THERA to respond..." 
                : "Conversation paused. Press 'Start Conversation' to begin."
              }
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Or type your message here..."
            className="thera-input flex-grow resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            className="thera-button self-end"
            disabled={!inputMessage.trim()}
            onClick={() => handleSendMessage()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AutoConversation;
