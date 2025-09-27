import { useState } from "react";
import { HomeScreen } from "./src/components/HomeScreen";
import { CharacterCreation } from "./src/components/CharacterCreation";
import { InteractiveStory } from "./src/components/InteractiveStory";
import "@fontsource/poppins";

export interface CharacterData {
  name: string;
  pronouns: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  culturalBackground: string;
  accessibility: string[];
  personalityTrait: string;
}

export interface StoryProgress {
  storiesCompleted: number;
  pathsUnlocked: string[];
  currentLevel: number;
  achievements: string[];
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "character" | "story"
  >("home");
  const [character, setCharacter] = useState<CharacterData>({
    name: "",
    pronouns: "",
    skinTone: "",
    hairStyle: "",
    hairColor: "",
    culturalBackground: "",
    accessibility: [],
    personalityTrait: "",
  });

  const [storyProgress, setStoryProgress] =
    useState<StoryProgress>({
      storiesCompleted: 0,
      pathsUnlocked: ["forest-adventure"],
      currentLevel: 1,
      achievements: [],
    });

  const handleCharacterComplete = (
    characterData: CharacterData,
  ) => {
    setCharacter(characterData);
  };

  const handleNavigate = (
    screen: "home" | "character" | "story",
  ) => {
    setCurrentScreen(screen);
  };

  const handleStoryComplete = (
    storyId: string,
    choicesMade: number,
  ) => {
    setStoryProgress((prev) => ({
      ...prev,
      storiesCompleted: prev.storiesCompleted + 1,
      currentLevel:
        Math.floor((prev.storiesCompleted + 1) / 3) + 1,
      pathsUnlocked: [
        ...prev.pathsUnlocked,
        ...(prev.storiesCompleted + 1 >= 3
          ? ["ocean-depths"]
          : []),
        ...(prev.storiesCompleted + 1 >= 6
          ? ["space-journey"]
          : []),
        ...(prev.storiesCompleted + 1 >= 9
          ? ["time-travel"]
          : []),
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffd6a5] via-[#cadbf1] to-[#749fff]">
      {currentScreen === "home" && (
        <HomeScreen
          onNavigate={handleNavigate}
          storyProgress={storyProgress}
        />
      )}

      {currentScreen === "character" && (
        <CharacterCreation
          onNavigate={handleNavigate}
          onCharacterComplete={handleCharacterComplete}
          existingCharacter={character}
        />
      )}

      {currentScreen === "story" && (
        <InteractiveStory
          onNavigate={handleNavigate}
          character={character}
          storyProgress={storyProgress}
          onStoryComplete={handleStoryComplete}
        />
      )}
    </div>
  );
}