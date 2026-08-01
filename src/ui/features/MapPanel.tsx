import React, { useState } from 'react';
import { Map as MapIcon, Globe, MapPin } from 'lucide-react';

export const MapPanel: React.FC = () => {
  const [isGlobal, setIsGlobal] = useState(false);

  // Generování jednoduché placeholder mřížky 16x8
  const gridCells = Array.from({ length: 128 }, (_, i) => i);

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

      {/* Zjednodušená interaktivní mřížka */}
      <div className="flex-1 p-4 flex items-center justify-center bg-[#1a0f0a] overflow-hidden">
        <div 
          className="grid gap-px w-full max-w-3xl"
          style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
        >
          {gridCells.map((i) => (
            <div 
              key={i} 
              className="bg-[var(--surface-color)] hover:bg-[var(--accent-color)] border border-[var(--border-color)]/30 cursor-pointer transition-colors duration-200 aspect-square"
              onClick={() => console.log(`Kliknuto na políčko ${i}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
