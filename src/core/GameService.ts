import { World, Entity } from './ecs/ECS';
import { db } from '../storage/db';
import { 
  ComponentRegistry, 
  PlayerComponent, 
  NameComponent, 
  ResourceComponent, 
  MaintenanceComponent, 
  BuildingComponent, 
  StatsComponent,
  ArchetypeComponent,
  SkillsComponent,
  IntentComponent,
  MapComponent
} from './ecs/components/CoreComponents';
import type { TileData, BiomeType } from './ecs/components/CoreComponents';
import { MaintenanceSystem } from './ecs/systems/MaintenanceSystem';
import { ArchetypeSystem } from './ecs/systems/ArchetypeSystem';
import { ProgressionSystem } from './ecs/systems/ProgressionSystem';

export class GameService {
  private static instance: GameService;
  public world: World;
  private currentSaveId: number | undefined;
  public selectedHex: { q: number, r: number } | null = null;
  public activeMapMode: 'local' | 'global' = 'local';
  public onStateChange: () => void = () => {};

  private constructor() {
    this.world = new World();
    this.world.addSystem(new MaintenanceSystem());
    this.world.addIntentSystem(new ArchetypeSystem());
    this.world.addIntentSystem(new ProgressionSystem());
  }

  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  public async startNewGame() {
    this.world = new World();
    this.world.addSystem(new MaintenanceSystem());
    this.world.addIntentSystem(new ArchetypeSystem());
    this.world.addIntentSystem(new ProgressionSystem());
    this.world.currentTurn = 0;

    // Vytvoření hráče s požadovanými počátečními zdroji
    const player = new Entity('player');
    player.addComponent(new PlayerComponent());
    player.addComponent(new NameComponent('Neznámý rolník'));
    player.addComponent(new ArchetypeComponent(false, null));
    
    // Základní zdroje před volbou (Zlato 10, Jídlo)
    player.addComponent(new ResourceComponent(
      10, 
      [
        { type: 'Chleba', amount: 1, energy: 10 },
        { type: 'Jablko', amount: 10, energy: 2 }
      ],
      [] // Předměty získají až výběrem
    ));

    // Počáteční budovy (Chalupa, Pole, Stáj, Pastva, Dílna)
    player.addComponent(new BuildingComponent([
      { type: 'Chalupa', count: 1, active: true },
      { type: 'Pole', count: 1, active: true },
      { type: 'Stáj', count: 1, active: true },
      { type: 'Pastva', count: 1, active: true },
      { type: 'Dílna', count: 1, active: true }
    ]));

    // Hráč potřebuje základní údržbu (např. 5 energie za tah)
    player.addComponent(new MaintenanceComponent(5));
    
    // Oslabené počáteční statistiky (vyprofilují se po výběru)
    // hp, maxHp, energy, maxEnergy, attack, defense, intellect, mana, maxMana, agility, loyalty
    player.addComponent(new StatsComponent(50, 50, 100, 100, 1, 0, 1, 0, 0, 1, 100));
    
    // Prázdný strom dovedností
    player.addComponent(new SkillsComponent([], { farming: 0, crafting: 0, combat: 0, magic: 0 }));

    // Fronta záměrů
    player.addComponent(new IntentComponent([]));

    this.world.addEntity(player);

    // Vytvoření mapy (Statická předpřipravená lokální startovní lokace - Tier 0)
    const localMapEntity = new Entity('world_map');
    const localTiles: TileData[] = [];
    const localRadius = 4;
    for (let q = -localRadius; q <= localRadius; q++) {
      const r1 = Math.max(-localRadius, -q - localRadius);
      const r2 = Math.min(localRadius, -q + localRadius);
      for (let r = r1; r <= r2; r++) {
        let type: BiomeType = 'empty';
        let archetypeSpawn: 'builder' | 'thief' | 'mage' | 'warrior' | 'worker' | undefined = undefined;

        if (q === 0 && r === 0) type = 'village';
        else if (q === 1 && r === -1) { type = 'nature'; archetypeSpawn = 'builder'; }
        else if (q === 1 && r === 0) { type = 'empty'; archetypeSpawn = 'thief'; }
        else if (q === 0 && r === 1) { type = 'road'; archetypeSpawn = 'mage'; }
        else if (q === -1 && r === 1) { type = 'nature'; archetypeSpawn = 'warrior'; }
        else if (q === 0 && r === -1) { type = 'empty'; archetypeSpawn = 'worker'; }
        else if (q === -1 && r === 2) type = 'nature';
        else if (q === 2 && r === 0) type = 'road';
        else if (q === -2 && r === -1) type = 'water';
        else if (q === 0 && r === -2) type = 'obstacle'; // Skála
        else if (Math.abs(q) + Math.abs(r) + Math.abs(-q-r) === localRadius * 2) type = 'nature'; // Okraje les
        
        const discovered = (q === 0 && r === 0);
        localTiles.push({ q, r, type, discovered, archetypeSpawn });
      }
    }
    localMapEntity.addComponent(new MapComponent(localTiles));
    this.world.addEntity(localMapEntity);

    // Vytvoření globální mapy (Makro úroveň - Tier 0)
    const globalMapEntity = new Entity('global_map');
    const globalTiles: TileData[] = [];
    const globalRadius = 6;
    for (let q = -globalRadius; q <= globalRadius; q++) {
      const r1 = Math.max(-globalRadius, -q - globalRadius);
      const r2 = Math.min(globalRadius, -q + globalRadius);
      for (let r = r1; r <= r2; r++) {
        let type: BiomeType = 'empty';
        let discovered = false;
        
        if (q === 0 && r === 0) {
          type = 'village'; // Pozemek hráče z pohledu globální mapy
          discovered = true;
        } else if (q === 3 && r === -2) {
          type = 'city'; // Vesnice jako další cíl
          discovered = true;
        } else if (Math.random() > 0.8) {
          type = 'nature';
        } else if (Math.random() > 0.9) {
          type = 'obstacle';
        }

        globalTiles.push({ q, r, type, discovered });
      }
    }
    globalMapEntity.addComponent(new MapComponent(globalTiles));
    this.world.addEntity(globalMapEntity);

    // Smazat staré uložené pozice a uložit novou - ODSTRANĚNO
    // Nyní nezavoláme db.gameSaves.clear(), abychom umožnili více slotů.
    this.currentSaveId = undefined; // Pro jistotu, aby to byl nový save
    
    await this.saveGame();
    this.onStateChange();
  }

  public async loadGameById(id: number): Promise<boolean> {
    const save = await db.gameSaves.get(id);
    if (save) {
      this.currentSaveId = save.id;
      this.world = new World();
      this.world.addSystem(new MaintenanceSystem());
      this.world.addIntentSystem(new ArchetypeSystem());
      this.world.addIntentSystem(new ProgressionSystem());
      this.world.deserialize(save.serializedWorld, ComponentRegistry);
      this.onStateChange();
      return true;
    }
    return false;
  }

  public async getAvailableSaves() {
    return await db.gameSaves.orderBy('lastSavedAt').reverse().toArray();
  }

  public async deleteSave(id: number) {
    await db.gameSaves.delete(id);
    // Pokud jsme smazali aktuálně načtenou hru, můžeme ji zkusit odnastavit, ale typicky to hráč dělá v menu
    if (this.currentSaveId === id) {
      this.currentSaveId = undefined;
    }
  }

  public async loadGame(): Promise<boolean> {
    const save = await db.gameSaves.orderBy('lastSavedAt').reverse().first();
    if (save) {
      this.currentSaveId = save.id;
      this.world = new World(); // Reset and add systems
      this.world.addSystem(new MaintenanceSystem());
      this.world.addIntentSystem(new ArchetypeSystem());
      this.world.addIntentSystem(new ProgressionSystem());
      this.world.deserialize(save.serializedWorld, ComponentRegistry);
      this.onStateChange();
      return true;
    }
    return false;
  }

  public async nextTurn() {
    this.world.processTurn();
    await this.saveGame();
    this.onStateChange();
  }

  public getTurn(): number {
    return this.world?.currentTurn || 0;
  }

  private async saveGame() {
    const player = this.getPlayerEntity();
    const nameComp = player?.getComponent<NameComponent>('NameComponent');
    const archComp = player?.getComponent<ArchetypeComponent>('ArchetypeComponent');

    const characterName = nameComp?.name || 'Neznámý rolník';
    const archetype = archComp?.archetypeId || null;

    if (this.currentSaveId !== undefined) {
      await db.gameSaves.update(this.currentSaveId, {
        characterName,
        archetype,
        turn: this.world.currentTurn,
        serializedWorld: this.world.serialize(),
        lastSavedAt: new Date()
      });
    } else {
      const saveState = {
        characterName,
        archetype,
        turn: this.world.currentTurn,
        serializedWorld: this.world.serialize(),
        lastSavedAt: new Date()
      };
      this.currentSaveId = await db.gameSaves.add(saveState);
    }
  }

  public async chooseArchetype(archetypeId: 'builder' | 'thief' | 'mage' | 'warrior' | 'worker') {
    const player = this.getPlayerEntity();
    if (!player) return;

    const intentComp = player.getComponent<IntentComponent>('IntentComponent');
    if (intentComp) {
      intentComp.intents.push({ type: 'choose_archetype', archetypeId });
      this.world.processIntents();
    }

    await this.saveGame();
    this.onStateChange();
  }

  public async unlockSkill(skillId: string, category: 'farming' | 'crafting' | 'combat' | 'magic', cost: number) {
    const player = this.getPlayerEntity();
    if (!player) return;

    const intentComp = player.getComponent<IntentComponent>('IntentComponent');
    if (intentComp) {
      intentComp.intents.push({ type: 'unlock_skill', skillId, category, cost });
      this.world.processIntents();
    }

      await this.saveGame();
      this.onStateChange();
  }

  public getPlayerEntity(): Entity | undefined {
    return this.world.entities.get('player');
  }

  public getMapEntity(): Entity | undefined {
    return this.world.entities.get(this.activeMapMode === 'global' ? 'global_map' : 'world_map');
  }

  public switchMapMode(mode: 'local' | 'global') {
    if (this.activeMapMode !== mode) {
      this.activeMapMode = mode;
      this.selectedHex = null; // Reset selection on switch
      this.onStateChange();
    }
  }

  public async exploreHex(q: number, r: number) {
    const player = this.getPlayerEntity();
    const map = this.getMapEntity();
    if (!player || !map) {
      alert("Chyba: Nelze najít hráče nebo mapu!");
      return;
    }

    const stats = player.getComponent<StatsComponent>('StatsComponent');
    const mapComp = map.getComponent<MapComponent>('MapComponent');
    
    if (stats && mapComp) {
      if (stats.energy >= 5) {
        const tile = mapComp.tiles.find(t => t.q === q && t.r === r);
        if (tile) {
          stats.energy -= 5;
          tile.discovered = true;
          this.selectedHex = { q, r }; // Automaticky vybrat po prozkoumání
          try {
            await this.saveGame();
            this.onStateChange();
          } catch (e) {
            console.error("Chyba při ukládání hry:", e);
            alert("Chyba při ukládání hry po průzkumu.");
          }
        } else {
          alert("Chyba: Zvolený hex nebyl nalezen v datech mapy.");
        }
      } else {
        alert("Nedostatek energie k průzkumu! Potřebuješ 5 energie.");
      }
    } else {
      alert("Chyba: Chybí komponenty statistik nebo mapy.");
    }
  }

  public selectHex(q: number, r: number) {
    this.selectedHex = { q, r };
    this.onStateChange();
  }

}

export const gameService = GameService.getInstance();
