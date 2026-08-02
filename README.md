# Středověk - Webová Textová Strategie

Tento projekt je prohlížečová textová strategická a manažerská hra zasazená do fiktivního středověkého světa. Hra využívá React 18, TypeScript, Vite a Dexie.js pro ukládání dat. Zpracování herní logiky je postaveno na Headless Engine s architekturou ECS (Entity-Component-System).

## Architektura a Herní Pravidla (GDD)

**Všechna zásadní rozhodnutí o herních mechanikách, pravidlech, příběhu i architektuře jsou evidována v dokumentu [MASTER_GDD.md](./MASTER_GDD.md).**
Tento soubor představuje Single Source of Truth (SSOT). Nikdy neimplementujte novou logiku, aniž by byla nejprve schválena a zapsána do GDD.

## Problémy a Vývoj (Audit)

Pokud objevíte nedořešený mechanismus nebo nejasnost, zapište ho do fronty úkolů ve složce [audit/Aktivni_Audity.md](./audit/Aktivni_Audity.md).
Pravidla pro vedení záznamů naleznete v [audit/Pravidla_Auditu.md](./audit/Pravidla_Auditu.md).

## Vývoj (Spuštění projektu)

```bash
npm install
npm run dev
```
