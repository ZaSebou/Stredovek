import { Component } from '../ECS';
export * from './MapComponent';
import { MapComponent } from './MapComponent';

export class NameComponent extends Component {
  type = 'NameComponent';
  constructor(public name: string) {
    super();
  }
}

export class PlayerComponent extends Component {
  type = 'PlayerComponent';
}

export class ArchetypeComponent extends Component {
  type = 'ArchetypeComponent';
  constructor(public chosen: boolean = false, public archetypeId: string | null = null) {
    super();
  }
}

export class SkillsComponent extends Component {
  type = 'SkillsComponent';
  constructor(
    public unlockedSkills: string[] = [],
    public xp: {
      farming: number;
      crafting: number;
      combat: number;
      magic: number;
    } = { farming: 0, crafting: 0, combat: 0, magic: 0 }
  ) {
    super();
  }
}

export class ResourceComponent extends Component {
  type = 'ResourceComponent';
  constructor(
    public gold: number = 0,
    public food: { type: string; amount: number; energy: number }[] = [],
    public items: { type: string; amount: number }[] = []
  ) {
    super();
  }
}

export class BuildingComponent extends Component {
  type = 'BuildingComponent';
  constructor(
    public buildings: { type: string; count: number; active: boolean }[] = []
  ) {
    super();
  }
}

export class MaintenanceComponent extends Component {
  type = 'MaintenanceComponent';
  constructor(public requiredEnergyPerTurn: number) {
    super();
  }
}

export class StatsComponent extends Component {
  type = 'StatsComponent';
  constructor(
    public hp: number = 100,
    public maxHp: number = 100,
    public energy: number = 50,
    public maxEnergy: number = 50,
    public attack: number = 5,
    public defense: number = 0,
    public intellect: number = 1,
    public mana: number = 0,
    public maxMana: number = 0,
    public agility: number = 1,
    public loyalty: number = 100
  ) {
    super();
  }
}

export type Intent = 
  | { type: 'choose_archetype'; archetypeId: 'builder' | 'thief' | 'mage' | 'warrior' | 'worker' }
  | { type: 'unlock_skill'; skillId: string; category: 'farming' | 'crafting' | 'combat' | 'magic'; cost: number };

export class IntentComponent extends Component {
  type = 'IntentComponent';
  constructor(public intents: Intent[] = []) {
    super();
  }
}

// Slouží jako slovník pro deserializaci
// Definice typu pro třídu dědící z Component
export type ComponentConstructor = new (...args: any[]) => Component;

export const ComponentRegistry: Record<string, ComponentConstructor> = {
  NameComponent,
  PlayerComponent,
  ArchetypeComponent,
  SkillsComponent,
  ResourceComponent,
  BuildingComponent,
  MaintenanceComponent,
  StatsComponent,
  IntentComponent,
  MapComponent
};
