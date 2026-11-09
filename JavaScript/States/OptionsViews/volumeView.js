import { playBeep, setMasterVolume } from '../../Engine/sound.js';
import { MenuControls } from '../../Engine/input.js';

export class VolumeView {
    constructor(stateManager) {
        this.stateManager = stateManager;
        
        // Initialisation ou récupération du volume global (par défaut 80%)
        if (this.stateManager.globalVolume === undefined) {
            this.stateManager.globalVolume = 80;
        }
    }

    handleKeyDown(event, onBackToMenu) {
        // Touche Q / A (KeyA) : On baisse le volume de 5%
        if (event.code === 'KeyA') {
            if (this.stateManager.globalVolume > 0) {
                this.stateManager.globalVolume -= 5;

                // CORRECTION : On applique le nouveau volume en direct au moteur audio !
                setMasterVolume(this.stateManager.globalVolume);

                // Joue un bip de test au nouveau volume
                playBeep(400, 0.05); 
            }
        }
        // Touche D (KeyD) : On augmente le volume de 5%
        else if (event.code === 'KeyD') {
            if (this.stateManager.globalVolume < 100) {
                this.stateManager.globalVolume += 5;

                // CORRECTION : On applique le nouveau volume en direct au moteur audio !
                setMasterVolume(this.stateManager.globalVolume);

                playBeep(400, 0.05);
            }
        }
        // On valide avec Entrée ou on quitte avec Espace
        else if (MenuControls.isAction(event) || MenuControls.isCancel(event)) {
            playBeep(600, 0.08);
            onBackToMenu(); // Retour à la colonne de gauche
        }
    }

    draw(ctx, canvas, startX, startY) {
        const optionSize = Math.floor(canvas.height * 0.04);
        const volume = this.stateManager.globalVolume;

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // --- TITRE DU SLIDER ---
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
        ctx.fillText("VOLUME GÉNÉRAL", startX, startY);

        // --- CONCEPTION DE LA JAUGE TEXTE (Style TRON/AAA) ---
        // Exemple : [■■■■■■■■□□] 80%
        const totalBars = 10;
        const filledBars = Math.round(volume / 10);
        let barString = '[';

        for (let i = 0; i < totalBars; i++) {
            barString += (i < filledBars) ? '■' : '□';
        }
        barString += ']';

        // Effet pulsant sur la jauge de réglage active
        const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(0, 243, 255, ${pulse})`; // Cyan TRON dynamique
        ctx.font = `${optionSize * 1.2}px 'Courier New', Courier, monospace`;
        
        // Affichage de la jauge et du pourcentage exact
        ctx.fillText(`${barString}  ${volume}%`, startX, startY + 70);

        // Petites flèches d'aide sous la jauge
        ctx.fillStyle = '#558899';
        ctx.font = `${optionSize * 0.65}px 'Courier New', Courier, monospace`;
        ctx.fillText('<- Touche Q-A / D -> pour ajuster', startX, startY + 130);
    }
}
