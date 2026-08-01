import Dexie, { type Table } from 'dexie';

export interface GameSaveState {
  id?: number;
  turn: number;
  serializedWorld: string; // JSON reprezentace ECS pro jednoduchost
  lastSavedAt: Date;
}

export class MedievalDatabase extends Dexie {
  gameSaves!: Table<GameSaveState>;

  constructor() {
    super('MedievalDB');
    this.version(1).stores({
      gameSaves: '++id, turn, lastSavedAt' // Primární klíč a indexy
    });
  }
}

export const db = new MedievalDatabase();

/**
 * Pomocná funkce pro zjištění, zda existuje alespoň jeden uložený stav hry.
 */
export async function hasActiveSave(): Promise<boolean> {
  const count = await db.gameSaves.count();
  return count > 0;
}
