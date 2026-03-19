export class Projectile {
    constructor(x, y, speed, damage) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage || 20;
        this.alive = true;
        this.radius = 6;
    }

    update(deltaTime) {
        this.x += this.speed * deltaTime;
        // Si sale de la pantalla, lo marcamos para borrar
        if (this.x > 800) this.alive = false;
    }

    render(ctx) {
        ctx.fillStyle = '#90EE90'; // Verde claro para el guisante
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}