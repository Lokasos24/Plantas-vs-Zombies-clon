export class InputManager {
    constructor(canvas, grid, offsetX = 0, offsetY = 0) {
        this.canvas = canvas;
        this.grid = grid;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.mouse = { x: 0, y: 0, gridX: 0, gridY: 0 };

        this.canvas.addEventListener('mousemove', (e) => this.updateMousePosition(e));
    }

    updateMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        
        // Posición real del mouse en el Canvas
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        // Guardamos la posición absoluta para la UI
        this.mouse.x = canvasX;
        this.mouse.y = canvasY;

        // Calculamos la posición RELATIVA a la rejilla restando los offsets
        const relativeX = canvasX - this.offsetX;
        const relativeY = canvasY - this.offsetY;

        // Solo actualizamos la rejilla si estamos dentro de la zona de juego
        const gridPos = this.grid.getGridLocation(relativeX, relativeY);
        this.mouse.gridX = gridPos.x;
        this.mouse.gridY = gridPos.y;
    }
}