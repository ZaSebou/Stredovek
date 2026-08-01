import React from 'react';
import { Calculator } from 'lucide-react';

import { gameService } from '../../core/GameService';

export const CalculationPanel: React.FC = () => {
  const turn = gameService.getTurn();

  const handleEndTurn = () => {
    gameService.nextTurn();
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-color)] p-6 relative">
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-4">
        <Calculator className="text-[var(--color-wood-300)]" size={24} />
        <h2 className="text-xl font-medium text-[var(--text-primary)]">Taktické Záznamy</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        <div className="bg-[var(--surface-color)]/50 p-3 rounded border border-[var(--border-color)]/50">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Systém: Analýza prostředí</p>
          <p className="text-sm">Během průzkumu nebylo zjištěno žádné vnější nebezpečí. Daně odváděné Koruně zůstávají na 0 (Příjem rolníka).</p>
        </div>
        
        <div className="bg-[var(--surface-color)]/50 p-3 rounded border border-[var(--border-color)]/50 border-l-2 border-l-[var(--color-gold-400)]">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Tah {turn} započal</p>
          <p className="text-sm">Čekám na tvé akce.</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
        <button 
          onClick={handleEndTurn}
          className="w-full bg-[var(--color-wood-500)] hover:bg-[var(--color-wood-400)] text-white font-medium px-6 py-4 rounded transition-colors shadow-lg active:scale-[0.98] text-lg tracking-wide"
        >
          Ukončit Tah ({turn})
        </button>
      </div>
    </div>
  );
};
