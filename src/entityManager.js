import { Plant } from "./plant.js";
import { Projectile } from "./projectile.js";
import { Sun } from "./sun.js";

export class EntityManager {
    constructor() {
        this.plants = [];
        this.zombies = [];
        this.projectiles = []; // Nueva lista para guisantes
        this.suns = [];        // Nueva lista para soles
    }

    handleEntityCreation(type, data) {
        if (type === 'sun') {
            // Pasamos todos los datos nuevos al constructor
            const newSun = new Sun(data.x, data.y);
            if (data.isFromSky) {
                newSun.isFromSky = true;
                newSun.targetY = data.targetY;
                newSun.speed = 100;
            }
            this.suns.push(newSun);
        } else if (type === 'projectile') {
            this.projectiles.push(new Projectile(data.x, data.y, 300, 20));
        }
    }

    addPlant(gridX, gridY, cellWidth, cellHeight, type) {
        // Le pasamos la referencia a handleEntityCreation como un "callback"
        const newPlant = new Plant(
            gridX, gridY, cellWidth, cellHeight, type,
            (t, d) => this.handleEntityCreation(t, d)
        );
        this.plants.push(newPlant);
    }

    removePlant(gridX, gridY) {
        // Filtramos el array: nos quedamos con todas las plantas EXCEPTO la que está en esa celda
        const initialCount = this.plants.length;
        this.plants = this.plants.filter(p => !(p.gridX === gridX && p.gridY === gridY));

        // Si el tamaño cambió, es que efectivamente borramos algo
        return initialCount !== this.plants.length;
    }

    // El corazón del movimiento y la lógica
    update(deltaTime) {
        // Actualizamos TODOS, incluidos los zombies
        this.plants.forEach(p => p.update(deltaTime, this));
        this.projectiles.forEach(p => p.update(deltaTime));
        this.suns.forEach(s => s.update(deltaTime));
        this.zombies.forEach(z => z.update(deltaTime, this)); // Pasamos 'this' para que el zombie vea las plantas

        // LÓGICA DE COLISIÓN PROYECTIL -> ZOMBIE
        this.projectiles.forEach(p => {
            this.zombies.forEach(z => {
                // Si están en la misma fila y la X del proyectil cruza la del zombie
                if (z.gridY === Math.floor((p.y) / (this.gridReference.cellHeight))) {
                    const distance = Math.abs(p.x - z.x);

                    if (distance < 30) { // Margen de choque
                        z.health -= p.damage; // Restar vida (20)
                        p.alive = false;      // El proyectil desaparece
                    }
                }
            });
        });

        // Limpieza de muertos
        this.projectiles = this.projectiles.filter(p => p.alive);
        this.zombies = this.zombies.filter(z => z.health > 0);
        this.projectiles = this.projectiles.filter(p => p.alive);
        this.suns = this.suns.filter(s => s.alive);
        this.zombies = this.zombies.filter(z => z.alive);

        // Lógica de plantas muertas (necesitas asegurarte de que this.gridReference exista)
        if (this.gridReference) {
            const deadPlants = this.plants.filter(p => p.health <= 0);
            deadPlants.forEach(p => {
                this.gridReference.matrix[p.gridY][p.gridX] = false;
            });
        }
        this.plants = this.plants.filter(p => p.health > 0);
    }

    render(ctx) {
        this.plants.forEach(p => p.render(ctx));
        this.projectiles.forEach(p => p.render(ctx));
        this.suns.forEach(s => s.render(ctx));
        this.zombies.forEach(z => z.render(ctx)); // <--- ¡ESTO FALTA!
    }
}