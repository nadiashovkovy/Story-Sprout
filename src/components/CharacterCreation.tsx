import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, Check, Users, Globe, Heart, Volume2 } from "lucide-react";
import { CharacterData } from "../../App";

interface CharacterCreationProps {
  onNavigate: (screen: "home" | "character" | "story") => void;
  onCharacterComplete: (character: CharacterData) => void;
  existingCharacter: CharacterData;
}

export function CharacterCreation({ onNavigate, onCharacterComplete, existingCharacter }: CharacterCreationProps) {
  const [character, setCharacter] = useState<CharacterData>(
    existingCharacter.name ? existingCharacter : {
      name: '',
      pronouns: '',
      skinTone: '',
      hairStyle: '',
      hairColor: '',
      culturalBackground: '',
      accessibility: [],
      personalityTrait: '',
      voiceId: ''
    }
  );

  const skinTones = [
    { id: 'fair-light', color: '#fde2b4ff', name: 'Fair Light' },
    { id: 'light', color: '#F1C27D', name: 'Light' },
    { id: 'light-medium', color: '#E0AC69', name: 'Light Medium' },
    { id: 'medium', color: '#C68642', name: 'Medium' },
    { id: 'medium-brown', color: '#A0522D', name: 'Medium Brown' },
    { id: 'brown', color: '#8B4513', name: 'Brown' },
    { id: 'deep-brown', color: '#654321', name: 'Deep Brown' },
    { id: 'dark', color: '#493116ff', name: 'Dark Brown' }
  ];

  const hairStyles = [
    { id: 'short-straight', name: 'Short & Straight' },
    { id: 'short-curly', name: 'Short & Curly' },
    { id: 'medium-wavy', name: 'Medium & Wavy' },
    { id: 'long-straight', name: 'Long & Straight' },
    { id: 'braids', name: 'Braids' },
    { id: 'locs', name: 'Locs/Dreadlocks' },
    { id: 'afro', name: 'Afro' },
    { id: 'ponytail', name: 'Ponytail' },
    { id: 'bun', name: 'Bun' },
    { id: 'pixie', name: 'Pixie Cut' },
    { id: 'buzz', name: 'Buzz Cut' },
    { id: 'hijab', name: 'Hijab' }
  ];

  const hairColors = [
    { id: 'black', color: '#2C1810', name: 'Black' },
    { id: 'dark-brown', color: '#8B4513', name: 'Dark Brown' },
    { id: 'brown', color: '#A0522D', name: 'Brown' },
    { id: 'light-brown', color: '#CD853F', name: 'Light Brown' },
    { id: 'blonde', color: '#e7c778ff', name: 'Blonde' },
    { id: 'red', color: '#B22222', name: 'Red' },
    { id: 'auburn', color: '#A52A2A', name: 'Auburn' },
    { id: 'gray', color: '#808080', name: 'Gray/Silver' },
    { id: 'white', color: '#F5F5F5', name: 'White' },
    { id: 'rainbow', color: 'linear-gradient(45deg, #e96161ff, #ead669ff, #53c0d8ff)', name: 'Rainbow' }
  ];

  const culturalBackgrounds = [
    { id: 'african', name: 'African' },
    { id: 'african-american', name: 'African American' },
    { id: 'asian', name: 'Asian' },
    { id: 'hispanic-latino', name: 'Hispanic/Latino' },
    { id: 'middle-eastern', name: 'Middle Eastern' },
    { id: 'native-american', name: 'Native American' },
    { id: 'pacific-islander', name: 'Pacific Islander' },
    { id: 'european', name: 'European' },
    { id: 'mixed-heritage', name: 'Mixed Heritage' },
    { id: 'other', name: 'Other' }
  ];

  const accessibilityOptions = [
    { id: 'wheelchair', name: 'Uses Wheelchair', icon: '♿' },
    { id: 'hearing-aid', name: 'Hearing Aid', icon: '🦻' },
    { id: 'glasses', name: 'Glasses', icon: '👓' },
    { id: 'prosthetic', name: 'Prosthetic Limb', icon: '🦾' },
    { id: 'cane', name: 'Walking Cane', icon: '🦯' },
    { id: 'service-dog', name: 'Service Dog', icon: '🐕‍🦺' },
    { id: 'cochlear-implant', name: 'Cochlear Implant', icon: '🔊' },
    { id: 'feeding-tube', name: 'Feeding Tube', icon: '🩺' },
    { id: 'oxygen-tank', name: 'Oxygen Tank', icon: '🫁' },
    { id: 'braces', name: 'Leg Braces', icon: '🦵' }
  ];

  const pronounOptions = [
    { id: 'she-her', name: 'She/Her' },
    { id: 'he-him', name: 'He/Him' },
    { id: 'they-them', name: 'They/Them' },
    { id: 'other', name: 'Other/Custom' }
  ];

  const personalityTraits = [
    { id: 'brave', name: 'Brave & Bold' },
    { id: 'kind', name: 'Kind & Caring' },
    { id: 'curious', name: 'Curious & Inquisitive' },
    { id: 'funny', name: 'Funny & Playful' },
    { id: 'artistic', name: 'Creative & Artistic' },
    { id: 'leader', name: 'Natural Leader' },
    { id: 'gentle', name: 'Gentle & Thoughtful' },
    { id: 'determined', name: 'Determined & Strong' }
  ];

  const voiceOptions = [
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam - Deep & Calm', description: 'American, middle-aged' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella - Sweet & Gentle', description: 'American, young adult' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni - Warm & Friendly', description: 'American, young adult' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold - Strong & Clear', description: 'American, middle-aged' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi - Bright & Cheerful', description: 'American, young' },
    { id: 'CYw3kZ02Hs0563khs1Fj', name: 'Dave - Casual & Cool', description: 'British, young adult' }
  ];

  const handleAccessibilityChange = (accessibilityId: string, checked: boolean) => {
    setCharacter(prev => ({
      ...prev,
      accessibility: checked
        ? [...prev.accessibility, accessibilityId]
        : prev.accessibility.filter(id => id !== accessibilityId)
    }));
  };

  const handleVoicePreview = async (voiceId: string) => {
    try {
      const { ElevenLabsClient } = await import('@elevenlabs/elevenlabs-js');
      const client = new ElevenLabsClient({
        apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
      });

      const audio = await client.textToSpeech.convert(
        voiceId,
        {
          text: "Hello! This is how I sound when reading your stories.",
          modelId: "eleven_turbo_v2"
        }
      );

      // Convert to audio and play
      const context = new AudioContext();
      const reader = audio.getReader();
      const chunks = [];
      
      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) chunks.push(value);
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
    } catch (error) {
      console.error('Voice preview error:', error);
    }
  };

  const handleNext = () => {
    if (character.skinTone && character.hairStyle && character.hairColor) {
      const finalCharacter = {
        ...character,
        name: character.name.trim() || 'You' // Default to 'You' if name is empty
      };
      onCharacterComplete(finalCharacter);
      onNavigate('story');
    }
  };

  const isComplete = character.skinTone && character.hairStyle && character.hairColor;

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
            <h2 className="text-xl font-semibold text-gray-800">Create Your Hero</h2>
            <div className="w-32" />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="bg-[#ede6db]/90 backdrop-blur rounded-2xl p-6 border-0">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-[#749fff]" />
                <h3 className="text-lg font-semibold text-gray-800">Tell Us About Yourself</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What's your name?</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={character.name}
                    onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#749fff] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pronouns</label>
                  <div className="grid grid-cols-2 gap-2">
                    {pronounOptions.map((pronoun) => (
                      <button
                        key={pronoun.id}
                        onClick={() => setCharacter({ ...character, pronouns: pronoun.id })}
                        className={`p-2 rounded-lg border-2 transition-all text-sm ${
                          character.pronouns === pronoun.id
                            ? 'border-[#749fff] bg-[#749fff]/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {pronoun.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personality</label>
                  <div className="grid grid-cols-2 gap-2">
                    {personalityTraits.map((trait) => (
                      <button
                        key={trait.id}
                        onClick={() => setCharacter({ ...character, personalityTrait: trait.id })}
                        className={`p-2 rounded-lg border-2 transition-all text-sm ${
                          character.personalityTrait === trait.id
                            ? 'border-[#ffd6a5] bg-[#ffd6a5]/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {trait.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Voice Selection */}
            <Card className="bg-[#ede6db]/90 backdrop-blur rounded-2xl p-6 border-0">
              <div className="flex items-center space-x-2 mb-4">
                <Volume2 className="w-5 h-5 text-[#749fff]" />
                <h3 className="text-lg font-semibold text-gray-800">Story Voice</h3>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
              
              <div className="space-y-3">
                {voiceOptions.map((voice) => (
                  <div key={voice.id} className="flex items-center justify-between">
                    <button
                      onClick={() => setCharacter({ ...character, voiceId: voice.id })}
                      className={`flex-1 text-left p-3 rounded-lg border-2 transition-all ${
                        character.voiceId === voice.id
                          ? 'border-[#cadbf1] bg-[#cadbf1]/20'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{voice.name}</p>
                          <p className="text-xs text-gray-600">{voice.description}</p>
                        </div>
                        {import.meta.env.VITE_ELEVENLABS_API_KEY && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVoicePreview(voice.id);
                            }}
                            className="text-[#749fff] hover:bg-[#749fff]/10"
                          >
                            🔊 Preview
                          </Button>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Cultural Background */}
            <Card className="bg-[#ede6db]/90 backdrop-blur rounded-2xl p-6 border-0">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-5 h-5 text-[#749fff]" />
                <h3 className="text-lg font-semibold text-gray-800">Cultural Background</h3>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {culturalBackgrounds.map((background) => (
                  <button
                    key={background.id}
                    onClick={() => setCharacter({ ...character, culturalBackground: background.id })}
                    className={`p-2 rounded-lg border-2 transition-all text-sm ${
                      character.culturalBackground === background.id
                        ? 'border-[#cadbf1] bg-[#cadbf1]/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {background.name}
                  </button>
                ))}
              </div>
            </Card>

            {/* Accessibility Features */}
            <Card className="bg-[#ede6db]/90 backdrop-blur rounded-2xl p-6 border-0">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-[#749fff]" />
                <h3 className="text-lg font-semibold text-gray-800">What Makes You Special</h3>
                <Badge variant="secondary" className="text-xs">Select all that apply</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {accessibilityOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={option.id}
                      checked={character.accessibility.includes(option.id)}
                      onCheckedChange={(checked: boolean) => handleAccessibilityChange(option.id, checked)}
                      className="data-[state=checked]:bg-[#749fff]"
                    />
                    <label htmlFor={option.id} className="text-sm text-gray-700 cursor-pointer flex items-center space-x-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skin Tone */}
            <Card className="bg-[#ede6db]/90 backdrop-blur rounded-2xl p-6 border-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skin Tone</h3>
              <div className="grid grid-cols-4 gap-3">
                {skinTones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setCharacter({ ...character, skinTone: tone.id })}
                    className={`w-16 h-16 rounded-full border-4 transition-all ${
                      character.skinTone === tone.id 
                        ? 'border-[#749fff] shadow-lg scale-110' 
                        : 'border-white shadow-md hover:scale-105'
                    }`}
                    style={{ backgroundColor: tone.color }}
                    title={tone.name}
                  >
                    {character.skinTone === tone.id && (
                      <Check className="w-6 h-6 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Hair Style */}
            <Card className="bg-[#ede6db]/90 backdrop-blur rounded-2xl p-6 border-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hair Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {hairStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setCharacter({ ...character, hairStyle: style.id })}
                    className={`p-3 rounded-xl border-2 transition-all text-sm ${
                      character.hairStyle === style.id
                        ? 'border-[#ffd6a5] bg-[#ffd6a5]/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </Card>

            {/* Hair Color */}
            <Card className="bg-[#ede6db]/90 backdrop-blur rounded-2xl p-6 border-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hair Color</h3>
              <div className="grid grid-cols-5 gap-3">
                {hairColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setCharacter({ ...character, hairColor: color.id })}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      character.hairColor === color.id 
                        ? 'border-[#749fff] shadow-lg scale-110' 
                        : 'border-white shadow-md hover:scale-105'
                    }`}
                    style={{ 
                      background: color.id === 'rainbow' ? color.color : color.color 
                    }}
                    title={color.name}
                  >
                    {character.hairColor === color.id && (
                      <Check className="w-4 h-4 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Character Preview */}
            <Card className="bg-white/95 backdrop-blur rounded-2xl p-6 border-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Hero</h3>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#ffd6a5] to-[#749fff] rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {character.name ? character.name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800">
                  {character.name || 'Your Hero'}
                </h4>
                {character.personalityTrait && (
                  <p className="text-sm text-gray-600 mt-1">
                    {personalityTraits.find(t => t.id === character.personalityTrait)?.name}
                  </p>
                )}
              </div>
            </Card>

            {/* Continue Button */}
            <Button
              onClick={handleNext}
              disabled={!isComplete}
              size="lg"
              className={`w-full h-14 rounded-2xl shadow-lg transition-all ${
                isComplete
                  ? 'bg-[#749fff] text-white hover:bg-[#749fff]/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Start My Adventure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}