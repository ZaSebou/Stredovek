import React, { useEffect, useState } from 'react';
import { hasActiveSave } from '../../storage/db';
import { Crown, Play, Save, Settings } from 'lucide-react';

interface MainMenuProps {
  onStartNewGame: () => void;
  onContinueGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartNewGame, onContinueGame }) => {
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    hasActiveSave().then(setHasSave);
  }, []);

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
          {hasSave && (
            <button 
              onClick={onContinueGame}
              className="w-full flex items-center justify-center gap-3 bg-[var(--color-wood-600)] hover:bg-[var(--color-wood-500)] text-white py-4 px-6 rounded border border-[var(--color-wood-400)] transition-all transform hover:scale-105 shadow-lg"
            >
              <Save size={20} />
              Pokračovat v dynastii
            </button>
          )}

          <button 
            onClick={() => {
              if (hasSave && !window.confirm("Opravdu chceš přemazat stávající rozehranou hru?")) return;
              onStartNewGame();
            }}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded border transition-all ${!hasSave ? 'bg-[var(--color-wood-600)] hover:bg-[var(--color-wood-500)] text-white border-[var(--color-wood-400)] shadow-lg hover:scale-105' : 'bg-transparent hover:bg-[var(--surface-color)] text-[var(--text-secondary)] border-[var(--border-color)]'}`}
          >
            <Play size={20} />
            {hasSave ? 'Nová Hra (Přemazat save)' : 'Zahájit Novou Hru'}
          </button>

          <button className="w-full flex items-center justify-center gap-3 bg-transparent hover:bg-[var(--surface-color)] text-[var(--text-secondary)] py-4 px-6 rounded border border-[var(--border-color)] transition-colors">
            <Settings size={20} />
            Nastavení (Verze 0.5.1)
          </button>
        </div>
        
      </div>
    </div>
  );
};
