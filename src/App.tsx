import { useState, useEffect } from 'react';
import { MainLayout } from './ui/layouts/MainLayout';
import { MainMenu } from './ui/screens/MainMenu';
import { ArchetypeSelectionScreen } from './ui/screens/ArchetypeSelectionScreen';
import { HUD } from './ui/features/HUD';
import { MapPanel } from './ui/features/MapPanel';
import { MapActionPanel } from './ui/features/MapActionPanel';
import { NarrativePanel } from './ui/features/NarrativePanel';
import { StatusBar } from './ui/features/StatusBar';
import { StatsPanel } from './ui/features/StatsPanel';
import { ActionPanel } from './ui/features/ActionPanel';
import { CraftingPanel } from './ui/features/CraftingPanel';
import { CalculationPanel } from './ui/features/CalculationPanel';
import { SkillTreeModal } from './ui/features/SkillTreeModal';
import { gameService } from './core/GameService';
import { ArchetypeComponent } from './core/ecs/components/CoreComponents';

type ScreenState = 'loading' | 'menu' | 'game';

function App() {
  const [screen, setScreen] = useState<ScreenState>('loading');
  const [isSkillTreeOpen, setIsSkillTreeOpen] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    // Navázání reaktivity na ECS engine
    gameService.onStateChange = () => {
      setTick(t => t + 1);
    };

    // Při spuštění zjistíme, zda se podaří načíst hru
    gameService.loadGame().then((loaded) => {
      if (loaded) {
        setScreen('game'); // Auto-load
      } else {
        setScreen('menu');
      }
    });
  }, []);

  const handleStartGame = async () => {
    setScreen('loading');
    await gameService.startNewGame();
    setScreen('game');
  };

  if (screen === 'loading') {
    return <div className="h-screen w-full bg-[var(--bg-color)] flex items-center justify-center text-[var(--color-wood-400)]">Načítání světa...</div>;
  }

  if (screen === 'menu') {
    return <MainMenu 
      onStartNewGame={handleStartGame} 
      onContinueGame={() => setScreen('game')} 
    />;
  }

  const player = gameService.getPlayerEntity();
  const archComp = player?.getComponent<ArchetypeComponent>('ArchetypeComponent');
  const isArchetypeChosen = archComp?.chosen ?? true;

  if (!isArchetypeChosen) {
    return <ArchetypeSelectionScreen onSelect={(id) => gameService.chooseArchetype(id)} />;
  }

  return (
    <>
      <MainLayout 
        hud={<HUD onBackToMenu={() => setScreen('menu')} />}
        statusBar={<StatusBar />}
        mapPanel={<MapPanel />}
        mapActionPanel={<MapActionPanel />}
        narrativePanel={<NarrativePanel />}
        statsPanel={<StatsPanel />}
        actionPanel={<ActionPanel onOpenSkillTree={() => setIsSkillTreeOpen(true)} />}
        craftingPanel={<CraftingPanel />}
        calculationPanel={<CalculationPanel />}
      />
      
      {isSkillTreeOpen && <SkillTreeModal onClose={() => setIsSkillTreeOpen(false)} />}
    </>
  );
}

export default App;
