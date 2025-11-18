// POKIMON: Cyber Myths - Controlador Principal del Juego

class Game {
    constructor() {
        this.currentScreen = 'title';
        this.player = null;
        this.world = null;
        this.engine = null;
        this.battle = null;
        this.isPaused = false;
        this.keys = {};

        this.init();
    }

    init() {
        console.log('🎮 Iniciando POKIMON: Cyber Myths...');

        // Inicializar motor gráfico
        this.engine = new GameEngine();

        // Configurar controles
        this.setupControls();

        // Mostrar pantalla de título
        this.switchScreen('title');

        console.log('✅ Juego inicializado correctamente!');
    }

    setupControls() {
        // Teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.handleKeyPress(e.key.toLowerCase(), e);
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Prevenir scroll con flechas
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
    }

    handleKeyPress(key, event) {
        if (this.currentScreen === 'game' && !this.isPaused) {
            // Movimiento
            if (key === 'arrowup' || key === 'w') this.movePlayer(0, -1);
            if (key === 'arrowdown' || key === 's') this.movePlayer(0, 1);
            if (key === 'arrowleft' || key === 'a') this.movePlayer(-1, 0);
            if (key === 'arrowright' || key === 'd') this.movePlayer(1, 0);

            // Interacción
            if (key === ' ') this.interact();

            // Menús
            if (key === 'm') this.openMenu();
            if (key === 'p') this.openPokedex();
            if (key === 's') this.saveGame();
        }

        // ESC para cerrar menús/modales
        if (key === 'escape') {
            if (this.currentScreen === 'menu') {
                this.closeMenu();
            } else {
                UI.closeModal();
            }
        }
    }

    newGame() {
        console.log('🎬 Iniciando nueva partida...');

        // Crear jugador
        this.player = new Player();
        this.player.name = prompt('¿Cuál es tu nombre?', 'Entrenador') || 'Entrenador';

        // Crear mundo
        this.world = new World();

        // Mostrar diálogo de introducción
        this.showIntroduction();
    }

    showIntroduction() {
        const intro = `
            <div style="padding: 2rem; text-align: center;">
                <h2>Bienvenido a POKIMON: Cyber Myths</h2>
                <p style="margin: 1.5rem 0; line-height: 1.6;">
                    Bienvenido, <strong>${this.player.name}</strong>, al mundo de <strong>Cyber Myths</strong>.<br><br>

                    En este mundo, las criaturas mitológicas han fusionado con la tecnología digital,
                    creando seres poderosos conocidos como <strong>POKIMON</strong>.<br><br>

                    Tu misión es convertirte en el mejor entrenador explorando diferentes zonas,
                    capturando criaturas únicas, y dominando el arte del combate estratégico.<br><br>

                    ¿Estás listo para tu aventura?
                </p>
                <button class="menu-btn" onclick="game.chooseStarter()">¡Comencemos!</button>
            </div>
        `;

        UI.showModal('POKIMON: Cyber Myths', intro);
    }

    chooseStarter() {
        const starters = [
            { key: 'SPARKYTE', desc: 'El veloz dragón eléctrico' },
            { key: 'PHOENIXBIT', desc: 'El místico ave fénix' },
            { key: 'NANOSHELL', desc: 'La resistente tortuga nano' }
        ];

        let content = `
            <div style="padding: 2rem;">
                <h3>Elige tu Pokimon Inicial</h3>
                <p style="margin: 1rem 0;">Esta decisión definirá el comienzo de tu aventura...</p>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem;">
        `;

        starters.forEach(starter => {
            const data = POKIMON_DATA[starter.key];
            content += `
                <div style="padding: 1.5rem; background: rgba(0,255,255,0.1); border: 2px solid var(--primary);
                            border-radius: 15px; cursor: pointer; transition: all 0.3s;"
                     onclick="game.selectStarter('${starter.key}')"
                     onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 30px rgba(0,255,255,0.5)';"
                     onmouseout="this.style.transform=''; this.style.boxShadow='';">
                    <div style="font-size: 4rem; text-align: center;">${data.emoji}</div>
                    <h4 style="text-align: center; color: var(--primary); margin: 0.5rem 0;">${data.name}</h4>
                    <p style="text-align: center; font-size: 0.9rem; opacity: 0.8;">${starter.desc}</p>
                    <p style="text-align: center; margin-top: 0.5rem; color: ${TYPES[data.type].color};">
                        Tipo: ${TYPES[data.type].name}
                    </p>
                </div>
            `;
        });

        content += `
                </div>
            </div>
        `;

        UI.showModal('Elige tu Compañero', content);
    }

    selectStarter(starterKey) {
        const starter = new Pokimon(starterKey, 5);
        this.player.addPokimon(starter);

        UI.showNotification(`¡Elegiste a ${starter.name}!`, 'success');
        UI.closeModal();

        // Añadir misiones iniciales
        this.player.quests = [...QUESTS_DATA];

        // Iniciar juego
        setTimeout(() => {
            this.startGame();
        }, 500);
    }

    startGame() {
        this.switchScreen('game');
        UI.showNotification('¡Tu aventura comienza ahora!', 'info');

        // Iniciar bucle del juego
        this.gameLoop();
    }

    loadGame() {
        const saveData = localStorage.getItem('pokimon_save');

        if (!saveData) {
            UI.showNotification('No hay partida guardada.', 'warning');
            return;
        }

        try {
            const data = JSON.parse(saveData);

            // Restaurar jugador
            this.player = new Player();
            Object.assign(this.player, data.player);

            // Restaurar Pokimon del equipo
            this.player.team = data.player.team.map(p => {
                const pokimon = new Pokimon(p.species, p.level);
                Object.assign(pokimon, p);
                return pokimon;
            });

            // Restaurar inventario
            this.player.inventory = new Inventory();
            this.player.inventory.items = data.player.inventory;

            // Restaurar pokedex
            this.player.pokedex = new Set(data.player.pokedex);

            // Restaurar quests
            this.player.quests = data.player.quests;

            // Crear mundo
            this.world = new World();
            this.world.currentZone = data.world.currentZone;
            this.world.weather = data.world.weather;
            this.world.timeOfDay = data.world.timeOfDay;
            this.world.time = data.world.time;

            UI.showNotification('Partida cargada correctamente.', 'success');
            this.startGame();
        } catch (error) {
            console.error('Error al cargar partida:', error);
            UI.showNotification('Error al cargar la partida.', 'error');
        }
    }

    saveGame() {
        if (!this.player || !this.world) {
            UI.showNotification('No hay partida para guardar.', 'warning');
            return;
        }

        try {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                player: {
                    name: this.player.name,
                    x: this.player.x,
                    y: this.player.y,
                    money: this.player.money,
                    team: this.player.team,
                    box: this.player.box,
                    inventory: this.player.inventory.items,
                    pokedex: Array.from(this.player.pokedex),
                    badges: this.player.badges,
                    quests: this.player.quests,
                    stats: this.player.stats
                },
                world: {
                    currentZone: this.world.currentZone,
                    weather: this.world.weather,
                    timeOfDay: this.world.timeOfDay,
                    time: this.world.time
                }
            };

            localStorage.setItem('pokimon_save', JSON.stringify(saveData));
            UI.showNotification('¡Partida guardada!', 'success');
        } catch (error) {
            console.error('Error al guardar:', error);
            UI.showNotification('Error al guardar la partida.', 'error');
        }
    }

    movePlayer(dx, dy) {
        if (this.player.move(dx, dy, this.world)) {
            // Crear efecto de partículas al caminar
            if (Math.random() < 0.3) {
                this.engine.createTrail(
                    this.player.x * TILE_SIZE,
                    this.player.y * TILE_SIZE
                );
            }

            // Verificar encuentros
            if (this.world.hasEncounter(this.player.x, this.player.y)) {
                this.triggerWildEncounter();
            }

            // Actualizar tiempo
            this.world.updateTime(0.1);

            // Actualizar HUD
            UI.updateHUD(this.player, this.world);
        }
    }

    interact() {
        // Verificar tile en la dirección del jugador
        const directions = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        };

        const dir = directions[this.player.direction];
        const targetX = this.player.x + dir.x;
        const targetY = this.player.y + dir.y;

        const interaction = this.world.interact(targetX, targetY);

        if (interaction === 'pokecenter') {
            this.visitPokecenter();
        } else if (interaction === 'shop') {
            UI.showShop();
        } else if (interaction === 'portal') {
            this.usePortal();
        }
    }

    visitPokecenter() {
        UI.showModal('Centro Pokimon', `
            <div style="padding: 2rem; text-align: center;">
                <h3>🏥 Bienvenido al Centro Pokimon</h3>
                <p style="margin: 1.5rem 0;">¿Quieres que curemos a tus Pokimon?</p>
                <button class="menu-btn" onclick="game.healAtCenter()">Sí, por favor</button>
                <button class="menu-btn" onclick="UI.closeModal()">No, gracias</button>
            </div>
        `);
    }

    healAtCenter() {
        this.player.healTeam();
        UI.showNotification('¡Tu equipo ha sido curado completamente!', 'success');
        UI.closeModal();

        // Efectos visuales
        this.engine.createExplosion(
            this.player.x * TILE_SIZE,
            this.player.y * TILE_SIZE,
            '#00ff88'
        );
    }

    usePortal() {
        const zones = Object.keys(ZONES);
        const currentIndex = zones.indexOf(this.world.currentZone);
        const nextZone = zones[(currentIndex + 1) % zones.length];

        UI.showModal('Portal Dimensional', `
            <div style="padding: 2rem; text-align: center;">
                <h3>🌀 Portal Dimensional</h3>
                <p style="margin: 1.5rem 0;">
                    Este portal te llevará a: <strong>${ZONES[nextZone].name}</strong><br>
                    <small>${ZONES[nextZone].description}</small>
                </p>
                <button class="menu-btn" onclick="game.travelToZone('${nextZone}')">Viajar</button>
                <button class="menu-btn" onclick="UI.closeModal()">Cancelar</button>
            </div>
        `);
    }

    travelToZone(zoneName) {
        this.world.changeZone(zoneName);
        this.player.x = 5;
        this.player.y = 7;

        UI.closeModal();
        UI.showNotification(`Llegaste a ${ZONES[zoneName].name}!`, 'info');

        // Actualizar misiones
        this.updateQuests('visit_zone');

        // Efectos visuales
        this.engine.createExplosion(
            this.player.x * TILE_SIZE,
            this.player.y * TILE_SIZE,
            '#8800ff'
        );
    }

    triggerWildEncounter() {
        const wildPokimon = this.world.getWildPokimon();

        if (!wildPokimon) return;

        // Verificar que el jugador tenga Pokimon activos
        if (!this.player.hasAlivePokimon()) {
            UI.showNotification('No tienes Pokimon para combatir.', 'warning');
            return;
        }

        const playerPokimon = this.player.getActivePokimon();

        // Iniciar batalla
        this.battle = new Battle(playerPokimon, wildPokimon, true);
        this.switchScreen('battle');
        this.battle.start();
    }

    updateQuests(type, value) {
        this.player.quests.forEach(quest => {
            quest.updateProgress(type, value);
            if (quest.isComplete() && !quest.notified) {
                UI.showNotification(`¡Misión completada: ${quest.title}!`, 'success');
                quest.notified = true;
            }
        });
    }

    switchScreen(screenName) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar la pantalla seleccionada
        const screen = document.getElementById(`${screenName}-screen`);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenName;
        }

        // Actualizar HUD si es necesario
        if (screenName === 'game' && this.player && this.world) {
            UI.updateHUD(this.player, this.world);
        }
    }

    openMenu() {
        this.switchScreen('menu');
    }

    closeMenu() {
        this.switchScreen('game');
    }

    openPokedex() {
        UI.showPokedex();
    }

    showTeamManagement() {
        UI.updateTeamPreview(this.player);
        UI.closeModal();

        // Mostrar todos los Pokimon del equipo en detalle
        let content = '<div style="padding: 1rem;"><h3>GESTIÓN DE EQUIPO</h3>';
        content += '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';

        this.player.team.forEach((pokimon, index) => {
            const hpPercent = Math.floor((pokimon.currentHP / pokimon.stats.hp) * 100);
            content += `
                <button class="menu-btn" onclick="UI.showPokimonDetails(game.player.team[${index}], ${index})"
                        style="text-align: left; padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="font-size: 2rem;">${pokimon.emoji}</div>
                        <div style="flex: 1;">
                            <div><strong>${pokimon.name}</strong> Nv.${pokimon.level}</div>
                            <div style="font-size: 0.9rem; opacity: 0.8;">
                                HP: ${pokimon.currentHP}/${pokimon.stats.hp} (${hpPercent}%)
                                ${pokimon.isFainted ? '💀 Debilitado' : ''}
                            </div>
                        </div>
                    </div>
                </button>
            `;
        });

        content += '</div></div>';
        UI.showModal('EQUIPO', content);
    }

    showInventory() {
        UI.showInventory();
    }

    showCrafting() {
        UI.showCrafting();
    }

    showFusion() {
        UI.showFusion();
    }

    showQuests() {
        UI.showQuests();
    }

    showSettings() {
        const content = `
            <div style="padding: 2rem;">
                <h3>CONFIGURACIÓN</h3>
                <div style="margin: 2rem 0;">
                    <h4 style="color: var(--primary);">Información del Juego</h4>
                    <p>POKIMON: Cyber Myths v1.0.0</p>
                    <p>Creado con ❤️ usando JavaScript puro</p>
                    <p style="margin-top: 1rem;">Características:</p>
                    <ul style="margin-left: 2rem; line-height: 1.8;">
                        <li>30+ Pokimon únicos</li>
                        <li>Sistema de combate dinámico</li>
                        <li>Clima y ciclo día/noche</li>
                        <li>Sistema de crafteo</li>
                        <li>Misiones y evoluciones</li>
                        <li>Múltiples zonas explorables</li>
                    </ul>
                </div>
                <button class="menu-btn" onclick="UI.closeModal()">Cerrar</button>
            </div>
        `;

        UI.showModal('CONFIGURACIÓN', content);
    }

    showControls() {
        UI.showControls();
    }

    showModal(content) {
        UI.showModal('Información', content);
    }

    closeModal() {
        UI.closeModal();
    }

    showNotification(message, type) {
        UI.showNotification(message, type);
    }

    gameLoop(timestamp = 0) {
        // Actualizar motor
        this.engine.update(timestamp);

        // Renderizar
        if (this.currentScreen === 'game') {
            this.engine.render();
        }

        // Continuar bucle
        requestAnimationFrame((t) => this.gameLoop(t));
    }
}

// Iniciar juego cuando se carga la página
let game;

window.addEventListener('load', () => {
    game = new Game();
});

// Exponer battle globalmente para los botones
let battle;
