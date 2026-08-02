import { Settings } from 'lucide-react';

export const NastaveniTab = () => {
  return (
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
        <Settings className="text-[var(--text-secondary)]" size={24} />
        <h2 className="text-xl font-medium text-[var(--text-primary)]">Nastavení hry (Verze 0.9.0)</h2>
      </div>
  );
};
