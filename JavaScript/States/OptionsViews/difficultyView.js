import { playBeep } from '../../Engine/sound.js';
import { MenuControls } from '../../Engine/input.js';

export class DifficultyView {
    constructor(stateManager) {
        this.stateManager = stateManager;
        // On reprend TA liste exacte !
        this.difficulties = ['Facile', 'Moyen', 'Difficile', 'Hardcore'];
        
        // Synchro de départ avec le manager
        const currentDiff = this.stateManager.currentDifficulty || 'Moyen';
        this.selectedIndex = this.difficulties.indexOf(currentDiff);
        if (this.selectedIndex === -1) this.selectedIndex = 1; 
    }

    handleKeyDown(event, onBackToMenu) {
        if (MenuControls.isUp(event)) {
            if (this.selectedIndex > 0) { 
                this.selectedIndex--; 
                playBeep(400, 0.05); 
            }
        }
        else if (MenuControls.isDown(event)) {
            if (this.selectedIndex < this.difficulties.length - 1) { 
                this.selectedIndex++; 
                playBeep(400, 0.05); 
            }
        }
        else if (MenuControls.isAction(event)) {
            playBeep(600, 0.08);
            this.stateManager.currentDifficulty = this.difficulties[this.selectedIndex];
            onBackToMenu(); // On valide et on revient à gauche
        }
        else if (MenuControls.isCancel(event)) {
            playBeep(400, 0.05);
            onBackToMenu(); // Annulation, on revient à gauche
        }
    }

    draw(ctx, canvas, startX, startY) {
        // Vos calculs de tailles typographiques AAA adaptés pour le volet de droite
        const optionSize = Math.floor(canvas.height * 0.04);
        const spacing = Math.floor(canvas.height * 0.09);

        ctx.textAlign = 'left'; // Alignement à gauche pour la colonne de droite
        ctx.textBaseline = 'middle';

        this.difficulties.forEach((diff, index) => {
            const y = startY + (index * spacing);

            if (index === this.selectedIndex) {
                // Effet de clignotement/pulsation néon pour la sélection active
                const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`; // Blanc brillant pulsant
                ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
                
                // Effet aller-retour discret pour le curseur de droite
                const offset = Math.sin(Date.now() * 0.007) * 4;
                ctx.fillText(`> ${diff} <`, startX + offset, y);
            } else {
                ctx.fillStyle = '#558899'; // Cyan éteint de ton code original !
                ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(`  ${diff}`, startX, y);
            }
        });
    }
}
