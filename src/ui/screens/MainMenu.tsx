import React, { useEffect, useState } from 'react';
import { Crown, Play, Settings, Trash2 } from 'lucide-react';
import { gameService } from '../../core/GameService';
import type { GameSaveState } from '../../storage/db';

interface MainMenuProps {
  onStartNewGame: () => void;
  onContinueGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartNewGame, onContinueGame }) => {
  const [saves, setSaves] = useState<GameSaveState[]>([]);

  useEffect(() => {
    loadSaves();
  }, []);

  const loadSaves = () => {
    gameService.getAvailableSaves().then(setSaves);
  };

  const handleLoadSave = async (id: number) => {
    const success = await gameService.loadGameById(id);
    if (success) {
      onContinueGame();
    }
  };

  const handleDeleteSave = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Zabránit načtení hry při kliknutí na koš
    if (window.confirm("Opravdu chceš smazat tuto pozici?")) {
      await gameService.deleteSave(id);
      loadSaves(); // Obnovit seznam
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-[var(--bg-color)] text-[var(--text-primary)]">
      <div className="flex flex-col items-center gap-12 w-full max-w-md">
        
        {/* Titul hry */}
        <div className="text-center space-y-4">
          <Crown className="mx-auto text-[var(--color-gold-400)] mb-4" size={64} />
          <h1 className="text-5xl font-serif tracking-widest text-[var(--text-primary)]">STŘEDOVĚK</h1>
          <p className="text-[var(--color-wood-400)] tracking-[0.2em] uppercase text-sm">Od rolníka po krále</p>
        </div>

        {/* Menu tlačítka */}
        <div className="w-full flex flex-col gap-4 px-8">
          
          {saves.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              <h3 className="text-[var(--color-wood-400)] text-sm tracking-wide uppercase mb-2 text-center">Rozehrané hry</h3>
              {saves.map(save => (
                <div 
                  key={save.id}
                  onClick={() => save.id && handleLoadSave(save.id)}
                  className="w-full flex items-center justify-between bg-[var(--surface-color)] hover:bg-[var(--surface-light)] py-3 px-4 rounded border border-[var(--color-wood-400)] cursor-pointer transition-all transform hover:scale-[1.02] shadow-md"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{save.characterName} {save.archetype ? `(${save.archetype})` : ''}</span>
                    <span className="text-xs text-[var(--text-secondary)]">Tah {save.turn} • {new Date(save.lastSavedAt).toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={(e) => save.id && handleDeleteSave(e, save.id)}
                    className="p-2 text-[var(--color-red-400)] hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                    title="Smazat pozici"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={onStartNewGame}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded border transition-all ${saves.length === 0 ? 'bg-[var(--color-wood-600)] hover:bg-[var(--color-wood-500)] text-white border-[var(--color-wood-400)] shadow-lg hover:scale-105' : 'bg-transparent hover:bg-[var(--surface-color)] text-white border-[var(--color-wood-400)]'}`}
          >
            <Play size={20} />
            Zahájit Novou Hru
          </button>

          <button className="w-full flex items-center justify-center gap-3 bg-transparent hover:bg-[var(--surface-color)] text-[var(--text-secondary)] py-4 px-6 rounded border border-[var(--border-color)] transition-colors">
            <Settings size={20} />
            Nastavení (Verze 0.10.1)
          </button>
        </div>
        
      </div>
    </div>
  );
};
