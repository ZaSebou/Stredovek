# MASTER GDD (Game Design Document) - Středověk

> **DŮLEŽITÉ PRAVIDLO (Auto-Update):** Tento dokument slouží jako Single Source of Truth (SSOT). Kdykoliv zazní nový nápad, příběhový střípek nebo úprava ekonomiky v chatu, tento dokument bude okamžitě a jako první aktualizován.

## 1. Hlavní vize a ekonomický model
- **Žánr:** Prohlížečová textová hra z prostředí fiktivní středověké říše (offline, single player). 
- **Základní smyčka (Core Loop):** Od svobodného rolníka po vůdce rodu. Natažený příběh, management a dobývání.
- **Ekonomika a Měna:** Hra využívá univerzální celosvětové platidlo. Nejedná se o simulátor s absolutně konečným množstvím peněz ve světě, ceny se mění primárně na základě reálné produkce a událostí, nikoliv lokálních mikroztrát. 
- **Odtok zdrojů (Resource Sinks):** Suroviny a produkty neustále odtékají směrem k: nasycení armády, placení daní a poplatků, a k výstavbě (stavba vyžaduje nejen materiál, ale i "energii" - ať už vlastní, nebo nakoupenou od dělníků).
- **Hierarchie Jídla:** Každé jídlo má energetickou hodnotu a je sestupně seřazeno pro potřeby. Pokud chybí "chleba" a armáda jí "jablka", klesá loajalita. Hrad navíc musí nakupovat na trhu za fiat, pokud nemá pokryto.
- **Energie v budovách:** Zásadní rozhodnutí a čerpání energie se děje v hlavní budově (např. Chalupa).
## 2. Příběhové pozadí (Lore) a frakce
- **Svět a Rasy:** Fiktivní středověká říše s čistě matematicky zpracovanou magií. 
- **Dynastie:** Hráč buduje pokrevní linii. Hlavní nástupce přebírá kontrolu po smrti předchůdce.
- **Znalosti a Průzkum:** Mlha války. Detailní data uzlů vyžadují průzkum.

## 3. Herní mechaniky (RPG progrese vs. Management)
### Headless Game Engine a UI Architektura
- **Engine:** Pure Functions, ECS (Entity-Component-System), Global State.
- **Roviny UI:** Hra je rozdělena na "Lokální" a "Globální" rovinu (plátno).  - *Layout (Mřížka):* 
    - Nahoře: Interaktivní Hex mapa (přepínač lokální/globální) a vedle ní (vpravo) Globální příběhové okno. **Hex mapa rozlišuje území pouze odstínem (Biome & Territory Shading): prázdná pole, vesnice, města, cesty, přírodní úkazy, nehratelná pole, armádní budovy, vodní plochy.**
    - Dole (zleva doprava): 1. Tabulka statistik hráče/armády, 2. Akční pole pro interakce a crafting (reagující na mapu), 3. Bitevní a tahové přepočty s logy.
- **Evoluce UI motivu (Theme Evolution):** Barvy rozhraní odráží pokrok (raná fáze = dřevěný dark mode, pokročilá = zlatavá, end-game = nachová/purpurová).

### Pilíře
- **Události (Hybrid Event Architecture):** Pevně psané questy (Static Narrative Graph) kombinované se systémově generovanými situacemi.
- **Řemesla (Crafting):** Tabulkový a přísně deterministický systém. Dovednosti odemykají širší katalogy receptů. Vylepšování předmětů probíhá klasickou výrobou nových, nebo tabulkovou úpravou. 
- **Boj a Válka:** Taktika a rozhodnutí se odehrávají *před bitvou* a *po bitvě*. Samotný střet je čistě matematický auto-resolve propočet bez nutnosti mikromanagementu během boje.
- **Hrozby podle měřítka (Tiered Obstacles):** Nepřátelé striktně odpovídají vrstvě mapy. Pozemek = škůdci. Vesnice = rváči a tlupy. Město/Impérium = vnější aktéři a gardy.
- **Logistika a Zásoby:** Sklady jsou lokální. Přesun řešen přes propojky grafu. Pohyb karavan probíhá vzdušnou čarou bez řešení fyzických státních hranic (stačí aby města sousedila např. přes prázdná pole).
- **Makroekonomika a Daně:** Hráč odvádí daně ve Zlatě, dokud nepřevezme přímou správu uzlů. Pokud království a armáda nemají pokryté potřeby z lokální produkce, musí nakupovat za "tržní ceny", což vysává globální pokladnici a startuje *Spirálu úpadku* (nedostatek peněz -> vyšší daně -> chudnutí lokací -> menší produkce -> vyšší ceny).
- **Čas a Kalendář:** Hra stojí na konceptech tahů představujících čas. Roční období (zima vs. léto) reálně modifikují produkci, logistiku a bojeschopnost.
- **Loajalita a Údržba (Maintenance):** Každý poddaný, pracovník i voják vyžaduje pravidelné uspokojování potřeb (hlad, nástroje, výzbroj).
- **Krizové stavy a Prohra (Game Over):** Samotná prohra v bitvě nekončí hru, vede pouze ke ztrátě surovin, penalizacím a vzpourám. "Game Over" nastává výhradně tehdy, pokud dojde ke smrti vůdce bez zajištěného dědice.
- **Magie:** Legitimní síla ve světě, státy mají dominantní a podružné magické zaměření. Její vliv se ale počítá striktně přes datové koeficienty a staty hrdiny, bez nutnosti grafických animací.

## 4. Slovník pojmů (Business vs. Tech termíny)

| Business pojem (Hráč/Designer) | Technický pojem (Architektura/Kód) | Popis |
| :--- | :--- | :--- |
| Univerzální měna, ceny dle trhu | **Fiat Currency / Event-driven Pricing** | Oproti barteru je měna globální standard a její hodnota se odvíjí od maker-změn (produkce, války). |
| Stavba žere materiál i energii | **Multi-resource Build Costs** | Cena akce vyžaduje fyzické Item entity (hřebíky) i Stat entity (energie hráče/dělníků). |
| Tabulkový crafting a upgrady | **Deterministic Crafting / Recipe System** | Výroba a vylepšování je fixní (mám X a Y = dostanu Z), bez miniher o náhodnou kvalitu. |
| Rozhodnutí před/po boji, boj sám je jen výpočet | **Auto-resolve Combat / Pre-battle Tactical Phase** | Bitevní systém, který vezme staty obou stran, vteřinu počítá a vyplivne report. Volby probíhají před výpočtem. |
| Lokální a Globální roviny herní mapy a příběhů | **Scope-bound Narrative / Macro vs. Micro UI Planes** | Události a tlačítka se mění podle toho, zda zrovna koukáš na detail "Mého pozemku" (Lokální), nebo na "Mapu říše" (Globální). |
| Události psané i generované | **Hybrid Event Architecture** | Systém čerpající jak z ručně psané databáze textů, tak z generovaných situací. |
| Okno pro příběh a okno pro čísla | **Split-pane Layout** | UI rozdělené na narativní panel a taktický panel. |
| Výsuvné panely | **Collapsible Sidebars / Non-modal UI** | Rozhraní nevytrhávající z kontextu pop-up oknem. |

## 5. Wishlist / Backlog (Nápady k budoucímu zpracování)
- Koncový milník: Možnost zcela převzít financování královské armády a využít ji jako svou osobní údernou sílu.
- Rozdělení mapy na kontinenty nebo "ostatní říše" v endgame fázi hry.
- Výběr při Nové hře (zatím odloženo): Vygenerování startovních podmínek je zatím pevné, později chceme výběr archetypu a místa.

### Startovní situace (Nová Hra)
- **Archetype Selection (Organický výběr):** Hráč začíná na pozemku, kde jeho první interakce s prostředím (najít rýč = stavitel, ukrást měšec = diplomat/zloděj, najít knihu = mág) trvale vyprofiluje jeho startovní staty (Max HP, Attack, Defense, Intellect, Mana, Agility) a otevře první dějové linky.
- **Suroviny:** 10 Zlatých, 1x Chleba, 10x Jablko.
- **Předměty:** 1x Rýč (crafting: opracované dřevo + železo, ale hráč k železu zatím nemá přístup).
- **Budovy:** 
  - Chalupa (čerpání energie, provádění rozhodnutí o chodu území).
  - 1x Pole pro pěstování obilí (na začátku zaseto).
  - 1x Stáj a 1x Pastva (pro produkční/výkonná zvířata - vejce, mléko, kůň, kráva).
  - Dílna (výroba základních předmětů bez skillu).
