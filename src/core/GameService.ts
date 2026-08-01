import { World, Entity } from './ecs/ECS';
import { db } from '../storage/db';
import { 
  ComponentRegistry, 
  PlayerComponent, 
  NameComponent, 
  ResourceComponent, 
  MaintenanceComponent, 
  BuildingComponent, 
  StatsComponent 
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
    
    // Zlato 10, Jídlo (Chleba 1x energie 10, Jablko 10x energie 2), Itemy (Rýč 1x)
    player.addComponent(new ResourceComponent(
      10, 
      [
        { type: 'Chleba', amount: 1, energy: 10 },
        { type: 'Jablko', amount: 10, energy: 2 }
      ],
      [
        { type: 'Rýč', amount: 1 }
      ]
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
    
    // Statistiky
    player.addComponent(new StatsComponent(100, 100, 50, 50, 5, 2));

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

  public getPlayerEntity(): Entity | undefined {
    return this.world.entities.get('player');
  }
}

export const gameService = GameService.getInstance();
