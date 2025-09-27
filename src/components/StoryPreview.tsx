import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Heart, Share2, Volume2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface StoryPreviewProps {
  onNavigate: (screen: string) => void;
  character: {
    name: string;
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    accessory: string;
  };
}

export function StoryPreview({ onNavigate, character }: StoryPreviewProps) {
  const generateStoryText = () => {
    const accessories = {
      'glasses': 'with sparkling glasses',
      'hearing-aid': 'with their special hearing aids that help them hear the magic',
      'wheelchair': 'in their amazing wheelchair that could go anywhere',
      'hat': 'wearing their favorite hat',
      'none': ''
    };

    const accessoryText = character.accessory !== 'none' ? accessories[character.accessory as keyof typeof accessories] : '';

    return `Once upon a time, in a magical kingdom filled with wonder, there lived a brave hero named ${character.name} ${accessoryText}. 

${character.name} had a special gift - the ability to see the magic that others couldn't. One sunny morning, while exploring the enchanted forest, ${character.name} discovered a glowing crystal that needed help finding its way home.

"I'll help you!" said ${character.name} with a kind smile. The crystal sparkled with joy, knowing it had found a true friend.

Together, they embarked on an amazing adventure through rainbow valleys and singing mountains, where ${character.name} learned that being different wasn't just okay - it was what made them the perfect hero for this magical quest.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD6A5] to-[#A5D8FF] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('character')}
          className="text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl text-white">{character.name}'s Adventure</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 rounded-full"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Story Content */}
      <div className="space-y-6">
        {/* Story Illustration */}
        <Card className="rounded-2xl overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1685478237148-aaf613b2e8ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtYWdpY2FsJTIwc3Rvcnlib29rJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1ODk5Nzg5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Magical storybook illustration"
            className="w-full h-48 object-cover"
          />
          {/* Character representation overlay */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD6A5] to-[#A5D8FF] flex items-center justify-center">
              <span className="text-xs text-white font-semibold">
                {character.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </Card>

        {/* Story Text */}
        <Card className="bg-white/95 backdrop-blur rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-800">Chapter 1: The Magic Crystal</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#A5D8FF] hover:bg-[#A5D8FF]/20 rounded-full"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="prose prose-sm text-gray-700 leading-relaxed">
            {generateStoryText().split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </Card>

        {/* Character Summary */}
        <Card className="bg-white/95 backdrop-blur rounded-2xl p-6">
          <h3 className="mb-4 text-gray-800">Meet Your Hero</h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFD6A5] to-[#A5D8FF] rounded-full flex items-center justify-center">
              <span className="text-xl text-white font-bold">
                {character.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="text-lg text-gray-800">{character.name}</h4>
              <p className="text-sm text-gray-600">
                The brave hero with {character.hairStyle} {character.hairColor} hair
                {character.accessory !== 'none' && character.accessory !== '' && (
                  <span> and {character.accessory.replace('-', ' ')}</span>
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full h-14 bg-white text-[#6B46C1] hover:bg-white/90 rounded-2xl shadow-lg">
            <Heart className="w-5 h-5 mr-2" />
            Save This Story
          </Button>
          
          <Button 
            onClick={() => onNavigate('character')}
            variant="outline"
            className="w-full h-12 bg-white/20 text-white border-white/30 hover:bg-white/30 rounded-2xl"
          >
            Create Another Adventure
          </Button>
        </div>
      </div>
    </div>
  );
}