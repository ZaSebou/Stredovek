---
name: project-stredovek
description: Lokální pravidla pro projekt Středověk (GDD, Textové UI, Architektura, Pre-commit, Striktní TypeScript).
---

# Lokální pravidla pro projekt Středověk

## 1. Práce s GDD (Game Design Document) - ZÁSADNÍ
- Na začátku každého vlákna (konverzace) si MUSÍŠ vyhledat a přečíst aktuální Game Design Document (GDD).
- Při veškerém vývoji a návrhu se tímto dokumentem striktně řiď.
- Pokud při vývoji vznikne úprava mechanik nebo přidání nové, MUSÍŠ na konci práce (nebo před commitem) GDD příslušně aktualizovat.

## 2. Styling a UI (Text-First přístup)
- Hra je výhradně o textu, volbách a skillu hráče. Ne o grafice.
- **ZÁKAZ:** Nepřidávej žádné animace, zvuky, ani objemná obrázková data.
- **VIZUALIZACE:** K vizualizaci dat, statistik a příběhu hledej chytrá řešení – využívej čistý layout, práci s fonty (typografie), ASCII / textové symboly nebo jednoduché geometrické prvky.

## 3. Architektura a Herní logiky
- Striktně odděluj herní logiku a datové modely od UI komponent.
- Všechny výpočty a změny stavu zpracovávej v oddělených modulech, funkcích či React hookových (např. custom hooks, které odstíní logiku od vizuálu).

## 4. Kvalita kódu před commitem (Pre-commit)
- Vždy, než provedeš příkaz `git commit` a následný `push` (jak určuje globální pravidlo), MUSÍŠ v projektu spustit kontrolní skripty.
- Spusť linter a kontrolu kódu (např. `npm run lint`, případně typovou kontrolu, pokud se používá TypeScript) přes příkazovou řádku, abys ověřil, že nově napsaný kód neobsahuje zbytečné chyby nebo varování.

## 5. Striktní TypeScript (Zákaz ANY na konci iterace)
- Během rychlého experimentování a hledání řešení je dočasné použití `any` akceptovatelné pro zachování rychlosti.
- **VŠAK na konci iterace (před commitem) MUSÍ být kód 100% striktně otypován.**
- AI nesmí odevzdat finální hotovou funkcionalitu s `any` – vždy musí definovat přesné rozhraní nebo typ (přesnost a kvalita má na konci přednost).
