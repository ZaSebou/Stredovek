import React, { useState } from 'react';
import { Coins, Clock, Hammer } from 'lucide-react';

export const TacticalPanel: React.FC = () => {
  const [turn, setTurn] = useState(1);

  const handleEndTurn = () => {
    setTurn(t => t + 1);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      
      {/* Top Bar - Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--surface-color)] p-4 rounded border border-[var(--border-color)] flex items-center gap-3">
          <Clock className="text-[var(--text-secondary)]" size={20} />
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Tah</div>
            <div className="text-lg font-bold">Den {turn}</div>
          </div>
        </div>
        <div className="bg-[var(--surface-color)] p-4 rounded border border-[var(--border-color)] flex items-center gap-3">
          <Coins className="text-[var(--color-gold-400)]" size={20} />
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Pokladna</div>
            <div className="text-lg font-bold">0 Zlatek</div>
          </div>
        </div>
        <div className="bg-[var(--surface-color)] p-4 rounded border border-[var(--border-color)] flex items-center gap-3">
          <Hammer className="text-[var(--accent-color)]" size={20} />
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Materiál</div>
            <div className="text-lg font-bold">Základní nástroje</div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex-1 bg-[var(--surface-light)]/20 rounded border border-[var(--border-color)] p-6 flex flex-col">
        <h2 className="text-xl font-medium mb-6 text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">Možnosti (Taktické rozhraní)</h2>
        
        <div className="flex flex-col gap-3 flex-1">
          <button className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-[var(--border-color)] text-left px-6 py-4 rounded transition-colors text-[var(--text-primary)] flex items-center gap-3">
            <span className="bg-[var(--bg-color)] px-2 py-1 rounded text-sm text-[var(--text-secondary)]">A</span>
            Prohledat okolí boudy (Najít svůj osud)
          </button>
          
          <button disabled className="w-full bg-[var(--bg-color)] border border-[var(--border-color)]/50 text-left px-6 py-4 rounded text-[var(--text-secondary)]/50 cursor-not-allowed flex items-center gap-3">
            <span className="bg-[var(--surface-color)] px-2 py-1 rounded text-sm opacity-50">B</span>
            Postavit dílnu (Chybí materiál)
          </button>
        </div>

        {/* End Turn Action */}
        <div className="mt-8 pt-4 border-t border-[var(--border-color)]">
          <button 
            onClick={handleEndTurn}
            className="w-full bg-[var(--color-wood-500)] hover:bg-[var(--color-wood-400)] text-white font-medium px-6 py-4 rounded transition-colors shadow-lg active:scale-[0.98]"
          >
            Ukončit tah
          </button>
        </div>
      </div>
    </div>
  );
};
