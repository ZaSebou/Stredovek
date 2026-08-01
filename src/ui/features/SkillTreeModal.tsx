import React from 'react';
import { X, Sprout, Hammer, Sword, Sparkles } from 'lucide-react';
import { gameService } from '../../core/GameService';
import { SkillsComponent } from '../../core/ecs/components/CoreComponents';

interface SkillTreeModalProps {
  onClose: () => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({ onClose }) => {
  const player = gameService.getPlayerEntity();
  const skills = player?.getComponent<SkillsComponent>('SkillsComponent');

  if (!skills) return null;

  const hasSkill = (id: string) => skills.unlockedSkills.includes(id);

  const handleUnlock = (id: string, category: 'farming' | 'crafting' | 'combat' | 'magic', cost: number) => {
    gameService.unlockSkill(id, category, cost);
  };

  const renderSkillNode = (
    id: string, 
    label: string, 
    desc: string, 
    category: 'farming' | 'crafting' | 'combat' | 'magic', 
    cost: number,
    icon: React.ReactNode,
    req?: string
  ) => {
    const isUnlocked = hasSkill(id);
    const canUnlock = !isUnlocked && (!req || hasSkill(req));
    const xpAvailable = skills.xp[category] ?? 0;
    const canAfford = xpAvailable >= cost;

    let bgClass = 'bg-[var(--surface-color)] border-[var(--border-color)] opacity-50';
    let textClass = 'text-[var(--text-secondary)]';

    if (isUnlocked) {
      bgClass = 'bg-[var(--color-gold-400)]/20 border-[var(--color-gold-400)]';
      textClass = 'text-[var(--color-gold-400)] font-medium';
    } else if (canUnlock) {
      bgClass = canAfford ? 'bg-[var(--surface-light)] border-green-500/50 cursor-pointer hover:border-green-400' : 'bg-[var(--surface-light)] border-[var(--border-color)] cursor-not-allowed';
      textClass = 'text-[var(--text-primary)]';
    }

    return (
      <div 
        className={`w-64 p-4 rounded-lg border-2 transition-all flex flex-col gap-2 ${bgClass}`}
        onClick={() => {
          if (canUnlock && canAfford) {
            handleUnlock(id, category, cost);
          }
        }}
      >
        <div className="flex items-center gap-2">
          <div className={textClass}>{icon}</div>
          <div className={textClass}>{label}</div>
        </div>
        <div className="text-xs text-[var(--text-secondary)]">{desc}</div>
        
        {!isUnlocked && (
          <div className={`text-xs mt-2 font-medium ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
            Cena: {cost} {category.toUpperCase()} XP
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--bg-color)]/90">
        <h2 className="text-2xl font-serif text-[var(--color-gold-400)]">Strom Dovedností</h2>
        
        {/* XP Status */}
        <div className="flex gap-6">
          <div className="flex flex-col items-center"><span className="text-xs text-green-400">Přežití</span><span className="font-bold">{skills.xp.farming} XP</span></div>
          <div className="flex flex-col items-center"><span className="text-xs text-orange-400">Řemeslo</span><span className="font-bold">{skills.xp.crafting} XP</span></div>
          <div className="flex flex-col items-center"><span className="text-xs text-red-400">Boj</span><span className="font-bold">{skills.xp.combat} XP</span></div>
          <div className="flex flex-col items-center"><span className="text-xs text-purple-400">Magie</span><span className="font-bold">{skills.xp.magic} XP</span></div>
        </div>

        <button 
          onClick={onClose}
          className="p-2 hover:bg-[var(--surface-color)] rounded transition-colors text-[var(--text-secondary)] hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* Tree Container */}
      <div className="flex-1 overflow-auto p-12 custom-scrollbar flex justify-center">
        
        <div className="grid grid-cols-4 gap-12">
          
          {/* Přežití / Zemědělství */}
          <div className="flex flex-col items-center gap-8">
            <h3 className="text-lg text-green-400 font-medium mb-4 flex items-center gap-2"><Sprout /> Přežití a Zemědělství</h3>
            {renderSkillNode('farm_1', 'Základy obdělávání', 'Odemkne stavbu základního pole.', 'farming', 10, <Sprout size={16} />)}
            {renderSkillNode('farm_2', 'Odolnost', 'Trvale zvýší maximální energii o 20.', 'farming', 50, <Sprout size={16} />, 'farm_1')}
          </div>

          {/* Řemeslo / Obchod */}
          <div className="flex flex-col items-center gap-8">
            <h3 className="text-lg text-orange-400 font-medium mb-4 flex items-center gap-2"><Hammer /> Řemeslo a Obchod</h3>
            {renderSkillNode('craft_1', 'Základní nástroje', 'Odemkne výrobu lepších rýčů.', 'crafting', 10, <Hammer size={16} />)}
            {renderSkillNode('craft_2', 'Pokročilá dílna', 'Odemyká přístavbu k dílně.', 'crafting', 50, <Hammer size={16} />, 'craft_1')}
          </div>

          {/* Boj / Taktika */}
          <div className="flex flex-col items-center gap-8">
            <h3 className="text-lg text-red-400 font-medium mb-4 flex items-center gap-2"><Sword /> Boj a Taktika</h3>
            {renderSkillNode('combat_1', 'Základy šermu', 'Trvale zvýší Útok o 2.', 'combat', 10, <Sword size={16} />)}
            {renderSkillNode('combat_2', 'Obranný postoj', 'Trvale zvýší Obranu o 2.', 'combat', 50, <Sword size={16} />, 'combat_1')}
          </div>

          {/* Magie / Okultismus */}
          <div className="flex flex-col items-center gap-8">
            <h3 className="text-lg text-purple-400 font-medium mb-4 flex items-center gap-2"><Sparkles /> Magie a Okultismus</h3>
            {renderSkillNode('magic_1', 'Soustředění', 'Trvale zvýší Max Manu o 20.', 'magic', 10, <Sparkles size={16} />)}
            {renderSkillNode('magic_2', 'Alchymie', 'Odemkne výrobu jednoduchých lektvarů.', 'magic', 50, <Sparkles size={16} />, 'magic_1')}
          </div>

        </div>

      </div>
    </div>
  );
};
