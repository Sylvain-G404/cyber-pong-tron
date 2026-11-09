// JavaScript/States/gameState.js

import { Board } from '../Entities/board.js';
import { Paddle } from '../Entities/paddle.js';
import { Ball } from '../Entities/ball.js';
import { CountdownView } from '../Entities/countdownView.js';
import { playBeep, playAdvancedBeep, startDangerAlarm, stopDangerAlarm, stopAmbientMusic, stopMenuMusic, startGameMusic } from '../Engine/sound.js';

export class GameState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;
        this.board = null;
        this.paddleLeftOrTop = null;
        this.paddleRightOrBottom = null;

        // --- MURS DE DANGER TRON UNIVERSELS ---
        this.wallDangerJoueur = false; 
        this.wallDangerIA = false;     

        this.countdownAnimation = null;

        // --- PROPRIÉTÉS DE DIFFICULTÉ IA DYNAMIQUES ---
        this.aiSpeed = 400;
        this.aiReactionTimer = 0;
        this.aiTargetPos = undefined; 
    }

    async enter() {
        console.log("Le match commence !");
        stopMenuMusic();
        startGameMusic();
        const canvas = this.stateManager.canvas;

        this.wallDangerJoueur = false;
        this.wallDangerIA = false;
        this.countdownAnimation = new CountdownView(canvas.width, canvas.height, this.stateManager.currentDifficulty);
        this.aiTargetPos = undefined;

        // 1. Détermination de la clé en minuscules
        const diffKey = (this.stateManager.currentDifficulty || 'Facile').toLowerCase();

        // 2. Chargement de la configuration de l'IA
        try {
            const response = await fetch('Data/aiConfig.json');
            const config = await response.json();
            const aiSettings = config[diffKey] || config['facile'];

            this.aiSpeed = aiSettings.speed;
            this.aiReactionInterval = aiSettings.reactionTime; 
            this.aiErrorMargin = aiSettings.errorMargin;
            this.aiMalice = aiSettings.malice || false;

            console.log(`[IA CONFIG] Mode ${diffKey} appliqué : Vitesse=${this.aiSpeed}, Réaction=${this.aiErrorMargin}px`);
        } catch (error) {
            console.error("Impossible de charger la configuration de l'IA, valeurs de secours appliquées :", error);
            this.aiSpeed = 400;
            this.aiReactionInterval = 0.15;
            this.aiErrorMargin = 40;
        }

        // 3. Initialisation des entités (Arène paysage)
        this.board = new Board(canvas);
        this.ball = new Ball(canvas.width, canvas.height);

        const pWidth = 15;
        const pHeight = canvas.height * 0.2; 

        this.paddleLeftOrTop = new Paddle(
            'left', 
            20, 
            canvas.height / 2 - pHeight / 2,
            pWidth, pHeight, "#00ff66",
            canvas.width, canvas.height
        );
        this.paddleRightOrBottom = new Paddle(
            'right', 
            canvas.width - 20 - pWidth, 
            canvas.height / 2 - pHeight / 2,
            pWidth, pHeight, "#ff0077",
            canvas.width, canvas.height
        );
    }

    update(deltaTime) {
        const canvas = this.stateManager.canvas;
        const playerSide = this.stateManager.playerSide || 'left'; // 'left' par défaut

        // --- 1 & 2. CONTRÔLES DYNAMIQUES JOUEUR ET PILOTAGE AUTOMATIQUE IA ---
        
        // La raquette GAUCHE est-elle le joueur ou l'IA ?
        if (this.paddleLeftOrTop) {
            if (playerSide === 'left') {
                // Mode classique : Le joueur contrôle la raquette gauche
                this.paddleLeftOrTop.update(deltaTime, this.input, canvas.width, canvas.height);
            } else {
                // Mode inversé : C'est l'IA qui pilote la raquette gauche !
                this.updateAI(this.paddleLeftOrTop, deltaTime, canvas);
            }
        }

        // La raquette DROITE est-elle le joueur ou l'IA ?
        if (this.paddleRightOrBottom) {
            if (playerSide === 'right') {
                // Mode inversé : Le joueur contrôle la raquette droite
                this.paddleRightOrBottom.update(deltaTime, this.input, canvas.width, canvas.height);
            } else {
                // Mode classique : C'est l'IA qui pilote la raquette droite
                this.updateAI(this.paddleRightOrBottom, deltaTime, canvas);
            }
        }

        // --- GESTION DU DÉCOMPTE V2 (ANIMATION ISOLÉE) ---
        if (this.countdownAnimation && !this.countdownAnimation.isFinished) {

            // On sauvegarde le temps avant et après l'update pour détecter les bips à la seconde exacte
            const prevTimer = this.countdownAnimation.timer;
            this.countdownAnimation.update(deltaTime);
            const currentTimer = this.countdownAnimation.timer;

            // Détection du passage des secondes pour les effets sonores d'arcade
            const prevFloor = Math.ceil(prevTimer);
            const currentFloor = Math.ceil(currentTimer);

            if (prevFloor !== currentFloor && currentFloor >= 0) {
                if (currentFloor === 0) {
                    playAdvancedBeep(880, 0.3, 'sawtooth'); // Le bip strident du FIGHT !
                } else if (currentFloor <= 3) {
                    playBeep(300, 0.08); // Les bips des chiffres 3, 2, 1
                } else {
                    playBeep(200, 0.05); // Petit clic mécanique pour l'annonce MODE / HARDCORE
                }
            }
        } else if (this.ball && this.board) {
            // Mise à jour de la balle (On passe 'false' car ce n'est plus un terrain vertical)
            this.ball.update(deltaTime, false);

            // --- PHYSIQUE UNIVERSELLE ISSUE DU CROQUIS : RAQUETTE JOUEUR GAUCHE ---
            if (this.checkCollision(this.ball, this.paddleLeftOrTop)) {
                playAdvancedBeep(650, 0.06, 'sine'); 

                let relativeIntersectY = this.ball.y - (this.paddleLeftOrTop.y + this.paddleLeftOrTop.height / 2);
                let normalizedIntersectY = relativeIntersectY / (this.paddleLeftOrTop.height / 2);
                let absIntersect = Math.abs(normalizedIntersectY);

                let speedMultiplier = 1.05; 
                if (absIntersect > 0.75) {
                    speedMultiplier = 1.08; 
                } else if (absIntersect > 0.3) {
                    speedMultiplier = 1.06 + (absIntersect - 0.3) * 0.022; 
                }

                this.ball.currentSpeed *= speedMultiplier;

                if (absIntersect <= 0.3) {
                    this.ball.vy = 0; 
                } else {
                    this.ball.vy = normalizedIntersectY * (this.ball.currentSpeed * 0.75); 
                }

                this.ball.vx = Math.sqrt(Math.pow(this.ball.currentSpeed, 2) - Math.pow(this.ball.vy, 2));
                this.ball.x = this.paddleLeftOrTop.x + this.paddleLeftOrTop.width + this.ball.radius;
            }

            // --- PHYSIQUE UNIVERSELLE ISSUE DU CROQUIS : RAQUETTE IA DROITE ---
            if (this.checkCollision(this.ball, this.paddleRightOrBottom)) {
                playAdvancedBeep(520, 0.08, 'triangle'); 

                let relativeIntersectY = this.ball.y - (this.paddleRightOrBottom.y + this.paddleRightOrBottom.height / 2);
                let normalizedIntersectY = relativeIntersectY / (this.paddleRightOrBottom.height / 2);
                let absIntersect = Math.abs(normalizedIntersectY);

                let speedMultiplier = 1.05;
                if (absIntersect > 0.75) {
                    speedMultiplier = 1.08;
                } else if (absIntersect > 0.3) {
                    speedMultiplier = 1.06 + (absIntersect - 0.3) * 0.022;
                }

                this.ball.currentSpeed *= speedMultiplier;

                if (absIntersect <= 0.3) {
                    this.ball.vy = 0; 
                } else {
                    this.ball.vy = normalizedIntersectY * (this.ball.currentSpeed * 0.75);
                }

                this.ball.vx = -Math.sqrt(Math.pow(this.ball.currentSpeed, 2) - Math.pow(this.ball.vy, 2));
                this.ball.x = this.paddleRightOrBottom.x - this.ball.radius;
            }

            // --- CONDITIONS DE COMPTAGE DU SCORE (BUTS ENCAISSÉS - UNIVERSEL) ---
            // Si la balle dépasse la GAUCHE
            if (this.ball.x - this.ball.radius <= 0 && this.ball.vx < 0) {
                this.ball.x = this.ball.radius + 15;
                this.ball.vx = Math.abs(this.ball.vx);
                this.ball.penalize();
                playBeep(180, 0.2); 
                stopDangerAlarm(); 

                // Qui est à gauche ?
                if (playerSide === 'left') {
                    // C'est le JOUEUR qui prend le but
                    if (this.wallDangerIA) {
                        this.wallDangerIA = false;
                    } else if (this.wallDangerJoueur) {
                        console.log("%c💀 GAME OVER !", "color: #ff0000; font-weight: bold;");
                        this.stateManager.states['end'].setResult('gameover');
                        this.stateManager.changeState('end');
                    } else {
                        this.wallDangerJoueur = true;
                    }
                } else {
                    // C'est l'IA qui prend le but
                    if (this.wallDangerJoueur) {
                        this.wallDangerJoueur = false;
                    } else if (this.wallDangerIA) {
                        console.log("%c🏆 VICTOIRE DU JOUEUR !", "color: #00ff00; font-weight: bold;");
                        this.stateManager.states['end'].setResult('victory');
                        this.stateManager.changeState('end');
                    } else {
                        this.wallDangerIA = true;
                    }
                }
            }

            // Si la balle dépasse la DROITE
            if (this.ball.x + this.ball.radius >= canvas.width && this.ball.vx > 0) {
                this.ball.x = canvas.width - this.ball.radius - 15;
                this.ball.vx = -Math.abs(this.ball.vx);
                this.ball.penalize();
                playBeep(180, 0.2); 
                stopDangerAlarm(); 

                // Qui est à droite ?
                if (playerSide === 'right') {
                    // C'est le JOUEUR qui prend le but
                    if (this.wallDangerIA) {
                        this.wallDangerIA = false;
                    } else if (this.wallDangerJoueur) {
                        console.log("%c💀 GAME OVER !", "color: #ff0000; font-weight: bold;");
                        this.stateManager.states['end'].setResult('gameover');
                        this.stateManager.changeState('end');
                    } else {
                        this.wallDangerJoueur = true;
                    }
                } else {
                    // C'est l'IA qui prend le but
                    if (this.wallDangerJoueur) {
                        this.wallDangerJoueur = false;
                    } else if (this.wallDangerIA) {
                        console.log("%c🏆 VICTOIRE DU JOUEUR !", "color: #00ff00; font-weight: bold;");
                        this.stateManager.states['end'].setResult('victory');
                        this.stateManager.changeState('end');
                    } else {
                        this.wallDangerIA = true;
                    }
                }
            }
        }

        // --- GESTION AUDIO DE L'ALARME DE DANGER DYNAMIQUE (AAA) ---
        if ((playerSide === 'left' && this.wallDangerJoueur) || (playerSide === 'right' && this.wallDangerIA)) {
            startDangerAlarm('joueur'); // Le joueur est au bord de l'élimination !
        } else if ((playerSide === 'left' && this.wallDangerIA) || (playerSide === 'right' && this.wallDangerJoueur)) {
            startDangerAlarm('ia');     // L'IA est sous pression
        } else {
            stopDangerAlarm();
        }
    }

    draw(ctx, canvas) {
        // 1. Dessin de l'arrière-plan du terrain
        if (this.board) this.board.render(ctx, this.stateManager);

        // EXTRACTION DU CÔTÉ JOUEUR POUR LA COHÉRENCE VISUELLE AAA
        const playerSide = this.stateManager.playerSide || 'left';

        // 2. Affichage néon rouge des murs de danger adaptatifs
        ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff0000";

        // Si le joueur est à gauche : son mur est à gauche, celui de l'IA est à droite
        if (playerSide === 'left') {
            if (this.wallDangerJoueur) ctx.fillRect(0, 0, 15, canvas.height); // Ton alerte à gauche
            if (this.wallDangerIA) ctx.fillRect(canvas.width - 15, 0, 15, canvas.height); // Alerte IA à droite
        } 
        // Si le joueur est à droite : son mur passe à droite, celui de l'IA passe à gauche !
        else {
            if (this.wallDangerJoueur) ctx.fillRect(canvas.width - 15, 0, 15, canvas.height); // Ton alerte à droite
            if (this.wallDangerIA) ctx.fillRect(0, 0, 15, canvas.height); // Alerte IA à gauche
        }

        ctx.shadowBlur = 0; 

        // 3. Dessin des entités (Raquettes et balle)
        if (this.paddleLeftOrTop) this.paddleLeftOrTop.render(ctx, this.stateManager);
        if (this.paddleRightOrBottom) this.paddleRightOrBottom.render(ctx, this.stateManager);
        if (this.ball) this.ball.render(ctx, this.stateManager);

        // 4. Dessin de l'animation de démarrage cyberpunk
        if (this.countdownAnimation && !this.countdownAnimation.isFinished) {
            this.countdownAnimation.draw(ctx);
        }
    }


    checkCollision(ball, paddle) {
        return ball.x + ball.radius > paddle.x &&
               ball.x - ball.radius < paddle.x + paddle.width &&
               ball.y + ball.radius > paddle.y &&
               ball.y - ball.radius < paddle.y + paddle.height;
    }

    exit() {
        console.log("Fin du match : destruction des alarmes");
        this.wallDangerJoueur = false;
        this.wallDangerIA = false;
        stopDangerAlarm();
        stopAmbientMusic();
    }

    // ========================================================
    // SCRIPT IA CENTRALISÉ ET UNIVERSEL (POUR N'IMPORTE QUELLE RAQUETTE)
    // ========================================================
    updateAI(paddle, deltaTime, canvas) {
        if (!this.aiReactionTimer) this.aiReactionTimer = 0;
        this.aiReactionTimer += deltaTime;

        if (this.aiReactionTimer >= this.aiReactionInterval) {
            this.aiReactionTimer = 0; 

            // Détection du côté opposé pour la malice hardcore
            const opponentPaddle = (paddle.type === 'right') ? this.paddleLeftOrTop : this.paddleRightOrBottom;

            if (this.aiMalice && opponentPaddle) {
                // Logique agressive selon la direction de la balle
                const ballMovingTowardsAI = (paddle.type === 'right' && this.ball.vx > 0) || (paddle.type === 'left' && this.ball.vx < 0);
                
                if (ballMovingTowardsAI) {
                    const opponentCenter = opponentPaddle.y + opponentPaddle.height / 2;
                    const aiHeight = paddle.height;
                    const targetOffset = aiHeight * 0.42; 

                    if (opponentCenter < canvas.height / 2) {
                        this.aiTargetPos = this.ball.y - targetOffset;
                    } else {
                        this.aiTargetPos = this.ball.y + targetOffset;
                    }
                } else {
                    this.aiTargetPos = this.ball.y;
                }
            } else {
                const error = (Math.random() - 0.5) * 2 * this.aiErrorMargin;
                this.aiTargetPos = this.ball.y + error; 
            }
        }

        if (this.aiTargetPos === undefined) {
            this.aiTargetPos = this.ball.y;
        }

        let paddleCenter = paddle.y + paddle.height / 2;

        if (this.aiTargetPos < paddleCenter - 5) {
            paddle.y -= this.aiSpeed * deltaTime;
        } else if (this.aiTargetPos > paddleCenter + 5) {
            paddle.y += this.aiSpeed * deltaTime;
        }

        // Sécurité des bords d'arène pour la raquette IA
        if (paddle.y < 0) paddle.y = 0;
        if (paddle.y + paddle.height > canvas.height) {
            paddle.y = canvas.height - paddle.height;
        }
    }
}
