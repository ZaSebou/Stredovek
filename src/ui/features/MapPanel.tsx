import React, { useState } from 'react';
import { Map as MapIcon, Globe, MapPin } from 'lucide-react';
import { gameService } from '../../core/GameService';
import { MapComponent } from '../../core/ecs/components/MapComponent';

const HEX_SIZE = 22;
const SQRT3 = Math.sqrt(3);

const getHexCorners = (cx: number, cy: number, size: number) => {
  return [0, 1, 2, 3, 4, 5].map(i => {
    const angle_deg = 60 * i - 30;
    const angle_rad = Math.PI / 180 * angle_deg;
    return `${cx + size * Math.cos(angle_rad)},${cy + size * Math.sin(angle_rad)}`;
  }).join(' ');
};

export const MapPanel: React.FC = () => {
  const [isGlobal, setIsGlobal] = useState(false);
  
  const mapEntity = gameService.getMapEntity();
  const mapComp = mapEntity?.getComponent<MapComponent>('MapComponent');
  const tiles = mapComp?.tiles || [];

  const handleTileClick = (q: number, r: number, discovered: boolean) => {
    // Prozkoumávání bude naší další fází
    if (!discovered) {
      gameService.exploreHex(q, r);
    } else {
      console.log(`Zvolen prozkoumaný hex q:${q} r:${r}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface-color)]/20 rounded border border-[var(--border-color)] overflow-hidden">
      {/* Header s přepínačem */}
      <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--bg-color)]">
        <div className="flex items-center gap-2">
          <MapIcon className="text-[var(--accent-color)]" size={20} />
          <h2 className="font-medium text-[var(--text-primary)]">Mapa Území</h2>
        </div>
        
        <div className="flex bg-[var(--surface-color)] rounded border border-[var(--border-color)] p-1">
          <button 
            onClick={() => setIsGlobal(false)}
            className={`px-3 py-1 rounded text-sm flex items-center gap-2 transition-colors ${!isGlobal ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <MapPin size={14} /> Lokální
          </button>
          <button 
            onClick={() => setIsGlobal(true)}
            className={`px-3 py-1 rounded text-sm flex items-center gap-2 transition-colors ${isGlobal ? 'bg-[var(--color-wood-500)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Globe size={14} /> Globální
          </button>
        </div>
      </div>

      {/* Hex mřížka */}
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-color)] overflow-hidden relative">
        <svg 
          viewBox="-200 -200 400 400" 
          className="w-full h-full max-w-full max-h-full drop-shadow-xl"
        >
          <g>
            {tiles.map((tile) => {
              // Výpočet pozice středu hexu
              const cx = HEX_SIZE * SQRT3 * (tile.q + tile.r / 2);
              const cy = HEX_SIZE * 3/2 * tile.r;
              
              const points = getHexCorners(cx, cy, HEX_SIZE - 1); // -1 pro mezeru mezi hexy
              
              const fill = tile.discovered ? `var(--biome-${tile.type})` : `var(--biome-undiscovered)`;
              const stroke = tile.discovered ? `var(--border-color)` : `#2a1a12`;
              
              return (
                <polygon
                  key={`${tile.q}_${tile.r}`}
                  points={points}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="1.5"
                  className={`transition-colors duration-300 ${tile.discovered ? 'hover:brightness-125 cursor-pointer' : 'cursor-help hover:fill-[var(--surface-color)]'}`}
                  onClick={() => handleTileClick(tile.q, tile.r, tile.discovered)}
                >
                  <title>
                    {tile.discovered ? `Typ: ${tile.type} (q:${tile.q}, r:${tile.r})` : 'Neznámé území'}
                  </title>
                </polygon>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
