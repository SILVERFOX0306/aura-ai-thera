
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, BarChart, Smile, Meh, Frown, ArrowRight } from "lucide-react";

// Sample mood data for the chart
const sampleMoodData = [
  { date: '07/15', mood: 4 },
  { date: '07/16', mood: 3 },
  { date: '07/17', mood: 5 },
  { date: '07/18', mood: 2 },
  { date: '07/19', mood: 4 },
  { date: '07/20', mood: 3 },
  { date: '07/21', mood: 5 },
];

const MoodChart = () => {
  return (
    <div className="h-60 w-full flex items-end justify-between gap-1">
      {sampleMoodData.map((item, index) => (
        <div key={index} className="flex flex-col items-center justify-center gap-2">
          <div 
            className="w-10 rounded-t-lg transition-all duration-300" 
            style={{ 
              height: `${item.mood * 20}%`,
              backgroundColor: item.mood > 3 
                ? 'rgba(155, 135, 245, 0.8)' 
                : item.mood === 3 
                ? 'rgba(155, 135, 245, 0.5)' 
                : 'rgba(255, 222, 226, 0.8)'
            }}
          />
          <span className="text-xs text-gray-500">{item.date}</span>
        </div>
      ))}
    </div>
  );
};

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const submitMood = () => {
    if (currentMood !== null) {
      // In a real app, we would save this to a database
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    }
  };
  
  return (
    <div className="min-h-screen thera-gradient flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/therapy">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-thera-purple">Mood Tracker</h1>
        </div>
        <Button variant="outline" size="icon" className="rounded-full">
          <Calendar className="h-5 w-5" />
        </Button>
      </header>
      
      {/* Main Content */}
      <div className="flex-grow p-4 flex flex-col">
        {/* Mood Chart */}
        <Card className="glass-card p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Your Mood Timeline</h2>
            <Button variant="ghost" size="sm">
              <BarChart className="h-4 w-4 mr-1" />
              Weekly
            </Button>
          </div>
          <MoodChart />
        </Card>
        
        {/* Today's Mood */}
        <Card className="glass-card p-6">
          <h2 className="text-lg font-medium mb-4">How are you feeling today?</h2>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[1, 2, 3, 4, 5].map(mood => (
              <Button
                key={mood}
                variant="outline"
                className={`aspect-square p-4 flex flex-col items-center justify-center ${
                  currentMood === mood ? 'ring-2 ring-thera-purple' : ''
                }`}
                onClick={() => setCurrentMood(mood)}
              >
                {mood <= 2 && <Frown className={`h-8 w-8 ${mood === currentMood ? 'text-thera-pink' : ''}`} />}
                {mood === 3 && <Meh className={`h-8 w-8 ${mood === currentMood ? 'text-thera-purple' : ''}`} />}
                {mood >= 4 && <Smile className={`h-8 w-8 ${mood === currentMood ? 'text-thera-purple' : ''}`} />}
                <span className="text-sm mt-2">{mood}</span>
              </Button>
            ))}
          </div>
          
          <Button className="thera-button w-full" onClick={submitMood}>
            Save Today's Mood
          </Button>
          
          {showFeedback && (
            <div className="mt-4 p-3 bg-thera-purple/10 rounded-lg text-center text-thera-purple animate-fade-in">
              Mood recorded successfully! 
            </div>
          )}
        </Card>
      </div>
      
      {/* Navigation */}
      <div className="p-4">
        <Card className="glass-card p-2 flex items-center justify-around">
          <Link to="/therapy">
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xs">Therapy</span>
            </Button>
          </Link>
          <Link to="/journal">
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <ArrowRight className="h-5 w-5" />
              <span className="text-xs">Journal</span>
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default MoodTracker;
