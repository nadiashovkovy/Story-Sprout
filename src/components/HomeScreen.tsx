import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Users, Globe, Accessibility, Trophy, ChevronRight } from "lucide-react";

interface HomeScreenProps {
  onNavigate: (screen: "home" | "character" | "story") => void;
  storyProgress: {
    storiesCompleted: number;
    pathsUnlocked: string[];
    currentLevel: number;
    achievements: string[];
  };
}

export function HomeScreen({ onNavigate, storyProgress }: HomeScreenProps) {
  const progressPercentage = (storyProgress.storiesCompleted % 3) * 33.33;
  
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/src/assets/StorySproutWideTransparent.png" 
                alt="StorySprout" 
                className="h-8"
              />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-gray-600">Level {storyProgress.currentLevel}</span>
              <Badge variant="secondary" className="bg-[#cadbf1] text-[#749fff]">
                {storyProgress.storiesCompleted} Stories Completed
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <img 
                src="/src/assets/StorySproutTransparent.png" 
                alt="StorySprout" 
                className="h-20"
              />
              <Badge className="bg-white text-gray-800 px-4 py-2">
                World's First Inclusive AI Storytelling
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Every Child is the <span className="text-[#749fff]">Hero</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                The world's first inclusive, adaptive AI storytelling app that makes every child the hero — 
                reflecting their unique identity, abilities, and imagination.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/95 backdrop-blur p-6 rounded-2xl border-0">
                <Users className="w-8 h-8 text-[#749fff] mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Cultural Celebration</h3>
                <p className="text-sm text-gray-600">Stories that honor diverse backgrounds and traditions</p>
              </Card>
              
              <Card className="bg-white/95 backdrop-blur p-6 rounded-2xl border-0">
                <Accessibility className="w-8 h-8 text-[#ffd6a5] mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Disability Representation</h3>
                <p className="text-sm text-gray-600">Heroes with wheelchairs, hearing aids, and more</p>
              </Card>
              
              <Card className="bg-white/95 backdrop-blur p-6 rounded-2xl border-0">
                <Globe className="w-8 h-8 text-[#cadbf1] mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Interactive Adventures</h3>
                <p className="text-sm text-gray-600">Make choices that change your story's path</p>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => onNavigate('character')}
                size="lg"
                className="bg-white text-[#749fff] hover:bg-white/90 px-8 py-4 rounded-2xl shadow-lg"
              >
                Create Your Hero
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              
              {storyProgress.storiesCompleted > 0 && (
                <Button
                  onClick={() => onNavigate('story')}
                  variant="outline"
                  size="lg"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-8 py-4 rounded-2xl"
                >
                  Continue Adventure
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            
            
            {/* Floating Progress Card */}
            {storyProgress.storiesCompleted > 0 && (
              <Card className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-4">
                  <Trophy className="w-8 h-8 text-[#ffd6a5]" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Reading Progress</h4>
                    <div className="flex items-center space-x-2 mt-2">
                      <Progress value={progressPercentage} className="w-24" />
                      <span className="text-sm text-gray-600">Level {storyProgress.currentLevel}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Story Paths Section */}
      {storyProgress.pathsUnlocked.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Your Unlocked Adventures</h2>
            <p className="text-white/80">Choose your next magical journey</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'forest-adventure', title: 'Enchanted Forest', icon: '🌲', unlocked: true },
              { id: 'ocean-depths', title: 'Ocean Depths', icon: '🌊', unlocked: storyProgress.storiesCompleted >= 3 },
              { id: 'space-journey', title: 'Space Journey', icon: '🚀', unlocked: storyProgress.storiesCompleted >= 6 },
              { id: 'time-travel', title: 'Time Travel', icon: '⏰', unlocked: storyProgress.storiesCompleted >= 9 }
            ].map((path) => (
              <Card 
                key={path.id}
                className={`p-6 rounded-2xl text-center transition-all cursor-pointer ${
                  path.unlocked 
                    ? 'bg-white/95 backdrop-blur hover:scale-105 shadow-lg' 
                    : 'bg-white/20 backdrop-blur opacity-60'
                }`}
                onClick={() => path.unlocked && onNavigate('story')}
              >
                <div className="text-4xl mb-3">{path.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{path.title}</h3>
                {path.unlocked ? (
                  <Badge className="bg-[#cadbf1] text-[#749fff]">Available</Badge>
                ) : (
                  <Badge variant="secondary">Locked</Badge>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/src/assets/StorySproutLogoTransparent.png" 
                alt="StorySprout" 
                className="h-8"
              />
            </div>
            <p className="text-white/70 text-sm">
              Celebrating every child's unique story, one adventure at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}