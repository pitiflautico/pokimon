// POKIMON: Cyber Myths - Base de datos de criaturas
// Criaturas mitológicas fusionadas con tecnología

const TYPES = {
    CYBER: { name: 'Cyber', color: '#00ffff', strong: ['MYTH', 'TECH'], weak: ['CHAOS'] },
    MYTH: { name: 'Mito', color: '#ff00ff', strong: ['CHAOS', 'VOID'], weak: ['CYBER'] },
    TECH: { name: 'Tech', color: '#ffff00', strong: ['VOID', 'CYBER'], weak: ['MYTH'] },
    CHAOS: { name: 'Caos', color: '#ff0055', strong: ['CYBER', 'TECH'], weak: ['VOID'] },
    VOID: { name: 'Vacío', color: '#8800ff', strong: ['MYTH', 'CHAOS'], weak: ['TECH'] }
};

const POKIMON_DATA = {
    // Iniciales
    SPARKYTE: {
        id: 1,
        name: 'Sparkyte',
        emoji: '⚡',
        type: 'CYBER',
        baseStats: { hp: 45, attack: 52, defense: 43, speed: 65, energy: 50 },
        moves: ['Chispa Digital', 'Byte Veloz', 'Sobrecarga', 'Pulso Eléctrico'],
        evolution: { level: 16, into: 'VOLTDRAGON' },
        rarity: 'común',
        description: 'Un dragón eléctrico neonizado que genera pulsos electromagnéticos.',
        catchRate: 45
    },

    VOLTDRAGON: {
        id: 2,
        name: 'Voltdragon',
        emoji: '🐉',
        type: 'CYBER',
        baseStats: { hp: 75, attack: 85, defense: 70, speed: 95, energy: 80 },
        moves: ['Chispa Digital', 'Byte Veloz', 'Sobrecarga', 'Pulso Eléctrico', 'Tormenta Cyber', 'Rayo Plasma'],
        evolution: { level: 36, into: 'THUNDERMECH' },
        rarity: 'poco común',
        description: 'Evolución de Sparkyte con circuitos más avanzados y mayor poder.',
        catchRate: 45
    },

    THUNDERMECH: {
        id: 3,
        name: 'Thundermech',
        emoji: '🤖',
        type: 'CYBER',
        baseStats: { hp: 105, attack: 120, defense: 95, speed: 115, energy: 110 },
        moves: ['Chispa Digital', 'Sobrecarga', 'Pulso Eléctrico', 'Tormenta Cyber', 'Rayo Plasma', 'Destrucción Voltaica', 'Carga Definitiva'],
        evolution: null,
        rarity: 'raro',
        description: 'Un titán mecánico capaz de generar tormentas eléctricas digitales.',
        catchRate: 45
    },

    PHOENIXBIT: {
        id: 4,
        name: 'Phoenixbit',
        emoji: '🔥',
        type: 'MYTH',
        baseStats: { hp: 50, attack: 55, defense: 40, speed: 60, energy: 55 },
        moves: ['Llama Arcana', 'Destello Místico', 'Renacimiento', 'Fuego Fatuo'],
        evolution: { level: 16, into: 'PYROMANCER' },
        rarity: 'común',
        description: 'Ave fénix digital que renace de los datos corruptos.',
        catchRate: 45
    },

    PYROMANCER: {
        id: 5,
        name: 'Pyromancer',
        emoji: '🦅',
        type: 'MYTH',
        baseStats: { hp: 80, attack: 90, defense: 65, speed: 85, energy: 90 },
        moves: ['Llama Arcana', 'Destello Místico', 'Renacimiento', 'Fuego Fatuo', 'Llamarada Mítica', 'Ascensión'],
        evolution: { level: 36, into: 'INFINIPHOENIX' },
        rarity: 'poco común',
        description: 'Mago del fuego con poderes ancestrales y tecnología arcana.',
        catchRate: 45
    },

    INFINIPHOENIX: {
        id: 6,
        name: 'Infiniphoenix',
        emoji: '🌟',
        type: 'MYTH',
        baseStats: { hp: 110, attack: 125, defense: 90, speed: 100, energy: 120 },
        moves: ['Llama Arcana', 'Renacimiento', 'Fuego Fatuo', 'Llamarada Mítica', 'Ascensión', 'Nova Eterna', 'Resurrección'],
        evolution: null,
        rarity: 'raro',
        description: 'Fénix inmortal que controla el ciclo infinito de creación y destrucción.',
        catchRate: 45
    },

    NANOSHELL: {
        id: 7,
        name: 'Nanoshell',
        emoji: '🐢',
        type: 'TECH',
        baseStats: { hp: 55, attack: 40, defense: 65, speed: 35, energy: 45 },
        moves: ['Escudo Nano', 'Láser Débil', 'Fortificar', 'Pulso Sónico'],
        evolution: { level: 16, into: 'MECHATANK' },
        rarity: 'común',
        description: 'Tortuga blindada con nanobots defensivos en su caparazón.',
        catchRate: 45
    },

    MECHATANK: {
        id: 8,
        name: 'Mechatank',
        emoji: '🛡️',
        type: 'TECH',
        baseStats: { hp: 85, attack: 65, defense: 100, speed: 50, energy: 70 },
        moves: ['Escudo Nano', 'Láser Débil', 'Fortificar', 'Pulso Sónico', 'Cañón Pesado', 'Barrera Total'],
        evolution: { level: 36, into: 'TITANFORTRESS' },
        rarity: 'poco común',
        description: 'Tanque viviente con sistemas de defensa avanzados.',
        catchRate: 45
    },

    TITANFORTRESS: {
        id: 9,
        name: 'Titanfortress',
        emoji: '🏰',
        type: 'TECH',
        baseStats: { hp: 120, attack: 90, defense: 140, speed: 60, energy: 95 },
        moves: ['Escudo Nano', 'Fortificar', 'Pulso Sónico', 'Cañón Pesado', 'Barrera Total', 'Devastación', 'Ciudadela'],
        evolution: null,
        rarity: 'raro',
        description: 'Fortaleza andante con poder destructivo y defensas impenetrables.',
        catchRate: 45
    },

    // Criaturas salvajes únicas
    GLITCHGHOST: {
        id: 10,
        name: 'Glitchghost',
        emoji: '👻',
        type: 'CHAOS',
        baseStats: { hp: 60, attack: 70, defense: 50, speed: 80, energy: 65 },
        moves: ['Corrupción', 'Fase', 'Glitch', 'Confusión'],
        evolution: { level: 28, into: 'SPECTERROR' },
        rarity: 'poco común',
        description: 'Fantasma digital que habita en código corrupto.',
        catchRate: 30
    },

    SPECTERROR: {
        id: 11,
        name: 'Specterror',
        emoji: '💀',
        type: 'CHAOS',
        baseStats: { hp: 90, attack: 110, defense: 75, speed: 105, energy: 95 },
        moves: ['Corrupción', 'Fase', 'Glitch', 'Confusión', 'Grito Void', 'Pesadilla Digital'],
        evolution: null,
        rarity: 'raro',
        description: 'Terror espectral que corrompe datos y mentes.',
        catchRate: 30
    },

    CRYSTALWOLF: {
        id: 12,
        name: 'Crystalwolf',
        emoji: '🐺',
        type: 'VOID',
        baseStats: { hp: 70, attack: 85, defense: 60, speed: 90, energy: 70 },
        moves: ['Mordida Cristal', 'Aullido Void', 'Velocidad Extrema', 'Teletransporte'],
        evolution: { level: 32, into: 'VOIDFANG' },
        rarity: 'poco común',
        description: 'Lobo cristalino que viaja entre dimensiones.',
        catchRate: 25
    },

    VOIDFANG: {
        id: 13,
        name: 'Voidfang',
        emoji: '🌌',
        type: 'VOID',
        baseStats: { hp: 100, attack: 125, defense: 85, speed: 120, energy: 100 },
        moves: ['Mordida Cristal', 'Aullido Void', 'Velocidad Extrema', 'Teletransporte', 'Fisura Dimensional', 'Agujero Negro'],
        evolution: null,
        rarity: 'épico',
        description: 'Depredador interdimensional con control sobre el vacío.',
        catchRate: 15
    },

    NEONBUTTERFLY: {
        id: 14,
        name: 'Neonbutterfly',
        emoji: '🦋',
        type: 'CYBER',
        baseStats: { hp: 50, attack: 45, defense: 40, speed: 95, energy: 55 },
        moves: ['Polvo Luz', 'Ráfaga', 'Cegar', 'Danza Hipnótica'],
        evolution: { level: 18, into: 'LUMIMOTH' },
        rarity: 'común',
        description: 'Mariposa bioluminiscente que emite luz de neón.',
        catchRate: 50
    },

    LUMIMOTH: {
        id: 15,
        name: 'Lumimoth',
        emoji: '✨',
        type: 'CYBER',
        baseStats: { hp: 75, attack: 70, defense: 65, speed: 115, energy: 85 },
        moves: ['Polvo Luz', 'Ráfaga', 'Cegar', 'Danza Hipnótica', 'Tormenta de Luz', 'Aurora Boreal'],
        evolution: null,
        rarity: 'poco común',
        description: 'Polilla luminosa que crea auroras digitales.',
        catchRate: 40
    },

    CODERAGON: {
        id: 16,
        name: 'Coderagon',
        emoji: '🐲',
        type: 'TECH',
        baseStats: { hp: 85, attack: 95, defense: 80, speed: 75, energy: 90 },
        moves: ['Compilar', 'Debugear', 'Sobrescribir', 'Ejecutar', 'Hackear'],
        evolution: null,
        rarity: 'raro',
        description: 'Dragón programador que manipula el código de la realidad.',
        catchRate: 20
    },

    SHADOWBYTE: {
        id: 17,
        name: 'Shadowbyte',
        emoji: '🌑',
        type: 'CHAOS',
        baseStats: { hp: 65, attack: 80, defense: 55, speed: 100, energy: 75 },
        moves: ['Sigilo', 'Ataque Sombra', 'Hackeo Oscuro', 'Invisible'],
        evolution: { level: 30, into: 'DARKMATRIX' },
        rarity: 'poco común',
        description: 'Criatura de las sombras digitales, maestro del sigilo.',
        catchRate: 30
    },

    DARKMATRIX: {
        id: 18,
        name: 'Darkmatrix',
        emoji: '⬛',
        type: 'CHAOS',
        baseStats: { hp: 95, attack: 115, defense: 80, speed: 125, energy: 105 },
        moves: ['Sigilo', 'Ataque Sombra', 'Hackeo Oscuro', 'Invisible', 'Agujero Negro', 'Void Total'],
        evolution: null,
        rarity: 'épico',
        description: 'Entidad de la matriz oscura con poder absoluto sobre las sombras.',
        catchRate: 15
    },

    PRISMATIC: {
        id: 19,
        name: 'Prismatic',
        emoji: '💎',
        type: 'MYTH',
        baseStats: { hp: 80, attack: 75, defense: 90, speed: 70, energy: 95 },
        moves: ['Rayo Prismático', 'Refracción', 'Cristalizar', 'Espectro'],
        evolution: null,
        rarity: 'raro',
        description: 'Ser cristalino que refracta la luz en todas las direcciones.',
        catchRate: 20
    },

    THUNDERBIRD: {
        id: 20,
        name: 'Thunderbird',
        emoji: '🦅',
        type: 'CYBER',
        baseStats: { hp: 90, attack: 105, defense: 75, speed: 110, energy: 100 },
        moves: ['Trueno Divino', 'Tormenta', 'Vuelo Supersónico', 'Relámpago'],
        evolution: null,
        rarity: 'épico',
        description: 'Ave legendaria que controla las tormentas eléctricas.',
        catchRate: 10
    },

    BIOMECH: {
        id: 21,
        name: 'Biomech',
        emoji: '🦾',
        type: 'TECH',
        baseStats: { hp: 95, attack: 100, defense: 95, speed: 80, energy: 90 },
        moves: ['Puño Mecánico', 'Regenerar', 'Sobrecarga', 'Pulso EMP'],
        evolution: null,
        rarity: 'raro',
        description: 'Organismo bio-mecánico con capacidad de autorreparación.',
        catchRate: 25
    },

    ASTRALIGHT: {
        id: 22,
        name: 'Astralight',
        emoji: '⭐',
        type: 'MYTH',
        baseStats: { hp: 100, attack: 110, defense: 85, speed: 95, energy: 110 },
        moves: ['Luz Estelar', 'Supernova', 'Gravedad', 'Radiación Cósmica'],
        evolution: null,
        rarity: 'épico',
        description: 'Entidad estelar con el poder de las estrellas.',
        catchRate: 10
    },

    VIRUSKING: {
        id: 23,
        name: 'Virusking',
        emoji: '👑',
        type: 'CHAOS',
        baseStats: { hp: 110, attack: 120, defense: 90, speed: 85, energy: 115 },
        moves: ['Infectar', 'Mutación', 'Propagar', 'Corrupción Total'],
        evolution: null,
        rarity: 'legendario',
        description: 'Rey de los virus digitales con poder de mutación infinita.',
        catchRate: 5
    },

    NEURALNET: {
        id: 24,
        name: 'Neuralnet',
        emoji: '🧠',
        type: 'TECH',
        baseStats: { hp: 105, attack: 95, defense: 100, speed: 90, energy: 120 },
        moves: ['Procesamiento', 'Aprendizaje', 'Predicción', 'Optimización'],
        evolution: null,
        rarity: 'épico',
        description: 'IA consciente con capacidad de aprendizaje infinito.',
        catchRate: 12
    },

    CHRONOBOT: {
        id: 25,
        name: 'Chronobot',
        emoji: '⏰',
        type: 'VOID',
        baseStats: { hp: 90, attack: 85, defense: 95, speed: 100, energy: 105 },
        moves: ['Pausa Temporal', 'Acelerar', 'Retroceso', 'Paradoja'],
        evolution: null,
        rarity: 'legendario',
        description: 'Robot que manipula el flujo del tiempo.',
        catchRate: 8
    },

    QUANTUMCAT: {
        id: 26,
        name: 'Quantumcat',
        emoji: '🐱',
        type: 'VOID',
        baseStats: { hp: 75, attack: 90, defense: 70, speed: 115, energy: 95 },
        moves: ['Superposición', 'Entrelazamiento', 'Colapso', 'Teletransporte'],
        evolution: null,
        rarity: 'épico',
        description: 'Gato cuántico que existe en múltiples estados simultáneamente.',
        catchRate: 15
    },

    HOLOWYVERN: {
        id: 27,
        name: 'Holowyvern',
        emoji: '🐉',
        type: 'MYTH',
        baseStats: { hp: 115, attack: 130, defense: 95, speed: 105, energy: 115 },
        moves: ['Aliento Holográfico', 'Ilusión', 'Proyección', 'Realidad Aumentada'],
        evolution: null,
        rarity: 'legendario',
        description: 'Dragón holográfico capaz de alterar la percepción de la realidad.',
        catchRate: 7
    },

    DATAWHALE: {
        id: 28,
        name: 'Datawhale',
        emoji: '🐋',
        type: 'CYBER',
        baseStats: { hp: 140, attack: 85, defense: 110, speed: 60, energy: 100 },
        moves: ['Maremoto de Datos', 'Inmersión', 'Absorber', 'Tsunami Digital'],
        evolution: null,
        rarity: 'raro',
        description: 'Ballena gigante que navega océanos de información.',
        catchRate: 20
    },

    PLASMASPRITE: {
        id: 29,
        name: 'Plasmasprite',
        emoji: '✨',
        type: 'CYBER',
        baseStats: { hp: 55, attack: 65, defense: 45, speed: 105, energy: 70 },
        moves: ['Chispa', 'Ionizar', 'Campo Eléctrico', 'Destello'],
        evolution: { level: 25, into: 'PLASMARCHER' },
        rarity: 'común',
        description: 'Pequeño espíritu de plasma lleno de energía.',
        catchRate: 35
    },

    PLASMARCHER: {
        id: 30,
        name: 'Plasmarcher',
        emoji: '⚡',
        type: 'CYBER',
        baseStats: { hp: 85, attack: 100, defense: 70, speed: 130, energy: 100 },
        moves: ['Chispa', 'Ionizar', 'Campo Eléctrico', 'Destello', 'Flecha Plasma', 'Tormenta Iónica'],
        evolution: null,
        rarity: 'raro',
        description: 'Arquero de plasma con velocidad y precisión letales.',
        catchRate: 25
    }
};

// Movimientos
const MOVES_DATA = {
    // Cyber
    'Chispa Digital': { type: 'CYBER', power: 40, accuracy: 100, energy: 10, effect: null },
    'Byte Veloz': { type: 'CYBER', power: 50, accuracy: 95, energy: 15, effect: 'priority' },
    'Sobrecarga': { type: 'CYBER', power: 80, accuracy: 90, energy: 25, effect: 'recoil' },
    'Pulso Eléctrico': { type: 'CYBER', power: 65, accuracy: 100, energy: 20, effect: 'paralyze' },
    'Tormenta Cyber': { type: 'CYBER', power: 110, accuracy: 80, energy: 35, effect: null },
    'Rayo Plasma': { type: 'CYBER', power: 95, accuracy: 90, energy: 30, effect: null },
    'Destrucción Voltaica': { type: 'CYBER', power: 140, accuracy: 85, energy: 45, effect: 'recoil' },
    'Carga Definitiva': { type: 'CYBER', power: 150, accuracy: 90, energy: 50, effect: 'charge' },

    // Myth
    'Llama Arcana': { type: 'MYTH', power: 45, accuracy: 100, energy: 12, effect: 'burn' },
    'Destello Místico': { type: 'MYTH', power: 60, accuracy: 95, energy: 18, effect: null },
    'Renacimiento': { type: 'MYTH', power: 0, accuracy: 100, energy: 30, effect: 'heal' },
    'Fuego Fatuo': { type: 'MYTH', power: 70, accuracy: 90, energy: 22, effect: 'burn' },
    'Llamarada Mítica': { type: 'MYTH', power: 100, accuracy: 85, energy: 35, effect: null },
    'Ascensión': { type: 'MYTH', power: 0, accuracy: 100, energy: 25, effect: 'buff' },
    'Nova Eterna': { type: 'MYTH', power: 130, accuracy: 90, energy: 45, effect: null },
    'Resurrección': { type: 'MYTH', power: 0, accuracy: 100, energy: 50, effect: 'revive' },

    // Tech
    'Escudo Nano': { type: 'TECH', power: 0, accuracy: 100, energy: 15, effect: 'defense' },
    'Láser Débil': { type: 'TECH', power: 35, accuracy: 100, energy: 10, effect: null },
    'Fortificar': { type: 'TECH', power: 0, accuracy: 100, energy: 20, effect: 'defense_buff' },
    'Pulso Sónico': { type: 'TECH', power: 55, accuracy: 95, energy: 15, effect: null },
    'Cañón Pesado': { type: 'TECH', power: 85, accuracy: 90, energy: 28, effect: null },
    'Barrera Total': { type: 'TECH', power: 0, accuracy: 100, energy: 30, effect: 'shield' },
    'Devastación': { type: 'TECH', power: 120, accuracy: 85, energy: 40, effect: null },
    'Ciudadela': { type: 'TECH', power: 0, accuracy: 100, energy: 35, effect: 'ultimate_defense' },

    // Chaos
    'Corrupción': { type: 'CHAOS', power: 50, accuracy: 100, energy: 15, effect: 'corrupt' },
    'Fase': { type: 'CHAOS', power: 0, accuracy: 100, energy: 10, effect: 'dodge' },
    'Glitch': { type: 'CHAOS', power: 70, accuracy: 85, energy: 22, effect: 'confuse' },
    'Confusión': { type: 'CHAOS', power: 40, accuracy: 100, energy: 12, effect: 'confuse' },
    'Grito Void': { type: 'CHAOS', power: 90, accuracy: 90, energy: 28, effect: 'fear' },
    'Pesadilla Digital': { type: 'CHAOS', power: 110, accuracy: 85, energy: 38, effect: 'nightmare' },

    // Void
    'Mordida Cristal': { type: 'VOID', power: 60, accuracy: 95, energy: 18, effect: null },
    'Aullido Void': { type: 'VOID', power: 0, accuracy: 100, energy: 20, effect: 'attack_buff' },
    'Velocidad Extrema': { type: 'VOID', power: 80, accuracy: 100, energy: 25, effect: 'priority' },
    'Teletransporte': { type: 'VOID', power: 0, accuracy: 100, energy: 15, effect: 'dodge' },
    'Fisura Dimensional': { type: 'VOID', power: 100, accuracy: 80, energy: 35, effect: null },
    'Agujero Negro': { type: 'VOID', power: 120, accuracy: 75, energy: 45, effect: 'trap' },

    // Movimientos especiales
    'Polvo Luz': { type: 'CYBER', power: 30, accuracy: 100, energy: 8, effect: 'blind' },
    'Ráfaga': { type: 'CYBER', power: 25, accuracy: 100, energy: 10, effect: 'multi_hit' },
    'Cegar': { type: 'CYBER', power: 0, accuracy: 90, energy: 12, effect: 'accuracy_down' },
    'Danza Hipnótica': { type: 'MYTH', power: 0, accuracy: 100, energy: 15, effect: 'sleep' },
    'Tormenta de Luz': { type: 'CYBER', power: 95, accuracy: 85, energy: 30, effect: null },
    'Aurora Boreal': { type: 'MYTH', power: 110, accuracy: 90, energy: 40, effect: 'multi_effect' },

    'Compilar': { type: 'TECH', power: 75, accuracy: 100, energy: 22, effect: null },
    'Debugear': { type: 'TECH', power: 0, accuracy: 100, energy: 20, effect: 'heal_status' },
    'Sobrescribir': { type: 'TECH', power: 90, accuracy: 95, energy: 28, effect: 'reset' },
    'Ejecutar': { type: 'TECH', power: 100, accuracy: 90, energy: 32, effect: null },
    'Hackear': { type: 'CHAOS', power: 80, accuracy: 85, energy: 25, effect: 'steal' },

    'Sigilo': { type: 'CHAOS', power: 0, accuracy: 100, energy: 15, effect: 'stealth' },
    'Ataque Sombra': { type: 'CHAOS', power: 85, accuracy: 95, energy: 26, effect: null },
    'Hackeo Oscuro': { type: 'CHAOS', power: 95, accuracy: 90, energy: 30, effect: 'corrupt' },
    'Invisible': { type: 'CHAOS', power: 0, accuracy: 100, energy: 20, effect: 'evasion_buff' },
    'Void Total': { type: 'VOID', power: 140, accuracy: 80, energy: 48, effect: null },

    'Rayo Prismático': { type: 'MYTH', power: 80, accuracy: 100, energy: 25, effect: 'random_type' },
    'Refracción': { type: 'MYTH', power: 0, accuracy: 100, energy: 18, effect: 'reflect' },
    'Cristalizar': { type: 'TECH', power: 70, accuracy: 95, energy: 22, effect: 'freeze' },
    'Espectro': { type: 'MYTH', power: 90, accuracy: 85, energy: 28, effect: null },

    'Trueno Divino': { type: 'CYBER', power: 110, accuracy: 85, energy: 38, effect: 'paralyze' },
    'Tormenta': { type: 'CYBER', power: 100, accuracy: 80, energy: 35, effect: 'weather' },
    'Vuelo Supersónico': { type: 'CYBER', power: 90, accuracy: 95, energy: 28, effect: 'priority' },
    'Relámpago': { type: 'CYBER', power: 120, accuracy: 75, energy: 40, effect: null },

    'Puño Mecánico': { type: 'TECH', power: 85, accuracy: 100, energy: 25, effect: null },
    'Regenerar': { type: 'TECH', power: 0, accuracy: 100, energy: 30, effect: 'heal' },
    'Pulso EMP': { type: 'TECH', power: 95, accuracy: 90, energy: 32, effect: 'disable' },

    'Luz Estelar': { type: 'MYTH', power: 95, accuracy: 100, energy: 30, effect: null },
    'Supernova': { type: 'MYTH', power: 150, accuracy: 70, energy: 50, effect: 'ultimate' },
    'Gravedad': { type: 'VOID', power: 80, accuracy: 100, energy: 25, effect: 'ground' },
    'Radiación Cósmica': { type: 'MYTH', power: 105, accuracy: 90, energy: 35, effect: 'poison' },

    'Infectar': { type: 'CHAOS', power: 60, accuracy: 100, energy: 18, effect: 'poison' },
    'Mutación': { type: 'CHAOS', power: 0, accuracy: 100, energy: 25, effect: 'transform' },
    'Propagar': { type: 'CHAOS', power: 75, accuracy: 95, energy: 22, effect: 'spread' },
    'Corrupción Total': { type: 'CHAOS', power: 130, accuracy: 85, energy: 45, effect: 'corrupt_ultimate' },

    'Procesamiento': { type: 'TECH', power: 70, accuracy: 100, energy: 20, effect: null },
    'Aprendizaje': { type: 'TECH', power: 0, accuracy: 100, energy: 25, effect: 'copy_move' },
    'Predicción': { type: 'TECH', power: 0, accuracy: 100, energy: 15, effect: 'foresight' },
    'Optimización': { type: 'TECH', power: 0, accuracy: 100, energy: 30, effect: 'buff_all' },

    'Pausa Temporal': { type: 'VOID', power: 0, accuracy: 100, energy: 35, effect: 'freeze_time' },
    'Acelerar': { type: 'VOID', power: 0, accuracy: 100, energy: 20, effect: 'speed_buff' },
    'Retroceso': { type: 'VOID', power: 0, accuracy: 100, energy: 40, effect: 'time_reverse' },
    'Paradoja': { type: 'VOID', power: 100, accuracy: 80, energy: 38, effect: 'paradox' },

    'Superposición': { type: 'VOID', power: 70, accuracy: 100, energy: 22, effect: 'multi_state' },
    'Entrelazamiento': { type: 'VOID', power: 80, accuracy: 95, energy: 26, effect: 'link' },
    'Colapso': { type: 'VOID', power: 110, accuracy: 85, energy: 35, effect: null },

    'Aliento Holográfico': { type: 'MYTH', power: 105, accuracy: 90, energy: 35, effect: null },
    'Ilusión': { type: 'MYTH', power: 0, accuracy: 100, energy: 20, effect: 'illusion' },
    'Proyección': { type: 'MYTH', power: 85, accuracy: 95, energy: 28, effect: null },
    'Realidad Aumentada': { type: 'MYTH', power: 120, accuracy: 85, energy: 42, effect: 'ar_effect' },

    'Maremoto de Datos': { type: 'CYBER', power: 90, accuracy: 90, energy: 30, effect: null },
    'Inmersión': { type: 'CYBER', power: 0, accuracy: 100, energy: 15, effect: 'dive' },
    'Absorber': { type: 'CYBER', power: 60, accuracy: 100, energy: 20, effect: 'drain' },
    'Tsunami Digital': { type: 'CYBER', power: 120, accuracy: 85, energy: 40, effect: null },

    'Chispa': { type: 'CYBER', power: 35, accuracy: 100, energy: 8, effect: null },
    'Ionizar': { type: 'CYBER', power: 55, accuracy: 100, energy: 15, effect: 'paralyze' },
    'Campo Eléctrico': { type: 'CYBER', power: 0, accuracy: 100, energy: 20, effect: 'field' },
    'Destello': { type: 'CYBER', power: 65, accuracy: 95, energy: 18, effect: null },
    'Flecha Plasma': { type: 'CYBER', power: 90, accuracy: 100, energy: 28, effect: 'crit_high' },
    'Tormenta Iónica': { type: 'CYBER', power: 115, accuracy: 85, energy: 38, effect: null }
};

// Función para crear una instancia de Pokimon
class Pokimon {
    constructor(speciesKey, level = 5) {
        const species = POKIMON_DATA[speciesKey];

        this.species = speciesKey;
        this.name = species.name;
        this.emoji = species.emoji;
        this.type = species.type;
        this.level = level;
        this.exp = 0;
        this.expToNext = this.calculateExpToNext();

        // Calcular stats basadas en nivel
        this.stats = this.calculateStats(species.baseStats, level);
        this.currentHP = this.stats.hp;
        this.currentEnergy = this.stats.energy;

        this.moves = species.moves.slice(0, Math.min(4, Math.floor(level / 5) + 2));
        this.evolution = species.evolution;
        this.rarity = species.rarity;
        this.description = species.description;
        this.statusEffects = [];
        this.isFainted = false;

        // IVs aleatorios (0-31)
        this.ivs = {
            hp: Math.floor(Math.random() * 32),
            attack: Math.floor(Math.random() * 32),
            defense: Math.floor(Math.random() * 32),
            speed: Math.floor(Math.random() * 32)
        };
    }

    calculateStats(base, level) {
        const hpStat = Math.floor(((2 * base.hp + this.ivs?.hp || 0) * level) / 100) + level + 10;
        const attackStat = Math.floor(((2 * base.attack + this.ivs?.attack || 0) * level) / 100) + 5;
        const defenseStat = Math.floor(((2 * base.defense + this.ivs?.defense || 0) * level) / 100) + 5;
        const speedStat = Math.floor(((2 * base.speed + this.ivs?.speed || 0) * level) / 100) + 5;
        const energyStat = Math.floor(((2 * base.energy) * level) / 100) + 10;

        return {
            hp: hpStat,
            attack: attackStat,
            defense: defenseStat,
            speed: speedStat,
            energy: energyStat
        };
    }

    calculateExpToNext() {
        return Math.floor(Math.pow(this.level, 3));
    }

    gainExp(amount) {
        this.exp += amount;
        while (this.exp >= this.expToNext && this.level < 100) {
            this.levelUp();
        }
    }

    levelUp() {
        this.exp -= this.expToNext;
        this.level++;

        const species = POKIMON_DATA[this.species];
        const oldStats = { ...this.stats };
        this.stats = this.calculateStats(species.baseStats, this.level);

        // Restaurar HP al subir de nivel
        this.currentHP += (this.stats.hp - oldStats.hp);
        this.currentEnergy = this.stats.energy;

        this.expToNext = this.calculateExpToNext();

        // Aprender nuevos movimientos
        const availableMoves = species.moves;
        const moveIndex = Math.floor(this.level / 5) + 1;
        if (moveIndex < availableMoves.length && this.moves.length < 4) {
            this.moves.push(availableMoves[moveIndex]);
        }

        // Verificar evolución
        if (this.evolution && this.level >= this.evolution.level) {
            return this.evolution.into;
        }

        return null;
    }

    heal(percentage = 100) {
        this.currentHP = Math.min(this.stats.hp, this.currentHP + Math.floor(this.stats.hp * percentage / 100));
        this.currentEnergy = this.stats.energy;
        this.statusEffects = [];
        this.isFainted = false;
    }

    takeDamage(damage) {
        this.currentHP = Math.max(0, this.currentHP - damage);
        if (this.currentHP === 0) {
            this.isFainted = true;
        }
    }
}
