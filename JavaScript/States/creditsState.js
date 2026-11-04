import { playBeep } from '../Engine/sound.js';

export class CreditsState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    enter() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    exit() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        if (event.key === 'Escape' || event.key === 'Backspace') {
            playBeep(400, 0.05);
            this.stateManager.changeState('menu'); // Retour au menu principal
        }
    }

    update(deltaTime) {}

    draw(ctx, canvas) {
        // Fond noir
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Titre
        ctx.fillStyle = '#00f3ff';
        ctx.font = "28px 'Courier New', Courier, monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CRÉDITS', canvas.width / 2, canvas.height / 2 - 60);

        // Contenu
        ctx.fillStyle = '#ffffff';
        ctx.font = "18px 'Courier New', Courier, monospace";
        ctx.fillText('Développeur : Ki->ir->rA', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Musique : Chris_art\'Tattoo', canvas.width / 2, canvas.height / 2 + 30);

        // Retour info
        ctx.fillStyle = '#558899';
        ctx.font = "14px 'Courier New', Courier, monospace";
        ctx.fillText('Appuyez sur ÉCHAP pour revenir', canvas.width / 2, canvas.height - 60);
    }
}
