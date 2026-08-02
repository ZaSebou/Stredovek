# MASTER GDD (Game Design Document) - Středověk

> **DŮLEŽITÉ PRAVIDLO (Auto-Update):** Tento dokument slouží jako Single Source of Truth (SSOT). Kdykoliv zazní nový nápad, příběhový střípek nebo úprava ekonomiky v chatu, tento dokument bude okamžitě a jako první aktualizován.

## 1. Hlavní vize a ekonomický model
- **Žánr:** Prohlížečová textová hra z prostředí fiktivní středověké říše (offline, single player). 
- **Základní smyčka (Core Loop):** Od svobodného rolníka po vůdce rodu. Natažený příběh, management a dobývání.
- **Ekonomika a Měna:** Hra využívá univerzální celosvětové platidlo. Nejedná se o simulátor s absolutně konečným množstvím peněz ve světě, ceny se mění primárně na základě reálné produkce a událostí, nikoliv lokálních mikroztrát. 
- **Odtok zdrojů (Resource Sinks):** Suroviny a produkty neustále odtékají směrem k: nasycení armády, placení daní a poplatků, a k výstavbě (stavba vyžaduje nejen materiál, ale i "energii" - ať už vlastní, nebo nakoupenou od dělníků).
- **Hierarchie Jídla:** Každé jídlo má energetickou hodnotu a je sestupně seřazeno pro potřeby. Pokud chybí "chleba" a armáda jí "jablka", klesá loajalita. Hrad navíc musí nakupovat na trhu za fiat, pokud nemá pokryto.
- **Energie v budovách:** Zásadní rozhodnutí a čerpání energie se děje v hlavní budově (např. Chalupa). Konec tahu se nespouští automaticky vyčerpáním energie, ale výhradně manuálním stiskem tlačítka "Ukončit tah" (protože ne všechny akce stojí energii).
## 2. Příběhové pozadí (Lore) a frakce
- **Svět a Rasy:** Fiktivní středověká říše s čistě matematicky zpracovanou magií. 
- **Dynastie:** Hráč buduje pokrevní linii. Hlavní nástupce přebírá kontrolu po smrti předchůdce.
- **Znalosti a Průzkum:** Mlha války. Detailní data uzlů vyžadují průzkum.

## 3. Herní mechaniky (RPG progrese vs. Management)
### Headless Game Engine a UI Architektura
- **Engine:** Pure Functions, ECS (Entity-Component-System), Global State.
- **Roviny UI:** Hra je rozdělena na "Lokální" a "Globální" rovinu (plátno).  - *Layout (Mřížka):* 
    - Nahoře: Interaktivní Hex mapa (přepínač lokální/globální) a vedle ní (vpravo) Globální příběhové okno. **Hex mapa rozlišuje území elegantním, ale striktně bez-obrázkovým designem (CSS tvary/ikony a barvy): prázdná pole, vesnice, města, cesty, přírodní úkazy, nehratelná pole, armádní budovy, vodní plochy. Mapa je předem definovaná.**
    - Dole (zleva doprava): 1. Tabulka statistik hráče/armády, 2. Akční pole pro interakce a crafting (reagující na mapu), 3. Bitevní a tahové přepočty s logy.
- **Evoluce UI motivu (Theme Evolution):** Barvy rozhraní odráží pokrok (raná fáze = dřevěný dark mode, pokročilá = zlatavá, end-game = nachová/purpurová).

### Víceúrovňová Mapa a Progrese (Map Tiers)
Systém mapy reflektuje fázi a vliv hráče ve světě pomocí provázaných úrovní.
- **Milníky progrese (Tiers):**
  - **Tier 0:** Lokální = Pozemek (farma) | Globální = Cesta k nejbližší Vesnici
  - **Tier 1:** Lokální = Vesnice | Globální = Kraj (hlavní bod: Město)
  - **Tier 2:** Lokální = Město | Globální = Oblast (hlavní bod: Hrad)
  - **Tier 3:** Lokální = Hrad | Globální = Říše (hlavní bod: Palác)
- **Cestování a průzkum:** Přesun do jiného uzlu (např. do vesnice) vyžaduje nejprve prozkoumání příslušné cesty na globální mapě.
- **Rozvoj a návrat:** Hráč musí aktivně spravovat a rozvíjet každou lokaci (vesnici, město) ve své říši. Na jakýkoliv již objevený lokální bod (včetně startovního pozemku) se lze vrátit proklikem na jeho hex na globální mapě. Hráč má možnost svůj startovní pozemek povýšit historicky až na úroveň paláce.
- **Alternativní (Skryté) lokace:** Globální mapa obsahuje body skryté před běžným zrakem (např. *Ležení, Tábor, Podzemí*). Objeví se a zpřístupní se pouze při alternativních scénářích (splnění specifického questu, rozhodnutí příběhu, vzpoura, temná stezka zloděje). Pro tyto cesty zůstává základní globální mapa stejná, ale odhalují se v ní nové vrstvy/uzly.
- **Makro-interakce na globální mapě:** Postupem času se hráči odemknou možnosti reagovat s globální mapou (např. založení nové vsi, povýšení vesnice na město), které se dynamicky odvíjí od jeho aktuálního "statusu" a zdrojů. Některé z těchto funkcí se mohou v rané fázi v UI objevovat jako možnosti označené *"Ve vývoji"*.
- **Plynulý přechod RPG -> Strategie (Mikro vs Makro):** Dokud je hráč fyzicky přítomen na lokální mapě (např. Farma), může provádět akce (např. pěstování obilí) ručně formou mikromanagementu. Jakmile lokaci opustí, budovy musí přejít na automatický režim. 
- **Automatizace a Dělníci:** Automatická produkce stojí na Přiřazení dělníků (Poddaných). Pokud budova nemá dělníka, neprodukuje. Dělník každé kolo vyžaduje Údržbu (jídlo/plat). Dělníky hráč získává objevováním polí na mapě (např. první tulák žádající o práci v neprozkoumaném poli na farmě), plněním questů, nebo náborem za zlato ve vesnicích a městech.

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
| Organický výběr povolání | **ArchetypeComponent / StoryState Initialization** | Startovní fáze hry, kde UI dynamicky nabízí možnosti interakce. Výběr přepíše base staty entity, nahodí startovní předměty a uloží stav `chosen = true`. |
| Události psané i generované | **Hybrid Event Architecture** | Systém čerpající jak z ručně psané databáze textů, tak z generovaných situací. |
| Okno pro příběh a okno pro čísla | **Split-pane Layout** | UI rozdělené na narativní panel a taktický panel. |
| Výsuvné panely | **Collapsible Sidebars / Non-modal UI** | Rozhraní nevytrhávající z kontextu pop-up oknem. |

## 5. Wishlist / Backlog (Nápady k budoucímu zpracování)
- Koncový milník: Možnost zcela převzít financování královské armády a využít ji jako svou osobní údernou sílu.
- Rozdělení mapy na kontinenty nebo "ostatní říše" v endgame fázi hry.
- Výběr při Nové hře (zatím odloženo): Vygenerování startovních podmínek je zatím pevné, později chceme výběr archetypu a místa.

### Startovní situace (Nová Hra)
- **Archetype Selection (Organický výběr na mapě):** Výběr archetypu není jen textové okno, ale je vázán přímo na nejbližší okolní pole (hexy) na startovní mapě. Hráč klikne na pole (např. s rýčem = stavitel, s měšcem = zloděj) a tímto organickým průzkumem si vyprofiluje své *počáteční* staty (Max HP, Attack, Defense, Intellect, Mana, Agility) a odemkne první příběhovou linku. 
- **Fluidní progrese a Specializace (WoW-style):** Počáteční volba není absolutní a hráče trvale nezamyká. Archetypy mají podkategorie a hráč se následně profiluje investicí "Skillpoints" (dovednostních bodů). Může se úzce specializovat do jedné či dvou větví (tzv. min-maxing), nebo body rovnoměrně rozprostřít a hrát jako univerzál.
- **Suroviny:** 10 Zlatých, 1x Chleba, 10x Jablko.
- **Předměty:** 1x Rýč (crafting: opracované dřevo + železo, ale hráč k železu zatím nemá přístup).
- **Budovy:** 
  - Chalupa (čerpání energie, provádění rozhodnutí o chodu území).
  - 1x Pole pro pěstování obilí (na začátku zaseto).
  - 1x Stáj a 1x Pastva (pro produkční/výkonná zvířata - vejce, mléko, kůň, kráva).
  - Dílna (výroba základních předmětů bez skillu).
