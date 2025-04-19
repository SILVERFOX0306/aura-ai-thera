
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, Smile, Mic, MicOff, 
  Volume2, VolumeX, Image, 
  Settings, MessageSquare, Shield, Music, Brain
} from "lucide-react";
import { Link } from "react-router-dom";
import TheraIcon from "@/components/TheraIcon";
import EmotionBubble from "@/components/EmotionBubble";
import TherapyTip from "@/components/TherapyTip";
import BreathingExercise from "@/components/BreathingExercise";
import FacialEmotionDetector from "@/components/FacialEmotionDetector";

// Avatar component with emotion awareness
const TheraAvatar = ({ emotion = 'neutral' }: { emotion?: string }) => {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-thera-pink/50 to-thera-blue/30 rounded-xl flex items-center justify-center relative">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full bg-thera-purple/20 animate-pulse-slow"></div>
        <div className="absolute inset-2 rounded-full bg-thera-purple/30"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-thera-purple to-blue-400 flex items-center justify-center text-white text-xl font-bold">
          THERA
        </div>
      </div>
      
      {/* Emotion indicator */}
      <div className="absolute top-4 right-4">
        <EmotionBubble 
          emotion={emotion as any} 
          size="md" 
          intensity={7}
        />
      </div>
    </div>
  );
};

// Sample responses for the therapy chat
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

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'thera';
  timestamp: Date;
}

const Therapy = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm THERA, your AI therapist. How are you feeling today?",
      sender: 'thera',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");

    // Simulate AI response (with delay)
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'thera',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMessage]);
    }, 1000);
  };

  const toggleMicrophone = () => {
    setIsListening(!isListening);
    // In a real app, we would start/stop speech recognition here
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // In a real app, we would mute/unmute audio here
  };

  return (
    <div className="min-h-screen thera-gradient flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-thera-purple">THERA AI</Link>
        <div className="flex gap-2">
          <Link to="/mood">
            <Button variant="outline" size="icon" className="rounded-full">
              <Smile className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/journal">
            <Button variant="outline" size="icon" className="rounded-full">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-grow p-4 flex flex-col">
        {/* Avatar area */}
        <Card className="glass-card overflow-hidden mb-4">
          <TheraAvatar emotion="neutral" />
        </Card>
        
        {/* Chat messages */}
        <Card className="glass-card flex-grow p-4 mb-4 overflow-y-auto">
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
        </Card>
        
        {/* Input area */}
        <div className="flex gap-2 items-end">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
          >
            <Image className="h-5 w-5" />
          </Button>
          
          <Textarea
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="thera-input flex-grow resize-none"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          <Button 
            variant="outline" 
            size="icon" 
            className={`rounded-full ${isListening ? 'bg-thera-pink' : ''}`}
            onClick={toggleMicrophone}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button 
            className="thera-button"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Therapy;
