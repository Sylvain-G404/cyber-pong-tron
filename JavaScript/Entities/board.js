// JavaScript/Entities/board.js

export class Board {
    constructor(canvas) {
        this.canvas = canvas;
    }

    render(ctx, stateManager) {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Extraction de la couleur de l'arène (Cyan de secours)
        const wallColor = (stateManager && stateManager.colors) ? stateManager.colors.walls : "#00f0ff";

        // ==========================================
        // LA GRILLE CYBER QUADRILLÉE DYNAMIQUE
        // ==========================================
        ctx.save();
        ctx.strokeStyle = wallColor; 
        ctx.globalAlpha = 0.06; // Reste très discret pour le confort visuel des yeux
        ctx.lineWidth = 1;

        // Les lignes verticales régulières
        const stepX = 80; 
        for (let x = 0; x <= w; x += stepX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        // B. Les lignes horizontales régulières
        const stepY = 80; 
        for (let y = 0; y <= h; y += stepY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        ctx.restore();

        // ==========================================
        // LE FILET CENTRAL CLASSIQUE
        // ==========================================
        ctx.save();
        ctx.strokeStyle = wallColor; 
        ctx.globalAlpha = 0.4; // Intensité du filet
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]); // Vos pointillés rétro d'origine !

        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
        ctx.restore();

        // ==========================================
        // ENCADREMENT NÉON DYNAMIQUE DE L'ARÈNE (CODE AAA)
        // ==========================================
        ctx.save();
        ctx.strokeStyle = wallColor;
        ctx.lineWidth = 6; // Une bonne épaisseur néon d'arcade
        ctx.shadowBlur = 15;
        ctx.shadowColor = wallColor; // L'effet de halo lumineux Tron !

        ctx.strokeRect(0, 0, w, h); // Encadre parfaitement le terrain
        ctx.restore();
    }
}
