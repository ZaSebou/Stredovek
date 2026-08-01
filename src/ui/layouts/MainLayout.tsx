import React from 'react';

interface MainLayoutProps {
  hud: React.ReactNode;
  statusBar: React.ReactNode;
  mapPanel: React.ReactNode;
  mapActionPanel?: React.ReactNode;
  narrativePanel: React.ReactNode;
  statsPanel: React.ReactNode;
  actionPanel: React.ReactNode;
  craftingPanel: React.ReactNode;
  calculationPanel: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  hud, statusBar, mapPanel, mapActionPanel, narrativePanel, statsPanel, actionPanel, craftingPanel, calculationPanel 
}) => {
  return (
    <div className="flex flex-col h-screen w-full bg-[var(--bg-color)] text-[var(--text-primary)] overflow-hidden font-sans">
      
      {/* 1. HUD (Základní Globální info a Menu) */}
      <div className="flex-none">
        {hud}
      </div>

      {/* 2. STATUS BAR (Lokální info) */}
      <div className="flex-none">
        {statusBar}
      </div>

      {/* 3. HORNÍ ČÁST (Mapa + Akce Mapy + Příběh) */}
      <div className="flex-[4] min-h-0 flex w-full">
        {/* Mapa (menší a hustší) */}
        <div className="flex-[3] p-4 flex flex-col min-h-0">
          {mapPanel}
        </div>
        
        {/* Akce spojené přímo s mapou (Stavby, upgrady) */}
        <div className="flex-[2] p-4 pl-0 flex flex-col min-h-0">
          {mapActionPanel}
        </div>

        {/* Příběh */}
        <div className="flex-[3] p-4 pl-0 flex flex-col min-h-0">
          <div className="flex-1 bg-[var(--surface-color)]/30 rounded border border-[var(--border-color)] p-6 overflow-y-auto custom-scrollbar">
            {narrativePanel}
          </div>
        </div>
      </div>

      {/* 4. SPODNÍ ČÁST (Statistiky + Akce/Crafting + Logy) */}
      <div className="flex-[5] min-h-0 flex w-full border-t border-[var(--border-color)]">
        {/* Levý panel: Statistiky hráče/armády */}
        <div className="flex-[1] min-h-0 flex flex-col">
          {statsPanel}
        </div>
        
        {/* Prostřední panely: Akční pole vlevo, Crafting vpravo */}
        <div className="flex-[2.5] min-h-0 flex flex-row">
          <div className="flex-1 min-h-0 flex flex-col">
            {actionPanel}
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            {craftingPanel}
          </div>
        </div>
        
        {/* Pravý panel: Tahové a bitevní propočty */}
        <div className="flex-[1] min-h-0 flex flex-col">
          {calculationPanel}
        </div>
      </div>

    </div>
  );
};
