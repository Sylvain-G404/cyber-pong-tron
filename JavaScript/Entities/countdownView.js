export class CountdownView {
    constructor(canvasWidth, canvasHeight, difficulty) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.difficulty = difficulty || 'Moyen';
        
        // Notre chrono interne de 5 secondes
        this.timer = 5.0;
        this.isFinished = false;
    }

    update(deltaTime) {
        if (this.isFinished) return;

        // Le chrono descend seconde par seconde
        this.timer -= deltaTime;

        // Fin de l'animation après le FIGHT (on laisse 0.5s de rab à la fin)
        if (this.timer <= -0.5) {
            this.isFinished = true;
        }
    }

    draw(ctx) {
        if (this.isFinished) return;

        // Base géométrique pour centrer notre HUD
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;
        
        // Tailles proportionnelles AAA de l'affichage
        const boxWidth = Math.floor(this.canvasWidth * 0.35); 
        const boxHeight = Math.floor(this.canvasHeight * 0.12); 

        // ==========================================
        // PHASE 1 : ANNONCE DU MODE (De 5.0s à 3.0s)
        // ==========================================
        if (this.timer > 3.0) {
            const isHardcore = this.difficulty.toLowerCase() === 'difficile';
            
            // Effet de clignotement d'alerte pour le mode Hardcore
            let isFlashOn = true;
            if (isHardcore) {
                isFlashOn = Math.floor(this.timer * 5) % 2 === 0;
            }

            let neonColor = '#00f3ff'; 
            if (isHardcore && isFlashOn) {
                neonColor = '#ff0033'; 
            }

            // --- TRACÉ VECTORIEL DU CADRE HUD ---
            ctx.save();
            ctx.strokeStyle = neonColor;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = neonColor;

            ctx.strokeRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);

            // Petites équerres cyber aux quatre coins
            const cornerSize = 15;
            ctx.beginPath();
            ctx.moveTo(centerX - boxWidth / 2 - 10, centerY - boxHeight / 2 + cornerSize);
            ctx.lineTo(centerX - boxWidth / 2 - 10, centerY - boxHeight / 2 - 10);
            ctx.lineTo(centerX - boxWidth / 2 + cornerSize, centerY - boxHeight / 2 - 10);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(centerX + boxWidth / 2 + 10, centerY - boxHeight / 2 + cornerSize);
            ctx.lineTo(centerX + boxWidth / 2 + 10, centerY - boxHeight / 2 - 10);
            ctx.lineTo(centerX + boxWidth / 2 - cornerSize, centerY - boxHeight / 2 - 10);
            ctx.stroke();
            ctx.restore(); 

            // --- TEXTES INTERNES (CORRIGÉS AVEC 'this.') ---
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillStyle = '#558899';
            ctx.font = `bold ${Math.floor(this.canvasHeight * 0.022)}px 'Courier New', Courier, monospace`;
            ctx.fillText(">> CHARGEMENT FLUX <<", centerX, centerY - 20);

            ctx.fillStyle = isHardcore ? '#ff0033' : '#ffffff';
            ctx.font = `bold italic ${Math.floor(this.canvasHeight * 0.035)}px 'Courier New', Courier, monospace`;
            
            const txtMode = isHardcore ? `MODE: ${this.difficulty.toUpperCase()}` : `MODE: ${this.difficulty}`;
            ctx.fillText(txtMode, centerX, centerY + 20);
        }
        
        // ==========================================
        // PHASE 2 : LE DECOMPTE PULSATION (De 3.0s à 0.0s)
        // ==========================================
        else if (this.timer > 0.0) {
            const currentSecond = Math.ceil(this.timer); // 3, 2 ou 1
            
            // MATHÉMATIQUES DE PULSATION AAA :
            // On extrait les décimales restantes de la seconde en cours (va de 1.0 à 0.0)
            const fraction = this.timer - (currentSecond - 1);
            
            // Formule de zoom : le texte et l'onde apparaissent géants puis se rétractent
            const scaleFactor = 1.0 + (fraction * 1.5); 
            const baseFontSize = Math.floor(this.canvasHeight * 0.08); // Taille de base (~80px)
            const dynamicFontSize = Math.floor(baseFontSize * scaleFactor);

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // --- TRACÉ DE L'ONDE DE CHOC OCTOGONALE ÉLECTRIQUE ---
            ctx.strokeStyle = `rgba(255, 102, 0, ${fraction * 0.5})`; // Disparaît avec le temps
            ctx.lineWidth = 4;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff6600';

            const radius = Math.floor(this.canvasHeight * 0.08) * scaleFactor;

            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 4) * i;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();

            // --- CHIFFRE GÉANT RETRO ---
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
            ctx.font = `bold ${dynamicFontSize}px 'Courier New', Courier, monospace`;
            ctx.fillText(currentSecond, centerX, centerY);
            
            ctx.restore();
        }
        
        // ==========================================
        // PHASE 3 : L'EXPLOSION FINALE (De 0.0s à -0.5s)
        // ==========================================
        else {
            // L'effet d'estompement progressif (Fade Out)
            const alpha = 1.0 - (Math.abs(this.timer) / 0.5); // Descend de 1.0 à 0.0 en une demi-seconde
            
            ctx.save();
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#00ff66'; // Vert cyber d'activation
            ctx.font = `bold italic ${Math.floor(this.canvasHeight * 0.1)}px 'Courier New', Courier, monospace`;
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00ff66';
            
            ctx.fillText("FIGHT !", centerX, centerY);
            ctx.restore();
        }
    }
}
