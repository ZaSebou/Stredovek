import { System, Entity } from '../ECS';
import { MaintenanceComponent, ResourceComponent } from '../components/CoreComponents';

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
          console.warn(`[Tah ${currentTurn}] Entita ${entity.id} hladoví! Chybí ${energyNeeded} energie.`);
          // TODO: Zde by proběhl odpočet loajality, HP nebo nákup za fiat.
        }
        
        // Vyčistíme prázdné hromádky jídla
        resources.food = resources.food.filter(f => f.amount > 0);
      }
    }
  }
}
