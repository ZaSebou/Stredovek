import { System, Entity } from '../ECS';
import { MaintenanceComponent, ResourceComponent, StatsComponent } from '../components/CoreComponents';

export class MaintenanceSystem extends System {
  update(entities: Entity[], currentTurn: number): void {
    for (const entity of entities) {
      if (entity.hasComponent('MaintenanceComponent') && entity.hasComponent('ResourceComponent')) {
        const maintenance = entity.getComponent<MaintenanceComponent>('MaintenanceComponent')!;
        const resources = entity.getComponent<ResourceComponent>('ResourceComponent')!;

        let energyNeeded = maintenance.requiredEnergyPerTurn;

        // Seřadíme jídlo podle energetické hodnoty sestupně
        resources.food.sort((a, b) => b.energy - a.energy);

        for (let i = 0; i < resources.food.length; i++) {
          if (energyNeeded <= 0) break;

          const foodItem = resources.food[i];
          while (foodItem.amount > 0 && energyNeeded > 0) {
            foodItem.amount--;
            energyNeeded -= foodItem.energy;
          }
        }

        // Pokud stále chybí energie (jídlo došlo), logujeme / penalizujeme
        if (energyNeeded > 0) {
          const stats = entity.getComponent<StatsComponent>('StatsComponent');

          // Tržní nákup chybějícího jídla (prozatímní ekonomika 1 Zlato = 1 Energie)
          if (resources.gold > 0) {
            const goldNeeded = energyNeeded;
            if (resources.gold >= goldNeeded) {
              resources.gold -= goldNeeded;
              console.log(`[Tah ${currentTurn}] Entita ${entity.id} nakoupila jídlo z trhu za ${goldNeeded} zlata.`);
              energyNeeded = 0;
            } else {
              energyNeeded -= resources.gold;
              console.log(`[Tah ${currentTurn}] Entita ${entity.id} nakoupila částečné jídlo za ${resources.gold} zlata, ale stále chybí ${energyNeeded} energie.`);
              resources.gold = 0;
            }
          }

          if (energyNeeded > 0 && stats) {
            stats.hp = Math.max(0, stats.hp - 10);
            if (stats.loyalty !== undefined) {
              stats.loyalty = Math.max(0, stats.loyalty - 10);
            }
            console.warn(`[Tah ${currentTurn}] Entita ${entity.id} hladoví! Ztráta 10 HP a 10 Loajality.`);
          }
        }
        
        // Vyčistíme prázdné hromádky jídla
        resources.food = resources.food.filter(f => f.amount > 0);
      }
    }
  }
}
