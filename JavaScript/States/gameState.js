// JavaScript/States/gameState.js

import { Board } from '../Entities/board.js';
import { Paddle } from '../Entities/paddle.js';
import { Ball } from '../Entities/ball.js';

export class GameState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;
        this.board = null;
        this.paddleLeftOrTop = null;
        this.paddleRightOrBottom = null;

        // --- NOUVEAU SYSTÈME DESIGN : MURS DE DANGER TRON ---
        this.wallDangerJoueur = false; // Si vrai, le mur du joueur reste rouge (Alerte Game Over)
        this.wallDangerIA = false;     // Si vrai, le mur de l'IA reste rouge
        
        // Le compte à rebours de départ
        this.countdown = 3;
    }

    enter() {
        console.log("Le match commence !");
        const canvas = this.stateManager.canvas;
    
        this.wallDangerJoueur = false;
        this.wallDangerIA = false;
        this.countdown = 3;
        this.board = new Board(canvas);
        this.ball = new Ball(canvas.width, canvas.height);

        if (this.board.isVertical()) {
            const pWidth = canvas.width * 0.2;
            const pHeight = 15;
            
            this.paddleLeftOrTop = new Paddle(
                'top', 
                canvas.width / 2 - pWidth / 2,
                20, 
                pWidth, pHeight, "#00ff66"
            );
            this.paddleRightOrBottom = new Paddle(
                'bottom', 
                canvas.width / 2 - pWidth / 2,
                canvas.height - 20 - pHeight,
                pWidth, pHeight, "#ff0077"
            );
        } else {
            const pWidth = 15;
            const pHeight = canvas.height * 0.2;
            
            this.paddleLeftOrTop = new Paddle(
                'left', 
                20, 
                canvas.height / 2 - pHeight / 2,
                pWidth, pHeight, "#00ff66"
            );
            this.paddleRightOrBottom = new Paddle(
                'right', 
                canvas.width - 20 - pWidth, 
                canvas.height / 2 - pHeight / 2,
                pWidth, pHeight, "#ff0077"
            );
        }
    }

update(deltaTime) {
        const canvas = this.stateManager.canvas;

        // 1. Mise à jour de ton contrôleur de Raquette (Joueur 1)
        if (this.paddleLeftOrTop) {
            this.paddleLeftOrTop.update(deltaTime, this.input, canvas.width, canvas.height);
        }

        // 2. LE PILOTAGE AUTOMATIQUE DE L'IA (RAQUETTE ADVERSE)
        if (this.paddleRightOrBottom && this.ball) {
            const isVertical = this.board.isVertical();
            const iaSpeed = this.paddleRightOrBottom.speed * 0.75;

            if (isVertical) {
                let paddleCenter = this.paddleRightOrBottom.x + this.paddleRightOrBottom.width / 2;
                if (this.ball.x < paddleCenter - 10) {
                    this.paddleRightOrBottom.x -= iaSpeed * deltaTime;
                } else if (this.ball.x > paddleCenter + 10) {
                    this.paddleRightOrBottom.x += iaSpeed * deltaTime;
                }
                if (this.paddleRightOrBottom.x < 0) this.paddleRightOrBottom.x = 0;
                if (this.paddleRightOrBottom.x + this.paddleRightOrBottom.width > canvas.width) {
                    this.paddleRightOrBottom.x = canvas.width - this.paddleRightOrBottom.width;
                }
            } else {
                let paddleCenter = this.paddleRightOrBottom.y + this.paddleRightOrBottom.height / 2;
                if (this.ball.y < paddleCenter - 10) {
                    this.paddleRightOrBottom.y -= iaSpeed * deltaTime;
                } else if (this.ball.y > paddleCenter + 10) {
                    this.paddleRightOrBottom.y += iaSpeed * deltaTime;
                }
                if (this.paddleRightOrBottom.y < 0) this.paddleRightOrBottom.y = 0;
                if (this.paddleRightOrBottom.y + this.paddleRightOrBottom.height > canvas.height) {
                    this.paddleRightOrBottom.y = canvas.height - this.paddleRightOrBottom.height;
                }
            }
        }

        // 3. Mise à jour de la balle, des rebonds et des BUTS DYNAMIQUES TRON
        if (this.countdown > 0) {
            this.countdown -= deltaTime;
        } else if (this.ball && this.board) {
            this.ball.update(deltaTime, this.board.isVertical());
            const isVertical = this.board.isVertical();

            // Collision raquette 1 (Gauche / Haut)
            if (this.checkCollision(this.ball, this.paddleLeftOrTop)) {
                const currentBallSpeed = this.ball.currentSpeed;
                if (isVertical) {
                    let relativeIntersectX = (this.paddleLeftOrTop.x + this.paddleLeftOrTop.width / 2) - this.ball.x;
                    let normalizedIntersectX = relativeIntersectX / (this.paddleLeftOrTop.width / 2);
                    this.ball.vx = -normalizedIntersectX * currentBallSpeed;
                    this.ball.vy = currentBallSpeed * 0.8;
                    this.ball.y = this.paddleLeftOrTop.y + this.paddleLeftOrTop.height + this.ball.radius;
                } else {
                    let relativeIntersectY = (this.paddleLeftOrTop.y + this.paddleLeftOrTop.height / 2) - this.ball.y;
                    let normalizedIntersectY = relativeIntersectY / (this.paddleLeftOrTop.height / 2);
                    this.ball.vx = currentBallSpeed;
                    this.ball.vy = -normalizedIntersectY * currentBallSpeed;
                    this.ball.x = this.paddleLeftOrTop.x + this.paddleLeftOrTop.width + this.ball.radius;
                }
                this.ball.accelerate();
            }

            // Collision raquette 2 (Droite / Bas)
            if (this.checkCollision(this.ball, this.paddleRightOrBottom)) {
                const currentBallSpeed = this.ball.currentSpeed;
                if (isVertical) {
                    let relativeIntersectX = (this.paddleRightOrBottom.x + this.paddleRightOrBottom.width / 2) - this.ball.x;
                    let normalizedIntersectX = relativeIntersectX / (this.paddleRightOrBottom.width / 2);
                    this.ball.vx = -normalizedIntersectX * currentBallSpeed;
                    this.ball.vy = -currentBallSpeed * 0.8;
                    this.ball.y = this.paddleRightOrBottom.y - this.ball.radius;
                } else {
                    let relativeIntersectY = (this.paddleRightOrBottom.y + this.paddleRightOrBottom.height / 2) - this.ball.y;
                    let normalizedIntersectY = relativeIntersectY / (this.paddleRightOrBottom.height / 2);
                    this.ball.vx = -currentBallSpeed;
                    this.ball.vy = -normalizedIntersectY * currentBallSpeed;
                    this.ball.x = this.paddleRightOrBottom.x - this.ball.radius;
                }
                this.ball.accelerate();
            }

            // --- JAUGE D'AVANTAGE TRON : DÉTECTION DES SCORES SUR LES MURS ---
            if (isVertical) {
                // Si la balle dépasse le HAUT (l'IA encaisse)
                if (this.ball.y - this.ball.radius <= 0 && this.ball.vy < 0) {
                    this.ball.y = this.ball.radius + 15;
                    this.ball.vy = Math.abs(this.ball.vy);
                    this.ball.penalize();

                    if (this.wallDangerJoueur) {
                        this.wallDangerJoueur = false; // Le joueur efface son alerte !
                    } else if (this.wallDangerIA) {
                        console.log("%c🏆 VICTOIRE DU JOUEUR !", "color: #00ff00; font-weight: bold;");
                        this.stateManager.states['end'].setResult('victory');
                        this.stateManager.changeState('end');
                    } else {
                        this.wallDangerIA = true; // Premier avertissement pour l'IA
                    }
                }
                // Si la balle dépasse le BAS (Le joueur encaisse)
                if (this.ball.y + this.ball.radius >= canvas.height && this.ball.vy > 0) {
                    this.ball.y = canvas.height - this.ball.radius - 15;
                    this.ball.vy = -Math.abs(this.ball.vy);
                    this.ball.penalize();

                    if (this.wallDangerIA) {
                        this.wallDangerIA = false; // L'IA efface son alerte !
                    } else if (this.wallDangerJoueur) {
                        console.log("%c💀 GAME OVER !", "color: #ff0000; font-weight: bold;");
                        this.stateManager.states['end'].setResult('gameover');
                        this.stateManager.changeState('end');
                    } else {
                        this.wallDangerJoueur = true; // Premier avertissement pour le joueur
                    }
                }
            } else {
                // Mode PC : Si la balle dépasse la GAUCHE (Le joueur encaisse)
                if (this.ball.x - this.ball.radius <= 0 && this.ball.vx < 0) {
                    this.ball.x = this.ball.radius + 15;
                    this.ball.vx = Math.abs(this.ball.vx);
                    this.ball.penalize();

                    if (this.wallDangerIA) {
                        this.wallDangerIA = false;
                    } else if (this.wallDangerJoueur) {
                        console.log("%c💀 GAME OVER !", "color: #ff0000; font-weight: bold;");
                        this.stateManager.states['end'].setResult('gameover');
                        this.stateManager.changeState('end');
                    } else {
                        this.wallDangerJoueur = true;
                    }
                }
                // Si la balle dépasse la DROITE (l'IA encaisse)
                if (this.ball.x + this.ball.radius >= canvas.width && this.ball.vx > 0) {
                    this.ball.x = canvas.width - this.ball.radius - 15;
                    this.ball.vx = -Math.abs(this.ball.vx);
                    this.ball.penalize();

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
    }

    render(ctx) {
        const isVertical = this.board ? this.board.isVertical() : false;

        // 1. Dessin du terrain
        if (this.board) this.board.render(ctx);

        // --- AFFICHAGE DES MURS DE DANGER NÉON FIXES EN ROUGE ---
        ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff0000";

        if (isVertical) {
            // Mode Mobile
            if (this.wallDangerIA) ctx.fillRect(0, 0, ctx.canvas.width, 15); // Haut en rouge
            if (this.wallDangerJoueur) ctx.fillRect(0, ctx.canvas.height - 15, ctx.canvas.width, 15); // Bas en rouge
        } else {
            // Mode PC
            if (this.wallDangerJoueur) ctx.fillRect(0, 0, 15, ctx.canvas.height); // Gauche en rouge
            if (this.wallDangerIA) ctx.fillRect(ctx.canvas.width - 15, 0, 15, ctx.canvas.height); // Droite en rouge
        }
        ctx.shadowBlur = 0; // Reset ombres

        // 2. Dessin des entités
        if (this.paddleLeftOrTop) this.paddleLeftOrTop.render(ctx);
        if (this.paddleRightOrBottom) this.paddleRightOrBottom.render(ctx);
        if (this.ball) this.ball.render(ctx);

        // 3. Dessin du compte à rebours
        if (this.countdown > 0) {
            ctx.fillStyle = "#ff6600";
            ctx.font = "bold 60px 'Courier New'";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#ff6600";
            ctx.fillText(Math.ceil(this.countdown), ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.shadowBlur = 0;
        }
    }

    checkCollision(ball, paddle) {
        return ball.x + ball.radius > paddle.x &&
               ball.x - ball.radius < paddle.x + paddle.width &&
               ball.y + ball.radius > paddle.y &&
               ball.y - ball.radius < paddle.y + paddle.height;
    }

    exit() {
        console.log("Fin du match");
    }
}