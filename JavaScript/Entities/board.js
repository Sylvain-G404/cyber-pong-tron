// JavaScript/Entities/board.js

export class Board {
    constructor(canvas) {
        this.canvas = canvas;
    }

    // Permet de savoir à tout moment si le terrain est en mode Mobile (Vertical)
    isVertical() {
        return this.canvas.width < this.canvas.height;
    }

    // Dessine les lignes de l'arène TRON
    render(ctx) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.4)"; // Cyan TRON semi-transparent
        ctx.lineWidth = 2;
        
        // On configure de vrais pointillés rétro (5px dessinés, 5px vides)
        ctx.setLineDash([8, 8]); 

        ctx.beginPath();
        if (this.isVertical()) {
            // Mode Mobile : Le filet est horizontal (au milieu de la hauteur)
            ctx.moveTo(0, this.canvas.height / 2);
            ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        } else {
            // Mode PC : Le filet est vertical (au milieu de la largeur) - CORRIGÉ ICI !
            ctx.moveTo(this.canvas.width / 2, 0);
            ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        }
        ctx.stroke();
        
        // On remet à zéro les pointillés pour ne pas impacter les autres dessins (balles, raquettes)
        ctx.setLineDash([]);
    }
}
