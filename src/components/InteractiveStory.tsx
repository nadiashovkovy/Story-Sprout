import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, BookOpen, Volume2, Pause, Star, Trophy, RotateCcw } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CharacterData, StoryProgress } from "../../App";
import { parseEducationalText } from "./VocabularyTooltip";
// Conditionally import ElevenLabs only if needed
// import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// story images
import enchantedForest from "../assets/enchantedforest.png";
import unicornInForestImg from "../assets/unicorninforest.png";
import crystalCave from "../assets/crystalcave.png";
import dragon from "../assets/dragoninforest.png";
import confetti from "../assets/confetti.png"
import rainbow from "../assets/rainbowflowers.png"
import butterfly from "../assets/butterfly.png"


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
  const [currentAudioSource, setCurrentAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Debug logging for production
  console.log('InteractiveStory component rendering', { character, storyProgress, currentNodeId });

  // ElevenLabs client will be loaded dynamically when needed to avoid build issues

  // read story text aloud
  const readStoryAloud = async (text: string) => {
    if (isPlaying || !import.meta.env.VITE_ELEVENLABS_API_KEY) return;
    
    try {
      setIsPlaying(true);
      
      // Dynamically import ElevenLabs to avoid build issues
      const { ElevenLabsClient } = await import('@elevenlabs/elevenlabs-js');
      const client = new ElevenLabsClient({
        apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
      });
      
      const audio = await client.textToSpeech.convert(
        character.voiceId || "pNInz6obpgDQGcFmaJgB", // Use selected voice or default to Rachel's voice
        {
          text: text,
          modelId: "eleven_multilingual_v2"
        }
      );

      // Convert to audio and play
      const context = new AudioContext();
      setAudioContext(context);
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
      
      const audioBuffer = await context.decodeAudioData(audioData.buffer);
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
      
      setCurrentAudioSource(source);
      
      source.onended = () => {
        setIsPlaying(false);
        setCurrentAudioSource(null);
        setAudioContext(null);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setCurrentAudioSource(null);
      setAudioContext(null);
    }
  };

  // pause/stop audio
  const pauseAudio = () => {
    if (currentAudioSource && audioContext) {
      currentAudioSource.stop();
      setIsPlaying(false);
      setCurrentAudioSource(null);
      setAudioContext(null);
    }
  };

  // story nodes based on character
  const generateStoryNodes = (): Record<string, StoryNode> => {
    // Debug logging to check character name
    console.log('Character data in story generation:', character);
    
    // Ensure we have a valid name, fallback to "You" if needed
    const characterName = character.name?.trim() || 'You';
    
    // Handle pronouns based on character selection
    const getPronounSet = (pronounId: string) => {
      switch (pronounId) {
        case 'she-her':
          return {
            subject: 'she',
            object: 'her',
            possessive: 'her',
            possessiveAdjective: 'her',
            reflexive: 'herself'
          };
        case 'he-him':
          return {
            subject: 'he',
            object: 'him',
            possessive: 'his',
            possessiveAdjective: 'his',
            reflexive: 'himself'
          };
        case 'they-them':
        case 'other':
        default:
          return {
            subject: 'they',
            object: 'them',
            possessive: 'theirs',
            possessiveAdjective: 'their',
            reflexive: 'themselves'
          };
      }
    };
    
    const pronouns = getPronounSet(character.pronouns || 'they-them');
    
    const accessibilityText = character.accessibility.length > 0 
      ? ` ${characterName} moved confidently ${character.accessibility.includes('wheelchair') ? `in ${pronouns.possessiveAdjective} wheelchair` : 
          character.accessibility.includes('cane') ? `with ${pronouns.possessiveAdjective} helpful cane` : 
          character.accessibility.includes('service-dog') ? `alongside ${pronouns.possessiveAdjective} loyal service dog` : ''}` 
      : '';

    const personalityBonus = character.personalityTrait === 'brave' ? `with courage in ${pronouns.possessiveAdjective} heart` :
                             character.personalityTrait === 'kind' ? `with kindness guiding ${pronouns.possessiveAdjective} way` :
                             character.personalityTrait === 'curious' ? 'eager to explore and learn' : '';

    return {
      start: {
        id: 'start',
        text: `${characterName} stepped into the enchanted forest on a sunny morning. The tall trees formed a beautiful ecosystem where many different animals and plants lived together. Colorful flowers bloomed everywhere, and butterflies danced from one flower to another. Birds sang happy songs in the branches above. ${accessibilityText} The forest felt magical and welcoming. ${personalityBonus}, ${characterName} saw three different paths leading deeper into the woods. Each path looked like it would lead to a different adventure.`,
        illustration: enchantedForest,
        choices: [
          { id: 'crystal_path', text: 'Follow the sparkling crystal path toward the mountain cave', nextNodeId: 'crystal_cave' },
          { id: 'musical_path', text: 'Follow the path with beautiful birdsong toward the grove', nextNodeId: 'singing_grove' },
          { id: 'helping_path', text: 'Help the injured monarch butterfly first', nextNodeId: 'butterfly_friend' }
        ]
      },
      crystal_cave: {
        id: 'crystal_cave',
        text: `The crystal path led ${characterName} up a mountain to an amazing cave filled with glowing gems. The crystals were so beautiful they looked like stars twinkling in the darkness. Each crystal made different musical sounds when the wind blew through them. An old, wise dragon sat quietly among the crystals, looking very sad. "Hello, young friend," the dragon said gently. "I used to be able to make these crystals sing with my voice, but I've lost that special ability." The dragon explained that when the crystals sang, they created a resonance that helped rare cave creatures live happily. Without the dragon's voice, the luminescent crystals were slowly losing their magical glow.`,
        illustration: crystalCave,
        choices: [
          { id: 'learn_crystals', text: 'Ask to learn more about how crystals and sound work together', nextNodeId: 'crystal_science' },
          { id: 'find_voice', text: 'Offer to search for what took the dragon\'s voice', nextNodeId: 'voice_quest' },
          { 
            id: 'sign_language', 
            text: 'Suggest trying different ways to communicate with crystals', 
            nextNodeId: 'communication_science',
            requiresAccessibility: ['hearing-aid', 'cochlear-implant']
          }
        ]
      },
      crystal_science: {
        id: 'crystal_science',
        text: `The dragon's eyes sparkled with joy when ${characterName} wanted to learn more. "These special crystals have been growing here for thousands of years," the dragon explained proudly. "When I sing to them, they vibrate and create beautiful light that helps tiny creatures see in the dark." ${characterName} learned that small, glowing moths lived in the cave and needed the crystal light to find food. The dragon showed ${characterName} how sound waves could make the crystals dance and shine. "But now that my voice is gone, the poor little moths are having trouble finding their way around," the dragon said sadly. ${characterName} noticed that some of the crystals were already getting dimmer. The cave felt quieter and less magical than it should be.`,
        illustration: crystalCave,
        choices: [
          { id: 'help_sing', text: 'Offer to try singing with the dragon to help the crystals', nextNodeId: 'harmony_ending' },
          { id: 'find_solution', text: 'Look for another way to make the crystals glow', nextNodeId: 'crystal_solution' },
          { id: 'protect_moths', text: 'Focus on helping the glowing moths find food', nextNodeId: 'moth_helper' }
        ]
      },
      singing_grove: {
        id: 'singing_grove',
        text: `${characterName} followed the sound of beautiful birdsong to a magical grove where the trees themselves were singing! The music was so pretty it made ${characterName} feel happy and peaceful. In the center of the grove, a white unicorn was trapped by thick, thorny vines that didn't belong in the forest. These were invasive plants that had grown too big and were hurting the other plants around them. The unicorn looked at ${characterName} with kind, hopeful eyes. The native flowers and trees in the grove were struggling because the mean vines were taking all their sunlight and water. ${characterName} could see that this beautiful place needed help to become healthy again. The birds in the trees seemed to be asking for ${characterName}'s help with their songs.`,
        illustration: unicornInForestImg,
        choices: [
          { id: 'remove_vines', text: 'Try to carefully remove the harmful vines', nextNodeId: 'vine_removal' },
          { id: 'ask_birds', text: 'Ask the singing birds for advice about helping the grove', nextNodeId: 'bird_wisdom' },
          { id: 'comfort_unicorn', text: 'Talk to the unicorn to learn more about the problem', nextNodeId: 'unicorn_story' }
        ]
      },
      vine_removal: {
        id: 'vine_removal',
        text: `${characterName} carefully started pulling away the thorny vines, being extra gentle so no one would get hurt. It was hard work, but ${characterName} discovered that teamwork made it easier. Some friendly squirrels came down from the trees to help move the smaller pieces. The birds sang encouraging songs while everyone worked together. As the vines came away, beautiful native wildflowers began to poke their heads up toward the sunlight again. The unicorn's eyes grew brighter as more space opened up around ${pronouns.object}. "Thank you for understanding that some plants don't belong here," the unicorn said gratefully. Soon, the grove looked much healthier, and all the forest animals seemed happier too.`,
        illustration: rainbow,
        choices: [],
        isEnding: true
      },
      butterfly_friend: {
        id: 'butterfly_friend',
        text: `${characterName} gently knelt down next to a beautiful orange and black butterfly whose wing was stuck under a fallen leaf. The butterfly looked just like the monarch butterflies that make amazing journeys across the country! ${character.accessibility.includes('prosthetic') ? `Using ${pronouns.possessiveAdjective} prosthetic arm very carefully,` : ''} ${characterName} lifted the leaf and freed the butterfly's delicate wing. Suddenly, the butterfly began to glow with magical light! "Thank you for your kindness," the butterfly said in a tiny, sweet voice. "I'm actually a fairy who protects all the butterflies and bees in this forest!" The fairy explained that real monarch butterflies travel thousands of miles during their migration to find warm places to live. She told ${characterName} that these amazing butterflies are very important pollinators who help flowers make seeds.`,
        illustration: butterfly,
        choices: [
          { id: 'learn_migration', text: 'Ask to learn more about butterfly migration', nextNodeId: 'migration_lesson' },
          { id: 'help_pollinators', text: 'Offer to help protect the butterflies and bees', nextNodeId: 'pollinator_garden' },
          { id: 'make_wish', text: 'Ask the fairy for help with the forest', nextNodeId: 'fairy_wish' }
        ]
      },
      migration_lesson: {
        id: 'migration_lesson',
        text: `The butterfly fairy's wings sparkled as she shared an amazing story about migration. "Every fall, monarch butterflies fly all the way from Canada to Mexico - that's farther than driving across the whole country!" she explained excitedly. ${characterName} learned that these incredible butterflies use the sun and special magnetic feelings to find their way, just like having a natural compass. The fairy showed ${characterName} a map in the clouds of the long journey the butterflies take. "The most amazing part is that the butterflies making this trip have never been there before - their great-great-grandparents made the trip!" the fairy said with wonder. She explained that butterflies need safe places to rest and eat along the way, just like people need rest stops on long car trips. ${characterName} felt amazed thinking about these tiny creatures making such a big adventure. The fairy smiled, seeing how much ${characterName} cared about helping the butterflies.`,
        illustration: butterfly,
        choices: [
          { id: 'create_rest_stops', text: 'Help create safe rest stops for traveling butterflies', nextNodeId: 'migration_ending' },
          { id: 'spread_word', text: 'Promise to tell others about protecting butterfly paths', nextNodeId: 'conservation_ending' },
          { id: 'plant_flowers', text: 'Plant special flowers that butterflies love', nextNodeId: 'garden_ending' }
        ]
      },
      // Simplified endings
      harmony_ending: {
        id: 'harmony_ending',
        text: `${characterName} took a deep breath and began to sing along with the dragon. Their voices blended together beautifully, creating the perfect sound to wake up the crystals! The cave filled with the most amazing light show as all the crystals began to glow and dance. The tiny moths fluttered happily around the bright crystals, finally able to see clearly again. "Your voice is the missing piece I needed," the dragon said with tears of joy. "Together, we've brought the magic back to our cave home!" The dragon and ${characterName} became the best of friends, and the crystal cave became the most beautiful and safe home for all the creatures who lived there. ${characterName} had learned that sometimes the best solutions come from working together and helping others.`,
        illustration: dragon,
        choices: [],
        isEnding: true
      },
      migration_ending: {
        id: 'migration_ending',
        text: `${characterName} and the butterfly fairy worked together to plant beautiful flowers all along the forest paths where butterflies liked to travel. They made cozy resting spots with shallow water dishes and sheltered areas where tired butterflies could sleep safely. Soon, the forest became known as the most wonderful place for traveling butterflies to stop and rest. Monarchs, swallowtails, and many other butterflies visited throughout the year, making the forest more colorful and lively than ever before. "You've created something truly special," the fairy said proudly. "${characterName}, you've helped make sure these amazing travelers will have a safe journey for many years to come!" The forest buzzed with happy butterflies, and ${characterName} felt proud of making such a difference for these incredible creatures.`,
        illustration: rainbow,
        choices: [],
        isEnding: true
      },
      conservation_ending: {
        id: 'conservation_ending',
        text: `${characterName} promised the fairy to become a butterfly protector and share what ${pronouns.subject} had learned with everyone back home. The fairy gave ${characterName} a special badge that sparkled like butterfly wings to show ${pronouns.subject} was now an official "Butterfly Guardian." ${characterName} learned that conservation means taking care of nature so that amazing animals like monarch butterflies can keep living and thriving. The fairy taught ${characterName} simple ways to help, like planting native flowers and avoiding harmful chemicals in gardens. "Every person who cares makes a difference," the fairy said warmly. "And now you'll help others care too!" ${characterName} left the forest feeling excited to share the butterfly story and help create more safe places for these wonderful creatures. The adventure had turned ${characterName} into a real nature hero!`,
        illustration: butterfly,
        choices: [],
        isEnding: true
      }
    };
  };

  const storyNodes = generateStoryNodes();
  const currentNode = storyNodes[currentNodeId];

  // Safety check - if currentNode is undefined, something went wrong
  if (!currentNode) {
    console.error('Current node not found:', currentNodeId, 'Available nodes:', Object.keys(storyNodes));
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Story Loading Error</h2>
          <p className="text-gray-600 mb-4">There was an issue loading the story content.</p>
          <Button onClick={() => onNavigate('home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

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
                <div className="ml-auto flex space-x-1">
                  {!isPlaying ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => readStoryAloud(currentNode.text)}
                      disabled={!import.meta.env.VITE_ELEVENLABS_API_KEY}
                      title="Play story audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={pauseAudio}
                      title="Pause audio"
                    >
                      <Pause className="w-4 h-4 text-blue-500 animate-pulse" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="prose prose-lg text-gray-700 leading-relaxed mb-8">
                {parseEducationalText(currentNode.text, character.voiceId)}
              </div>

              {/* Choices */}
              {currentNode.choices.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-[#749fff]" />
                    What will you do?
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