
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

// Animated background component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-br from-thera-lightpurple via-thera-blue to-thera-pink opacity-30 blur-3xl animate-float"></div>
      <div className="absolute top-[40%] left-[60%] w-80 h-80 rounded-full bg-thera-purple/20 blur-3xl"></div>
      <div className="absolute top-[60%] left-[30%] w-60 h-60 rounded-full bg-thera-pink/20 blur-3xl animate-pulse-slow"></div>
    </div>
  );
};

// Logo component
const TherapyLogo = () => {
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-32 h-32 bg-gradient-to-br from-thera-purple to-thera-blue rounded-full flex items-center justify-center shadow-lg mb-4">
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-thera-purple/90 to-thera-blue/90 rounded-full flex items-center justify-center text-white font-bold text-4xl">
            T
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-thera-purple to-blue-500">
        THERA AI
      </h1>
      <p className="text-gray-600 mt-2 text-center">Your Personal AI Psychotherapist</p>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="glass-card p-4 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-thera-purple/10 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const Index = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulated loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative flex flex-col">
      <AnimatedBackground />
      
      <main className="relative z-10 flex-grow flex flex-col">
        {/* Header */}
        <header className="p-4 flex justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          >
            {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </header>
        
        {/* Main Content */}
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <div 
            className={`transition-all duration-700 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <TherapyLogo />
          </div>
          
          <div 
            className={`mt-10 max-w-md w-full transition-all duration-700 delay-300 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Link to="/setup">
              <Button className="thera-button w-full mb-4 text-lg">
                Start Therapy Session
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <p className="text-center text-sm text-gray-600 mb-10">
              Your safe space for emotional support and growth
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard 
                icon={<span className="text-xl">🧠</span>}
                title="AI Therapy"
                description="Personalized therapeutic conversations"
              />
              <FeatureCard 
                icon={<span className="text-xl">📊</span>}
                title="Mood Tracking"
                description="Monitor your emotional well-being"
              />
              <FeatureCard 
                icon={<span className="text-xl">📓</span>}
                title="Journal"
                description="Document your thoughts and progress"
              />
              <FeatureCard 
                icon={<span className="text-xl">🧘</span>}
                title="Self-Care"
                description="Guided exercises and activities"
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10 p-4 text-center text-xs text-gray-500">
        <p>THERA AI © 2024 - Your emotional well-being companion</p>
      </footer>
    </div>
  );
};

export default Index;
