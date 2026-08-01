# Analýza přeskočených herních mechanismů

Během diskuzí "Textová Strategie Architektura Projektu" a "Implementace Herní Logiky Středověk" padlo obrovské množství skvělých myšlenek, ale v momentě, kdy se AI asistent nadchnul pro inicializaci React/Vite projektu ("vibecoding"), unikly mu některé podstatné detaily, které nezapsal do `MASTER_GDD.md`. 

Tento dokument sbírá tyto střípky, skládá je do kontextu a vysvětluje, jak přesně doplňují celkovou vizi projektu. Příslušné pasáže byly také nově zakomponovány přímo do `MASTER_GDD.md`.

## 1. Organický výběr povolání (Archetype Selection)
**Co se přehlédlo:** Místo výběru povolání z menu se specializace hráče vyvíjí na základě prvních interakcí v boudě na pozemku.
**Kontext:** "Hráč právě dostal od krále svobodu a pozemek... musí sehnat, najít, koupit nebo vyměnit, ukrást nebo vyrobit něco, co bude definovat jeho další cestu."
Hra by měla na začátku nabídnout volbu jako sebrání rezavého rýče (Zemědělec/Stavitel), ukradení měšce (Zloděj/Diplomat), nalezení knihy magie (Mág) nebo získání meče (Bojovník/Vojevůdce). Tento první předmět nastaví startovní staty (`Max HP, Attack, Defense, Intellect, Mana, Agility`) a odemkne prvotní příběhové linky. Může vést k hluboké specializaci nebo k vyváženému profilu.

## 2. Hrozby škálující podle měřítka (Tiered Obstacles)
**Co se přehlédlo:** Hrozby nejsou jen generičtí bandité, ale striktně se vážou na to, na jaké rovině se hráč právě nachází.
**Kontext:** 
- **Lokální pozemek:** Hlavní konkurencí a hrozbou jsou **škůdci** (zvířata, plísně na obilí).
- **Vesnice:** Nepřáteli jsou **místní rváči a tlupy**.
- **Města a impérium:** Překážky tvoří **vnější aktéři, cizí gardy a politická opozice** bojující o moc.
Tímto hra zachovává logickou soudržnost – generál cizí armády ti nebude krást jablka ze stodoly na pozemku, tam řešíš krysy.

## 3. Typy území a vizuální stínování (Biome & Territory Shading)
**Co se přehlédlo:** Přesný výčet polí na globální hexagonové mapě a jejich odlišení.
**Kontext:** Protože hra nemá "fancy grafiku", mapa je řešena pouze odstíny. Výčet území, se kterými musí engine počítat, zahrnuje:
- Prázdná pole
- Vesnice
- Města
- Cesty
- Přírodní úkazy
- Nehratelná pole (např. vysoké hory/skály)
- Armádní budovy (pevnosti)
- Vodní plochy

## 4. Logistika karavan vzdušnou čarou (Node Adjacency)
**Co se přehlédlo:** Specifikace fyzického přesunu zásob a ignorování státních hranic pro výpočty tras.
**Kontext:** Hra nebude složitě počítat pathfinding přes hory a lesy pro každého obchodníka. Karavany se pohybují vzdušnou čarou (přes propojky grafu). Jedinou podmínkou je, aby byla města vedle sebe, případně oddělená prázdnými hratelnými poli nebo cestami. Hranice států logistice nebrání. 

## 5. Vizuální progrese UI (Theme Evolution)
**Co se přehlédlo:** Vývoj samotného rozhraní v čase, který jsi navrhl na konci diskuze před spuštěním kódu.
**Kontext:** Byla škoda to zahodit v zápalu psaní kódu. UI textovky nebude celou dobu stejné, ale bude reflektovat hráčův vliv a moc:
- **Raná fáze (Pozemek/Vesnice):** Dřevěný dark mode (chudoba, práce se dřevem, bláto).
- **Pokročilá fáze (Město/Rozvoj):** Zlatavá barva (bohatství, daně, obchod).
- **End-game fáze (Říše/Válka):** Nachová/purpurová barva (barva králů, absolutní moci a magie).
