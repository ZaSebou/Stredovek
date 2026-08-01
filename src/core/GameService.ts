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
  IntentComponent
} from './ecs/components/CoreComponents';
import { MaintenanceSystem } from './ecs/systems/MaintenanceSystem';
import { ArchetypeSystem } from './ecs/systems/ArchetypeSystem';
import { ProgressionSystem } from './ecs/systems/ProgressionSystem';

export class GameService {
  private static instance: GameService;
  public world: World;
  private currentSaveId: number | undefined;
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
    // hp, maxHp, energy, maxEnergy, attack, defense, intellect, mana, maxMana, agility
    player.addComponent(new StatsComponent(50, 50, 20, 20, 1, 0, 1, 0, 0, 1));
    
    // Prázdný strom dovedností
    player.addComponent(new SkillsComponent([], { farming: 0, crafting: 0, combat: 0, magic: 0 }));

    // Fronta záměrů
    player.addComponent(new IntentComponent([]));

    this.world.addEntity(player);

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

  public async chooseArchetype(archetypeId: 'builder' | 'thief' | 'mage' | 'warrior') {
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
}

export const gameService = GameService.getInstance();
