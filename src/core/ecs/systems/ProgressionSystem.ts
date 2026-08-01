import { System, Entity } from '../ECS';
import { IntentComponent, SkillsComponent, StatsComponent } from '../components/CoreComponents';

export class ProgressionSystem extends System {
  update(entities: Entity[], _currentTurn: number): void {
    for (const entity of entities) {
      const intentComp = entity.getComponent<IntentComponent>('IntentComponent');
      if (!intentComp) continue;

      const progIntentIndex = intentComp.intents.findIndex(i => i.type === 'unlock_skill');
      if (progIntentIndex !== -1) {
        const intent = intentComp.intents[progIntentIndex];
        if (intent.type === 'unlock_skill') {
          const skills = entity.getComponent<SkillsComponent>('SkillsComponent');
          const stats = entity.getComponent<StatsComponent>('StatsComponent');

          if (skills && stats && skills.xp[intent.category] >= intent.cost && !skills.unlockedSkills.includes(intent.skillId)) {
            skills.xp[intent.category] -= intent.cost;
            skills.unlockedSkills.push(intent.skillId);

            // Aplikace trvalých bonusů podle ID
            switch (intent.skillId) {
              case 'farm_2':
                stats.maxEnergy += 20;
                stats.energy += 20;
                break;
              case 'combat_1':
                stats.attack += 2;
                break;
              case 'combat_2':
                stats.defense += 2;
                break;
              case 'magic_1':
                stats.maxMana += 20;
                stats.mana += 20;
                break;
            }
          }
        }
        
        // Smazat zpracovaný záměr
        intentComp.intents.splice(progIntentIndex, 1);
      }
    }
  }
}
