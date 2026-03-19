export class Zombie {
    constructor(x, y, gridY) {
        this.x = x;
        this.y = y;
        this.gridY = gridY; // Fila en la que se desplaza
        this.speed = 25;
        this.health = 100;
        this.alive = true;
        this.width = 50;
        this.height = 80;

        // ESTADOS
        this.isAttacking = false;
        this.targetPlant = null; // Referencia a la planta que está atacando
        this.attackDamage = 20; // Daño por segundo
        this.attackTimer = 0;
    }

    update(deltaTime, entityManager) {
        if (this.isAttacking) {
            this.attackLogic(deltaTime);
        } else {
            // Caminar si no hay obstáculos
            this.x -= this.speed * deltaTime;
            this.checkCollisionWithPlants(entityManager);
        }

        if (this.health <= 0) this.alive = false;
        if (this.x < 0) console.log("¡GAME OVER!");
    }

    checkCollisionWithPlants(entityManager) {
        // Buscamos si hay una planta en nuestra fila y posición X
        const collisionMargin = 10;
        const plantToAttack = entityManager.plants.find(p =>
            p.gridY === this.gridY &&
            Math.abs(this.x - p.x) < collisionMargin
        );

        if (plantToAttack) {
            this.isAttacking = true;
            this.targetPlant = plantToAttack;
        }
    }

    attackLogic(deltaTime) {
        if (!this.targetPlant || this.targetPlant.health <= 0) {
            // Si la planta murió o desapareció (pala), seguimos caminando
            this.isAttacking = false;
            this.targetPlant = null;
            return;
        }

        // Aplicar daño constante
        this.targetPlant.health -= this.attackDamage * deltaTime;
    }

    render(ctx) {
        ctx.save();

        // El zombie se dibuja hacia ARRIBA desde this.y (que ahora es el suelo)
        ctx.fillStyle = this.isAttacking ? '#9C27B0' : '#7B1FA2';
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height, // Esto lo "apoya" en el suelo
            this.width,
            this.height
        );

        // Barra de vida un poco más arriba para que no tape la cabeza
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 20, this.y - this.height - 15, 40, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 20, this.y - this.height - 15, 40 * (this.health / 100), 5);

        ctx.restore();
    }
}