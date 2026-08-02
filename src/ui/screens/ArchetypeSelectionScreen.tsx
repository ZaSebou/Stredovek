import React from 'react';
import { Hammer, Coins, Sparkles, Swords } from 'lucide-react';

interface ArchetypeSelectionScreenProps {
  onSelect: (id: 'builder' | 'thief' | 'mage' | 'warrior') => void;
}

export const ArchetypeSelectionScreen: React.FC<ArchetypeSelectionScreenProps> = ({ onSelect }) => {
  const archetypes = [
    {
      id: 'builder' as const,
      name: 'Stavitel',
      description: 'Zručný v práci s materiály. Získá Rýč, vysokou energii a spolehlivé zdraví.',
      icon: <Hammer size={48} className="text-[var(--color-wood-400)]" />,
      stats: 'HP: 100 | Energie: 80',
      color: 'hover:border-[var(--color-wood-400)] hover:shadow-[0_0_20px_var(--color-wood-400)]',
    },
    {
      id: 'thief' as const,
      name: 'Zloděj',
      description: 'Hbitý a lstivý. Získá Dýku, 50 zlata a vysokou agilitu.',
      icon: <Coins size={48} className="text-yellow-400" />,
      stats: 'HP: 80 | Energie: 60 | Agilita: 5',
      color: 'hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]',
    },
    {
      id: 'mage' as const,
      name: 'Mág',
      description: 'Znalec tajných umění. Získá Knihu magie a obrovský intelekt.',
      icon: <Sparkles size={48} className="text-blue-400" />,
      stats: 'HP: 60 | Mana: 40 | Intelekt: 8',
      color: 'hover:border-blue-400 hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]',
    },
    {
      id: 'warrior' as const,
      name: 'Válečník',
      description: 'Silný a odolný. Získá Rezavý meč a bonusy k útoku a obraně.',
      icon: <Swords size={48} className="text-red-400" />,
      stats: 'HP: 120 | Útok: 8 | Obrana: 5',
      color: 'hover:border-red-400 hover:shadow-[0_0_20px_rgba(248,113,113,0.4)]',
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-primary)] relative overflow-hidden p-8">
      
      {/* Dekorativní pozadí */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-color)] via-[var(--surface-color)] to-[var(--bg-color)] opacity-50 z-0"></div>
      
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-[var(--text-primary)]">KÝM JSI BYL?</h1>
          <p className="text-[var(--color-wood-400)] tracking-[0.2em] uppercase text-sm max-w-2xl mx-auto">
            Každý příběh někde začíná. Zvol si svou minulost, která určí tvé počáteční předpoklady do budoucna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {archetypes.map((arch) => (
            <button
              key={arch.id}
              onClick={() => onSelect(arch.id)}
              className={`
                flex flex-col items-center text-center p-8 rounded-xl
                bg-[var(--surface-color)] border border-[var(--border-color)]
                transition-all duration-300 transform hover:-translate-y-2
                group cursor-pointer ${arch.color}
              `}
            >
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                {arch.icon}
              </div>
              <h2 className="text-2xl font-serif mb-4 text-white group-hover:text-[var(--color-gold-400)] transition-colors">
                {arch.name}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mb-6 flex-grow leading-relaxed">
                {arch.description}
              </p>
              <div className="mt-auto pt-4 border-t border-[var(--border-color)] w-full">
                <span className="text-xs font-mono text-[var(--color-wood-400)]">
                  {arch.stats}
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
