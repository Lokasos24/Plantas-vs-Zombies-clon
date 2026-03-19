export class Plant {
    constructor(gridX, gridY, cellWidth, cellHeight, type, onCreateEntity) {
        this.gridX = gridX; // Posición en la rejilla (ej: columna 2)
        this.gridY = gridY; // Posición en la rejilla (ej: fila 1)
        this.width = cellWidth * 0.8; // Un poco más pequeña que la celda
        this.height = cellHeight * 0.8;
        this.type = type; // 'sunflower' o 'peashooter'
        this.onCreateEntity = onCreateEntity; //Crear entidad para acciones

        // Coordenadas de dibujo (centradas en la celda)
        this.x = (gridX * cellWidth) + (cellWidth / 2);
        this.y = (gridY * cellHeight) + (cellHeight / 2);

        this.timer = 0; // Acumulador de tiempo
        this.cooldown = type === 'sunflower' ? 7.0 : 5.0; // 5s para sol, 2s para disparo

        this.health = 100;
    }

    update(deltaTime, entityManager) {
        if (this.type === 'peashooter') {
            // 1. Detectar si hay zombies en la misma fila
            const zombieInLane = entityManager.zombies.some(z => z.gridY === this.gridY && z.x > this.x);

            if (zombieInLane) {
                this.timer += deltaTime;
                if (this.timer >= 2.0) { // Dispara tras 2 segundos de detección
                    this.executeAction();
                    this.timer = 0;
                }
            } else {
                this.timer = 0; // Resetear si el zombie muere o sale de la fila
            }
        } else {
            // El girasol sigue con su lógica normal
            this.timer += deltaTime;
            if (this.timer >= this.cooldown) {
                this.executeAction();
                this.timer = 0;
            }
        }
    }

    executeAction() {
        if (this.type === 'sunflower') {
            // "¡Oye, quien sea que me esté escuchando, crea un Sol aquí!"
            this.onCreateEntity('sun', { x: this.x, y: this.y });
        } else if (this.type === 'peashooter') {
            // "¡Crea un proyectil!"
            this.onCreateEntity('projectile', { x: this.x, y: this.y });
        }
    }

    render(ctx) {
        ctx.fillStyle = this.type === 'sunflower' ? '#FFD700' : '#4CAF50';
        ctx.beginPath();
        // Dibujamos un círculo para representar la planta por ahora
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Un pequeño borde para que se vea pro
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}