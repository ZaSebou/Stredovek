import React from 'react';
import { LogOut, CalendarDays, Castle, ShieldAlert } from 'lucide-react';

interface HUDProps {
  onBackToMenu: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onBackToMenu }) => {
  return (
    <div className="bg-[var(--bg-color)] border-b border-[var(--border-color)] px-6 py-3 flex items-center justify-between shadow-md z-10 relative">
      
      {/* Vlevo: Identita a Globální Bohatství */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <Castle className="text-[var(--color-wood-300)]" size={24} />
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Dynastie</div>
            <div className="text-lg font-bold text-[var(--color-gold-400)] tracking-wide">Zakladatel (Zatím beze jména)</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 border-l border-[var(--border-color)] pl-8">
          <ShieldAlert className="text-[var(--color-gold-400)]" size={20} />
          <div className="cursor-pointer hover:text-white transition-colors" title="Klikni pro detail rozpočtů">
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Zásobování armády</div>
            <div className="text-lg font-bold text-red-400">Kritické (1/5)</div>
          </div>
        </div>
      </div>

      {/* Vpravo: Čas a Menu */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Letopočet</div>
            <div className="text-lg font-bold">Rok 1, Den 1</div>
          </div>
          <CalendarDays className="text-[var(--text-secondary)]" size={24} />
        </div>
        
        <button 
          onClick={onBackToMenu}
          className="bg-[var(--surface-color)] hover:bg-[var(--surface-light)] p-2 rounded border border-[var(--border-color)] transition-colors text-[var(--text-secondary)] hover:text-white flex items-center gap-2"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Menu</span>
        </button>
      </div>
      
    </div>
  );
};
