import { startMenuMusic } from '../Engine/sound.js';
import { playBeep } from '../Engine/sound.js'; // Pour le petit son de navigation

export class MenuState {
    constructor(stateManager) {
        this.stateManager = stateManager;

        // Configuration du menu interactif
        this.options = ['Jouer', 'Options', 'Crédits'];
        this.selectedIndex = 0; // 0 = Jouer, 1 = Options, 2 = Crédits
        
        // Liaison du contexte pour les événements clavier
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    enter() {
        startMenuMusic();
        // On écoute les touches du clavier dès qu'on entre dans le menu
        window.addEventListener('keydown', this.handleKeyDown);
    }

    exit() {
        // TRÈS IMPORTANT : On retire l'écouteur pour éviter les fuites de mémoire et les conflits d'inputs
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'z':
            case 'Z':
                // On monte dans le menu (avec sécurité pour ne pas dépasser le haut)
                if (this.selectedIndex > 0) {
                    this.selectedIndex--;
                    playBeep(400, 0.05); // Petit bip de navigation mécanique
                }
                break;

            case 'ArrowDown':
            case 's':
            case 'S':
                // On descend dans le menu (avec sécurité pour ne pas dépasser le bas)
                if (this.selectedIndex < this.options.length - 1) {
                    this.selectedIndex++;
                    playBeep(400, 0.05);
                }
                break;

            case 'Enter':
            case ' ':
                playBeep(600, 0.08); // Bip de validation plus aigu
                this.selectOption();
                break;
        }
    }

    selectOption() {
        // Redirection AAA basée sur l'index sélectionné
        if (this.selectedIndex === 0) {
            this.stateManager.changeState('game');
        } else if (this.selectedIndex === 1) {
            this.stateManager.changeState('options');
        } else if (this.selectedIndex === 2) {
            this.stateManager.changeState('credits');
        }
    }

    update(deltaTime) {
        // Le menu principal est statique pour le moment (pas d'animations complexes nécessaires ici)
    }

    draw(ctx, canvas) {
        // 1. Fond noir profond
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Titre du jeu principal
        ctx.fillStyle = '#00f3ff';
        ctx.font = "32px 'Courier New', Courier, monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CYBER PONG TRON', canvas.width / 2, canvas.height / 2 - 80);

        // 3. Rendu dynamique des options du menu
        const startY = canvas.height / 2 + 20;
        const spacing = 45;

        this.options.forEach((option, index) => {
            if (index === this.selectedIndex) {
                // Style Option Sélectionnée
                ctx.fillStyle = '#ffffff';
                ctx.font = "bold 20px 'Courier New', Courier, monospace";
                ctx.fillText(`> ${option} <`, canvas.width / 2, startY + (index * spacing));
            } else {
                // Style Options Inactives
                ctx.fillStyle = '#558899';
                ctx.font = "20px 'Courier New', Courier, monospace";
                ctx.fillText(option, canvas.width / 2, startY + (index * spacing));
            }
        });
    }
}
