// Sistema de Combate Dinámico

class Battle {
    constructor(playerPokimon, enemyPokimon, isWild = true) {
        this.playerPokimon = playerPokimon;
        this.enemyPokimon = enemyPokimon;
        this.isWild = isWild;
        this.turn = 0;
        this.battleLog = [];
        this.state = 'menu'; // menu, move_select, item_select, team_select, animation, end
        this.weather = null;
        this.terrain = null;
        this.playerBuffs = { attack: 0, defense: 0, speed: 0, evasion: 0, accuracy: 0 };
        this.enemyBuffs = { attack: 0, defense: 0, speed: 0, evasion: 0, accuracy: 0 };
        this.battleEffects = [];
    }

    start() {
        this.log(`¡Un ${this.enemyPokimon.name} salvaje apareció!`);
        this.log(`¡Adelante, ${this.playerPokimon.name}!`);
        this.updateUI();
    }

    log(message) {
        this.battleLog.push(message);
        if (this.battleLog.length > 10) {
            this.battleLog.shift();
        }
        this.updateBattleLog();
    }

    updateBattleLog() {
        const logElement = document.getElementById('battleLog');
        if (logElement) {
            logElement.innerHTML = this.battleLog.map(msg => `<div>${msg}</div>`).join('');
            logElement.scrollTop = logElement.scrollHeight;
        }
    }

    updateUI() {
        // Actualizar sprites
        document.getElementById('playerSprite').textContent = this.playerPokimon.emoji;
        document.getElementById('enemySprite').textContent = this.enemyPokimon.emoji;

        // Actualizar info del jugador
        document.getElementById('playerPokimonName').textContent = this.playerPokimon.name;
        document.getElementById('playerPokimonLevel').textContent = `Nv. ${this.playerPokimon.level}`;
        this.updateHPBar('player');

        // Actualizar info del enemigo
        document.getElementById('enemyName').textContent = this.enemyPokimon.name;
        document.getElementById('enemyLevel').textContent = `Nv. ${this.enemyPokimon.level}`;
        this.updateHPBar('enemy');

        // Actualizar efectos de estado
        this.updateStatusEffects();
    }

    updateHPBar(side) {
        const pokimon = side === 'player' ? this.playerPokimon : this.enemyPokimon;
        const hpBar = document.getElementById(`${side}HPBar`);
        const hpText = document.getElementById(side === 'player' ? 'playerPokimonHP' : 'enemyHP');

        const hpPercentage = (pokimon.currentHP / pokimon.stats.hp) * 100;
        hpBar.style.width = `${hpPercentage}%`;

        if (hpPercentage > 50) {
            hpBar.classList.remove('low');
        } else {
            hpBar.classList.add('low');
        }

        hpText.textContent = `${pokimon.currentHP} / ${pokimon.stats.hp}`;

        // Actualizar barra de energía del jugador
        if (side === 'player') {
            const energyBar = document.getElementById('playerEnergyBar');
            const energyPercentage = (pokimon.currentEnergy / pokimon.stats.energy) * 100;
            energyBar.style.width = `${energyPercentage}%`;
        }
    }

    updateStatusEffects() {
        const updateSide = (pokimon, elementId) => {
            const statusElement = document.getElementById(elementId);
            statusElement.innerHTML = '';

            pokimon.statusEffects.forEach(effect => {
                const span = document.createElement('span');
                span.className = 'status-effect';
                span.textContent = effect.toUpperCase();
                statusElement.appendChild(span);
            });
        };

        updateSide(this.playerPokimon, 'playerStatus');
        updateSide(this.enemyPokimon, 'enemyStatus');
    }

    showMoves() {
        const movesMenu = document.getElementById('movesMenu');
        movesMenu.innerHTML = '';

        this.playerPokimon.moves.forEach(moveName => {
            const move = MOVES_DATA[moveName];
            const btn = document.createElement('button');
            btn.className = 'move-btn';

            const canUse = this.playerPokimon.currentEnergy >= move.energy;
            if (!canUse) btn.style.opacity = '0.5';

            btn.innerHTML = `
                <div class="move-name">${moveName}</div>
                <div class="move-info">
                    Tipo: ${move.type} | Poder: ${move.power || '-'} |
                    Precisión: ${move.accuracy}% | Energía: ${move.energy}
                </div>
            `;

            if (canUse) {
                btn.onclick = () => this.useMove(moveName);
            }

            movesMenu.appendChild(btn);
        });

        document.getElementById('battleMenu').classList.add('hidden');
        movesMenu.classList.remove('hidden');
    }

    showItems() {
        const itemsMenu = document.getElementById('itemsMenu');
        itemsMenu.innerHTML = '';

        const usableItems = ['POKIBALL', 'SUPERBALL', 'ULTRABALL', 'MASTERBALL', 'POTION', 'SUPER_POTION', 'HYPER_POTION'];

        for (const itemKey of usableItems) {
            const count = game.player.inventory.getItemCount(itemKey);
            if (count > 0) {
                const item = ITEMS_DATA[itemKey];
                const btn = document.createElement('button');
                btn.className = 'item-btn';
                btn.innerHTML = `
                    <div class="item-name">${item.emoji} ${item.name} x${count}</div>
                    <div class="item-info">${item.description}</div>
                `;
                btn.onclick = () => this.useItem(itemKey);
                itemsMenu.appendChild(btn);
            }
        }

        if (itemsMenu.children.length === 0) {
            itemsMenu.innerHTML = '<div style="padding: 1rem; color: var(--light);">No hay items disponibles</div>';
        }

        document.getElementById('battleMenu').classList.add('hidden');
        itemsMenu.classList.remove('hidden');
    }

    showTeam() {
        const teamMenu = document.getElementById('teamMenu');
        teamMenu.innerHTML = '';

        game.player.team.forEach((pokimon, index) => {
            if (pokimon === this.playerPokimon) return; // No mostrar el actual

            const btn = document.createElement('button');
            btn.className = 'pokimon-btn';

            const hpPercentage = (pokimon.currentHP / pokimon.stats.hp) * 100;

            btn.innerHTML = `
                <div class="pokimon-name">${pokimon.emoji} ${pokimon.name} Nv.${pokimon.level}</div>
                <div class="pokimon-info-text">
                    HP: ${pokimon.currentHP}/${pokimon.stats.hp} (${Math.floor(hpPercentage)}%)
                    ${pokimon.isFainted ? '💀 Debilitado' : ''}
                </div>
            `;

            if (!pokimon.isFainted) {
                btn.onclick = () => this.switchPokimon(index);
            } else {
                btn.style.opacity = '0.5';
            }

            teamMenu.appendChild(btn);
        });

        document.getElementById('battleMenu').classList.add('hidden');
        teamMenu.classList.remove('hidden');
    }

    hideMenus() {
        document.getElementById('movesMenu').classList.add('hidden');
        document.getElementById('itemsMenu').classList.add('hidden');
        document.getElementById('teamMenu').classList.add('hidden');
        document.getElementById('battleMenu').classList.remove('hidden');
    }

    useMove(moveName) {
        this.hideMenus();

        const move = MOVES_DATA[moveName];

        // Verificar energía
        if (this.playerPokimon.currentEnergy < move.energy) {
            this.log('¡No hay suficiente energía!');
            return;
        }

        this.playerPokimon.currentEnergy -= move.energy;

        // Determinar orden de ataque (por velocidad)
        const playerSpeed = this.calculateStat(this.playerPokimon, 'speed', this.playerBuffs.speed);
        const enemySpeed = this.calculateStat(this.enemyPokimon, 'speed', this.enemyBuffs.speed);

        if (playerSpeed >= enemySpeed) {
            this.executeMove(this.playerPokimon, this.enemyPokimon, move, this.playerBuffs, this.enemyBuffs);
            if (!this.checkBattleEnd()) {
                this.enemyTurn();
            }
        } else {
            this.enemyTurn();
            if (!this.checkBattleEnd()) {
                this.executeMove(this.playerPokimon, this.enemyPokimon, move, this.playerBuffs, this.enemyBuffs);
                this.checkBattleEnd();
            }
        }

        this.turn++;
        this.updateUI();
    }

    executeMove(attacker, defender, move, attackerBuffs, defenderBuffs) {
        this.log(`${attacker.name} usó ${move.type === attacker.type ? '⭐' : ''} ${Object.keys(MOVES_DATA).find(k => MOVES_DATA[k] === move)}!`);

        // Verificar precisión
        const accuracy = move.accuracy * (1 + attackerBuffs.accuracy * 0.1) * (1 - defenderBuffs.evasion * 0.1);
        if (Math.random() * 100 > accuracy) {
            this.log('¡El ataque falló!');
            return;
        }

        // Calcular daño
        if (move.power > 0) {
            const damage = this.calculateDamage(attacker, defender, move, attackerBuffs, defenderBuffs);
            defender.takeDamage(damage);
            this.log(`${defender.name} recibió ${damage} de daño!`);

            // Efectividad
            const effectiveness = this.getEffectiveness(move.type, defender.type);
            if (effectiveness > 1) this.log('¡Es super efectivo!');
            else if (effectiveness < 1) this.log('No es muy efectivo...');

            // Animación de daño
            this.createDamageAnimation(defender === this.playerPokimon ? 'player' : 'enemy', damage);
        }

        // Aplicar efectos
        this.applyMoveEffect(move, attacker, defender, attackerBuffs, defenderBuffs);
    }

    calculateDamage(attacker, defender, move, attackerBuffs, defenderBuffs) {
        const attack = this.calculateStat(attacker, 'attack', attackerBuffs.attack);
        const defense = this.calculateStat(defender, 'defense', defenderBuffs.defense);

        // Fórmula de daño
        let damage = Math.floor(((2 * attacker.level / 5 + 2) * move.power * (attack / defense)) / 50) + 2;

        // STAB (Same Type Attack Bonus)
        if (move.type === attacker.type) {
            damage *= 1.5;
        }

        // Efectividad de tipo
        damage *= this.getEffectiveness(move.type, defender.type);

        // Crítico
        const critChance = move.effect === 'crit_high' ? 0.25 : 0.0625;
        if (Math.random() < critChance) {
            damage *= 2;
            this.log('¡Golpe crítico!');
        }

        // Variación aleatoria (85% - 100%)
        damage *= (0.85 + Math.random() * 0.15);

        // Modificador de clima
        if (this.weather === 'rainy' && move.type === 'CYBER') damage *= 1.2;
        if (this.weather === 'sunny' && move.type === 'MYTH') damage *= 1.2;

        return Math.max(1, Math.floor(damage));
    }

    calculateStat(pokimon, stat, buffStage) {
        let value = pokimon.stats[stat];

        // Aplicar buffs/debuffs
        if (buffStage > 0) {
            value *= (1 + buffStage * 0.5);
        } else if (buffStage < 0) {
            value *= (1 / (1 + Math.abs(buffStage) * 0.5));
        }

        return Math.floor(value);
    }

    getEffectiveness(attackType, defenseType) {
        const type = TYPES[attackType];
        if (!type) return 1.0;

        if (type.strong.includes(defenseType)) return 1.5;
        if (type.weak.includes(defenseType)) return 0.67;
        return 1.0;
    }

    applyMoveEffect(move, attacker, defender, attackerBuffs, defenderBuffs) {
        if (!move.effect) return;

        const effects = {
            heal: () => {
                const healAmount = Math.floor(attacker.stats.hp * 0.5);
                attacker.currentHP = Math.min(attacker.stats.hp, attacker.currentHP + healAmount);
                this.log(`${attacker.name} recuperó ${healAmount} HP!`);
            },
            buff: () => {
                attackerBuffs.attack += 1;
                attackerBuffs.defense += 1;
                this.log(`¡Las estadísticas de ${attacker.name} aumentaron!`);
            },
            defense: () => {
                attackerBuffs.defense += 2;
                this.log(`¡La defensa de ${attacker.name} aumentó!`);
            },
            attack_buff: () => {
                attackerBuffs.attack += 2;
                this.log(`¡El ataque de ${attacker.name} aumentó!`);
            },
            speed_buff: () => {
                attackerBuffs.speed += 2;
                this.log(`¡La velocidad de ${attacker.name} aumentó!`);
            },
            paralyze: () => {
                if (Math.random() < 0.3 && !defender.statusEffects.includes('paralyze')) {
                    defender.statusEffects.push('paralyze');
                    this.log(`${defender.name} está paralizado!`);
                }
            },
            burn: () => {
                if (Math.random() < 0.3 && !defender.statusEffects.includes('burn')) {
                    defender.statusEffects.push('burn');
                    this.log(`${defender.name} está quemado!`);
                }
            },
            poison: () => {
                if (Math.random() < 0.3 && !defender.statusEffects.includes('poison')) {
                    defender.statusEffects.push('poison');
                    this.log(`${defender.name} está envenenado!`);
                }
            },
            confuse: () => {
                if (Math.random() < 0.4 && !defender.statusEffects.includes('confuse')) {
                    defender.statusEffects.push('confuse');
                    this.log(`${defender.name} está confundido!`);
                }
            },
            sleep: () => {
                if (Math.random() < 0.5 && !defender.statusEffects.includes('sleep')) {
                    defender.statusEffects.push('sleep');
                    this.log(`${defender.name} se durmió!`);
                }
            }
        };

        if (effects[move.effect]) {
            effects[move.effect]();
        }
    }

    enemyTurn() {
        // IA simple: elegir movimiento aleatorio
        const enemyMoves = this.enemyPokimon.moves.filter(moveName => {
            const move = MOVES_DATA[moveName];
            return this.enemyPokimon.currentEnergy >= move.energy;
        });

        if (enemyMoves.length === 0) {
            this.log(`${this.enemyPokimon.name} no puede atacar!`);
            this.enemyPokimon.currentEnergy = Math.min(
                this.enemyPokimon.stats.energy,
                this.enemyPokimon.currentEnergy + 20
            );
            return;
        }

        const moveName = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
        const move = MOVES_DATA[moveName];

        this.enemyPokimon.currentEnergy -= move.energy;
        this.executeMove(this.enemyPokimon, this.playerPokimon, move, this.enemyBuffs, this.playerBuffs);
    }

    useItem(itemKey) {
        this.hideMenus();

        const item = ITEMS_DATA[itemKey];

        if (item.type === 'pokiball') {
            this.attemptCatch(itemKey);
        } else if (item.type === 'healing') {
            const result = game.player.inventory.useItem(itemKey, this.playerPokimon);
            this.log(result.message);
            if (result.success) {
                this.enemyTurn();
                this.updateUI();
            }
        }
    }

    attemptCatch(ballType) {
        if (!this.isWild) {
            this.log('¡No puedes capturar Pokimon de otros entrenadores!');
            return;
        }

        const ball = ITEMS_DATA[ballType];
        if (!game.player.inventory.removeItem(ballType)) {
            this.log('¡No tienes ese tipo de Pokiball!');
            return;
        }

        this.log(`¡Usaste ${ball.name}!`);

        // Calcular probabilidad de captura
        const hpFactor = (1 - this.enemyPokimon.currentHP / this.enemyPokimon.stats.hp);
        const rarityFactor = { común: 1, 'poco común': 0.8, raro: 0.6, épico: 0.4, legendario: 0.2 }[this.enemyPokimon.rarity] || 1;
        const catchRate = POKIMON_DATA[this.enemyPokimon.species].catchRate;

        const probability = ((catchRate * ball.catchRate * hpFactor * rarityFactor) / 255) * 100;

        // Animación de captura
        this.createCaptureAnimation();

        setTimeout(() => {
            if (Math.random() * 100 < probability || ball.catchRate === 255) {
                this.log(`¡${this.enemyPokimon.name} fue capturado!`);
                game.player.addPokimon(this.enemyPokimon);

                // Actualizar misiones
                game.updateQuests('catch', this.enemyPokimon.species);

                setTimeout(() => this.endBattle(true), 2000);
            } else {
                this.log(`¡Oh no! ${this.enemyPokimon.name} escapó!`);
                this.enemyTurn();
                this.updateUI();
            }
        }, 2000);
    }

    switchPokimon(index) {
        this.hideMenus();

        const newPokimon = game.player.team[index];
        this.log(`¡${this.playerPokimon.name}, regresa!`);
        this.playerPokimon = newPokimon;
        this.log(`¡Adelante, ${this.playerPokimon.name}!`);

        this.enemyTurn();
        this.updateUI();
    }

    tryRun() {
        if (!this.isWild) {
            this.log('¡No puedes huir de un combate de entrenadores!');
            return;
        }

        const playerSpeed = this.playerPokimon.stats.speed;
        const enemySpeed = this.enemyPokimon.stats.speed;
        const escapeChance = (playerSpeed / enemySpeed) * 100;

        if (Math.random() * 100 < escapeChance || escapeChance > 100) {
            this.log('¡Escapaste con éxito!');
            setTimeout(() => this.endBattle(false), 1000);
        } else {
            this.log('¡No pudiste escapar!');
            this.enemyTurn();
            this.updateUI();
        }
    }

    checkBattleEnd() {
        if (this.enemyPokimon.isFainted) {
            this.log(`¡${this.enemyPokimon.name} se debilitó!`);

            // Ganar experiencia
            const expGain = Math.floor((this.enemyPokimon.level * 50) * (this.isWild ? 1 : 1.5));
            this.playerPokimon.gainExp(expGain);
            this.log(`${this.playerPokimon.name} ganó ${expGain} EXP!`);

            // Dinero
            const moneyGain = this.enemyPokimon.level * 25;
            game.player.money += moneyGain;
            this.log(`¡Ganaste ${moneyGain} créditos!`);

            // Actualizar estadísticas
            game.player.stats.battles++;
            game.player.stats.victories++;

            // Actualizar misiones
            game.updateQuests('battle_win');

            setTimeout(() => this.endBattle(true), 3000);
            return true;
        }

        if (this.playerPokimon.isFainted) {
            this.log(`¡${this.playerPokimon.name} se debilitó!`);

            // Verificar si hay más Pokimon disponibles
            const nextPokimon = game.player.getActivePokimon();
            if (nextPokimon) {
                this.log('Elige el siguiente Pokimon...');
                this.showTeam();
            } else {
                this.log('¡Todos tus Pokimon se debilitaron!');
                game.player.stats.battles++;
                setTimeout(() => this.endBattle(false), 2000);
            }
            return true;
        }

        return false;
    }

    endBattle(won) {
        if (won) {
            game.showNotification('¡Victoria!', 'success');
        } else {
            game.showNotification('Batalla terminada', 'info');
        }

        game.switchScreen('game');
    }

    createDamageAnimation(side, damage) {
        const sprite = document.getElementById(`${side}Sprite`);
        sprite.style.animation = 'none';
        setTimeout(() => {
            sprite.style.animation = '';
        }, 10);

        // Crear partícula de daño
        const particle = document.createElement('div');
        particle.textContent = `-${damage}`;
        particle.style.position = 'absolute';
        particle.style.color = '#ff0055';
        particle.style.fontWeight = 'bold';
        particle.style.fontSize = '2rem';
        particle.style.animation = 'particle-rise 1s ease-out forwards';

        const spriteRect = sprite.getBoundingClientRect();
        particle.style.left = spriteRect.left + 'px';
        particle.style.top = spriteRect.top + 'px';

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }

    createCaptureAnimation() {
        const enemySprite = document.getElementById('enemySprite');
        enemySprite.style.animation = 'shake 0.5s ease-in-out 3';
    }
}

// Añadir animación de sacudida al CSS dinámicamente
if (!document.getElementById('battle-animations')) {
    const style = document.createElement('style');
    style.id = 'battle-animations';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}
