import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Globe, Accessibility, ChevronRight, ChevronLeft, LockKeyholeOpen, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { CharacterData } from "../../App";

// Import assets
import forestImg from "../assets/forest.png";
import oceanImg from "../assets/ocean.png";
import rocketImg from "../assets/rocket.png";
import treasureImg from "../assets/treasure.png";
import logoWideImg from "../assets/StorySproutWideTransparent.png";
import logoImg from "../assets/StorySproutLogoTransparent.png";
import logoMainImg from "../assets/StorySproutTransparent.png";
import castleImg from "../assets/castle.png";
import ufoImg from "../assets/ufo.png";
import magnifyImg from "../assets/magnify.png";
import comedyImg from "../assets/comedy.png";
import actionImg from "../assets/action.png";
import sliceImg from "../assets/slice.png";
import questionImg from "../assets/question.png";

interface HomeScreenProps {
  onNavigate: (screen: "home" | "character" | "story") => void;
  storyProgress: {
    storiesCompleted: number;
    pathsUnlocked: string[];
    currentLevel: number;
    achievements: string[];
  };
  character: CharacterData;
}

export function HomeScreen({ onNavigate, storyProgress, character }: HomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const storyPaths = [
    { 
      id: 'forest-adventure', 
      title: 'Enchanted Forest', 
      icon: forestImg, 
      description: 'Journey through magical woodlands filled with talking animals and mysterious creatures. Discover ancient secrets hidden within the heart of an enchanted realm.',
      unlocked: true 
    },
    { 
      id: 'ocean-depths', 
      title: 'Ocean Depths', 
      icon: oceanImg, 
      description: 'Dive beneath the waves to explore underwater kingdoms and coral cities. Meet mermaids, dolphins, and sea creatures on an aquatic adventure.',
      unlocked: storyProgress.storiesCompleted >= 1 
    },
    { 
      id: 'space-journey', 
      title: 'Space Journey', 
      icon: rocketImg, 
      description: 'Blast off to distant planets and explore alien worlds among the stars. Navigate asteroid fields and make contact with friendly extraterrestrial beings.',
      unlocked: storyProgress.storiesCompleted >= 2 
    },
    { 
      id: 'pirate-adventure', 
      title: 'Pirate Voyage', 
      icon: treasureImg, 
      description: 'Set sail on the high seas in search of legendary buried treasure. Navigate dangerous waters and outwit rival pirates on your quest for gold.',
      unlocked: storyProgress.storiesCompleted >= 3 
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % storyPaths.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + storyPaths.length) % storyPaths.length);
  };

  const handleStoryNavigation = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate('story');
  };
  
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={logoWideImg} 
                alt="StorySprout" 
                className="h-8"
              />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-gray-600">{character.name ? `${character.name}'s` : "Your"} Reading Level: {storyProgress.currentLevel}</span>
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
                src={logoImg}
                alt="StorySprout" 
                className="h-20"
              />
              <img 
                src={logoMainImg} 
                alt="StorySprout" 
                className="h-20"
              />
              <Badge className="bg-white text-gray-800 px-4 py-2">
                Inclusive & Educational AI Storytelling
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Every Child is the <span className="text-[#749fff]">Hero</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                The world's first inclusive, adaptive AI storytelling site that makes every child the hero — 
                reflecting their unique identity, abilities, and imagination.
              </p>
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
                  className="bg-white/50 text-grey border-white/30 hover:bg-white/30 px-8 py-4 rounded-2xl"
                >
                  Continue Adventure
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            
          
          </div>
        </div>
      </section>
      

      {/* Key Features */}
      <section className="max-w-7xl mx-auto px-6 py-2">
        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
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
        </section>

      {/* Story Paths Section */}
      {storyProgress.pathsUnlocked.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose From Pre-Generated Stories</h2>
            <p className="text-white/80">Choose your next magical journey</p>
          </div>
          
          {/* Slideshow Container */}
          <div className="relative overflow-hidden">
            {/* Slides Container */}
            <div className="rounded-2xl overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {storyPaths.map((path) => (
                  <div key={path.id} className="w-full flex-shrink-0 px-4">
                    <Card 
                      className={`p-4 md:p-6 rounded-2xl transition-all cursor-pointer mx-auto relative ${
                        path.unlocked 
                          ? 'bg-[white]/80 backdrop-blur hover:scale-105 shadow-lg' 
                          : 'bg-[white]/80 backdrop-blur opacity-60'
                      }`}
                      onClick={() => path.unlocked && handleStoryNavigation()}
                    >
                      {/* Navigation Arrows Inside Card */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevSlide();
                        }}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-200/80 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-gray-300/80 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextSlide();
                        }}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-200/80 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-gray-300/80 transition-all"
                      >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>

                      <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
                        <div className="flex justify-center items-center flex-shrink-0 order-1 md:order-none">
                          <img 
                            src={path.icon} 
                            alt={path.title}
                            className="w-24 h-24 md:w-30 md:h-30 object-contain"
                          />
                        </div>
                        <div className="flex-1 text-center md:text-left px-2 md:px-0 order-2 md:order-none">
                          <h3 className="font-bold text-gray-800 mb-2 text-xl md:text-2xl">{path.title}</h3>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{path.description}</p>
                          <div className="flex justify-center md:justify-start">
                            {path.unlocked ? (
                              <Badge className="bg-[#cadbf1] text-[#749fff] text-md px-4 py-2 flex items-center w-fit">
                                <LockKeyholeOpen className="w-4 h-4 mr-2" />
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-md px-4 py-2 flex items-center w-fit">
                                <LockKeyhole className="w-4 h-4 mr-2" />
                                Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {storyPaths.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Genre Paths Section */}
      {storyProgress.pathsUnlocked.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Or Build One From Scratch</h2>
            <p className="text-white/80">Choose a genre below</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'fantasy', title: 'Fantasy', icon: castleImg, unlocked: true },
              { id: 'sci-fi', title: 'Sci-Fi', icon: ufoImg, unlocked: storyProgress.storiesCompleted >= 2  },
              { id: 'mystery', title: 'Mystery', icon: magnifyImg, unlocked: storyProgress.storiesCompleted >= 3  },
              { id: 'comedy', title: 'Comedy', icon: comedyImg, unlocked: storyProgress.storiesCompleted >= 4  },
              { id: 'action', title: 'Action', icon: actionImg, unlocked: storyProgress.storiesCompleted >= 5  },
              { id: 'slice-of-life', title: 'Slice of Life', icon: sliceImg, unlocked: storyProgress.storiesCompleted >= 6  },
              { id: 'random', title: 'Random', icon: questionImg, unlocked: storyProgress.storiesCompleted >= 7  }
            ].map((path) => (
              <Card 
                key={path.id}
                className={`p-6 rounded-2xl text-center transition-all cursor-pointer ${
                  path.unlocked 
                    ? 'bg-white/95 backdrop-blur hover:scale-105 shadow-lg' 
                    : 'bg-white/20 backdrop-blur opacity-60'
                }`}
                onClick={() => path.unlocked && handleStoryNavigation()}
              >
                <div className="flex justify-center items-center mb-3 h-16">
                  <img 
                    src={path.icon} 
                    alt={path.title}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{path.title}</h3>
                {path.unlocked ? (
                  <Badge className="bg-[#cadbf1] text-[#749fff] flex items-center w-fit mx-auto">
                    <LockKeyholeOpen className="w-4 h-4 mr-2" />
                    Available
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center w-fit mx-auto">
                    <LockKeyhole className="w-4 h-4 mr-2" />
                    Locked
                  </Badge>
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
                src={logoImg} 
                alt="StorySprout" 
                className="h-8"
              />
            </div>
            <p className="text-white/70 text-sm">
              Celebrating every child's unique story, one educational adventure at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}