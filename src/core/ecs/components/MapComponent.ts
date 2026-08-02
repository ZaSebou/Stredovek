import { Component } from '../ECS';

export type BiomeType = 'empty' | 'village' | 'city' | 'road' | 'nature' | 'obstacle' | 'fort' | 'water';

export interface TileData {
  q: number;
  r: number;
  type: BiomeType;
  discovered: boolean;
  name?: string;
  archetypeSpawn?: 'builder' | 'thief' | 'mage' | 'warrior' | 'worker';
}

export class MapComponent extends Component {
  type = 'MapComponent';
  constructor(public tiles: TileData[] = []) {
    super();
  }
}
