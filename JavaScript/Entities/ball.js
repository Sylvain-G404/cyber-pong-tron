import { playBeep } from '../Engine/sound.js';
// JavaScript/Entities/ball.js

export class Ball {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Taille et style de la balle néon TRON
        this.radius = Math.floor(this.canvasHeight * 0.016); 
        this.color = "#ff6600"; // Orange Néon TRON ultra flashy 🍊

        // --- SUIVI DE LA TRAÎNÉE (MOTO TRON) ---
        this.history = [];
        this.maxHistory = 8;

        this.reset();
    }

    // Remet la balle au centre de l'écran avec une direction aléatoire
    reset() {
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;
        this.history = [{ x: this.x, y: this.y }];

        // Vitesse d'origine minimale absolue adaptative
        this.minSpeed = Math.floor(this.canvasWidth * 0.4375); // ~700px/s pour un terrain de 1600px
        this.currentSpeed = this.minSpeed; 

        // On calcule l'angle de départ de la balle
        const angleX = Math.random() > 0.5 ? 1 : -1;
        const angleY = (Math.random() > 0.5 ? 1 : -1) * 0.7;

        // Application de la vitesse sur les axes
        this.vx = angleX * this.currentSpeed;
        this.vy = angleY * this.currentSpeed;
    }

    // Nouvelle fonction à appel en cas de BUT subi
    penalize() {
        this.currentSpeed *= 0.5; // On divise la vitesse par 2

        // Sécurité absolue : la vitesse ne peut pas descendre sous la vitesse d'origine
        if (this.currentSpeed < this.minSpeed) {
            this.currentSpeed = this.minSpeed;
        }

        const dirX = Math.sign(this.vx);
        const dirY = Math.sign(this.vy);

        this.vx = dirX * this.currentSpeed;
        this.vy = dirY * this.currentSpeed;
    }

        // Mise à jour de la position de la balle
    update(deltaTime) {
        // Ajout de la position actuelle dans l'historique de la traînée
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        // Déplacement physique
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // --- REBONDS UNIQUEMENT SUR LES MURS HORIZONTAUX (HAUT ET BAS) ---
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy = Math.abs(this.vy);
            playBeep(450, 0.05); // Bip Mur Haut !

            // --- LOGIQUE DU REBOND MUR : PÉNALITÉ DE 1% ---
            this.currentSpeed *= 0.99;
            if (this.currentSpeed < this.minSpeed) {
                this.currentSpeed = this.minSpeed;
            }
            // APPLICATION PHYSIQUE : On applique la nouvelle vitesse aux vecteurs
            const angle = Math.atan2(this.vy, this.vx);
            this.vx = Math.cos(angle) * this.currentSpeed;
            this.vy = Math.sin(angle) * this.currentSpeed;
        }

        if (this.y + this.radius > this.canvasHeight) {
            this.y = this.canvasHeight - this.radius;
            this.vy = -Math.abs(this.vy);
            playBeep(450, 0.05); // Bip Mur Bas !

            // --- LOGIQUE DU REBOND MUR : PÉNALITÉ DE 1% ---
            this.currentSpeed *= 0.99;
            if (this.currentSpeed < this.minSpeed) {
                this.currentSpeed = this.minSpeed;
            }
            // APPLICATION PHYSIQUE : On applique la nouvelle vitesse aux vecteurs
            const angle = Math.atan2(this.vy, this.vx);
            this.vx = Math.cos(angle) * this.currentSpeed;
            this.vy = Math.sin(angle) * this.currentSpeed;
        }
        console.log("Vitesse de la balle :", Math.round(this.currentSpeed), "px/s");
    }


    // Dessin de la traînée puis de la balle principale avec couleur dynamique
    render(ctx, stateManager) {
        // Extraction de la couleur de la balle depuis le manager (Blanc pur de secours)
        const ballColor = (stateManager && stateManager.colors) ? stateManager.colors.ball : "#ffffff";

        // Convertit la couleur HEX en RGBA pour gérer la transparence de la traînée de manière propre
        // Exemple : "#ffffff" devient "rgba(255, 255, 255, ...)"
        ctx.save();
        
        // 1. DESSIN DE LA TRAÎNÉE DE LA MOTO TRON DYNAMIQUE
        for (let i = 0; i < this.history.length; i++) {
            let pos = this.history[i];
            let ratio = i / this.history.length;

            ctx.fillStyle = ballColor;
            ctx.globalAlpha = ratio * 0.35; // Opacité progressive adaptative AAA
            let currentRadius = this.radius * ratio; 

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, currentRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 2. DESSIN DE LA BALLE PRINCIPALE
        ctx.fillStyle = ballColor;

        // Effet de halo néon puissant basé sur ta couleur choisie !
        ctx.shadowBlur = 15;
        ctx.shadowColor = ballColor;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // On coupe proprement l'effet d'ombre
    }

}
