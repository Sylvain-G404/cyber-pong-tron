import { playBeep } from '../../Engine/sound.js';
import { MenuControls } from '../../Engine/input.js';

export class SideView {
    constructor(stateManager) {
        this.stateManager = stateManager;
        
        // Initialisation du côté du joueur dans le manager (gauche par défaut)
        if (this.stateManager.playerSide === undefined) {
            this.stateManager.playerSide = 'left';
        }

        // Index local pour la navigation dans la colonne de droite (0 = Gauche, 1 = Droite)
        this.localIndex = this.stateManager.playerSide === 'left' ? 0 : 1;
    }

    handleKeyDown(event, onBackToMenu) {
        if (MenuControls.isUp(event)) {
            if (this.localIndex > 0) {
                this.localIndex--;
                playBeep(400, 0.05);
            }
        }
        else if (MenuControls.isDown(event)) {
            if (this.localIndex < 1) {
                this.localIndex++;
                playBeep(400, 0.05);
            }
        }
        else if (MenuControls.isAction(event)) {
            playBeep(600, 0.08);
            // On applique le changement de côté dans le manager global
            this.stateManager.playerSide = this.localIndex === 0 ? 'left' : 'right';

            // OPTIMISATION UX : On sort automatiquement et on retourne à gauche !
            onBackToMenu(); 
        }
        else if (MenuControls.isCancel(event)) {
            playBeep(400, 0.05);
            onBackToMenu(); // Retour sans rien changer si on appuie sur TAB
        }
    }


    draw(ctx, canvas, startX, startY) {
        const optionSize = Math.floor(canvas.height * 0.04);
        const spacing = Math.floor(canvas.height * 0.09);
        const currentSide = this.stateManager.playerSide;

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // --- TITRE DE LA SÉLECTION ---
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
        ctx.fillText("POSITION DU JOUEUR", startX, startY);

        const options = ['CÔTÉ GAUCHE', 'CÔTÉ DROITE'];

        options.forEach((label, index) => {
            const y = startY + 80 + (index * spacing);
            
            // Détermination du symbole de la checkbox [x] ou [ ]
            const isChecked = (index === 0 && currentSide === 'left') || (index === 1 && currentSide === 'right');
            const boxSymbol = isChecked ? '[X]' : '[ ]';

            if (index === this.localIndex) {
                // Option actuellement survolée (effet pulsant)
                const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
                ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
                
                const offset = Math.sin(Date.now() * 0.007) * 4;
                ctx.fillText(`${boxSymbol} ${label} <`, startX + offset, y);
            } else {
                // Option non survolée
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(`${boxSymbol} ${label}`, startX, y);
            }
        });
    }
}
