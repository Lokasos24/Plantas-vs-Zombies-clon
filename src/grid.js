export class Grid {
    constructor(canvasWidth, canvasHeight, rows = 5, cols = 9) {
        this.rows = rows;
        this.cols = cols;
        this.cellWidth = canvasWidth / cols;
        this.cellHeight = canvasHeight / rows;

        // Creamos una matriz de 5x9 llena de 'false' (libre)
        this.matrix = Array.from({ length: rows }, () => Array(cols).fill(false));
    }

    // El Grid es responsable de dibujarse a sí mismo
    render(ctx, mouseX, mouseY) {
        // 1. Dibujar la rejilla base
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                ctx.strokeRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }

        // 2. Dibujar el resaltado (Hover)
        // Validamos que el mouse esté dentro de los límites de la rejilla
        if (mouseX >= 0 && mouseX < this.cols && mouseY >= 0 && mouseY < this.rows) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // Blanco semitransparente
            ctx.fillRect(
                mouseX * this.cellWidth, 
                mouseY * this.cellHeight, 
                this.cellWidth, 
                this.cellHeight
            );
        }
    }

    // Método útil para el futuro: convertir clic de mouse a coordenadas de celda
    getGridLocation(mouseX, mouseY) {
        const x = Math.floor(mouseX / this.cellWidth);
        const y = Math.floor(mouseY / this.cellHeight);
        return { x, y };
    }

    isCellFree(x, y) {
        // Verificamos límites para no romper el código
        if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
            return !this.matrix[y][x];
        }
        return false;
    }

    occupyCell(x, y) {
        if (this.isCellFree(x, y)) {
            this.matrix[y][x] = true;
        }
    }
}