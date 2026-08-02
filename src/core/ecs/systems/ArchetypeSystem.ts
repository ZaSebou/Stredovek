import { System, Entity } from '../ECS';
import { ArchetypeComponent, IntentComponent, ResourceComponent, StatsComponent } from '../components/CoreComponents';

export class ArchetypeSystem extends System {
  update(entities: Entity[], _currentTurn: number): void {
    for (const entity of entities) {
      const intentComp = entity.getComponent<IntentComponent>('IntentComponent');
      if (!intentComp) continue;

      const archIntentIndex = intentComp.intents.findIndex(i => i.type === 'choose_archetype');
      if (archIntentIndex !== -1) {
        const intent = intentComp.intents[archIntentIndex];
        if (intent.type === 'choose_archetype') {
          const archComp = entity.getComponent<ArchetypeComponent>('ArchetypeComponent');
          const statsComp = entity.getComponent<StatsComponent>('StatsComponent');
          const resComp = entity.getComponent<ResourceComponent>('ResourceComponent');

          if (archComp && statsComp && resComp && !archComp.chosen) {
            archComp.chosen = true;
            archComp.archetypeId = intent.archetypeId;

            switch (intent.archetypeId) {
              case 'builder':
                statsComp.hp = statsComp.maxHp = 100;
                statsComp.energy = statsComp.maxEnergy = 80;
                statsComp.attack = 3;
                statsComp.defense = 2;
                statsComp.intellect = 1;
                statsComp.agility = 2;
                statsComp.energy -= 5;
                resComp.items.push({ type: 'Rýč', amount: 1 });
                break;
              case 'thief':
                statsComp.hp = statsComp.maxHp = 80;
                statsComp.energy = statsComp.maxEnergy = 60;
                statsComp.attack = 4;
                statsComp.defense = 1;
                statsComp.intellect = 2;
                statsComp.agility = 5;
                statsComp.energy -= 5;
                resComp.gold += 50;
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
                statsComp.energy -= 10;
                resComp.items.push({ type: 'Kniha magie', amount: 1 });
                break;
              case 'warrior':
                statsComp.hp = statsComp.maxHp = 120;
                statsComp.energy = statsComp.maxEnergy = 50;
                statsComp.attack = 8;
                statsComp.defense = 5;
                statsComp.intellect = 1;
                statsComp.agility = 1;
                statsComp.energy -= 15;
                resComp.items.push({ type: 'Rezavý meč', amount: 1 });
                break;
              case 'worker':
                statsComp.hp = statsComp.maxHp = 80;
                statsComp.energy = statsComp.maxEnergy = 60;
                statsComp.attack = 2;
                statsComp.defense = 1;
                statsComp.intellect = 1;
                statsComp.agility = 1;
                statsComp.energy -= 5;
                resComp.gold += 5;
                resComp.items.push({ type: 'Rýč', amount: 1 });
                break;
            }
          }
        }
        
        // Smazat zpracovaný záměr
        intentComp.intents.splice(archIntentIndex, 1);
      }
    }
  }
}
