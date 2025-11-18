// Sistema de Items y Crafteo

const ITEMS_DATA = {
    // Pokiballs
    POKIBALL: {
        id: 1,
        name: 'Pokiball',
        emoji: '⚾',
        type: 'pokiball',
        description: 'Dispositivo estándar de captura. 1x ratio.',
        catchRate: 1.0,
        price: 200,
        craftable: false
    },

    SUPERBALL: {
        id: 2,
        name: 'Superball',
        emoji: '🔵',
        type: 'pokiball',
        description: 'Dispositivo mejorado de captura. 1.5x ratio.',
        catchRate: 1.5,
        price: 600,
        craftable: true,
        recipe: { POKIBALL: 2, CYBER_FRAGMENT: 1 }
    },

    ULTRABALL: {
        id: 3,
        name: 'Ultraball',
        emoji: '🟡',
        type: 'pokiball',
        description: 'Dispositivo avanzado de captura. 2x ratio.',
        catchRate: 2.0,
        price: 1200,
        craftable: true,
        recipe: { SUPERBALL: 2, TECH_CORE: 1 }
    },

    MASTERBALL: {
        id: 4,
        name: 'Masterball',
        emoji: '🟣',
        type: 'pokiball',
        description: 'Captura garantizada. 100% éxito.',
        catchRate: 255,
        price: 0,
        craftable: true,
        recipe: { ULTRABALL: 3, LEGENDARY_ESSENCE: 1, VOID_CRYSTAL: 1 }
    },

    // Pociones
    POTION: {
        id: 5,
        name: 'Poción',
        emoji: '🧪',
        type: 'healing',
        description: 'Restaura 50 HP.',
        healAmount: 50,
        price: 150,
        craftable: true,
        recipe: { HERB: 2 }
    },

    SUPER_POTION: {
        id: 6,
        name: 'Super Poción',
        emoji: '🍶',
        type: 'healing',
        description: 'Restaura 120 HP.',
        healAmount: 120,
        price: 400,
        craftable: true,
        recipe: { POTION: 2, CYBER_FRAGMENT: 1 }
    },

    HYPER_POTION: {
        id: 7,
        name: 'Híper Poción',
        emoji: '⚗️',
        type: 'healing',
        description: 'Restaura 200 HP.',
        healAmount: 200,
        price: 800,
        craftable: true,
        recipe: { SUPER_POTION: 2, TECH_CORE: 1 }
    },

    MAX_POTION: {
        id: 8,
        name: 'Poción Máxima',
        emoji: '💊',
        type: 'healing',
        description: 'Restaura todo el HP.',
        healAmount: 9999,
        price: 2000,
        craftable: true,
        recipe: { HYPER_POTION: 2, MYTH_ESSENCE: 1 }
    },

    REVIVE: {
        id: 9,
        name: 'Revivir',
        emoji: '💚',
        type: 'revive',
        description: 'Revive un Pokimon con 50% HP.',
        reviveAmount: 0.5,
        price: 1500,
        craftable: true,
        recipe: { POTION: 3, PHOENIX_FEATHER: 1 }
    },

    MAX_REVIVE: {
        id: 10,
        name: 'Revivir Máx',
        emoji: '💗',
        type: 'revive',
        description: 'Revive un Pokimon con 100% HP.',
        reviveAmount: 1.0,
        price: 3000,
        craftable: true,
        recipe: { REVIVE: 2, LEGENDARY_ESSENCE: 1 }
    },

    // Items de Status
    ANTIDOTE: {
        id: 11,
        name: 'Antídoto',
        emoji: '💉',
        type: 'status',
        description: 'Cura envenenamiento.',
        cures: ['poison', 'toxic'],
        price: 200,
        craftable: true,
        recipe: { HERB: 3 }
    },

    AWAKENING: {
        id: 12,
        name: 'Despertar',
        emoji: '☕',
        type: 'status',
        description: 'Cura sueño.',
        cures: ['sleep'],
        price: 200,
        craftable: true,
        recipe: { HERB: 2, CYBER_FRAGMENT: 1 }
    },

    PARALYZE_HEAL: {
        id: 13,
        name: 'Anti-Parálisis',
        emoji: '⚡',
        type: 'status',
        description: 'Cura parálisis.',
        cures: ['paralyze'],
        price: 200,
        craftable: true,
        recipe: { HERB: 2, TECH_CORE: 1 }
    },

    FULL_HEAL: {
        id: 14,
        name: 'Cura Total',
        emoji: '✨',
        type: 'status',
        description: 'Cura todos los problemas de estado.',
        cures: ['all'],
        price: 600,
        craftable: true,
        recipe: { ANTIDOTE: 1, AWAKENING: 1, PARALYZE_HEAL: 1 }
    },

    // Items de Batalla
    X_ATTACK: {
        id: 15,
        name: 'Ataque X',
        emoji: '⚔️',
        type: 'battle',
        description: 'Aumenta Ataque en batalla.',
        stat: 'attack',
        boost: 2,
        price: 500,
        craftable: true,
        recipe: { CYBER_FRAGMENT: 2, TECH_CORE: 1 }
    },

    X_DEFENSE: {
        id: 16,
        name: 'Defensa X',
        emoji: '🛡️',
        type: 'battle',
        description: 'Aumenta Defensa en batalla.',
        stat: 'defense',
        boost: 2,
        price: 500,
        craftable: true,
        recipe: { TECH_CORE: 2, METAL_PLATE: 1 }
    },

    X_SPEED: {
        id: 17,
        name: 'Velocidad X',
        emoji: '💨',
        type: 'battle',
        description: 'Aumenta Velocidad en batalla.',
        stat: 'speed',
        boost: 2,
        price: 500,
        craftable: true,
        recipe: { CYBER_FRAGMENT: 2, VOID_CRYSTAL: 1 }
    },

    // Materiales de Crafteo
    HERB: {
        id: 18,
        name: 'Hierba',
        emoji: '🌿',
        type: 'material',
        description: 'Material común para pociones.',
        price: 20,
        craftable: false
    },

    CYBER_FRAGMENT: {
        id: 19,
        name: 'Fragmento Cyber',
        emoji: '💎',
        type: 'material',
        description: 'Fragmento de tecnología digital.',
        price: 100,
        craftable: false
    },

    TECH_CORE: {
        id: 20,
        name: 'Núcleo Tech',
        emoji: '⚙️',
        type: 'material',
        description: 'Núcleo de tecnología avanzada.',
        price: 250,
        craftable: false
    },

    MYTH_ESSENCE: {
        id: 21,
        name: 'Esencia Mítica',
        emoji: '✨',
        type: 'material',
        description: 'Esencia de poder mitológico.',
        price: 500,
        craftable: false
    },

    VOID_CRYSTAL: {
        id: 22,
        name: 'Cristal Void',
        emoji: '🔮',
        type: 'material',
        description: 'Cristal del vacío interdimensional.',
        price: 300,
        craftable: false
    },

    LEGENDARY_ESSENCE: {
        id: 23,
        name: 'Esencia Legendaria',
        emoji: '🌟',
        type: 'material',
        description: 'Esencia de poder legendario.',
        price: 1000,
        craftable: false
    },

    PHOENIX_FEATHER: {
        id: 24,
        name: 'Pluma Fénix',
        emoji: '🪶',
        type: 'material',
        description: 'Pluma del ave inmortal.',
        price: 400,
        craftable: false
    },

    METAL_PLATE: {
        id: 25,
        name: 'Placa Metal',
        emoji: '🔩',
        type: 'material',
        description: 'Placa de metal reforzado.',
        price: 150,
        craftable: false
    },

    // Items Especiales
    RARE_CANDY: {
        id: 26,
        name: 'Caramelo Raro',
        emoji: '🍬',
        type: 'special',
        description: 'Sube 1 nivel instantáneamente.',
        price: 5000,
        craftable: true,
        recipe: { LEGENDARY_ESSENCE: 1, MYTH_ESSENCE: 2 }
    },

    EVO_STONE: {
        id: 27,
        name: 'Piedra Evolutiva',
        emoji: '💠',
        type: 'special',
        description: 'Fuerza la evolución de un Pokimon.',
        price: 3000,
        craftable: true,
        recipe: { CYBER_FRAGMENT: 3, TECH_CORE: 2, MYTH_ESSENCE: 1 }
    },

    FUSION_CORE: {
        id: 28,
        name: 'Núcleo de Fusión',
        emoji: '⚛️',
        type: 'special',
        description: 'Permite fusionar dos Pokimon.',
        price: 10000,
        craftable: true,
        recipe: { LEGENDARY_ESSENCE: 2, VOID_CRYSTAL: 3, TECH_CORE: 5 }
    },

    EXP_SHARE: {
        id: 29,
        name: 'Repartir Exp',
        emoji: '📊',
        type: 'key_item',
        description: 'Reparte experiencia con todo el equipo.',
        price: 0,
        craftable: false
    },

    LUCKY_EGG: {
        id: 30,
        name: 'Huevo Suerte',
        emoji: '🥚',
        type: 'hold_item',
        description: 'Aumenta Exp ganada en 50%.',
        price: 8000,
        craftable: true,
        recipe: { LEGENDARY_ESSENCE: 1, PHOENIX_FEATHER: 2 }
    }
};

// Clase para el inventario del jugador
class Inventory {
    constructor() {
        this.items = {
            POKIBALL: 5,
            POTION: 3,
            HERB: 10,
            CYBER_FRAGMENT: 3
        };
    }

    addItem(itemKey, quantity = 1) {
        if (!this.items[itemKey]) {
            this.items[itemKey] = 0;
        }
        this.items[itemKey] += quantity;
    }

    removeItem(itemKey, quantity = 1) {
        if (!this.items[itemKey] || this.items[itemKey] < quantity) {
            return false;
        }
        this.items[itemKey] -= quantity;
        if (this.items[itemKey] === 0) {
            delete this.items[itemKey];
        }
        return true;
    }

    hasItem(itemKey, quantity = 1) {
        return this.items[itemKey] && this.items[itemKey] >= quantity;
    }

    getItemCount(itemKey) {
        return this.items[itemKey] || 0;
    }

    canCraft(itemKey) {
        const item = ITEMS_DATA[itemKey];
        if (!item || !item.craftable || !item.recipe) {
            return false;
        }

        for (const [material, needed] of Object.entries(item.recipe)) {
            if (!this.hasItem(material, needed)) {
                return false;
            }
        }
        return true;
    }

    craftItem(itemKey) {
        if (!this.canCraft(itemKey)) {
            return false;
        }

        const item = ITEMS_DATA[itemKey];
        // Consumir materiales
        for (const [material, needed] of Object.entries(item.recipe)) {
            this.removeItem(material, needed);
        }

        // Crear item
        this.addItem(itemKey, 1);
        return true;
    }

    useItem(itemKey, pokimon) {
        if (!this.hasItem(itemKey)) {
            return { success: false, message: 'No tienes este item.' };
        }

        const item = ITEMS_DATA[itemKey];

        switch (item.type) {
            case 'healing':
                if (pokimon.isFainted) {
                    return { success: false, message: 'No se puede usar en un Pokimon debilitado.' };
                }
                if (pokimon.currentHP === pokimon.stats.hp) {
                    return { success: false, message: 'El HP ya está al máximo.' };
                }
                pokimon.currentHP = Math.min(pokimon.stats.hp, pokimon.currentHP + item.healAmount);
                this.removeItem(itemKey);
                return { success: true, message: `${pokimon.name} recuperó ${item.healAmount} HP.` };

            case 'revive':
                if (!pokimon.isFainted) {
                    return { success: false, message: 'Este Pokimon no está debilitado.' };
                }
                pokimon.isFainted = false;
                pokimon.currentHP = Math.floor(pokimon.stats.hp * item.reviveAmount);
                this.removeItem(itemKey);
                return { success: true, message: `${pokimon.name} ha revivido!` };

            case 'status':
                if (pokimon.statusEffects.length === 0) {
                    return { success: false, message: 'No hay problemas de estado.' };
                }
                if (item.cures.includes('all')) {
                    pokimon.statusEffects = [];
                } else {
                    pokimon.statusEffects = pokimon.statusEffects.filter(
                        effect => !item.cures.includes(effect)
                    );
                }
                this.removeItem(itemKey);
                return { success: true, message: `${pokimon.name} se curó del estado.` };

            case 'special':
                if (itemKey === 'RARE_CANDY') {
                    const evolution = pokimon.levelUp();
                    this.removeItem(itemKey);
                    let msg = `${pokimon.name} subió al nivel ${pokimon.level}!`;
                    if (evolution) {
                        msg += ` ¿Quieres evolucionar a ${evolution}?`;
                    }
                    return { success: true, message: msg, evolution };
                }
                break;

            default:
                return { success: false, message: 'Este item no se puede usar así.' };
        }

        return { success: false, message: 'No se pudo usar el item.' };
    }
}

// Tienda
class Shop {
    constructor() {
        this.stock = {
            POKIBALL: 999,
            SUPERBALL: 999,
            ULTRABALL: 999,
            POTION: 999,
            SUPER_POTION: 999,
            HYPER_POTION: 999,
            ANTIDOTE: 999,
            AWAKENING: 999,
            PARALYZE_HEAL: 999,
            REVIVE: 999,
            HERB: 999,
            CYBER_FRAGMENT: 50,
            TECH_CORE: 20,
            MYTH_ESSENCE: 10,
            VOID_CRYSTAL: 15,
            PHOENIX_FEATHER: 10,
            METAL_PLATE: 30
        };
    }

    buyItem(itemKey, quantity, playerMoney) {
        const item = ITEMS_DATA[itemKey];
        if (!item) return { success: false, message: 'Item no encontrado.' };

        const totalCost = item.price * quantity;
        if (playerMoney < totalCost) {
            return { success: false, message: 'No tienes suficiente dinero.' };
        }

        if (this.stock[itemKey] !== undefined && this.stock[itemKey] < quantity) {
            return { success: false, message: 'Stock insuficiente.' };
        }

        if (this.stock[itemKey] !== undefined) {
            this.stock[itemKey] -= quantity;
        }

        return { success: true, cost: totalCost };
    }

    sellItem(itemKey, quantity) {
        const item = ITEMS_DATA[itemKey];
        if (!item) return { success: false, message: 'Item no encontrado.' };

        const sellPrice = Math.floor(item.price * 0.5);
        return { success: true, price: sellPrice * quantity };
    }
}
