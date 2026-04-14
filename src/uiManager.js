export class UIManager {
    constructor(width, height, assets) {
        this.width = width;
        this.height = height; // Altura de la barra (ej: 100px)
        this.selectedPlant = null; // Qué planta tenemos seleccionada
        this.assets = assets;

        // El "Ancho de la sección de Soles" será nuestra nueva referencia X
        this.sunSectionWidth = 100;

        // Definimos "botones" simples para nuestras plantas
        this.slots = [
            { id: 'sunflower', cost: 50, color: '#FFD700', x: 120, y: 10, w: 70, h: 60 },
            { id: 'peashooter', cost: 100, color: '#4CAF50', x: 200, y: 10, w: 70, h: 60 }
        ];

        // En el constructor de UIManager.js
        this.shovelSlot = { id: 'shovel', color: '#757575', x: width - 90, y: 10, w: 70, h: 80 };
    }

    render(ctx, currentSuns) {
        // Fondo de la barra
        ctx.fillStyle = '#3e2723'; // Café oscuro
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. RECUADRO DE SOLES (Extremo Izquierdo)
        ctx.fillStyle = '#5d4037'; // Un café un poco más claro para resaltar
        ctx.fillRect(10, 10, 90, 80);
        ctx.strokeStyle = '#D4AF37'; // Borde dorado
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 90, 80);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("SOLES", 55, 35);

        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#FFEB3B'; // Amarillo para el número
        ctx.fillText(currentSuns || 0, 55, 70);

        // 3. SLOTS DE PLANTAS
        ctx.textAlign = 'left'; // Reset para los slots
        this.slots.forEach(slot => {
            // Dibujar el slot (el botón)
            ctx.fillStyle = slot.color;
            ctx.fillRect(slot.x, slot.y, slot.w, slot.h);

            // Si hay una imagen para esta planta, la dibujamos en el centro del slot
            if (this.assets && this.assets[slot.id]) {
                const img = this.assets[slot.id];
                const padding = 5;
                ctx.drawImage(
                    img, 
                    slot.x + padding, 
                    slot.y + padding, 
                    slot.w - padding * 2, 
                    slot.h - padding * 2
                );
            }

            // Si está seleccionada, borde blanco
            if (this.selectedPlant === slot.id) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);
            }

            // DIBUJAR EL COSTO (Debajo del slot, estilo PvZ)
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            // Centramos el texto del costo bajo el recuadro
            const textX = slot.x + (slot.w / 2) - (ctx.measureText(slot.cost).width / 2);
            ctx.fillText(slot.cost, textX, slot.y + slot.h + 15);
        });

        // Dibujar la PALA
        ctx.fillStyle = this.shovelSlot.color;
        ctx.fillRect(this.shovelSlot.x, this.shovelSlot.y, this.shovelSlot.w, this.shovelSlot.h);

        // Icono simple de pala (una línea y un cuadrado)
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(this.shovelSlot.x + 30, this.shovelSlot.y + 10, 10, 40); // Mango
        ctx.fillRect(this.shovelSlot.x + 20, this.shovelSlot.y + 50, 30, 20); // Cabeza

        if (this.selectedPlant === 'shovel') {
            ctx.strokeStyle = 'red'; // Resaltado en rojo porque es "destructivo"
            ctx.lineWidth = 3;
            ctx.strokeRect(this.shovelSlot.x, this.shovelSlot.y, this.shovelSlot.w, this.shovelSlot.h);
        }
    }

    // Método para detectar si el clic fue en la UI
    checkClick(mouseX, mouseY) {
        let clickedOnUI = false;

        if (mouseY <= this.height) {
            this.slots.forEach(slot => {
                if (mouseX >= slot.x && mouseX <= slot.x + slot.w &&
                    mouseY >= slot.y && mouseY <= slot.y + slot.h) {
                    this.selectedPlant = slot.id;
                    clickedOnUI = true;
                }
            });
        }

        // Añadimos la detección del clic en la pala
        if (mouseY <= this.height) {
            // ... (logic for plant slots) ...

            // Check Shovel
            if (mouseX >= this.shovelSlot.x && mouseX <= this.shovelSlot.x + this.shovelSlot.w &&
                mouseY >= this.shovelSlot.y && mouseY <= this.shovelSlot.y + this.shovelSlot.h) {
                this.selectedPlant = 'shovel';
                clickedOnUI = true;
            }
        }

        return clickedOnUI;
    }
}