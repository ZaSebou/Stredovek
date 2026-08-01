import React from 'react';
import { Pickaxe, ArrowUpCircle } from 'lucide-react';

export const MapActionPanel: React.FC = () => {
  return (
    <div className="h-full bg-[var(--surface-color)]/30 rounded border border-[var(--border-color)] p-4 overflow-y-auto custom-scrollbar">
      <h3 className="text-sm font-medium text-[var(--color-wood-300)] uppercase tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">Lokace: Prázdná pláň</h3>
      
      <div className="flex flex-col gap-2">
        <button className="w-full bg-[var(--bg-color)] hover:bg-[var(--surface-light)] border border-[var(--border-color)] text-left px-3 py-2 rounded transition-colors text-[var(--text-primary)] flex items-center gap-3 text-sm">
          <Pickaxe size={16} className="text-[var(--text-secondary)]" />
          Založit pole (10 Energie)
        </button>
        <button disabled className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)]/30 text-left px-3 py-2 rounded text-[var(--text-secondary)]/50 cursor-not-allowed flex items-center gap-3 text-sm">
          <ArrowUpCircle size={16} />
          Vylepšit (Chybí budova)
        </button>
      </div>
    </div>
  );
};
