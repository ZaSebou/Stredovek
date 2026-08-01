import React from 'react';
import { Hammer, Clock, Pickaxe, Book, Sword, Coins } from 'lucide-react';
import { gameService } from '../../core/GameService';
import { ArchetypeComponent } from '../../core/ecs/components/CoreComponents';

export const ActionPanel: React.FC = () => {
  const player = gameService.getPlayerEntity();
  const archetype = player?.getComponent<ArchetypeComponent>('ArchetypeComponent');

  if (archetype && !archetype.chosen) {
    return (
      <div className="flex flex-col h-full bg-[var(--surface-color)]/30 border-r border-b border-[var(--border-color)] overflow-hidden p-6">
        <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-4">
          <h2 className="text-xl font-medium text-[var(--text-primary)]">Počátek tvé cesty</h2>
        </div>
        
        <p className="text-sm text-[var(--text-secondary)] mb-6">Rozhlédni se po svém novém pozemku. Tvá první akce určí tvůj osud.</p>
        
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
          <button 
            onClick={() => gameService.chooseArchetype('builder')}
            className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-[var(--color-wood-400)] text-left px-4 py-4 rounded transition-all text-[var(--text-primary)] flex flex-col gap-1 shadow hover:scale-[1.02] relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-orange-300">
                <Pickaxe size={18} /> Sebrat starý rýč
              </div>
              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">-5 Energie</span>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">Stavitel a zemědělec. Vysoké HP a energie. Získáš rýč.</span>
          </button>
          
          <button 
            onClick={() => gameService.chooseArchetype('thief')}
            className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-[var(--color-wood-400)] text-left px-4 py-4 rounded transition-all text-[var(--text-primary)] flex flex-col gap-1 shadow hover:scale-[1.02] relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-yellow-300">
                <Coins size={18} /> Ukrást pohozený měšec
              </div>
              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">-5 Energie</span>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">Zloděj a diplomat. Získáš 50 Zlatých a skrytou dýku.</span>
          </button>
          
          <button 
            onClick={() => gameService.chooseArchetype('mage')}
            className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-[var(--color-purple-400)] text-left px-4 py-4 rounded transition-all text-[var(--text-primary)] flex flex-col gap-1 shadow hover:scale-[1.02] relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-purple-300">
                <Book size={18} /> Oprášit cizí knihu
              </div>
              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">-10 Energie</span>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">Mág. Odemkne 40 Many a získáš magickou knihu.</span>
          </button>
          
          <button 
            onClick={() => gameService.chooseArchetype('warrior')}
            className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-[var(--color-red-400)] text-left px-4 py-4 rounded transition-all text-[var(--text-primary)] flex flex-col gap-1 shadow hover:scale-[1.02] relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-red-300">
                <Sword size={18} /> Vytáhnout rezavý meč
              </div>
              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">-15 Energie</span>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">Válečník. Ohromné zdraví a útok, ale velká námaha.</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--surface-color)]/30 border-r border-b border-[var(--border-color)] overflow-hidden p-6">
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

      </div>
      
      {/* Tlačítko pro další tah pevně dole */}
      <div className="pt-4 border-t border-[var(--border-color)] mt-auto">
        <button 
          onClick={() => gameService.nextTurn()}
          className="w-full bg-[var(--color-wood-600)] hover:bg-[var(--color-wood-500)] text-white border border-[var(--color-wood-400)] py-3 px-4 rounded transition-colors flex items-center justify-center gap-2 font-bold shadow-lg"
        >
          <Clock size={20} />
          Ukončit tah (Další tah)
        </button>
      </div>
    </div>
  );
};
