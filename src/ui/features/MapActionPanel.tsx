import React from 'react';
import { Pickaxe, ArrowUpCircle, Eye, Navigation, PlusCircle, Coins, Book, Sword, Hammer } from 'lucide-react';
import { gameService } from '../../core/GameService';
import { MapComponent } from '../../core/ecs/components/MapComponent';
import { ArchetypeComponent } from '../../core/ecs/components/CoreComponents';

// Pomocná mapa názvů
const BiomeNames: Record<string, string> = {
  empty: 'Prázdná pláň',
  village: 'Vesnice',
  city: 'Město',
  road: 'Cesta',
  nature: 'Les / Příroda',
  obstacle: 'Skály / Hory',
  fort: 'Pevnost',
  water: 'Vodní plocha'
};

export const MapActionPanel: React.FC = () => {
  const selectedHex = gameService.selectedHex;
  const mapEntity = gameService.getMapEntity();
  const mapComp = mapEntity?.getComponent<MapComponent>('MapComponent');
  
  const player = gameService.getPlayerEntity();

  let locName = 'Nevybráno';
  let coords = '';
  let isDiscovered = false;
  let currentTile = null;
  
  if (selectedHex && mapComp) {
    currentTile = mapComp.tiles.find(t => t.q === selectedHex.q && t.r === selectedHex.r);
    if (currentTile && currentTile.discovered) {
      locName = BiomeNames[currentTile.type] || currentTile.type;
      coords = ` (${currentTile.q}, ${currentTile.r})`;
      isDiscovered = true;
    } else if (currentTile && !currentTile.discovered) {
      locName = 'Neznámé území';
      coords = ` (${currentTile.q}, ${currentTile.r})`;
      isDiscovered = false;
    }
  }

  const renderTutorialEvent = (eventId: string) => {
    switch (eventId) {
      case 'farm':
        return (
          <button className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-green-400 text-left px-3 py-3 rounded transition-all flex flex-col gap-1 shadow shadow-green-900/20">
             <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-medium text-green-300"><Pickaxe size={16} /> Zkusit okopat zaplevelený záhon</div><span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Úkol</span></div>
             <span className="text-xs text-[var(--text-secondary)]">Získáš první XP a SP pro Zemědělství. (Ve vývoji)</span>
          </button>
        );
      case 'craft':
        return (
          <button className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-orange-400 text-left px-3 py-3 rounded transition-all flex flex-col gap-1 shadow shadow-orange-900/20">
             <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-medium text-orange-300"><Hammer size={16} /> Zkusit opravit starý plot</div><span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Úkol</span></div>
             <span className="text-xs text-[var(--text-secondary)]">Získáš první XP a SP pro Řemeslo. (Ve vývoji)</span>
          </button>
        );
      case 'combat':
        return (
          <button className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-red-400 text-left px-3 py-3 rounded transition-all flex flex-col gap-1 shadow shadow-red-900/20">
             <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-medium text-red-300"><Sword size={16} /> Odehnat divokou zvěř</div><span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Úkol</span></div>
             <span className="text-xs text-[var(--text-secondary)]">Získáš první XP a SP pro Boj. (Ve vývoji)</span>
          </button>
        );
      case 'explore':
        return (
          <button className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-blue-400 text-left px-3 py-3 rounded transition-all flex flex-col gap-1 shadow shadow-blue-900/20">
             <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-medium text-blue-300"><Eye size={16} /> Prozkoumat opuštěný vůz</div><span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Úkol</span></div>
             <span className="text-xs text-[var(--text-secondary)]">Získáš první obecné XP a zlaťáky. (Ve vývoji)</span>
          </button>
        );
      default: return null;
    }
  };

  return (
    <div className="h-full bg-[var(--surface-color)]/30 rounded border border-[var(--border-color)] p-4 overflow-y-auto custom-scrollbar">
      <h3 className="text-sm font-medium text-[var(--color-wood-300)] uppercase tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">
        Lokace: {locName}
        <span className="text-xs text-[var(--text-secondary)] normal-case tracking-normal ml-2">{coords}</span>
      </h3>
      
      {selectedHex ? (
        <div className="flex flex-col gap-2">
          {!isDiscovered ? (
            <button 
              onClick={() => gameService.exploreHex(selectedHex.q, selectedHex.r)}
              className="w-full bg-[var(--surface-color)] hover:bg-[var(--surface-light)] border border-[var(--color-wood-300)] text-left px-3 py-2 rounded transition-colors text-[var(--color-wood-300)] flex items-center gap-3 text-sm shadow-[0_0_10px_rgba(192,132,97,0.1)]"
            >
              <Eye size={16} />
              Prozkoumat cestu (5 Energie)
            </button>
          ) : (
            <>
              {currentTile?.tutorialEvent && renderTutorialEvent(currentTile.tutorialEvent)}
              {gameService.activeMapMode === 'global' ? (
                <>
                  <button 
                    onClick={() => alert('Cestování bude spouštět eventový systém (ve vývoji).')}
                    className="w-full bg-[var(--bg-color)] hover:bg-[var(--surface-light)] border border-[var(--color-wood-400)] text-left px-3 py-2 rounded transition-colors text-[var(--color-wood-400)] flex items-center gap-3 text-sm"
                  >
                    <Navigation size={16} />
                    Cestovat do lokace (20 Energie)
                  </button>
                  <button disabled className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)]/30 text-left px-3 py-2 rounded text-[var(--text-secondary)]/50 cursor-not-allowed flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <PlusCircle size={16} />
                      Založit novou vesnici
                    </div>
                    <span className="text-[10px] uppercase text-[var(--accent-color)] border border-[var(--accent-color)]/30 px-1.5 py-0.5 rounded">Ve vývoji</span>
                  </button>
                  <button disabled className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)]/30 text-left px-3 py-2 rounded text-[var(--text-secondary)]/50 cursor-not-allowed flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <ArrowUpCircle size={16} />
                      Povýšit vesnici na město
                    </div>
                    <span className="text-[10px] uppercase text-[var(--accent-color)] border border-[var(--accent-color)]/30 px-1.5 py-0.5 rounded">Ve vývoji</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full bg-[var(--bg-color)] hover:bg-[var(--surface-light)] border border-[var(--border-color)] text-left px-3 py-2 rounded transition-colors text-[var(--text-primary)] flex items-center gap-3 text-sm">
                    <Pickaxe size={16} className="text-[var(--text-secondary)]" />
                    Založit pole (10 Energie)
                  </button>
                  <button disabled className="w-full bg-[var(--bg-color)]/50 border border-[var(--border-color)]/30 text-left px-3 py-2 rounded text-[var(--text-secondary)]/50 cursor-not-allowed flex items-center gap-3 text-sm">
                    <ArrowUpCircle size={16} />
                    Vylepšit (Chybí budova)
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <p className="text-sm text-[var(--text-secondary)] italic">Vyber pole na mapě pro zobrazení možností.</p>
      )}
    </div>
  );
};
