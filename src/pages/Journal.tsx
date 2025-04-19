
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Edit, Sparkles, Bookmark, Plus, Search, Clock } from "lucide-react";

// Sample journal entries
const sampleEntries = [
  {
    id: '1',
    title: 'Making Progress',
    content: 'Today was a good day. I practiced mindfulness for 10 minutes and felt more grounded afterward.',
    date: 'July 21, 2024',
    tags: ['mindfulness', 'progress'],
    aiGenerated: true
  },
  {
    id: '2',
    title: 'Challenging Thoughts',
    content: 'I caught myself engaging in negative self-talk today. Using the techniques we discussed, I was able to reframe my thoughts more positively.',
    date: 'July 19, 2024',
    tags: ['cbt', 'thoughts'],
    aiGenerated: false
  },
  {
    id: '3',
    title: 'Therapy Session Review',
    content: 'We focused on my social anxiety today. The exercises helped me understand my triggers better.',
    date: 'July 15, 2024',
    tags: ['anxiety', 'therapy'],
    aiGenerated: true
  }
];

const Journal = () => {
  const [entries] = useState(sampleEntries);
  const [isCreating, setIsCreating] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  
  const handleCreate = () => {
    // In a real app, we would save this to a database
    setIsCreating(false);
    setNewEntry({ title: '', content: '' });
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
          <h1 className="text-xl font-bold text-thera-purple">Therapy Journal</h1>
        </div>
        <Button variant="outline" size="icon" className="rounded-full">
          <Calendar className="h-5 w-5" />
        </Button>
      </header>
      
      {/* Main Content */}
      <div className="flex-grow p-4 flex flex-col">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="thera-input pl-10"
            placeholder="Search journal entries..."
          />
        </div>
        
        {isCreating ? (
          <Card className="glass-card p-6 mb-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">New Journal Entry</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input 
                placeholder="Title"
                className="thera-input"
                value={newEntry.title}
                onChange={e => setNewEntry({...newEntry, title: e.target.value})}
              />
              
              <Textarea 
                placeholder="What's on your mind today?"
                className="thera-input min-h-[200px]"
                value={newEntry.content}
                onChange={e => setNewEntry({...newEntry, content: e.target.value})}
              />
              
              <div className="flex justify-between">
                <Button variant="outline" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Suggestions
                </Button>
                
                <Button className="thera-button" onClick={handleCreate}>
                  Save Entry
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Button 
            className="thera-button mb-4 flex items-center justify-center gap-2 w-full"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-5 w-5" />
            Create New Entry
          </Button>
        )}
        
        {/* Journal Entries */}
        <div className="space-y-4">
          {entries.map(entry => (
            <Card key={entry.id} className="glass-card p-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{entry.title}</h3>
                {entry.aiGenerated && (
                  <span className="text-xs bg-thera-purple/10 text-thera-purple px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> AI Generated
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {entry.content}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" /> 
                  {entry.date}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="p-4">
        <Card className="glass-card p-2 flex items-center justify-around">
          <Link to="/mood">
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xs">Mood</span>
            </Button>
          </Link>
          <Link to="/therapy">
            <Button variant="ghost" className="flex flex-col items-center gap-1">
              <ArrowRight className="h-5 w-5" />
              <span className="text-xs">Therapy</span>
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Journal;
