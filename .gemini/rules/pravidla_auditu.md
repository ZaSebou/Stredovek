# Pravidla Auditu

Tato složka slouží k systematické evidenci otevřených problémů, nápadů k řešení a pro zaznamenání historického kontextu (audit trail) při vývoji.

## Závazná struktura složky `audit/`

1. **`Aktivni_Audity.md`** 
   - Toto je fronta otevřených problémů. 
   - Kdykoliv AI agent nebo uživatel narazí na něco, co vyžaduje implementaci, nebo co chybí v `MASTER_GDD.md`, musí to být zapsáno sem. 
   - **AI agenti mají zakázáno vymýšlet architektonická "provizorní" řešení a hacky v logice kódu (netýká se to dočasného použití `any` typu během rychlé iterace).** Pokud návrh logiky není jasný nebo vyžaduje flastr, nesmí se zadrátovat natvrdo, ale zapíše se sem jako priorita k řešení.

2. **`Odskrtnute_Audity.md`**
   - Sem se přesouvají vyřešené úkoly z `Aktivni_Audity.md`. 
   - Slouží to jako log toho, "co se už vyřešilo a jak". Pomáhá to AI pochopit minulé záměry.

3. **Složka `archiv/`**
   - Slouží k uchování dlouhých výtažků z konverzací (např. `extracted_conversations.md`) a velkých brainstromingových logů. Agenti by sem měli nahlížet pouze, pokud hledají hlubší kontext k dávnému rozhodnutí.

## Životní cyklus auditu
1. **Zápis:** Problém -> Zápis do `Aktivni_Audity.md`.
2. **Řešení:** Vymyslí se koncept -> Zanese se do `MASTER_GDD.md` -> Aktualizuje se kód.
3. **Odškrtnutí:** Přesun problému z `Aktivni_Audity.md` do `Odskrtnute_Audity.md`.
