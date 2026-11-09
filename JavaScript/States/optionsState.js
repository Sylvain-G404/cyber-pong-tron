import { playBeep } from '../Engine/sound.js';
import { MenuControls } from '../Engine/input.js';

export class OptionsState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;

        // Configuration des choix de difficulté
        this.difficulties = ['Facile', 'Moyen', 'Difficile', 'Hardcore'];
        this.selectedIndex = 1; // Positionné sur 'Moyen' par défaut

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    enter() { window.addEventListener('keydown', this.handleKeyDown); }
    exit() { window.removeEventListener('keydown', this.handleKeyDown); }

    handleKeyDown(event) {
        if (MenuControls.isUp(event)) {
            if (this.selectedIndex > 0) { this.selectedIndex--; playBeep(400, 0.05); }
        }
        else if (MenuControls.isDown(event)) {
            // ICI : On utilise bien .difficulties pour cet écran précis !
            if (this.selectedIndex < this.difficulties.length - 1) { this.selectedIndex++; playBeep(400, 0.05); }
        }
        else if (MenuControls.isAction(event)) {
            playBeep(600, 0.08);
            this.stateManager.currentDifficulty = this.difficulties[this.selectedIndex];
            this.stateManager.changeState('menu');
        }
        else if (MenuControls.isCancel(event)) { // Prise en compte de la touche Espace/Retour
            playBeep(400, 0.05);
            this.stateManager.changeState('menu');
        }
    }

    update(deltaTime) {}

    draw(ctx, canvas) {
        // 1. Fond noir profond
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- CALCULS DE TAILLES TYPOGRAPHIQUES AUTOMATIQUES AAA ---
        const titleSize = Math.floor(canvas.height * 0.075); // ~75px pour 1000 de haut
        const optionSize = Math.floor(canvas.height * 0.04);  // ~40px
        const helpSize = Math.floor(canvas.height * 0.022);   // ~22px
        const spacing = Math.floor(canvas.height * 0.09);     // ~90px

        // 2. Titre de l'écran
        ctx.fillStyle = '#00f3ff';
        ctx.font = `bold ${titleSize}px 'Courier New', Courier, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DIFFICULTÉ IA', canvas.width / 2, canvas.height / 2 - (spacing * 1.2));

        // 3. Rendu dynamique des niveaux de difficulté
        const startY = canvas.height / 2 + (spacing * 0.3);

        this.difficulties.forEach((diff, index) => {
            if (index === this.selectedIndex) {
                // Style Difficultée sélectionnée (Blanc brillant avec indicateur)
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(`> ${diff} <`, canvas.width / 2, startY + (index * spacing));
            } else {
                // Style Difficultées inactives (Cyan éteint)
                ctx.fillStyle = '#558899';
                ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(diff, canvas.width / 2, startY + (index * spacing));
            }
        });

        // 4. Petit message d'aide en bas
        ctx.fillStyle = '#336677';
        ctx.font = `${helpSize}px 'Courier New', Courier, monospace`;
        ctx.fillText('[ Navigation ]  Haut : Z-W / ⬆  |  Bas : S / ⬇  |  Validation : Entrée / Espace', canvas.width / 2, canvas.height - (canvas.height * 0.06));
    }
}
