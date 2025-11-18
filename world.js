// Sistema de Mundo y Exploración

const TILE_SIZE = 32;

const TILE_TYPES = {
    GRASS: { emoji: '🟩', walkable: true, encounter: true, encounterRate: 4 },
    TALL_GRASS: { emoji: '🌿', walkable: true, encounter: true, encounterRate: 8 },
    WATER: { emoji: '🌊', walkable: false, encounter: true, encounterRate: 6 },
    TREE: { emoji: '🌲', walkable: false, encounter: false },
    ROCK: { emoji: '🪨', walkable: false, encounter: false },
    FLOWER: { emoji: '🌸', walkable: true, encounter: true, encounterRate: 6 },
    PATH: { emoji: '⬜', walkable: true, encounter: false },
    BUILDING: { emoji: '🏢', walkable: false, interact: 'building' },
    POKECENTER: { emoji: '🏥', walkable: false, interact: 'pokecenter' },
    SHOP: { emoji: '🏪', walkable: false, interact: 'shop' },
    CAVE: { emoji: '⛰️', walkable: true, encounter: true, encounterRate: 10 },
    LAVA: { emoji: '🔥', walkable: false, damage: true },
    ICE: { emoji: '🧊', walkable: true, slippery: true },
    PORTAL: { emoji: '🌀', walkable: true, interact: 'portal' },
    CYBER_ZONE: { emoji: '💠', walkable: true, encounter: true, encounterRate: 12 },
    VOID_ZONE: { emoji: '🌌', walkable: true, encounter: true, encounterRate: 15 }
};

// Zonas del juego
const ZONES = {
    STARTER_TOWN: {
        name: 'Neo Ciudad',
        description: 'Tu ciudad natal en el mundo cyber.',
        weatherChance: { sunny: 70, rainy: 20, stormy: 10 },
        wildPokimon: [],
        level: [1, 5]
    },
    ROUTE_1: {
        name: 'Ruta Digital 1',
        description: 'Primera ruta hacia la aventura.',
        weatherChance: { sunny: 60, rainy: 30, stormy: 10 },
        wildPokimon: ['SPARKYTE', 'PHOENIXBIT', 'NANOSHELL', 'NEONBUTTERFLY', 'PLASMASPRITE'],
        level: [2, 6]
    },
    CYBER_FOREST: {
        name: 'Bosque Cibernético',
        description: 'Bosque lleno de criaturas digitales.',
        weatherChance: { sunny: 40, rainy: 40, stormy: 20 },
        wildPokimon: ['NEONBUTTERFLY', 'GLITCHGHOST', 'PLASMASPRITE', 'SPARKYTE', 'CODERAGON'],
        level: [5, 12]
    },
    TECH_VALLEY: {
        name: 'Valle Tecnológico',
        description: 'Valle lleno de maravillas tecnológicas.',
        weatherChance: { sunny: 80, rainy: 15, stormy: 5 },
        wildPokimon: ['NANOSHELL', 'BIOMECH', 'CODERAGON', 'NEURALNET'],
        level: [10, 18]
    },
    MYTH_TEMPLE: {
        name: 'Templo Mítico',
        description: 'Antiguo templo con criaturas legendarias.',
        weatherChance: { sunny: 50, rainy: 30, stormy: 20 },
        wildPokimon: ['PHOENIXBIT', 'PRISMATIC', 'ASTRALIGHT', 'HOLOWYVERN'],
        level: [15, 25]
    },
    VOID_CAVERN: {
        name: 'Caverna del Vacío',
        description: 'Caverna dimensional peligrosa.',
        weatherChance: { sunny: 20, rainy: 30, stormy: 50 },
        wildPokimon: ['CRYSTALWOLF', 'SHADOWBYTE', 'QUANTUMCAT', 'CHRONOBOT'],
        level: [20, 30]
    },
    CHAOS_WASTELAND: {
        name: 'Páramo del Caos',
        description: 'Tierra devastada por el caos digital.',
        weatherChance: { sunny: 10, rainy: 40, stormy: 50 },
        wildPokimon: ['GLITCHGHOST', 'SHADOWBYTE', 'VIRUSKING', 'DARKMATRIX'],
        level: [25, 40]
    },
    CYBER_OCEAN: {
        name: 'Océano Cibernético',
        description: 'Vasto océano de datos.',
        weatherChance: { sunny: 30, rainy: 50, stormy: 20 },
        wildPokimon: ['DATAWHALE', 'NEONBUTTERFLY', 'QUANTUMCAT'],
        level: [18, 28]
    },
    SKY_TOWER: {
        name: 'Torre del Cielo',
        description: 'Torre que alcanza las nubes digitales.',
        weatherChance: { sunny: 20, rainy: 30, stormy: 50 },
        wildPokimon: ['THUNDERBIRD', 'HOLOWYVERN', 'ASTRALIGHT', 'LUMIMOTH'],
        level: [30, 50]
    }
};

// Mapa del mundo (simplificado para demo)
class World {
    constructor() {
        this.currentZone = 'STARTER_TOWN';
        this.weather = 'sunny';
        this.timeOfDay = 'day'; // day, night
        this.time = 0; // minutos del juego

        this.generateMap();
    }

    generateMap() {
        this.mapWidth = 50;
        this.mapHeight = 50;
        this.tiles = [];

        // Generar mapa procedural simple
        for (let y = 0; y < this.mapHeight; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                this.tiles[y][x] = this.generateTile(x, y);
            }
        }

        // Añadir edificios importantes
        this.addBuildings();
    }

    generateTile(x, y) {
        const zone = ZONES[this.currentZone];

        // Centro del pueblo (0-10, 0-10)
        if (x < 10 && y < 10) {
            if (x === 5 && y === 5) return 'POKECENTER';
            if (x === 7 && y === 5) return 'SHOP';
            if ((x + y) % 3 === 0) return 'BUILDING';
            return 'PATH';
        }

        // Bordes del mapa - árboles
        if (x === 0 || y === 0 || x === this.mapWidth - 1 || y === this.mapHeight - 1) {
            return 'ROCK';
        }

        // Zona de agua (esquina superior derecha)
        if (x > this.mapWidth - 15 && y < 15) {
            return 'WATER';
        }

        // Zonas especiales
        if (this.currentZone === 'CYBER_FOREST') {
            const rand = Math.random();
            if (rand < 0.3) return 'TREE';
            if (rand < 0.6) return 'TALL_GRASS';
            if (rand < 0.7) return 'CYBER_ZONE';
            return 'GRASS';
        }

        if (this.currentZone === 'VOID_CAVERN') {
            const rand = Math.random();
            if (rand < 0.4) return 'ROCK';
            if (rand < 0.7) return 'VOID_ZONE';
            return 'CAVE';
        }

        if (this.currentZone === 'CHAOS_WASTELAND') {
            const rand = Math.random();
            if (rand < 0.2) return 'LAVA';
            if (rand < 0.5) return 'ROCK';
            return 'CYBER_ZONE';
        }

        // Terreno general
        const rand = Math.random();
        if (rand < 0.1) return 'TREE';
        if (rand < 0.15) return 'ROCK';
        if (rand < 0.25) return 'FLOWER';
        if (rand < 0.5) return 'TALL_GRASS';
        if (rand < 0.6) return 'PATH';
        return 'GRASS';
    }

    addBuildings() {
        // Añadir portales entre zonas
        this.tiles[15][25] = 'PORTAL'; // Portal a siguiente zona
        this.tiles[20][10] = 'PORTAL';
        this.tiles[30][30] = 'PORTAL';
    }

    getTile(x, y) {
        if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight) {
            return null;
        }
        return this.tiles[y][x];
    }

    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return false;
        return TILE_TYPES[tile].walkable;
    }

    hasEncounter(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return false;

        const tileType = TILE_TYPES[tile];
        if (!tileType.encounter) return false;

        // Zona starter tiene encuentros reducidos
        let zoneModifier = 1.0;
        if (this.currentZone === 'STARTER_TOWN') zoneModifier = 0.3;
        if (this.currentZone === 'ROUTE_1') zoneModifier = 0.7;

        // Modificador por clima
        let weatherModifier = 1.0;
        if (this.weather === 'rainy') weatherModifier = 1.15;
        if (this.weather === 'stormy') weatherModifier = 1.3;

        // Modificador por hora
        let timeModifier = 1.0;
        if (this.timeOfDay === 'night') timeModifier = 1.2;

        const chance = tileType.encounterRate * zoneModifier * weatherModifier * timeModifier;
        return Math.random() * 100 < chance;
    }

    getWildPokimon() {
        const zone = ZONES[this.currentZone];
        if (!zone.wildPokimon || zone.wildPokimon.length === 0) {
            return null;
        }

        // Seleccionar Pokimon aleatorio
        const species = zone.wildPokimon[Math.floor(Math.random() * zone.wildPokimon.length)];

        // Nivel aleatorio dentro del rango de la zona
        const [minLevel, maxLevel] = zone.level;
        const level = minLevel + Math.floor(Math.random() * (maxLevel - minLevel + 1));

        return new Pokimon(species, level);
    }

    updateWeather() {
        const zone = ZONES[this.currentZone];
        const rand = Math.random() * 100;
        let cumulative = 0;

        for (const [weather, chance] of Object.entries(zone.weatherChance)) {
            cumulative += chance;
            if (rand < cumulative) {
                this.weather = weather;
                break;
            }
        }
    }

    updateTime(delta) {
        this.time += delta;

        // Cada 10 minutos de juego = 1 hora del juego
        const gameHour = Math.floor(this.time / 10) % 24;

        if (gameHour >= 6 && gameHour < 18) {
            this.timeOfDay = 'day';
        } else {
            this.timeOfDay = 'night';
        }

        // Cambiar clima cada cierto tiempo
        if (Math.floor(this.time) % 5 === 0 && Math.random() < 0.1) {
            this.updateWeather();
        }
    }

    interact(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return null;

        const tileType = TILE_TYPES[tile];
        return tileType.interact || null;
    }

    changeZone(newZone) {
        if (ZONES[newZone]) {
            this.currentZone = newZone;
            this.generateMap();
            this.updateWeather();
        }
    }

    getZoneInfo() {
        return ZONES[this.currentZone];
    }
}

// Player
class Player {
    constructor() {
        this.name = 'Entrenador';
        this.x = 5;
        this.y = 7;
        this.emoji = '🧑';
        this.direction = 'down'; // up, down, left, right
        this.money = 3000;
        this.team = [];
        this.box = []; // Pokimon almacenados
        this.inventory = new Inventory();
        this.pokedex = new Set(); // IDs capturados
        this.badges = 0;
        this.quests = [];
        this.stats = {
            steps: 0,
            battles: 0,
            caught: 0,
            victories: 0
        };
    }

    move(dx, dy, world) {
        const newX = this.x + dx;
        const newY = this.y + dy;

        if (world.isWalkable(newX, newY)) {
            this.x = newX;
            this.y = newY;
            this.stats.steps++;

            // Actualizar dirección
            if (dx > 0) this.direction = 'right';
            else if (dx < 0) this.direction = 'left';
            else if (dy > 0) this.direction = 'down';
            else if (dy < 0) this.direction = 'up';

            return true;
        }
        return false;
    }

    addPokimon(pokimon) {
        if (this.team.length < 6) {
            this.team.push(pokimon);
        } else {
            this.box.push(pokimon);
        }
        this.pokedex.add(pokimon.species);
        this.stats.caught++;
    }

    getActivePokimon() {
        return this.team.find(p => !p.isFainted);
    }

    healTeam() {
        this.team.forEach(p => p.heal());
        this.box.forEach(p => p.heal());
    }

    hasAlivePokimon() {
        return this.team.some(p => !p.isFainted);
    }
}

// NPCs
class NPC {
    constructor(x, y, emoji, name, dialogue, type = 'normal') {
        this.x = x;
        this.y = y;
        this.emoji = emoji;
        this.name = name;
        this.dialogue = dialogue;
        this.type = type; // normal, trainer, merchant
        this.interacted = false;
    }

    interact(player) {
        this.interacted = true;
        return {
            type: this.type,
            name: this.name,
            dialogue: this.dialogue
        };
    }
}

// Sistema de Misiones
class Quest {
    constructor(id, title, description, objectives, rewards) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.objectives = objectives; // { type: 'catch', target: 'SPARKYTE', current: 0, goal: 3 }
        this.rewards = rewards; // { money: 1000, items: { POKIBALL: 5 } }
        this.completed = false;
    }

    updateProgress(type, value) {
        for (const obj of this.objectives) {
            if (obj.type === type && (!obj.target || obj.target === value)) {
                obj.current = Math.min(obj.current + 1, obj.goal);
            }
        }

        // Verificar si está completa
        this.completed = this.objectives.every(obj => obj.current >= obj.goal);
    }

    isComplete() {
        return this.completed;
    }

    claim(player) {
        if (!this.completed) return false;

        if (this.rewards.money) {
            player.money += this.rewards.money;
        }

        if (this.rewards.items) {
            for (const [item, quantity] of Object.entries(this.rewards.items)) {
                player.inventory.addItem(item, quantity);
            }
        }

        return true;
    }
}

// Misiones predefinidas
const QUESTS_DATA = [
    new Quest(
        1,
        'Primer Pokimon',
        'Captura tu primer Pokimon salvaje.',
        [{ type: 'catch', current: 0, goal: 1 }],
        { money: 500, items: { POKIBALL: 5, POTION: 3 } }
    ),
    new Quest(
        2,
        'Coleccionista Inicial',
        'Captura 5 Pokimon diferentes.',
        [{ type: 'catch', current: 0, goal: 5 }],
        { money: 1500, items: { SUPERBALL: 3, SUPER_POTION: 2 } }
    ),
    new Quest(
        3,
        'Maestro de Batalla',
        'Gana 10 batallas.',
        [{ type: 'battle_win', current: 0, goal: 10 }],
        { money: 2000, items: { HYPER_POTION: 3, RARE_CANDY: 1 } }
    ),
    new Quest(
        4,
        'Explorador',
        'Visita 3 zonas diferentes.',
        [{ type: 'visit_zone', current: 0, goal: 3 }],
        { money: 2500, items: { ULTRABALL: 2, X_ATTACK: 2 } }
    ),
    new Quest(
        5,
        'Evolucionario',
        'Evoluciona un Pokimon.',
        [{ type: 'evolve', current: 0, goal: 1 }],
        { money: 3000, items: { EVO_STONE: 1, MAX_POTION: 2 } }
    )
];
