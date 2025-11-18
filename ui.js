// Sistema de UI y Menús

const UI = {
    showModal(title, content) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `<h2>${title}</h2>${content}`;
        modal.classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('modal').classList.add('hidden');
    },

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.remove('hidden');

        const colors = {
            success: '#00ff88',
            error: '#ff0055',
            warning: '#ffaa00',
            info: '#00ffff'
        };

        const textColors = {
            success: '#000',
            error: '#fff',
            warning: '#000',
            info: '#000'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.style.color = textColors[type] || textColors.info;

        // Añadir icono
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: '💡'
        };

        notification.textContent = `${icons[type] || icons.info} ${message}`;

        setTimeout(() => {
            notification.classList.add('hidden');
        }, duration);
    },

    updateHUD(player, world) {
        document.getElementById('playerName').textContent = player.name;
        document.getElementById('playerMoney').textContent = `💎 ${player.money}`;

        const gameHour = Math.floor(world.time / 10) % 24;
        const timeStr = `${String(gameHour).padStart(2, '0')}:${String(Math.floor(world.time % 10) * 6).padStart(2, '0')}`;
        document.getElementById('playerTime').textContent = `⏰ ${timeStr}`;

        const weatherEmojis = { sunny: '☀️', rainy: '🌧️', stormy: '⛈️' };
        const weatherNames = { sunny: 'Soleado', rainy: 'Lluvioso', stormy: 'Tormenta' };
        document.getElementById('weatherInfo').textContent = `${weatherEmojis[world.weather]} ${weatherNames[world.weather]}`;

        // Actualizar preview del equipo
        this.updateTeamPreview(player);
    },

    updateTeamPreview(player) {
        const preview = document.getElementById('teamPreview');
        preview.innerHTML = '';

        player.team.forEach((pokimon, index) => {
            const div = document.createElement('div');
            div.className = 'team-preview-pokimon';
            if (pokimon.isFainted) div.classList.add('fainted');
            div.textContent = pokimon.emoji;
            div.title = `${pokimon.name} Nv.${pokimon.level} - ${pokimon.currentHP}/${pokimon.stats.hp} HP`;

            div.onclick = () => {
                UI.showPokimonDetails(pokimon, index);
            };

            preview.appendChild(div);
        });
    },

    showPokimonDetails(pokimon, index) {
        const hpPercent = Math.floor((pokimon.currentHP / pokimon.stats.hp) * 100);
        const expPercent = Math.floor((pokimon.exp / pokimon.expToNext) * 100);

        let content = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 5rem;">${pokimon.emoji}</div>
                <h3>${pokimon.name}</h3>
                <p style="color: var(--primary);">Nivel ${pokimon.level} | ${TYPES[pokimon.type].name}</p>
                <p style="opacity: 0.8;">${pokimon.description}</p>

                <div style="margin: 1.5rem 0;">
                    <h4>Estadísticas</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;">
                        <div>HP: ${pokimon.currentHP}/${pokimon.stats.hp} (${hpPercent}%)</div>
                        <div>Ataque: ${pokimon.stats.attack}</div>
                        <div>Defensa: ${pokimon.stats.defense}</div>
                        <div>Velocidad: ${pokimon.stats.speed}</div>
                        <div>Energía: ${pokimon.currentEnergy}/${pokimon.stats.energy}</div>
                        <div>Rareza: ${pokimon.rarity}</div>
                    </div>
                </div>

                <div style="margin: 1.5rem 0;">
                    <h4>Experiencia</h4>
                    <div style="background: rgba(0,0,0,0.5); height: 20px; border-radius: 10px; overflow: hidden;">
                        <div style="background: var(--primary); height: 100%; width: ${expPercent}%;"></div>
                    </div>
                    <p>${pokimon.exp} / ${pokimon.expToNext} EXP</p>
                </div>

                <div style="margin: 1.5rem 0;">
                    <h4>Movimientos</h4>
                    <div style="display: grid; gap: 0.5rem; margin-top: 1rem;">
                        ${pokimon.moves.map(moveName => {
                            const move = MOVES_DATA[moveName];
                            return `
                                <div style="background: rgba(0,255,255,0.1); padding: 0.5rem; border-radius: 5px; border: 1px solid var(--primary);">
                                    <strong>${moveName}</strong> - ${move.type}<br>
                                    <small>Poder: ${move.power || '-'} | Precisión: ${move.accuracy}% | Energía: ${move.energy}</small>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                ${pokimon.evolution ? `
                    <div style="margin: 1.5rem 0; padding: 1rem; background: rgba(255,255,0,0.1); border-radius: 10px; border: 2px solid var(--accent);">
                        <p>⚡ Evoluciona a <strong>${pokimon.evolution.into}</strong> al nivel ${pokimon.evolution.level}</p>
                    </div>
                ` : ''}

                <div style="display: flex; gap: 1rem; margin-top: 2rem; justify-content: center;">
                    <button class="menu-btn" onclick="UI.healPokimon(${index})">Curar (Poción)</button>
                    ${pokimon.isFainted ? `<button class="menu-btn" onclick="UI.revivePokimon(${index})">Revivir</button>` : ''}
                    ${pokimon.evolution && pokimon.level >= pokimon.evolution.level ?
                        `<button class="menu-btn" onclick="UI.evolvePokimon(${index})">Evolucionar</button>` : ''}
                </div>
            </div>
        `;

        UI.showModal(pokimon.name, content);
    },

    healPokimon(index) {
        const pokimon = game.player.team[index];
        if (pokimon.isFainted) {
            UI.showNotification('Este Pokimon está debilitado. Usa un Revivir.', 'warning');
            return;
        }

        const result = game.player.inventory.useItem('POTION', pokimon);
        UI.showNotification(result.message, result.success ? 'success' : 'error');

        if (result.success) {
            UI.closeModal();
        }
    },

    revivePokimon(index) {
        const pokimon = game.player.team[index];
        const result = game.player.inventory.useItem('REVIVE', pokimon);
        UI.showNotification(result.message, result.success ? 'success' : 'error');

        if (result.success) {
            UI.closeModal();
        }
    },

    evolvePokimon(index) {
        const pokimon = game.player.team[index];
        if (!pokimon.evolution || pokimon.level < pokimon.evolution.level) {
            UI.showNotification('No puede evolucionar aún.', 'warning');
            return;
        }

        const newSpecies = pokimon.evolution.into;
        const oldName = pokimon.name;

        // Crear nueva instancia evolucionada
        const evolved = new Pokimon(newSpecies, pokimon.level);
        evolved.currentHP = pokimon.currentHP;
        evolved.currentEnergy = pokimon.currentEnergy;
        evolved.exp = pokimon.exp;
        evolved.ivs = pokimon.ivs;

        game.player.team[index] = evolved;
        game.player.pokedex.add(newSpecies);

        UI.showNotification(`¡${oldName} evolucionó a ${evolved.name}!`, 'success');
        UI.closeModal();

        // Actualizar misiones
        game.updateQuests('evolve');

        setTimeout(() => {
            UI.showPokimonDetails(evolved, index);
        }, 500);
    },

    showPokedex() {
        let content = '<div style="padding: 1rem;"><h3>POKIDEX - Criaturas Registradas</h3>';

        content += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem;">';

        for (const [key, data] of Object.entries(POKIMON_DATA)) {
            const caught = game.player.pokedex.has(key);
            const div = `
                <div style="padding: 1rem; background: ${caught ? 'rgba(0,255,255,0.2)' : 'rgba(0,0,0,0.3)'};
                            border: 2px solid ${caught ? 'var(--primary)' : '#555'};
                            border-radius: 10px; text-align: center; cursor: ${caught ? 'pointer' : 'default'};"
                     ${caught ? `onclick="UI.showPokedexEntry('${key}')"` : ''}>
                    <div style="font-size: 3rem;">${caught ? data.emoji : '❓'}</div>
                    <div style="font-weight: 700;">#${data.id.toString().padStart(3, '0')}</div>
                    <div>${caught ? data.name : '???'}</div>
                    ${caught ? `<div style="font-size: 0.8rem; color: ${TYPES[data.type].color};">${TYPES[data.type].name}</div>` : ''}
                </div>
            `;
            content += div;
        }

        content += '</div>';
        content += `<p style="margin-top: 2rem; text-align: center;">Capturados: ${game.player.pokedex.size} / ${Object.keys(POKIMON_DATA).length}</p>`;
        content += '</div>';

        UI.showModal('POKIDEX', content);
    },

    showPokedexEntry(speciesKey) {
        const data = POKIMON_DATA[speciesKey];

        let content = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 5rem;">${data.emoji}</div>
                <h3>#${data.id.toString().padStart(3, '0')} - ${data.name}</h3>
                <p style="color: ${TYPES[data.type].color}; font-size: 1.2rem;">${TYPES[data.type].name}</p>
                <p style="opacity: 0.8; margin: 1rem 0;">${data.description}</p>

                <div style="margin: 1.5rem 0;">
                    <h4>Estadísticas Base</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 1rem;">
                        <div>HP: ${data.baseStats.hp}</div>
                        <div>Ataque: ${data.baseStats.attack}</div>
                        <div>Defensa: ${data.baseStats.defense}</div>
                        <div>Velocidad: ${data.baseStats.speed}</div>
                        <div>Energía: ${data.baseStats.energy}</div>
                        <div>Rareza: ${data.rarity}</div>
                    </div>
                </div>

                <div style="margin: 1.5rem 0;">
                    <h4>Movimientos</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 1rem;">
                        ${data.moves.map(move => `<span style="padding: 0.3rem 0.8rem; background: rgba(0,255,255,0.2); border-radius: 5px;">${move}</span>`).join('')}
                    </div>
                </div>

                ${data.evolution ? `
                    <div style="margin: 1.5rem 0; padding: 1rem; background: rgba(255,255,0,0.1); border-radius: 10px;">
                        <p>Evoluciona a <strong>${data.evolution.into}</strong> al nivel ${data.evolution.level}</p>
                    </div>
                ` : ''}
            </div>
        `;

        UI.showModal(data.name, content);
    },

    showInventory() {
        let content = '<div style="padding: 1rem;"><h3>INVENTARIO</h3>';

        const categories = {
            pokiball: '🎾 Pokiballs',
            healing: '💊 Curación',
            status: '✨ Estado',
            battle: '⚔️ Batalla',
            special: '⭐ Especiales',
            material: '🔧 Materiales'
        };

        for (const [type, title] of Object.entries(categories)) {
            content += `<h4 style="margin-top: 1.5rem; color: var(--primary);">${title}</h4>`;
            content += '<div style="display: grid; gap: 0.5rem; margin-top: 0.5rem;">';

            let hasItems = false;
            for (const [itemKey, data] of Object.entries(ITEMS_DATA)) {
                if (data.type === type) {
                    const count = game.player.inventory.getItemCount(itemKey);
                    if (count > 0) {
                        hasItems = true;
                        content += `
                            <div style="display: flex; justify-content: space-between; align-items: center;
                                        padding: 0.8rem; background: rgba(0,255,255,0.1); border-radius: 5px;
                                        border: 1px solid var(--primary);">
                                <div>
                                    <strong>${data.emoji} ${data.name}</strong> x${count}<br>
                                    <small style="opacity: 0.8;">${data.description}</small>
                                </div>
                                <div style="display: flex; gap: 0.5rem;">
                                    ${type === 'healing' || type === 'status' ?
                                        `<button class="hud-btn" onclick="UI.useItemFromInventory('${itemKey}')">Usar</button>` : ''}
                                    <button class="hud-btn" onclick="UI.sellItem('${itemKey}')">Vender</button>
                                </div>
                            </div>
                        `;
                    }
                }
            }

            if (!hasItems) {
                content += '<p style="opacity: 0.6;">No hay items en esta categoría</p>';
            }

            content += '</div>';
        }

        content += '</div>';
        UI.showModal('INVENTARIO', content);
    },

    useItemFromInventory(itemKey) {
        // Mostrar selector de Pokimon
        let content = '<div style="padding: 1rem;"><h3>Selecciona un Pokimon</h3>';
        content += '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';

        game.player.team.forEach((pokimon, index) => {
            content += `
                <button class="menu-btn" onclick="UI.applyItemToPokimon('${itemKey}', ${index})"
                        style="text-align: left; padding: 1rem;">
                    ${pokimon.emoji} ${pokimon.name} Nv.${pokimon.level}<br>
                    <small>HP: ${pokimon.currentHP}/${pokimon.stats.hp} ${pokimon.isFainted ? '💀' : ''}</small>
                </button>
            `;
        });

        content += '</div></div>';
        UI.showModal('Usar Item', content);
    },

    applyItemToPokimon(itemKey, index) {
        const pokimon = game.player.team[index];
        const result = game.player.inventory.useItem(itemKey, pokimon);

        UI.showNotification(result.message, result.success ? 'success' : 'error');
        UI.closeModal();
    },

    sellItem(itemKey) {
        const item = ITEMS_DATA[itemKey];
        const sellPrice = Math.floor(item.price * 0.5);

        if (confirm(`¿Vender ${item.name} por ${sellPrice} créditos?`)) {
            if (game.player.inventory.removeItem(itemKey)) {
                game.player.money += sellPrice;
                UI.showNotification(`Vendiste ${item.name} por ${sellPrice} créditos.`, 'success');
                UI.showInventory(); // Refrescar
            }
        }
    },

    showCrafting() {
        let content = '<div style="padding: 1rem;"><h3>CRAFTEO DE ITEMS</h3>';
        content += '<p style="opacity: 0.8; margin-bottom: 1rem;">Combina materiales para crear items poderosos</p>';

        content += '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';

        for (const [itemKey, data] of Object.entries(ITEMS_DATA)) {
            if (data.craftable && data.recipe) {
                const canCraft = game.player.inventory.canCraft(itemKey);

                content += `
                    <div style="padding: 1rem; background: ${canCraft ? 'rgba(0,255,0,0.1)' : 'rgba(0,0,0,0.3)'};
                                border: 2px solid ${canCraft ? 'var(--success)' : '#555'}; border-radius: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${data.emoji} ${data.name}</strong><br>
                                <small style="opacity: 0.8;">${data.description}</small><br>
                                <div style="margin-top: 0.5rem;">
                                    <strong>Requiere:</strong>
                                    ${Object.entries(data.recipe).map(([mat, qty]) => {
                                        const matData = ITEMS_DATA[mat];
                                        const has = game.player.inventory.getItemCount(mat);
                                        const hasEnough = has >= qty;
                                        return `<span style="color: ${hasEnough ? 'var(--success)' : 'var(--danger)'};">
                                            ${matData.emoji} ${matData.name} x${qty} (${has})
                                        </span>`;
                                    }).join(' | ')}
                                </div>
                            </div>
                            <button class="hud-btn" onclick="UI.craftItem('${itemKey}')" ${!canCraft ? 'disabled' : ''}>
                                Craftear
                            </button>
                        </div>
                    </div>
                `;
            }
        }

        content += '</div></div>';
        UI.showModal('CRAFTEO', content);
    },

    craftItem(itemKey) {
        if (game.player.inventory.craftItem(itemKey)) {
            const item = ITEMS_DATA[itemKey];
            UI.showNotification(`¡Creaste ${item.name}!`, 'success');
            UI.showCrafting(); // Refrescar
        } else {
            UI.showNotification('No tienes los materiales necesarios.', 'error');
        }
    },

    showShop() {
        let content = '<div style="padding: 1rem;"><h3>TIENDA</h3>';
        content += `<p style="color: var(--primary); margin-bottom: 1rem;">Dinero: 💎 ${game.player.money}</p>`;

        content += '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';

        const shopItems = ['POKIBALL', 'SUPERBALL', 'ULTRABALL', 'POTION', 'SUPER_POTION', 'HYPER_POTION',
                          'REVIVE', 'ANTIDOTE', 'AWAKENING', 'PARALYZE_HEAL', 'HERB', 'CYBER_FRAGMENT',
                          'TECH_CORE', 'MYTH_ESSENCE'];

        for (const itemKey of shopItems) {
            const item = ITEMS_DATA[itemKey];
            const canBuy = game.player.money >= item.price;

            content += `
                <div style="display: flex; justify-content: space-between; align-items: center;
                            padding: 1rem; background: rgba(0,255,255,0.1); border-radius: 5px;
                            border: 1px solid var(--primary);">
                    <div>
                        <strong>${item.emoji} ${item.name}</strong><br>
                        <small style="opacity: 0.8;">${item.description}</small><br>
                        <span style="color: var(--accent); font-weight: 700;">💎 ${item.price}</span>
                    </div>
                    <button class="hud-btn" onclick="UI.buyItem('${itemKey}')" ${!canBuy ? 'disabled' : ''}>
                        Comprar
                    </button>
                </div>
            `;
        }

        content += '</div></div>';
        UI.showModal('TIENDA', content);
    },

    buyItem(itemKey) {
        const item = ITEMS_DATA[itemKey];

        if (game.player.money >= item.price) {
            game.player.money -= item.price;
            game.player.inventory.addItem(itemKey, 1);
            UI.showNotification(`Compraste ${item.name} por ${item.price} créditos.`, 'success');
            UI.showShop(); // Refrescar
        } else {
            UI.showNotification('No tienes suficiente dinero.', 'error');
        }
    },

    showQuests() {
        let content = '<div style="padding: 1rem;"><h3>MISIONES</h3>';

        if (game.player.quests.length === 0) {
            content += '<p style="opacity: 0.8;">No hay misiones activas.</p>';
        } else {
            content += '<div style="display: grid; gap: 1rem; margin-top: 1rem;">';

            game.player.quests.forEach(quest => {
                const progress = quest.objectives.map(obj =>
                    `${obj.current}/${obj.goal} ${obj.type}`
                ).join(', ');

                content += `
                    <div style="padding: 1rem; background: ${quest.completed ? 'rgba(0,255,0,0.2)' : 'rgba(0,255,255,0.1)'};
                                border: 2px solid ${quest.completed ? 'var(--success)' : 'var(--primary)'};
                                border-radius: 10px;">
                        <h4>${quest.title} ${quest.completed ? '✅' : ''}</h4>
                        <p style="opacity: 0.8;">${quest.description}</p>
                        <p style="margin-top: 0.5rem;"><strong>Progreso:</strong> ${progress}</p>
                        <p><strong>Recompensas:</strong> ${quest.rewards.money ? `💎 ${quest.rewards.money}` : ''}</p>
                        ${quest.completed ?
                            `<button class="hud-btn" onclick="UI.claimQuest(${quest.id})" style="margin-top: 0.5rem;">Reclamar</button>`
                            : ''}
                    </div>
                `;
            });

            content += '</div>';
        }

        content += '</div>';
        UI.showModal('MISIONES', content);
    },

    claimQuest(questId) {
        const quest = game.player.quests.find(q => q.id === questId);
        if (quest && quest.claim(game.player)) {
            game.player.quests = game.player.quests.filter(q => q.id !== questId);
            UI.showNotification('¡Misión completada! Recompensas recibidas.', 'success');
            UI.showQuests(); // Refrescar
        }
    },

    showFusion() {
        let content = '<div style="padding: 1rem;">';
        content += '<h3>⚛️ FUSIÓN DE POKIMON</h3>';
        content += '<p style="opacity: 0.8; margin: 1rem 0;">Combina dos Pokimon para crear uno más poderoso. ¡Proceso irreversible!</p>';

        const fusionCores = game.player.inventory.getItemCount('FUSION_CORE');
        content += `<p style="color: var(--accent);">Núcleos de Fusión disponibles: ${fusionCores}</p>`;

        if (fusionCores === 0) {
            content += '<p style="color: var(--danger); margin: 1rem 0;">Necesitas un Núcleo de Fusión para fusionar Pokimon.</p>';
        }

        content += '<p style="margin: 1rem 0;">Esta característica estará disponible próximamente con más mecánicas.</p>';
        content += '</div>';

        UI.showModal('FUSIÓN', content);
    },

    showControls() {
        const content = `
            <div style="padding: 2rem; text-align: left;">
                <h3>CONTROLES DEL JUEGO</h3>
                <div style="margin: 1.5rem 0; line-height: 2;">
                    <h4 style="color: var(--primary); margin-top: 1rem;">Exploración:</h4>
                    <p>⬆️ ⬇️ ⬅️ ➡️ o WASD - Mover al personaje</p>
                    <p>ESPACIO - Interactuar con NPCs y objetos</p>

                    <h4 style="color: var(--primary); margin-top: 1rem;">Menús:</h4>
                    <p>M - Abrir menú principal</p>
                    <p>P - Abrir Pokidex</p>
                    <p>S - Guardar partida</p>
                    <p>ESC - Cerrar menú/ventana actual</p>

                    <h4 style="color: var(--primary); margin-top: 1rem;">Combate:</h4>
                    <p>Click en botones o teclas numéricas 1-4</p>
                    <p>ESC - Intentar huir (solo batallas salvajes)</p>

                    <h4 style="color: var(--primary); margin-top: 1rem;">Características Especiales:</h4>
                    <p>🌦️ Sistema de clima dinámico que afecta encuentros</p>
                    <p>🌙 Ciclo día/noche con spawns especiales</p>
                    <p>⚔️ Sistema de combate con efectividad de tipos</p>
                    <p>🎒 Sistema de crafteo de items</p>
                    <p>📜 Sistema de misiones con recompensas</p>
                    <p>⚛️ Sistema de fusión de Pokimon (próximamente)</p>
                </div>
            </div>
        `;

        UI.showModal('CONTROLES', content);
    }
};
