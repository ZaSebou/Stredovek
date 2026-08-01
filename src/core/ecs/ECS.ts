/**
 * Základní třída pro Komponenty. Komponenta by měla obsahovat pouze data, žádnou logiku.
 */
export abstract class Component {
  abstract type: string;
}

/**
 * Entita je pouze ID a kontejner na komponenty.
 */
export class Entity {
  public id: string;
  public components: Map<string, Component>;

  constructor(id: string) {
    this.id = id;
    this.components = new Map();
  }

  addComponent(component: Component): void {
    this.components.set(component.type, component);
  }

  getComponent<T extends Component>(type: string): T | undefined {
    return this.components.get(type) as T;
  }

  hasComponent(type: string): boolean {
    return this.components.has(type);
  }
}

/**
 * Systém obsahuje čistou logiku, která iteruje přes entity a mění jejich komponenty.
 */
export abstract class System {
  abstract update(entities: Entity[], currentTurn: number): void;
}

/**
 * Hlavní registr světa, který drží entity a systémy.
 */
export class World {
  public entities: Map<string, Entity> = new Map();
  public systems: System[] = [];
  public currentTurn: number = 0;

  addEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
  }

  addSystem(system: System) {
    this.systems.push(system);
  }

  /**
   * Zpracování konce tahu – spustí všechny systémy v definovaném pořadí.
   */
  processTurn() {
    this.currentTurn++;
    const entityList = Array.from(this.entities.values());
    for (const system of this.systems) {
      system.update(entityList, this.currentTurn);
    }
  }

  serialize(): string {
    const plainEntities = Array.from(this.entities.values()).map(e => ({
      id: e.id,
      components: Array.from(e.components.values())
    }));
    return JSON.stringify({ currentTurn: this.currentTurn, entities: plainEntities });
  }

  deserialize(json: string, componentRegistry: Record<string, any>) {
    const data = JSON.parse(json);
    this.currentTurn = data.currentTurn || 0;
    this.entities.clear();

    if (data.entities) {
      for (const eData of data.entities) {
        const entity = new Entity(eData.id);
        if (eData.components) {
          for (const cData of eData.components) {
            const CompClass = componentRegistry[cData.type];
            if (CompClass) {
              const comp = new CompClass();
              Object.assign(comp, cData);
              entity.addComponent(comp);
            }
          }
        }
        this.addEntity(entity);
      }
    }
  }
}
