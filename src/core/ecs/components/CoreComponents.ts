import { Component } from '../ECS';

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
    public agility: number = 1
  ) {
    super();
  }
}

// Slouží jako slovník pro deserializaci
export const ComponentRegistry: Record<string, any> = {
  NameComponent,
  PlayerComponent,
  ArchetypeComponent,
  ResourceComponent,
  BuildingComponent,
  MaintenanceComponent,
  StatsComponent
};
