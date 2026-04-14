import { Grid } from './grid.js';
import { InputManager } from './inputManager.js';
import { UIManager } from './uiManager.js';
import { EntityManager } from './entityManager.js';
import { EconomyManager } from './economyManager.js';
import { Zombie } from './zombie.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Assets
        this.assets = {
            peashooter: new Image()
        };
        this.assets.peashooter.src = 'images/PvZ_1_Peashooter.svg';

        const UI_HEIGHT = 100;
        this.ui = new UIManager(this.canvas.width, UI_HEIGHT, this.assets);

        this.economy = new EconomyManager(50)

        // La rejilla ocupa el resto del espacio
        this.grid = new Grid(this.canvas.width, this.canvas.height - UI_HEIGHT, 5, 9);

        // IMPORTANTE: Le decimos que la rejilla empieza 100px abajo
        this.input = new InputManager(this.canvas, this.grid, 0, UI_HEIGHT);

        this.entities = new EntityManager(this.assets);
        this.entities.gridReference = this.grid; // <--- El puente entre ambos

        this.lastTime = 0; // Para calcular el DeltaTime
        this.sunSpawnTimer = 0;
        this.sunSpawnInterval = 7.0;

        this.zombieTimer = 0;
        this.spawnInterval = 10; // Empezamos con 10 segundos entre zombies
        this.minSpawnInterval = 3; // Lo más rápido que pueden salir

        this.initEvents();
    }

    start() {
        requestAnimationFrame((time) => this.loop(time))
    }

    update(deltaTime) {
        this.entities.update(deltaTime);

        this.sunSpawnTimer += deltaTime;
        if (this.sunSpawnTimer >= this.sunSpawnInterval) {
            this.spawnSkySun();
            this.sunSpawnTimer = 0;
        }

        this.zombieTimer += deltaTime;
        if (this.zombieTimer >= this.spawnInterval) {
            this.spawnZombie();
            this.zombieTimer = 0;
            // Dificultad progresiva: reducimos el intervalo un 5% cada vez
            this.spawnInterval = Math.max(this.minSpawnInterval, this.spawnInterval * 0.95);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ui.render(this.ctx, this.economy.balance);

        this.ctx.save();
        this.ctx.translate(0, 100);
        this.grid.render(this.ctx, this.input.mouse.gridX, this.input.mouse.gridY);

        // El EntityManager se encarga de dibujar todo su grupo
        this.entities.render(this.ctx);

        this.ctx.restore();
    }

    loop(currentTime) {
        // Calculamos cuánto tiempo pasó en SEGUNDOS (ej: 0.016 para 60fps)
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.loop(time));
    }

    spawnSkySun() {
        const margin = 50;
        const randomX = margin + Math.random() * (this.canvas.width - margin * 2);
        // Queremos que caiga a una fila aleatoria de la rejilla (entre 0 y 4)
        const randomGridY = Math.floor(Math.random() * this.grid.rows);
        const targetY = (randomGridY * this.grid.cellHeight) + (this.grid.cellHeight / 2);

        // IMPORTANTE: Como los soles se dibujan con translate(0,100), 
        // tenemos que restar 100 al targetY para que el EntityManager lo posicione bien
        this.entities.handleEntityCreation('sun', {
            x: randomX,
            y: -50,
            targetY: targetY,
            isFromSky: true
        });
    }

    spawnZombie() {
        const lane = Math.floor(Math.random() * this.grid.rows);
        // En lugar de ir al centro, vamos al final de la celda (lane + 1)
        const y = (lane + 1) * this.grid.cellHeight;
        // El zombie nace a la derecha (canvas.width + margen)
        this.entities.zombies.push(new Zombie(this.canvas.width + 50, y, lane));
    }

    initEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let actionConsumed = false; // Flag para detener la cadena de clics

            this.entities.suns.forEach(sun => {
                if (!actionConsumed) {
                    // Teorema de Pitágoras para ver si el clic está dentro del radio del sol
                    const dist = Math.sqrt((mouseX - sun.x) ** 2 + (mouseY - (sun.y + 100)) ** 2);
                    // Nota: sumamos 100 a sun.y porque la rejilla está desplazada

                    if (dist < 25) { // Si el radio es 15, un margen de 20 es cómodo
                        sun.alive = false; // El manager lo limpiará
                        this.economy.addSuns(sun.value);
                        actionConsumed = true
                    }
                }
            });

            // 2. PRIORIDAD MEDIA: UI (Botones de plantas)
            if (!actionConsumed) {
                const consumedByUI = this.ui.checkClick(mouseX, mouseY);
                if (consumedByUI) actionConsumed = true;
            }

            // LÓGICA DE PLANTADO
            if (!actionConsumed && mouseY > 100 && this.ui.selectedPlant) {
                const { gridX, gridY } = this.input.mouse;

                if (this.ui.selectedPlant === 'shovel') {
                    const removed = this.entities.removePlant(gridX, gridY);
                    if (removed) {
                        this.grid.matrix[gridY][gridX] = false;
                    }
                } else {
                    // Lógica de plantado normal
                    if (this.economy.canAfford(this.ui.selectedPlant) && this.grid.isCellFree(gridX, gridY)) {
                        this.entities.addPlant(gridX, gridY, this.grid.cellWidth, this.grid.cellHeight, this.ui.selectedPlant);
                        this.grid.occupyCell(gridX, gridY);
                        this.economy.spend(this.ui.selectedPlant);
                        this.ui.selectedPlant = null; // Deseleccionar tras plantar
                    }
                }
            }
        });
    }
}