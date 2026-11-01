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
        console.log(`Écran de fin affiché : ${this.result.toUpperCase()}`);
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
