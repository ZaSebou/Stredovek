import React, { useState } from 'react';
import { User, Users } from 'lucide-react';
import { gameService } from '../../core/GameService';
import { NameComponent, ResourceComponent, StatsComponent } from '../../core/ecs/components/CoreComponents';

export const StatsPanel: React.FC = () => {
  const [view, setView] = useState<'player' | 'army'>('player');

  const player = gameService.getPlayerEntity();
  const nameComp = player?.getComponent<NameComponent>('NameComponent');
  const resComp = player?.getComponent<ResourceComponent>('ResourceComponent');
  const statsComp = player?.getComponent<StatsComponent>('StatsComponent');

  return (
    <div className="flex flex-col h-full bg-[var(--bg-color)] border-r border-[var(--border-color)] overflow-hidden">
      
      {/* Záložky pro přepínání */}
      <div className="flex border-b border-[var(--border-color)]">
        <button 
          onClick={() => setView('player')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${view === 'player' ? 'bg-[var(--surface-color)] text-[var(--color-gold-400)] border-b-2 border-[var(--color-gold-400)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-light)]/20'}`}
        >
          <User size={18} /> Hrdina
        </button>
        <button 
          onClick={() => setView('army')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${view === 'army' ? 'bg-[var(--surface-color)] text-[var(--color-gold-400)] border-b-2 border-[var(--color-gold-400)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-light)]/20'}`}
        >
          <Users size={18} /> Armáda / Tlupa
        </button>
      </div>

      {/* Obsah statistik */}
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        {view === 'player' ? (
          <div className="space-y-4">
            <h3 className="text-xl text-[var(--text-primary)] mb-4">{nameComp ? nameComp.name : 'Neznámý'}</h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
              <div className="flex justify-between border-b border-[var(--border-color)] pb-1">
                <span className="text-[var(--text-secondary)]">Síla (Útok)</span>
                <span className="font-medium text-red-400">{statsComp?.attack ?? 0}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-1">
                <span className="text-[var(--text-secondary)]">Obrana</span>
                <span className="font-medium text-gray-400">{statsComp?.defense ?? 0}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-1">
                <span className="text-[var(--text-secondary)]">Intelekt</span>
                <span className="font-medium text-blue-400">{statsComp?.intellect ?? 0}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-1">
                <span className="text-[var(--text-secondary)]">Obratnost</span>
                <span className="font-medium text-green-300">{statsComp?.agility ?? 0}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-1 col-span-2 mt-2">
                <span className="text-[var(--text-secondary)]">Mana</span>
                <span className="font-medium text-purple-400">{statsComp?.mana ?? 0} / {statsComp?.maxMana ?? 0}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-1 col-span-2 mt-2">
                <span className="text-[var(--text-secondary)]">Zdraví (HP)</span>
                <span className="font-medium text-green-400">{statsComp?.hp ?? 0} / {statsComp?.maxHp ?? 0}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-1 col-span-2 mt-2">
                <span className="text-[var(--text-secondary)]">Energie (Stamina)</span>
                <span className="font-medium text-yellow-400">{statsComp?.energy ?? 0} / {statsComp?.maxEnergy ?? 0}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm uppercase tracking-wider text-[var(--color-wood-400)] mb-3">Bohatství a Zásoby</h4>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--text-secondary)]">Zlato</span>
                <span className="font-medium text-[var(--color-gold-400)]">{resComp?.gold ?? 0}</span>
              </div>
              
              <div className="mt-2 text-sm">
                <span className="text-[var(--text-secondary)] block mb-1">Jídlo:</span>
                {resComp?.food.map((f, i) => (
                  <div key={i} className="flex justify-between pl-2">
                    <span className="text-[var(--text-secondary)]">- {f.type}</span>
                    <span className="text-[var(--text-primary)]">{f.amount}x (E:{f.energy})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border-color)] border-dashed">
              <h4 className="text-sm uppercase tracking-wider text-[var(--color-wood-400)] mb-3">Aktivní vybavení</h4>
              {resComp?.items.map((it, i) => (
                <p key={i} className="text-[var(--text-secondary)] italic">{it.type} ({it.amount}x)</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             <h3 className="text-xl text-[var(--text-primary)] mb-4">Žádná armáda</h3>
             <p className="text-[var(--text-secondary)] italic">Zatím nikoho nezaměstnáváš ani nevedeš do boje.</p>
          </div>
        )}
      </div>
    </div>
  );
};
