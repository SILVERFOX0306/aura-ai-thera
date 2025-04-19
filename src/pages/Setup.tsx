
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const Setup = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    age: "",
    gender: "",
    preferredName: "",
    hobbies: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormState(prev => ({ ...prev, gender: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save this data
    console.log("Profile data:", formState);
    // Navigate to therapy screen
    navigate("/therapy");
  };

  return (
    <div className="min-h-screen thera-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-thera-purple">Profile Setup</h1>
        <p className="text-center mb-6 text-gray-600">Let's get to know you better</p>

        <Card className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name"
                name="name"
                className="thera-input" 
                placeholder="Enter your full name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Your Age</Label>
              <Input 
                id="age"
                name="age"
                type="number"
                className="thera-input" 
                placeholder="Enter your age"
                value={formState.age}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={handleSelectChange} value={formState.gender}>
                <SelectTrigger className="thera-input">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredName">What should we call you?</Label>
              <Input 
                id="preferredName"
                name="preferredName"
                className="thera-input" 
                placeholder="Your preferred name"
                value={formState.preferredName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies">Your Hobbies</Label>
              <Input 
                id="hobbies"
                name="hobbies"
                className="thera-input" 
                placeholder="What do you enjoy doing?"
                value={formState.hobbies}
                onChange={handleInputChange}
              />
            </div>

            <Button type="submit" className="thera-button w-full mt-6">
              Continue
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Setup;
