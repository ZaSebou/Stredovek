import React from 'react';
import { Hammer, Pickaxe, Book, Sword, Coins } from 'lucide-react';
import { gameService } from '../../core/GameService';
import { ArchetypeComponent } from '../../core/ecs/components/CoreComponents';

interface ActionPanelProps {
  onOpenSkillTree?: () => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ onOpenSkillTree }) => {
  const player = gameService.getPlayerEntity();
  const archetype = player?.getComponent<ArchetypeComponent>('ArchetypeComponent');

  if (archetype && !archetype.chosen) {
    return (
      <div className="flex flex-col h-full bg-[var(--surface-color)]/30 border-r border-[var(--border-color)] overflow-hidden p-6">
        <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-4">
          <h2 className="text-xl font-medium text-[var(--text-primary)]">Počátek tvé cesty</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Rozhlédni se po svém novém pozemku (klikni na okolní políčka na mapě). Tvá první akce na sousedním políčku určí tvůj osud.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--surface-color)]/30 border-r border-[var(--border-color)] overflow-hidden p-6">
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-4">
        <Hammer className="text-[var(--accent-color)]" size={24} />
        <h2 className="text-xl font-medium text-[var(--text-primary)]">Správa & Osobní Akce</h2>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
        <p className="text-sm text-[var(--text-secondary)] mb-2 italic">Akce nezávislé na vybraném políčku.</p>
        
        {/* Placeholder tlačítka simulující globální akce */}
        <button className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-[var(--border-color)] text-left px-4 py-3 rounded transition-colors text-[var(--text-primary)] flex items-center gap-3">
          <span className="bg-[var(--bg-color)] px-2 py-1 rounded text-sm text-[var(--text-secondary)]">A</span>
          Odpočinek (Doplnit Energii)
        </button>
        
        <button className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-[var(--border-color)] text-left px-4 py-3 rounded transition-colors text-[var(--text-primary)] flex items-center gap-3">
          <span className="bg-[var(--bg-color)] px-2 py-1 rounded text-sm text-[var(--text-secondary)]">B</span>
          Inventář a Vybavení
        </button>

        <button 
          onClick={onOpenSkillTree}
          className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-[var(--color-gold-400)] text-left px-4 py-3 rounded transition-colors text-[var(--text-primary)] flex items-center gap-3 shadow-[0_0_10px_rgba(250,204,21,0.1)]"
        >
          <span className="bg-[var(--bg-color)] px-2 py-1 rounded text-sm text-[var(--color-gold-400)] border border-[var(--color-gold-400)]/30">S</span>
          <span className="text-[var(--color-gold-400)] font-medium tracking-wide">Strom Dovedností</span>
        </button>

      </div>
    </div>
  );
};
