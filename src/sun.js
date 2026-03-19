export class Sun {
    constructor(x, y, targetY, isFromSky = false) {
        this.x = x;
        this.y = isFromSky ? -50 : y;
        this.targetY = targetY
        this.isFromSky = isFromSky
        this.value = 25;
        this.alive = true;

        // --- FÍSICA INICIAL ---
        // Un pequeño impulso hacia arriba (negativo) y aleatorio a los lados
        this.velocityY = -150; // Velocidad inicial de salto
        this.velocityX = (Math.random() - 0.5) * 50; // Salto lateral aleatorio
        this.gravity = 400; // Fuerza que lo empuja hacia abajo
        this.radius = 20;

        this.timer = 0;
        this.lifespan = 8; // Segundos antes de desaparecer
        this.groundY = y + 20; // El punto donde debe dejar de caer

        this.speed = isFromSky ? 50 : 0;
        this.opacity = 0; //Para un efecto de fade-in
    }

    update(deltaTime) {
        this.timer += deltaTime;

        // Efecto de Fade-in (Aparecer poco a poco como un héroe)
        if (this.opacity < 1) this.opacity += deltaTime * 2;

        if (this.isFromSky) {
            // Animación de caída lineal pero rápida
            if (this.y < this.targetY) {
                this.y += this.speed * deltaTime;
            } else {
                this.y = this.targetY;
            }
        } else {
            // 1. Aplicar Gravedad a la velocidad
            if (this.y < this.groundY) {
                this.velocityY += this.gravity * deltaTime;
                this.y += this.velocityY * deltaTime;
                this.x += this.velocityX * deltaTime;
            } else {
                // Si toca el "suelo" de su celda, se detiene
                this.y = this.groundY;
                this.velocityY = 0;
                this.velocityX = 0;
            }
        }

        // 2. Tiempo de vida
        if (this.timer >= this.lifespan) this.alive = false;
    }

    render(ctx) {
        // Dibujamos el "brillo" exterior
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = this.opacity; // Aplicamos la transparencia
        
        // Círculo base (El "brillo")
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + (Math.sin(this.timer * 5) * 5), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1.0; // Resetear transparencia para lo demás

        // Cuerpo del sol
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Borde naranja
        ctx.strokeStyle = '#FBC02D';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}