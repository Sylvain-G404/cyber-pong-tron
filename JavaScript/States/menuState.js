import { startMenuMusic } from '../Engine/sound.js';

// JavaScript/States/menuState.js

export class MenuState {
    // 1. On récupère "input" ici
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input; 
    }

    enter() {
        startMenuMusic();
        console.log("Entrée dans le Menu Principal");
    }

    // 2. La boucle de jeu appelle cette fonction 60 fois par seconde !
    update(deltaTime) {
        // Si le joueur appuie sur la barre Espace ('Space')
        if (this.input.isPressed('Space')) {
            // On demande au gestionnaire de basculer sur l'écran de match !
            this.stateManager.changeState('game');
        }
    }

    render(ctx) {
        ctx.fillStyle = "#00f0ff";
        ctx.font = "30px 'Courier New'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText("CYBER PONG TRON", ctx.canvas.width / 2, ctx.canvas.height / 2 - 30);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px 'Courier New'";
        ctx.fillText("Appuyez sur ESPACE pour jouer", ctx.canvas.width / 2, ctx.canvas.height / 2 + 30);
    }

    exit() {
        console.log("Sortie du Menu Principal");
    }
}
