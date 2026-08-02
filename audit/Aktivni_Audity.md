# Aktivní Audity (Fronta k řešení)

Tento soubor obsahuje seznam mechanismů, UI prvků nebo systémů, které aktuálně vyžadují analýzu, zanesení do GDD a následnou implementaci do kódu.

## Nevyřešené položky

- **UI pro Organický výběr povolání (Archetype Selection)**
  - *Stav:* Kód v ECS je (`ArchetypeSystem.ts`), UI prvky (tlačítka v `ActionPanel.tsx`) jsou také napsány. 
  - *Problém:* Je nutné napojit hru tak, aby se tato úvodní volba předložila hráči ve správný čas (úplný začátek po startu nové hry).
  - *Očekávané řešení:* Prověřit tok událostí (Game Loop) a zobrazit Archetype Selection screen/okno.

- **Údržba (Maintenance) a Odtok zdrojů (Resource Sinks)**
  - *Stav:* Nastíněno v GDD a `MaintenanceSystem.ts`.
  - *Problém:* Musí se doladit a vizualizovat odečítání jídla/peněz na konci tahu a penalizace za nedostatek.
