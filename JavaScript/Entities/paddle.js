// JavaScript/Entities/paddle.js

export class Paddle {
    constructor(type, x, y, width, height, color) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color || "#00f0ff";
        
        this.speed = 400; // Vitesse en pixels par seconde
    }

    // L'ORDRE STRICT ICI : deltaTime, puis input, puis width, puis height
    update(deltaTime, input, canvasWidth, canvasHeight) {
        
        // --- MODE PC (Mouvements Verticaux sur Y) ---
        if (this.type === 'left') {
            if (input.isPressed('KeyW')) this.y -= this.speed * deltaTime;
            if (input.isPressed('KeyS')) this.y += this.speed * deltaTime;

            if (this.y < 0) this.y = 0;
            if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
        }

        if (this.type === 'right') {
            if (input.isPressed('ArrowUp')) this.y -= this.speed * deltaTime;
            if (input.isPressed('ArrowDown')) this.y += this.speed * deltaTime;

            if (this.y < 0) this.y = 0;
            if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
        }

        // --- MODE MOBILE (Mouvements Horizontaux sur X) ---
        if (this.type === 'top') {
            if (input.isPressed('KeyA') || input.isPressed('ArrowLeft')) this.x -= this.speed * deltaTime;
            if (input.isPressed('KeyD') || input.isPressed('ArrowRight')) this.x += this.speed * deltaTime;

            if (this.x < 0) this.x = 0;
            if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
        }

        if (this.type === 'bottom') {
            if (input.isPressed('ArrowLeft')) this.x -= this.speed * deltaTime;
            if (input.isPressed('ArrowRight')) this.x += this.speed * deltaTime;

            if (this.x < 0) this.x = 0;
            if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
        }
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        // --- DESSIN ARRONDI ICI (CORRIGÉ) ---
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 5); // 5 pixels d'arrondi sur les coins !
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}
