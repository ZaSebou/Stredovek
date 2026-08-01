import React from 'react';
import { Scroll } from 'lucide-react';

export const NarrativePanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-2">
        <Scroll className="text-[var(--accent-color)]" size={24} />
        <h1 className="text-2xl font-semibold tracking-wide text-[var(--color-gold-400)]">Kronika Světa</h1>
      </div>
      
      <div className="space-y-6 text-lg leading-relaxed text-[var(--text-secondary)]">
        <p>
          <span className="text-xl text-[var(--text-primary)] font-medium">Začátek cesty.</span><br />
          Král ti daroval svobodu a malý kousek země na samém okraji říše. Stojíš před starou dřevěnou boudou. V ruce svíráš pár zrezivělých nástrojů. 
        </p>
        <p className="italic text-[var(--accent-color)]">
          Rozhlížíš se po svém novém pozemku. Můžeš to vzdát a zemřít hlady, nebo začít pracovat.
        </p>
      </div>
    </div>
  );
};
