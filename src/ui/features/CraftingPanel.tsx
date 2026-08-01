import React from 'react';
import { Anvil } from 'lucide-react';

export const CraftingPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[var(--surface-color)]/30 border-r border-[var(--border-color)] overflow-hidden p-6">
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-4">
        <Anvil className="text-[var(--color-wood-300)]" size={24} />
        <h2 className="text-xl font-medium text-[var(--text-primary)]">Výroba & Recepty</h2>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
        <p className="text-sm text-[var(--text-secondary)] mb-2 italic">Známé postupy (Zatím prázdné)</p>
        
        <div className="bg-[var(--bg-color)] border border-[var(--border-color)] p-4 rounded text-[var(--text-secondary)] flex items-center justify-between opacity-50">
          <div>
            <div className="font-medium text-[var(--text-primary)]">Základní Rýč</div>
            <div className="text-xs mt-1">Suroviny: 1x Dřevo, 1x Kámen</div>
          </div>
          <button disabled className="bg-[var(--surface-color)] px-3 py-1 rounded text-sm cursor-not-allowed border border-[var(--border-color)]">
            Vyrobit
          </button>
        </div>
      </div>
    </div>
  );
};
