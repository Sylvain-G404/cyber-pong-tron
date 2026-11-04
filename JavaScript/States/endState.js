import { playAdvancedBeep, stopAmbientMusic  } from '../Engine/sound.js';
// JavaScript/States/endState.js

export class EndState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;
        this.result = 'none'; // Reçoit 'victory' ou 'gameover'
    }

    // On récupère le résultat envoyé par le GameState au moment de basculer
    setResult(resultType) {
        this.result = resultType;
    }

    enter() {

        stopAmbientMusic(); // Sécurité supplémentaire

        // --- SONS DE FIN DE PARTIE ---
        if (this.result === 'victory') {
            // Petite mélodie montante héroïque 🏆
            playAdvancedBeep(440, 0.1, 'square');
            setTimeout(() => playAdvancedBeep(554, 0.1, 'square'), 100);
            setTimeout(() => playAdvancedBeep(659, 0.15, 'square'), 200);
            setTimeout(() => playAdvancedBeep(880, 0.3, 'sawtooth'), 300);
        } else {
            // Son lourd et agressif qui s'effondre (BZZZUUUuuu...) 💀
            playAdvancedBeep(150, 0.15, 'sawtooth');
            setTimeout(() => playAdvancedBeep(110, 0.15, 'sawtooth'), 120);
            setTimeout(() => playAdvancedBeep(85, 0.4, 'sawtooth'), 240);
        }
    }

    update(deltaTime) {
        // Touche Entrée (Enter) pour relancer directement un match
        if (this.input.isPressed('Space')) {
            this.stateManager.changeState('game');
        }
        // Touche Échap (Escape) pour retourner au Menu principal
        if (this.input.isPressed('Escape')) {
            this.stateManager.changeState('menu');
        }
    }

    render(ctx) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (this.result === 'victory') {
            ctx.fillStyle = "#00ff00"; // Vert néon Victoire
            ctx.font = "bold 40px 'Courier New'";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#00ff00";
            ctx.fillText("🏆 VICTOIRE TRON 🏆", ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
        } else {
            ctx.fillStyle = "#ff0000"; // Rouge néon Défaite
            ctx.font = "bold 40px 'Courier New'";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#ff0000";
            ctx.fillText("💀 GAME OVER 💀", ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
        }

        // Instructions de navigation communes
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px 'Courier New'";
        ctx.fillText("Appuyez sur ESPACE pour REJOUER", ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
        ctx.fillText("Appuyez sur ÉCHAP pour le MENU", ctx.canvas.width / 2, ctx.canvas.height / 2 + 75);
    }

    exit() {
        console.log("Fermeture de l'écran de fin");
    }
}
