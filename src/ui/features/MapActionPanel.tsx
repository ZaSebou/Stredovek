import React from 'react';
import { Pickaxe, ArrowUpCircle } from 'lucide-react';
import { gameService } from '../../core/GameService';
import { MapComponent } from '../../core/ecs/components/MapComponent';

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
  
  let locName = 'Nevybráno';
  let coords = '';
  
  if (selectedHex && mapComp) {
    const tile = mapComp.tiles.find(t => t.q === selectedHex.q && t.r === selectedHex.r);
    if (tile && tile.discovered) {
      locName = BiomeNames[tile.type] || tile.type;
      coords = ` (${tile.q}, ${tile.r})`;
    } else if (tile && !tile.discovered) {
      locName = 'Neznámé území';
      coords = ` (${tile.q}, ${tile.r})`;
    }
  }

  return (
    <div className="h-full bg-[var(--surface-color)]/30 rounded border border-[var(--border-color)] p-4 overflow-y-auto custom-scrollbar">
      <h3 className="text-sm font-medium text-[var(--color-wood-300)] uppercase tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">
        Lokace: {locName}
        <span className="text-xs text-[var(--text-secondary)] normal-case tracking-normal ml-2">{coords}</span>
      </h3>
      
      {selectedHex ? (
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
      ) : (
        <p className="text-sm text-[var(--text-secondary)] italic">Vyber pole na mapě pro zobrazení možností.</p>
      )}
    </div>
  );
};
