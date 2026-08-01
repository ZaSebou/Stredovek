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
  ArchetypeComponent
} from './ecs/components/CoreComponents';
import { MaintenanceSystem } from './ecs/systems/MaintenanceSystem';

export class GameService {
  private static instance: GameService;
  public world: World;
  private currentSaveId: number | undefined;
  public onStateChange: () => void = () => {};

  private constructor() {
    this.world = new World();
    this.world.addSystem(new MaintenanceSystem());
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

    this.world.addEntity(player);

    // Smazat staré uložené pozice a uložit novou
    await db.gameSaves.clear();
    const saveState = {
      turn: this.world.currentTurn,
      serializedWorld: this.world.serialize(),
      lastSavedAt: new Date()
    };
    this.currentSaveId = await db.gameSaves.add(saveState);
    this.onStateChange();
  }

  public async loadGame(): Promise<boolean> {
    const save = await db.gameSaves.orderBy('lastSavedAt').reverse().first();
    if (save) {
      this.currentSaveId = save.id;
      this.world = new World(); // Reset and add systems
      this.world.addSystem(new MaintenanceSystem());
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

  private async saveGame() {
    if (this.currentSaveId !== undefined) {
      await db.gameSaves.update(this.currentSaveId, {
        turn: this.world.currentTurn,
        serializedWorld: this.world.serialize(),
        lastSavedAt: new Date()
      });
    } else {
      const saveState = {
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

    const archComp = player.getComponent<ArchetypeComponent>('ArchetypeComponent');
    const statsComp = player.getComponent<StatsComponent>('StatsComponent');
    const resComp = player.getComponent<ResourceComponent>('ResourceComponent');

    if (archComp && statsComp && resComp) {
      archComp.chosen = true;
      archComp.archetypeId = archetypeId;

      switch (archetypeId) {
        case 'builder':
          statsComp.hp = statsComp.maxHp = 100;
          statsComp.energy = statsComp.maxEnergy = 80;
          statsComp.attack = 3;
          statsComp.defense = 2;
          statsComp.intellect = 1;
          statsComp.agility = 2;
          statsComp.energy -= 5; // Námaha na vykopání rýče
          resComp.items.push({ type: 'Rýč', amount: 1 });
          break;
        case 'thief':
          statsComp.hp = statsComp.maxHp = 80;
          statsComp.energy = statsComp.maxEnergy = 60;
          statsComp.attack = 4;
          statsComp.defense = 1;
          statsComp.intellect = 2;
          statsComp.agility = 5;
          statsComp.energy -= 5; // Námaha na odvedení pozornosti
          resComp.gold += 50; // Ukradený měšec
          resComp.items.push({ type: 'Dýka', amount: 1 });
          break;
        case 'mage':
          statsComp.hp = statsComp.maxHp = 60;
          statsComp.energy = statsComp.maxEnergy = 40;
          statsComp.attack = 1;
          statsComp.defense = 0;
          statsComp.intellect = 8;
          statsComp.agility = 1;
          statsComp.maxMana = statsComp.mana = 40;
          statsComp.energy -= 10; // Čtení těžké staré knihy
          resComp.items.push({ type: 'Kniha magie', amount: 1 });
          break;
        case 'warrior':
          statsComp.hp = statsComp.maxHp = 120;
          statsComp.energy = statsComp.maxEnergy = 50;
          statsComp.attack = 8;
          statsComp.defense = 5;
          statsComp.intellect = 1;
          statsComp.agility = 1;
          statsComp.energy -= 15; // Vytáhnout těžký zrezivělý meč
          resComp.items.push({ type: 'Rezavý meč', amount: 1 });
          break;
      }
    }

    await this.saveGame();
    this.onStateChange();
  }

  public getPlayerEntity(): Entity | undefined {
    return this.world.entities.get('player');
  }
}

export const gameService = GameService.getInstance();
