# Pravidla Auditu

Tato složka slouží k systematické evidenci otevřených problémů, nápadů k řešení a pro zaznamenání historického kontextu (audit trail) při vývoji.

## Závazná struktura složky `audit/`

1. **`Aktivni_Audity.md`** 
   - Toto je fronta otevřených problémů. 
   - Kdykoliv AI agent nebo uživatel narazí na něco, co vyžaduje implementaci, nebo co chybí v `MASTER_GDD.md`, musí to být zapsáno sem.
   - **Povinná struktura záznamu:** Každý záznam musí obsahovat Datum přidání, Prioritu (Kritická, Vysoká, Nízká) a Typ (Architektura, Bug, Bezpečnost, Nápad).
   - **Bezpečnostní pravidlo (No-Hack Policy):** AI agenti mají zakázáno vymýšlet architektonická "provizorní" řešení a hacky v logice kódu (netýká se to dočasného použití `any` typu během rychlé iterace). Pokud návrh logiky není jasný nebo vyžaduje flastr, nesmí se zadrátovat natvrdo, ale zapíše se sem jako "Kritická" priorita k řešení.

2. **`Odskrtnute_Audity.md`**
   - Sem se přesouvají vyřešené úkoly z `Aktivni_Audity.md`. 
   - **Podmínka přesunu (Traceability):** Každý vyřešený záznam musí obsahovat stručné shrnutí "Jak to bylo vyřešeno" a vazbu na to, co se změnilo (např. upravená komponenta, odkaz na sekci v GDD nebo verze).
   - Slouží to jako log toho, "co se už vyřešilo a jak". Pomáhá to AI pochopit minulé záměry a předejít regresím.

3. **Složka `archiv/`**
   - Slouží k uchování dlouhých výtažků z konverzací (např. `extracted_conversations.md`) a velkých brainstormingových logů. Agenti by sem měli nahlížet pouze, pokud hledají hlubší kontext k dávnému rozhodnutí.
   - Pokud `Odskrtnute_Audity.md` přesáhne rozumnou délku (např. stane se nepřehledným), starší záznamy se archivují sem.

## Životní cyklus auditu
1. **Zápis:** Identifikace problému -> Zápis do `Aktivni_Audity.md` včetně prioritizace.
2. **Návrh:** Vymyslí se koncept a vyhodnotí se rizika -> Zanese se do `MASTER_GDD.md`.
3. **Implementace:** Aktualizuje se kód dle schváleného návrhu.
4. **Validace (Gate):** Ověří se funkčnost (zda kód neobsahuje chyby, prošel testy/linty). 
5. **Uzavření:** Teprve po validaci se problém přesouvá do `Odskrtnute_Audity.md` s popisem řešení. (Pokud se v budoucnu chyba objeví znovu, nevrací se starý záznam, ale vytvoří se nový s odkazem na původní "odškrtnutý" audit).
