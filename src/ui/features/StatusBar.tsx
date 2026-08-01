import React from 'react';
import { SunSnow, ShieldAlert, Sparkles, Calendar } from 'lucide-react';
import { gameService } from '../../core/GameService';

export const StatusBar: React.FC = () => {
  return (
    <div className="bg-[var(--surface-color)] border-y border-[var(--border-color)] px-6 py-2 flex items-center justify-between text-sm shadow-inner">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[var(--color-wood-400)] font-bold border-r border-[var(--border-color)] pr-4">
          <Calendar size={16} />
          <span>Tah {gameService.world.currentTurn}</span>
        </div>
        <span className="font-medium text-[var(--color-gold-400)]">Království: Stabilní</span>
        
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <SunSnow size={16} className="text-blue-300" />
          <span>Období: Konec Zimy (Úroda -50%)</span>
        </div>

        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <ShieldAlert size={16} className="text-red-400" />
          <span>Daňové zatížení: Vysoké</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[var(--color-purple-400)]">
        <Sparkles size={16} />
        <span className="italic">Aktivní kletba: Sušší prameny</span>
      </div>
    </div>
  );
};
