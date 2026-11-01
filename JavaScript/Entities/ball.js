// JavaScript/Entities/ball.js

export class Ball {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.radius = 8; // Taille de la balle néon
        this.color = "#ff6600"; // Orange Néon TRON ultra flashy 🍊
        
        // --- SUIVI DE LA TRAÎNÉE (MOTO TRON) ---
        this.history = [];      // Tableau pour stocker les anciennes positions
        this.maxHistory = 8;    // Longueur de la traînée (plus c'est haut, plus la traînée est longue)
        
        this.reset();
    }

    // Remet la balle au centre de l'écran avec une direction aléatoire
    reset() {
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;

        // CORRECTION : On initialise l'historique avec la position centrale de départ
        this.history = [{ x: this.x, y: this.y }];
        
        // Vitesse d'origine minimale absolue
        this.minSpeed = 350; 
        this.currentSpeed = this.minSpeed; // La vitesse va évoluer ici
        
        // On calcule l'angle de départ de la balle
        const angleX = Math.random() > 0.5 ? 1 : -1;
        const angleY = (Math.random() > 0.5 ? 1 : -1) * 0.7;
        
        // On applique la vitesse actuelle sur les axes
        this.vx = angleX * this.currentSpeed;
        this.vy = angleY * this.currentSpeed;
    }

    // Nouvelle fonction très simple à appeler à chaque coup de raquette !
    accelerate() {
        this.currentSpeed *= 1.05; // +5% de vitesse exponentielle !
        
        // On conserve la direction actuelle mais on applique la nouvelle vitesse
        const dirX = Math.sign(this.vx);
        const dirY = Math.sign(this.vy);
        
        this.vx = dirX * this.currentSpeed;
        this.vy = dirY * this.currentSpeed;
        console.log(`Accélération TRON ! Nouvelle vitesse : ${Math.round(this.currentSpeed)} px/s`);
    }

    // Nouvelle fonction à appeler en cas de BUT subit
    penalize() {
        this.currentSpeed *= 0.5; // On divise la vitesse par 2
        
        // Sécurité absolue : la vitesse ne peut pas descendre sous la vitesse d'origine !
        if (this.currentSpeed < this.minSpeed) {
            this.currentSpeed = this.minSpeed;
        }
        
        const dirX = Math.sign(this.vx);
        const dirY = Math.sign(this.vy);
        
        this.vx = dirX * this.currentSpeed;
        this.vy = dirY * this.currentSpeed;
    }

    // Mise à jour de la position de la balle
    update(deltaTime, isVertical) {
        this.history.push({ x: this.x, y: this.y });
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // --- REBONDS UNIQUEMENT SUR LES MURS LATÉRAUX (PAS LES BUTS) ---
        if (isVertical) {
            // Mode Mobile : Rebond uniquement sur les côtés (Gauche et Droite)
            if (this.x - this.radius < 0) { this.x = this.radius; this.vx = Math.abs(this.vx); }
            if (this.x + this.radius > this.canvasWidth) { this.x = this.canvasWidth - this.radius; this.vx = -Math.abs(this.vx); }
        } else {
            // Mode PC : Rebond uniquement sur les côtés (Haut et Bas)
            if (this.y - this.radius < 0) { this.y = this.radius; this.vy = Math.abs(this.vy); }
            if (this.y + this.radius > this.canvasHeight) { this.y = this.canvasHeight - this.radius; this.vy = -Math.abs(this.vy); }
        }
    }


    // Dessin de la traînée puis de la balle principale
    render(ctx) {
        // 1. DESSIN DE LA TRAÎNÉE DE LA MOTO TRON
        for (let i = 0; i < this.history.length; i++) {
            let pos = this.history[i];
            
            // Calcul du ratio (0 au début, se rapproche de 1 à la fin)
            let ratio = i / this.history.length;
            
            // Plus on est vieux dans l'historique, plus c'est transparent et petit
            ctx.fillStyle = `rgba(255, 102, 0, ${ratio * 0.4})`; // Orange avec opacité dégressive
            let currentRadius = this.radius * ratio; // Taille dégressive
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, currentRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. DESSIN DE LA BALLE PRINCIPALE
        ctx.fillStyle = this.color;
        
        // Effet de halo néon puissant
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0; // On coupe proprement l'effet d'ombre
    }
}
