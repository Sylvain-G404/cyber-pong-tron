// JavaScript/main.js

// Importation de nos modules d'architecture
import { GameLoop } from './Engine/gameLoop.js';
import { Input } from './Engine/input.js';
import { StateManager } from './States/stateManager.js';
import { MenuState } from './States/menuState.js';
import { GameState } from './States/gameState.js';
import { EndState } from './States/endState.js';


// Récupération du Canvas et de son contexte de dessin
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 1. Instanciation du Gestionnaire d'États (Le Cerveau)
const stateManager = new StateManager(ctx, canvas);
const input = new Input(); // <--- AJOUTE CETTE LIGNE

// 2. Instanciation de la Boucle de Jeu (Le Cœur)
// On lui transmet les fonctions d'aiguillage du StateManager
const gameLoop = new GameLoop(
    (deltaTime) => stateManager.update(deltaTime),
    () => stateManager.render()
);

// Fonction pour adapter le canvas à la taille de la fenêtre
function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < height) {
        canvas.width = width * 0.95;
        canvas.height = height * 0.90;
    } else {
        canvas.width = width * 0.85;
        canvas.height = height * 0.85;
    }

    // On force le StateManager à redessiner l'écran actuel après un redimensionnement
    stateManager.render();
}

// Initialisation globale au chargement du DOM
window.addEventListener('DOMContentLoaded', () => {
    // Configuration de la taille initiale du Canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3. Enregistrement des différents écrans du jeu
    stateManager.addState('menu', new MenuState(stateManager, input));
    stateManager.addState('game', new GameState(stateManager, input));
    stateManager.addState('end', new EndState(stateManager, input));

    // 4. On définit l'écran de départ sur le MENU principal
    stateManager.changeState('menu');

    // 5. FEU ! On démarre la boucle principale du jeu
    gameLoop.start();
});
