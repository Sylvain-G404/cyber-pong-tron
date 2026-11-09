export class Input {
    constructor() {
        // Un objet "dictionnaire" pour stocker l'état des touches (true = enfoncée, false = relâchée)
        this.keys = {};

        // On écoute quand le joueur appuie sur une touche
        window.addEventListener('keydown', (e) => {
            // Sécurité pour éviter que la barre ESPACE ou les flèches fassent défiler la page web
            if (["Space", "ArrowUp", "ArrowDown", "KeyW", "KeyS", "Backspace", "Tab"].includes(e.code)) {
                e.preventDefault();
            }
            this.keys[e.code] = true;
        });

        // On écoute quand le joueur relâche la touche
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    // Une fonction bien pratique pour vérifier n'importe où si une touche précise est enfoncée
    // Exemple : input.isPressed('Space') ou input.isPressed('KeyW')
    isPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    // ========================================================
    // LOGIQUE DE NAVIGATION POUR LES MENUS (ÉVÉNEMENTIEL)
    // ========================================================
    
    // Renvoie true si la touche pressée correspond à "MONTER"
    getMenuUp(event) {
        return event.code === 'ArrowUp' || event.code === 'KeyW';
    }

    // Renvoie true si la touche pressée correspond à "DESCENDRE"
    getMenuDown(event) {
        return event.code === 'ArrowDown' || event.code === 'KeyS';
    }

    // Renvoie true si la touche pressée correspond à "VALIDER"
    getMenuAction(event) {
        return event.code === 'Enter' || event.code === 'Space';
    }

    // Renvoie true si la touche pressée correspond à "RETOUR / QUITTER"
    getMenuCancel(event) {
        return event.code === 'Space' || event.code === 'Tab';
    }
}

// ==========================================
// CENTRALISATION DES TOUCHES DE MENU (EXPORT)
// ==========================================
export const MenuControls = {
    isUp: (event) => event.code === 'ArrowUp' || event.code === 'KeyW',
    isDown: (event) => event.code === 'ArrowDown' || event.code === 'KeyS',
    isAction: (event) => event.code === 'Enter' || event.code === 'Space',
    isCancel: (event) => event.code === 'Space' || event.code === 'Tab'
};