import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface VocabularyTooltipProps {
  word: string;
  definition: string;
  children?: React.ReactNode;
  voiceId?: string;
}

export function VocabularyTooltip({ word, definition, children, voiceId }: VocabularyTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const pronounceWord = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlaying || !import.meta.env.VITE_ELEVENLABS_API_KEY) return;
    
    try {
      setIsPlaying(true);
      
      // Dynamically import ElevenLabs to avoid build issues
      const { ElevenLabsClient } = await import('@elevenlabs/elevenlabs-js');
      const client = new ElevenLabsClient({
        apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
      });
      
      const audio = await client.textToSpeech.convert(
        voiceId || "pNInz6obpgDQGcFmaJgB", // Use provided voice or default
        {
          text: word,
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
      
      source.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error('Error pronouncing word:', error);
      setIsPlaying(false);
    }
  };

  return (
    <span className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span
        className="underline decoration-[#749fff] decoration-2 cursor-help"
        style={{ color: '#749fff' }}
      >
        {children || word}
      </span>
      {isVisible && (
        <div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0.5 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50 max-w-sm w-max"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center gap-2 font-medium">
            {import.meta.env.VITE_ELEVENLABS_API_KEY && (
              <button
                onClick={pronounceWord}
                className="flex-shrink-0 p-1 hover:bg-gray-700 rounded transition-colors"
                title="Pronounce word"
                disabled={isPlaying}
              >
                <Volume2 className={`w-3 h-3 ${isPlaying ? 'text-blue-400 animate-pulse' : 'text-gray-300'}`} />
              </button>
            )}
            <span>{word}</span>
          </div>
          <div className="text-gray-300 text-xs mt-1 whitespace-normal">{definition}</div>
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </span>
  );
}

// Helper function to parse text and wrap vocabulary words
export function parseEducationalText(text: string, voiceId?: string): React.ReactNode {
  const vocabularyWords: Record<string, string> = {
    'ecosystem': 'A community of living things working together with their environment',
    'biodiversity': 'The variety of different plants and animals in nature',
    'endangered': 'Animals or plants that are at risk of disappearing forever',
    'habitat': 'The natural home where an animal or plant lives',
    'photosynthesis': 'How plants make their own food using sunlight and water',
    'pollination': 'When pollen moves from flower to flower to help plants make seeds',
    'migration': 'When animals travel long distances to find food or better weather',
    'conservation': 'Protecting nature and wildlife for the future',
    'adaptation': 'Special features that help animals survive in their environment',
    'pollinator': 'Animals like bees that help plants make seeds by moving pollen',
    'resonance': 'When something vibrates in response to another sound',
    'luminescent': 'Giving off light without heat, like fireflies',
    'invasive': 'Plants or animals that don\'t belong in an area and can cause problems',
    'native': 'Plants and animals that naturally belong in a place'
  };

  // Split text by words while preserving spaces and punctuation
  const parts = text.split(/(\s+|[.,;:!?])/);
  
  return parts.map((part, index) => {
    // Remove punctuation for matching but keep it for display
    const cleanWord = part.toLowerCase().replace(/[.,;:!?]/g, '');
    
    if (vocabularyWords[cleanWord]) {
      return (
        <VocabularyTooltip key={index} word={cleanWord} definition={vocabularyWords[cleanWord]} voiceId={voiceId}>
          {part}
        </VocabularyTooltip>
      );
    }
    return part;
  });
}