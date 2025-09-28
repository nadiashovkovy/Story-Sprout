import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, BookOpen, Volume2, Star, Trophy, RotateCcw } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CharacterData, StoryProgress } from "../../App";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// story images
import enchantedForest from "../assets/enchantedforest.png";
import unicornInForestImg from "../assets/unicorninforest.png";
import crystalCave from "../assets/crystalcave.png";
import dragon from "../assets/dragoninforest.png";
import confetti from "../assets/confetti.png"
import rainbow from "../assets/rainbowflowers.png"
import butterfly from "../assets/butterfly.png"
import seasprite from "../assets/seasprite.png"


interface InteractiveStoryProps {
  onNavigate: (screen: "home" | "character" | "story") => void;
  character: CharacterData;
  storyProgress: StoryProgress;
  onStoryComplete: (storyId: string, choicesMade: number) => void;
}

interface StoryNode {
  id: string;
  text: string;
  illustration: string;
  choices: Choice[];
  isEnding?: boolean;
}

interface Choice {
  id: string;
  text: string;
  nextNodeId: string;
  requiresAccessibility?: string[];
  culturalBonus?: boolean;
}

export function InteractiveStory({ onNavigate, character, storyProgress, onStoryComplete }: InteractiveStoryProps) {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [choicesMade, setChoicesMade] = useState(0);
  const [_storyPath, setStoryPath] = useState<string[]>(['start']);
  const [isPlaying, setIsPlaying] = useState(false);

  // ElevenLabs client
  const elevenLabsClient = new ElevenLabsClient({
    apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
  });

  // read story text aloud
  const readStoryAloud = async (text: string) => {
    if (isPlaying || !import.meta.env.VITE_ELEVENLABS_API_KEY) return;
    
    try {
      setIsPlaying(true);
      const audio = await elevenLabsClient.textToSpeech.convert(
        "pNInz6obpgDQGcFmaJgB", // Rachel's voice ID
        {
          text: text,
          modelId: "eleven_multilingual_v2"
        }
      );

      // Convert to audio and play
      const audioContext = new AudioContext();
      const reader = audio.getReader();
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      
      const audioData = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        audioData.set(chunk, offset);
        offset += chunk.length;
      }
      
      const audioBuffer = await audioContext.decodeAudioData(audioData.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      
      source.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  // story nodes based on character
  const generateStoryNodes = (): Record<string, StoryNode> => {
    const accessibilityText = character.accessibility.length > 0 
      ? ` ${character.name} moved confidently ${character.accessibility.includes('wheelchair') ? 'in their wheelchair' : 
          character.accessibility.includes('cane') ? 'with their helpful cane' : 
          character.accessibility.includes('service-dog') ? 'alongside their loyal service dog' : ''}` 
      : '';

    const personalityBonus = character.personalityTrait === 'brave' ? 'with courage in their heart' :
                             character.personalityTrait === 'kind' ? 'with kindness guiding their way' :
                             character.personalityTrait === 'curious' ? 'eager to explore and learn' : '';

    return {
      start: {
        id: 'start',
        text: `${character.name} stepped into the enchanted forest, where sunbeams danced through emerald leaves.${accessibilityText} The air shimmered with magic, and whispered voices seemed to call from deeper within the woods. ${personalityBonus}, ${character.name} noticed three different paths ahead.`,
        illustration: enchantedForest,
        choices: [
          { id: 'crystal_path', text: 'Follow the sparkling crystal path', nextNodeId: 'crystal_cave' },
          { id: 'musical_path', text: 'Follow the path with beautiful music', nextNodeId: 'singing_grove' },
          { id: 'helping_path', text: 'Help the crying butterfly first', nextNodeId: 'butterfly_friend' }
        ]
      },
      crystal_cave: {
        id: 'crystal_cave',
        text: `The crystal path led ${character.name} to a magnificent cave filled with glowing gems. Each crystal hummed with a different musical note. An ancient dragon sat among the crystals, looking sad. "I've lost my voice," the dragon explained. "Without it, I cannot sing the crystals to life and bring joy to the forest."`,
        illustration: crystalCave,
        choices: [
          { id: 'sing_for_dragon', text: 'Offer to sing for the dragon', nextNodeId: 'harmony_ending' },
          { id: 'find_voice', text: 'Search for the dragon\'s lost voice', nextNodeId: 'voice_quest' },
          { 
            id: 'sign_language', 
            text: 'Teach the dragon sign language', 
            nextNodeId: 'sign_ending',
            requiresAccessibility: ['hearing-aid', 'cochlear-implant']
          }
        ]
      },
      singing_grove: {
        id: 'singing_grove',
        text: `${character.name} discovered a grove where the trees themselves were singing a haunting melody. In the center, a unicorn stood trapped in a cage of thorny vines. The vines seemed to respond to the music, tightening when the song was sad and loosening when it was joyful. The unicorn looked at ${character.name} with hopeful eyes.`,
        illustration: unicornInForestImg,
        choices: [
          { id: 'change_song', text: 'Try to change the trees\' song to be happier', nextNodeId: 'musical_ending' },
          { id: 'cut_vines', text: 'Look for something to cut the vines', nextNodeId: 'tool_search' },
          { id: 'unicorn_communication', text: 'Try to communicate with the unicorn', nextNodeId: 'telepathy_ending' }
        ]
      },
      butterfly_friend: {
        id: 'butterfly_friend',
        text: `${character.name} approached the small butterfly whose wing was caught under a fallen leaf. ${character.accessibility.includes('prosthetic') ? 'Using their prosthetic arm with extra care,' : ''} ${character.name} gently freed the butterfly. "Thank you!" the butterfly sparkled. "I'm actually a fairy! Because you helped me first, I can grant you a special wish to help with your adventure."`,
        illustration: butterfly,
        choices: [
          { id: 'wish_wisdom', text: 'Wish for wisdom to help others', nextNodeId: 'wisdom_ending' },
          { id: 'wish_communication', text: 'Wish to understand all forest creatures', nextNodeId: 'communication_ending' },
          { id: 'wish_healing', text: 'Wish for the power to heal', nextNodeId: 'healing_ending' }
        ]
      },
      voice_quest: {
        id: 'voice_quest',
        text: `${character.name} searched high and low and discovered that the dragon's voice was captured in a magical shell by a mischievous sea sprite. ${character.accessibility.includes('wheelchair') ? 'Racing through the forest paths,' : 'Running quickly,'} ${character.name} reached the sprite's pond. The sprite agreed to return the voice, but only if ${character.name} could solve their riddle.`,
        illustration: seasprite,
        choices: [
          { id: 'solve_riddle', text: 'Accept the riddle challenge', nextNodeId: 'riddle_ending' },
          { id: 'trade_something', text: 'Offer to trade something precious', nextNodeId: 'trade_ending' },
          { id: 'challenge_game', text: 'Challenge the sprite to a game', nextNodeId: 'game_ending' }
        ]
      },
      harmony_ending: {
        id: 'harmony_ending',
        text: `${character.name} began to sing, and their voice harmonized perfectly with the crystal resonance. The dragon's eyes filled with tears of joy as the crystals began to glow brighter than ever before. "Your voice has given me something even better than my own," the dragon said. "You've shown me that different voices can create the most beautiful harmony." The forest filled with magical light, and all the creatures celebrated ${character.name}'s gift of bringing harmony to the world.`,
        illustration: dragon, 
        choices: [],
        isEnding: true
      },
      sign_ending: {
        id: 'sign_ending',
        text: dragon,
        illustration: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlzdGFsJTIwY2F2ZXxlbnwwfHx8fDE3NTg5OTg4NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        choices: [],
        isEnding: true
      },
      musical_ending: {
        id: 'musical_ending',
        text: `${character.name} ${character.personalityTrait === 'artistic' ? 'used their creative spirit and' : ''} began to hum a joyful tune, and amazingly, the trees responded! Their song shifted from melancholy to pure happiness. The thorny vines loosened and dissolved into flower petals. The unicorn was free! "Your heart's music changed everything," the unicorn said gratefully. "${character.name}, you have the rare gift of bringing joy and freedom wherever you go." The entire grove bloomed with rainbow flowers in celebration.`,
        illustration: rainbow,
        choices: [],
        isEnding: true
      },
      wisdom_ending: {
        id: 'wisdom_ending',
        text: `The fairy granted ${character.name} the gift of wisdom. Suddenly, ${character.name} could understand the needs of every creature in the forest. They helped the lost baby deer find their family, taught the young trees how to grow strong, and showed the stream how to sing more beautifully. Word of ${character.name}'s wisdom spread throughout all the magical realms. ${character.name} became known as the Forest's Greatest Helper, and creatures from far and wide came to learn from their kindness and insight.`,
        illustration: "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwYnV0dGVyZmx5fGVufDB8fHx8MTc1ODk5ODg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        choices: [],
        isEnding: true
      }
    };
  };

  const storyNodes = generateStoryNodes();
  const currentNode = storyNodes[currentNodeId];

  const handleChoice = (choice: Choice) => {
    if (choice.requiresAccessibility && 
        !choice.requiresAccessibility.some(req => character.accessibility.includes(req))) {
      return; // Choice not available
    }

    setCurrentNodeId(choice.nextNodeId);
    setChoicesMade(prev => prev + 1);
    setStoryPath(prev => [...prev, choice.nextNodeId]);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (storyNodes[choice.nextNodeId]?.isEnding) {
      setTimeout(() => {
        onStoryComplete('forest-adventure', choicesMade + 1);
      }, 2000);
    }
  };

  const restartStory = () => {
    setCurrentNodeId('start');
    setChoicesMade(0);
    setStoryPath(['start']);
  };

  const progressPercentage = Math.min((choicesMade / 3) * 100, 100);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-4">
              <Badge className="bg-[#ffd6a5] text-gray-800">
                {character.name}'s Adventure
              </Badge>
              <Progress value={progressPercentage} className="w-32" />
            </div>
            <Button
              variant="ghost"
              onClick={restartStory}
              className="text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Story Illustration */}
          <div className="space-y-6">
            <Card className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src={currentNode.illustration}
                alt="Story illustration"
                className="w-full h-[600px] object-cover"
              />
            </Card>
            
            {/* Print Link */}
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Story Coloring Page</title>
                          <style>
                            body { margin: 0; text-align: center; }
                            img { max-width: 100%; height: auto; }
                            @media print {
                              body { margin: 0; }
                              img { width: 100%; height: auto; page-break-inside: avoid; }
                            }
                          </style>
                        </head>
                        <body>
                          <img src="${currentNode.illustration}" alt="Story coloring page" />
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}
                className="text-[#749fff] border-[#749fff] hover:bg-[#749fff] hover:text-white"
              >
                Print coloring page
              </Button>
            </div>

            {/* Character Info */}
            <Card className="bg-[#ede6db]/90 backdrop-blur rounded-2xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Your Hero</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ffd6a5] to-[#749fff] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {character.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{character.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {character.accessibility.map((acc) => (
                      <Badge key={acc} variant="outline" className="text-xs">
                        {acc.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Progress Card */}
            <Card className="bg-white/95 backdrop-blur rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Trophy className="w-5 h-5 text-[#ffd6a5]" />
                <h3 className="font-semibold text-gray-800">Progress</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Choices Made</span>
                  <span className="font-medium">{choicesMade}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Story Level</span>
                  <span className="font-medium">{storyProgress.currentLevel}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Story Text and Choices */}
          <div className="space-y-6">
            <Card className="bg-[#ede6db]/95 backdrop-blur rounded-2xl p-8">
              <div className="flex items-center space-x-2 mb-6">
                <BookOpen className="w-5 h-5 text-[#749fff]" />
                <h2 className="text-xl font-semibold text-gray-800">The Enchanted Forest</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto" 
                  onClick={() => readStoryAloud(currentNode.text)}
                  disabled={isPlaying || !import.meta.env.VITE_ELEVENLABS_API_KEY}
                >
                  <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-blue-500' : ''}`} />
                </Button>
              </div>

              <div className="prose prose-lg text-gray-700 leading-relaxed mb-8">
                {currentNode.text}
              </div>

              {/* Choices */}
              {currentNode.choices.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-[#ffd6a5]" />
                    What will {character.name} do?
                  </h3>
                  <div className="space-y-3">
                    {currentNode.choices.map((choice) => {
                      const isAvailable = !choice.requiresAccessibility || 
                        choice.requiresAccessibility.some(req => character.accessibility.includes(req));
                      
                      return (
                        <Button
                          key={choice.id}
                          onClick={() => handleChoice(choice)}
                          disabled={!isAvailable}
                          variant={isAvailable ? "default" : "secondary"}
                          className={`w-full p-4 h-auto text-left justify-start rounded-xl transition-all ${
                            isAvailable 
                              ? 'bg-[#749fff] hover:text-white border border-gray-200' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{choice.text}</div>
                            {choice.requiresAccessibility && (
                              <div className="text-xs mt-1 opacity-70">
                                {isAvailable ? (
                                  <Badge variant="outline" className="text-xs">
                                    Special ability unlocked!
                                  </Badge>
                                ) : (
                                  <span>Requires: {choice.requiresAccessibility.join(', ')}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Ending screen
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <img 
                      src={confetti} 
                      alt="Celebration confetti" 
                      className="w-35 h-35 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Adventure Complete!</h3>
                    <p className="text-gray-600 mb-4">
                      {character.name} has successfully completed their magical journey!
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button onClick={restartStory} className="bg-[#749fff] text-white hover:bg-[#749fff]/90">
                        Try Different Choices
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => onNavigate('character')}
                        className="border-[#749fff] text-[#749fff] hover:bg-[#749fff] hover:text-white"
                      >
                        Create New Hero
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}