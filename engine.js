// Motor Gráfico y Renderizado

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;
        this.deltaTime = 0;

        this.cameraX = 0;
        this.cameraY = 0;

        this.particles = [];

        this.setupCanvas();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    update(currentTime) {
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Actualizar cámara para seguir al jugador
        this.updateCamera();

        // Actualizar partículas
        this.updateParticles();
    }

    updateCamera() {
        if (!game.player) return;

        const targetX = game.player.x * TILE_SIZE - this.canvas.width / 2;
        const targetY = game.player.y * TILE_SIZE - this.canvas.height / 2;

        // Suavizado de cámara
        this.cameraX += (targetX - this.cameraX) * 0.1;
        this.cameraY += (targetY - this.cameraY) * 0.1;
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.life -= this.deltaTime;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            } else {
                particle.x += particle.vx * this.deltaTime;
                particle.y += particle.vy * this.deltaTime;
                particle.alpha = particle.life / particle.maxLife;
            }
        }
    }

    render() {
        this.clear();

        if (!game.world || !game.player) return;

        // Calcular tiles visibles
        const startX = Math.floor(this.cameraX / TILE_SIZE);
        const startY = Math.floor(this.cameraY / TILE_SIZE);
        const endX = startX + Math.ceil(this.canvas.width / TILE_SIZE) + 1;
        const endY = startY + Math.ceil(this.canvas.height / TILE_SIZE) + 1;

        // Renderizar tiles
        for (let y = Math.max(0, startY); y < Math.min(game.world.mapHeight, endY); y++) {
            for (let x = Math.max(0, startX); x < Math.min(game.world.mapWidth, endX); x++) {
                this.renderTile(x, y);
            }
        }

        // Renderizar jugador
        this.renderPlayer();

        // Renderizar partículas
        this.renderParticles();

        // Renderizar efectos de clima
        this.renderWeatherEffects();

        // Renderizar información de zona
        this.renderZoneInfo();
    }

    clear() {
        this.ctx.fillStyle = '#0f1419';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderTile(x, y) {
        const tile = game.world.getTile(x, y);
        if (!tile) return;

        const tileType = TILE_TYPES[tile];
        const screenX = x * TILE_SIZE - this.cameraX;
        const screenY = y * TILE_SIZE - this.cameraY;

        // Fondo del tile
        if (tileType.walkable) {
            this.ctx.fillStyle = '#2a3f2a';
        } else {
            this.ctx.fillStyle = '#1a2a3a';
        }
        this.ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        // Borde del tile
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        // Emoji del tile
        this.ctx.font = `${TILE_SIZE * 0.8}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Sombra para el emoji
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(tileType.emoji, screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2);
        this.ctx.shadowBlur = 0;
    }

    renderPlayer() {
        const screenX = game.player.x * TILE_SIZE - this.cameraX;
        const screenY = game.player.y * TILE_SIZE - this.cameraY;

        // Sombra del jugador
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(
            screenX + TILE_SIZE / 2,
            screenY + TILE_SIZE - 5,
            TILE_SIZE / 3,
            TILE_SIZE / 6,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Jugador
        this.ctx.font = `${TILE_SIZE}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Efecto de brillo
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText(game.player.emoji, screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2);
        this.ctx.shadowBlur = 0;

        // Indicador de dirección
        this.renderDirectionIndicator(screenX, screenY);
    }

    renderDirectionIndicator(x, y) {
        const directions = {
            up: { x: TILE_SIZE / 2, y: 5 },
            down: { x: TILE_SIZE / 2, y: TILE_SIZE - 5 },
            left: { x: 5, y: TILE_SIZE / 2 },
            right: { x: TILE_SIZE - 5, y: TILE_SIZE / 2 }
        };

        const dir = directions[game.player.direction];
        if (!dir) return;

        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(x + dir.x, y + dir.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;

            const screenX = particle.x - this.cameraX;
            const screenY = particle.y - this.cameraY;

            if (particle.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (particle.type === 'text') {
                this.ctx.font = `${particle.size}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(particle.text, screenX, screenY);
            }

            this.ctx.restore();
        });
    }

    renderWeatherEffects() {
        if (game.world.weather === 'rainy') {
            this.renderRain();
        } else if (game.world.weather === 'stormy') {
            this.renderStorm();
        }
    }

    renderRain() {
        this.ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = (Math.random() * this.canvas.height + this.lastTime * 0.5) % this.canvas.height;

            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - 2, y + 10);
            this.ctx.stroke();
        }
    }

    renderStorm() {
        this.renderRain();

        // Relámpagos ocasionales
        if (Math.random() < 0.01) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Crear partículas de relámpago
            for (let i = 0; i < 5; i++) {
                this.createParticle(
                    Math.random() * this.canvas.width + this.cameraX,
                    Math.random() * this.canvas.height + this.cameraY,
                    'circle',
                    '#ffff00',
                    5,
                    0,
                    0,
                    0.2
                );
            }
        }
    }

    renderZoneInfo() {
        const zone = game.world.getZoneInfo();

        this.ctx.save();
        this.ctx.font = '24px Orbitron, sans-serif';
        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 10;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(zone.name, this.canvas.width / 2, 40);
        this.ctx.restore();

        // Coordenadas del jugador (debug)
        this.ctx.font = '14px monospace';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`X: ${game.player.x} Y: ${game.player.y}`, 10, this.canvas.height - 10);
    }

    createParticle(x, y, type = 'circle', color = '#00ffff', size = 3, vx = 0, vy = -50, life = 1.0) {
        this.particles.push({
            x, y, type, color, size, vx, vy,
            life,
            maxLife: life,
            alpha: 1.0,
            text: ''
        });
    }

    createTextParticle(x, y, text, color = '#00ffff', size = 20, vy = -30, life = 2.0) {
        this.particles.push({
            x, y,
            type: 'text',
            text,
            color,
            size,
            vx: 0,
            vy,
            life,
            maxLife: life,
            alpha: 1.0
        });
    }

    createExplosion(x, y, color = '#ff0055') {
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = 50 + Math.random() * 50;
            this.createParticle(
                x,
                y,
                'circle',
                color,
                3 + Math.random() * 3,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                0.5 + Math.random() * 0.5
            );
        }
    }

    createTrail(x, y) {
        this.createParticle(
            x + (Math.random() - 0.5) * TILE_SIZE,
            y + (Math.random() - 0.5) * TILE_SIZE,
            'circle',
            'rgba(0, 255, 255, 0.5)',
            2,
            0,
            10,
            0.5
        );
    }
}
