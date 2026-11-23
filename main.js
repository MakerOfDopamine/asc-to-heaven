let game = {
    progress: 0,
    health: 100,
    qi: 100,
    essence: 0,
    action: "none",
    enemy: null,
    attack_cd: 0,
    armor: 0,
    recovery: false,
    inventory: [
        // type * 100000 + tier * 10000 + amount (amount is capped to 9999)
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ],
    alchemy: [0, 0, 0, 0, 0],
    held: 0
}

const STAGE_REQ = [
    // Qi Condense
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100,

    // Foundation Establishment
    200, 300, 400, 500
]

const STAGE_NAMES = [
    "Mortal Body", "Qi Condensation Onefold", "Qi Condensation Twofold", "Qi Condensation Threefold", "Qi Condensation Fourfold", "Qi Condensation Fivefold", "Qi Condensation Sixfold", "Qi Condensation Sevenfold", "Qi Condensation Eightfold", "Qi Condensation Ninefold", "Qi Condensation Pinnacle",
    "Foundation Establishment Base", "Foundation Establishment Middle", "Foundation Establishment Upper", "Foundation Establishment Pinnacle" 
]

const STAGE_REQ_TOTAL = []

const PATHS = ["", "orb", "hide", "pill-cultivation", "pill-hp"]

let shifting = false

{
    let total = 0
    for (let s of STAGE_REQ) {
        total += s
        STAGE_REQ_TOTAL.push(total)
    }
}

// Calculatings

function progressCultivation() {
    let baseQi = 1
    return baseQi
}

function getMaxHealth() {
    let maxhp = 100
    maxhp *= 1.1 ** getCurrentStage(game.progress) 
    return Math.round(maxhp)
}

function getEssenceRegen() {
    let base = 0.01
    return base
}

function getMaxEssence() {
    return 10 + game.progress / 10
}

function getCurrentStage(progress) {
    let left = 0
    let right = STAGE_REQ_TOTAL.length

    while (left < right) {
        let guess = Math.floor((left + right) / 2)
        if (STAGE_REQ_TOTAL[guess] > progress) {
            right = guess
        } else {
            left = guess + 1
        }
    }

    return Math.min(left, STAGE_REQ_TOTAL.length - 1)
}

function getSpeed() {
    return 1 + getCurrentStage() * 0.02
}

// Functionals

function setProgress(id, width) {
    if (isNaN(width)) width = 0;
    width = Math.min(Math.max(width, 0), 1)
    document.getElementById(id).style.transform = `scale(${width}, 1)`
}

function setText(id, content) {
    document.getElementById(id).textContent = content
}

function startCultivate() {
    switchTab("cultivation-in-progress")
    game.action = "cultivation"
}

function stopCultivate() {
    switchTab("cultivation")
    game.action = "none"
}

function enterCombat() {
    switchTab("combat")
    game.action = "combat"
    game.recovery = false
}

function exitCombat() {
    switchTab("world")
    game.action = "world"
    game.enemy = null
}

function addDrops(mult, tier) {
    let base_drop_count = Math.round((getCurrentStage(game.progress) + 1) ** 1.3)
    let random_drop_multi = Math.random() * 0.5 + 0.75
    
    // Drop orbs
    let orbs_drop = Math.round(base_drop_count * random_drop_multi * mult)
    let remaining = orbs_drop
    for (let i = 0; i < 36; i++) {
        if (remaining == 0) break
        if (game.inventory[i] == 0) {
            // empty slot
            game.inventory[i] = (100000 + tier * 10000 + Math.min(remaining, 9999))
            remaining -= Math.min(remaining, 9999)
        } else if (Math.floor(game.inventory[i] / 100000) == 1 && Math.floor(game.inventory[i] / 10000) % 10 == tier && game.inventory[i] % 10000 != 9999) {
            // can add
            if (game.inventory[i] % 10000 + remaining < 9999) {
                // can add all into 1 slot
                game.inventory[i] += remaining
                remaining = 0
            } else {
                remaining -= (9999 - game.inventory[i] % 10000)
                game.inventory[i] += (9999 - game.inventory[i] % 10000)
            }
        }
    }
    if (remaining > 0) {
        sendNotification(`Your ${remaining} remaining Tier-${tier} monster orb has been destroyed because your inventory is full!`, 60000)
    }

    // Drop fur
    random_drop_multi = Math.random() * 0.5 + 0.75
    let hide_drop = Math.round(base_drop_count * random_drop_multi * mult)
    remaining = hide_drop
    for (let i = 0; i < 36; i++) {
        if (remaining == 0) break
        if (game.inventory[i] == 0) {
            // empty slot
            game.inventory[i] = (200000 + tier * 10000 + Math.min(remaining, 9999))
            remaining -= Math.min(remaining, 9999)
        } else if (Math.floor(game.inventory[i] / 100000) == 2 && Math.floor(game.inventory[i] / 10000) % 10 == tier && game.inventory[i] % 10000 != 9999) {
            // can add
            if (game.inventory[i] % 10000 + remaining < 9999) {
                // can add all into 1 slot
                game.inventory[i] += remaining
                remaining = 0
            } else {
                remaining -= (9999 - game.inventory[i] % 10000)
                game.inventory[i] += (9999 - game.inventory[i] % 10000)
            }
        }
    }
    if (remaining > 0) {
        sendNotification(`Your ${remaining} remaining Tier-${tier} monster hide has been destroyed because your inventory is full!`, 60000)
    }
}

function addPills(t, tier, n) {
    let remaining = n
    for (let i = 0; i < 36; i++) {
        if (remaining == 0) break
        if (game.inventory[i] == 0) {
            // empty slot
            game.inventory[i] = (200000 + 100000 * t + tier * 10000 + Math.min(remaining, 9999))
            remaining -= Math.min(remaining, 9999)
        } else if (Math.floor(game.inventory[i] / 100000) == (2 + t) && Math.floor(game.inventory[i] / 10000) % 10 == tier && game.inventory[i] % 10000 != 9999) {
            // can add
            if (game.inventory[i] % 10000 + remaining < 9999) {
                // can add all into 1 slot
                game.inventory[i] += remaining
                remaining = 0
            } else {
                remaining -= (9999 - game.inventory[i] % 10000)
                game.inventory[i] += (9999 - game.inventory[i] % 10000)
            }
        }
    }
    if (remaining > 0) {
        sendNotification(`Your ${remaining} remaining pills have been destroyed because your inventory is full!`, 60000)
    }
}

function renderInventory() {
    for (let row = 0; row < 4; row++) {
        for (let col = 1; col <= 8; col++) {
            if (game.inventory[row * 8 + col - 1] == 0) {
                document.getElementById(`combat-inventory-slot-${row}${col}`).innerHTML = ``
                document.getElementById(`alchemy-inventory-slot-${row}${col}`).innerHTML = ``
            } else {
                document.getElementById(`combat-inventory-slot-${row}${col}`).innerHTML = `
                    <img src="monster-${PATHS[Math.floor(game.inventory[row * 8 + col - 1] / 100000)]}-1.png" style="pointer-events: none;" draggable=false>
                    <p style="transform: translate(38px, -25px)">${game.inventory[row * 8 + col - 1] % 10000}</p>
                `
                document.getElementById(`alchemy-inventory-slot-${row}${col}`).innerHTML = `
                    <img src="monster-${PATHS[Math.floor(game.inventory[row * 8 + col - 1] / 100000)]}-1.png" style="pointer-events: none;" draggable=false>
                    <p style="transform: translate(38px, -25px)">${game.inventory[row * 8 + col - 1] % 10000}</p>
                `
            }
        }
    }

    for (let slot = 0; slot < 5; slot++) {
        if (game.alchemy[slot] == 0) {
            document.getElementById(`alchemy-slot-${slot}`).innerHTML = ``
        } else {
            document.getElementById(`alchemy-slot-${slot}`).innerHTML = `
                <img src="monster-${PATHS[Math.floor(game.alchemy[slot] / 100000)]}-1.png" style="pointer-events: none; width: 32px; height: 32px;" draggable=false>
                <p style="transform: translate(38px, -25px)">${game.alchemy[slot] % 10000}</p>
            `
        }
    }

    if (game.held == 0) {
        document.getElementById("cursor-item").innerHTML = ``
    } else {
        document.getElementById(`cursor-item`).innerHTML = `
            <img src="monster-${PATHS[Math.floor(game.held / 100000)]}-1.png" draggable=false>
            <p style="transform: translate(38px, -25px)">${game.held % 10000}</p>
        `
    }
}

function renderAlchemySuccess() {
    let total_orbs = 0
    let total_hides = 0

    for (let slot = 0; slot < 5; slot++) {
        if (game.alchemy[slot] == 0) {}
        else if (Math.floor(game.alchemy[slot] / 100000) == 1) {
            total_orbs += game.alchemy[slot] % 10000
        } else if (Math.floor(game.alchemy[slot] / 100000) == 2) {
            total_hides += game.alchemy[slot] % 10000
        } else {
            document.getElementById("alchemy-success-pct").innerHTML = "0"
            document.getElementById("alchemy-success-yld").innerHTML = "Invalid Recipe!"
            return
        }
    }
    
    if (total_hides == 0 && total_orbs == 0) {
        document.getElementById("alchemy-recipe").innerHTML = `Alchemize`
        document.getElementById("alchemy-success-pct").innerHTML = `-`
        document.getElementById("alchemy-success-yld").innerHTML = `-`
        return
    }

    if (total_orbs >= total_hides) {
        document.getElementById("alchemy-recipe").innerHTML = `Alchemize Cultivation Pills`
        document.getElementById("alchemy-success-pct").innerHTML = `${Math.round(50 + (50 * total_hides) / (total_hides + total_orbs))}%`
        document.getElementById("alchemy-success-yld").innerHTML = `${Math.round(0.75 * (total_orbs + 0.1 * total_hides))} ~ ${Math.round(1.25 * (total_orbs + 0.1 * total_hides))}`
    } else {
        document.getElementById("alchemy-recipe").innerHTML = `Alchemize HP Pills`
        document.getElementById("alchemy-success-pct").innerHTML = `${Math.round(50 + (50 * total_orbs) / (total_hides + total_orbs))}%`
        document.getElementById("alchemy-success-yld").innerHTML = `${Math.round(0.75 * (0.1 * total_orbs + total_hides))} ~ ${Math.round(1.25 * (0.1 * total_orbs + total_hides))}`
    }
}

function alchemize() {
    let orbs = 0
    let hides = 0

    for (let slot = 0; slot < 5; slot++) {
        if (game.alchemy[slot] == 0) {}
        else if (Math.floor(game.alchemy[slot] / 100000) == 1) {
            orbs += game.alchemy[slot] % 10000
        } else if (Math.floor(game.alchemy[slot] / 100000) == 2) {
            hides += game.alchemy[slot] % 10000
        } else {
            sendNotification("Invalid Recipe!")
            return
        }
    }

    if (orbs == 0 && hides == 0) {
        sendNotification("Invalid Recipe!")
        return
    }

    let prob_success = 0.5 + 0.5 * Math.min(orbs, hides) / (orbs + hides)
    if (Math.random() < prob_success) {
        if (orbs >= hides) {
            addPills(1, 1, Math.round((Math.random() * 0.5 + 0.75) * (0.1 * hides + orbs)))
        } else [
            addPills(2, 1, Math.round((Math.random() * 0.5 + 0.75) * (0.1 * orbs + hides)))
        ]
    } else {
        sendNotification("Your alchemy failed!")
    }

    game.alchemy = [0, 0, 0, 0, 0]
    renderInventory()
}

function use(slot) {
    if (game.inventory[slot] < 299999) {
        return
    } else {
        if (Math.floor(game.inventory[slot] / 100000) == 3) {
            game.inventory[slot] -= 1
            let effect = 15 * 1.5 ** (Math.floor(game.inventory[slot] / 10000) % 10 - 1)
            game.progress += effect
            if (game.inventory[slot] % 10000 == 0) {
                game.inventory[slot] = 0
            }
        } else {
            game.inventory[slot] -= 1
            let effect = 25 * 1.5 ** (Math.floor(game.inventory[slot] / 10000) % 10 - 1)
            game.health += effect
            if (game.inventory[slot] % 10000 == 0) {
                game.inventory[slot] = 0
            }
        }
    }

    renderInventory()
}

function clickSlot(row, col) {
    let slot = row * 8 + col
    if (game.held == 0) {
        if (game.inventory[slot] > 299999 && shifting) {
            use(slot)
        } else {
            // can pick up
            game.held = game.inventory[slot]
            game.inventory[slot] = 0
            renderInventory()
        }
    } else {
        if (game.inventory[slot] == 0) {
            // can put down
            if (shifting) {
                game.inventory[slot] = game.held - (game.held % 10000) + 1
                game.held -= 1
                if (game.held % 10000 == 0) {
                    game.held = 0
                }
            } else {
                game.inventory[slot] = game.held
                game.held = 0
            }
            renderInventory()
        } else if (Math.floor(game.held / 10000) != Math.floor(game.inventory[slot] / 10000)) {
            // different items
            let temp = game.held
            game.held = game.inventory[slot]
            game.inventory[slot] = temp
            renderInventory()
        } else {
            let max_putdown = Math.min(game.held % 10000, 9999 - game.inventory[slot] % 10000)
            if (shifting) max_putdown = 1
            game.held -= max_putdown
            game.inventory[slot] += max_putdown
            if (game.held % 10000 == 0) {
                game.held = 0
            }
            renderInventory()
        }
    }
}

function clickAlchemySlot(slot) {
    // this could be refactored in the future.
    if (game.held == 0) {
        // can pick up
        game.held = game.alchemy[slot]
        game.alchemy[slot] = 0
        renderInventory()
    } else {
        if (game.alchemy[slot] == 0) {
            // can put down
            if (shifting) {
                game.alchemy[slot] = game.held - (game.held % 10000) + 1
                game.held -= 1
                if (game.held % 10000 == 0) {
                    game.held = 0
                }
            } else {
                game.alchemy[slot] = game.held
                game.held = 0
            }
            renderInventory()
        } else if (Math.floor(game.held / 10000) != Math.floor(game.alchemy[slot] / 10000)) {
            // different items
            let temp = game.held
            game.held = game.alchemy[slot]
            game.alchemy[slot] = temp
            renderInventory()
        } else {
            let max_putdown = Math.min(game.held % 10000, 9999 - game.alchemy[slot] % 10000)
            if (shifting) max_putdown = 1
            game.held -= max_putdown
            game.alchemy[slot] += max_putdown
            if (game.held % 10000 == 0) {
                game.held = 0
            }
            renderInventory()
        }
    }
}

function resolveCombat(dt) {
    if (game.enemy == null) {
        if (Math.random() < 0.01) {
            game.enemy = generateRandomEnemy(getCurrentStage(game.progress) - Math.floor(Math.random() * 4 - 1))
        }
    } else {
        game.enemy.tick(dt)
        game.attack_cd = Math.min(game.attack_cd + dt, 1 / getSpeed())

        if (game.enemy.can_attack()) {
            game.health -= Math.max(game.enemy.damage - game.armor * (0.99 ** game.enemy.penetration), 0)
            game.enemy.attack_cd = 0
        }

        if (game.health <= 0) {
            exitCombat()
            game.recovery = true
        }

        if (Math.abs(game.attack_cd * getSpeed() - 1) < 1e-9) {
            let killed = game.enemy.take_damage(getCurrentStage(game.progress) + 3, 0)
            if (killed) {
                addDrops(game.enemy.rewards, 1)
                game.enemy = null
            }
            game.attack_cd = 0
        }
    }
}

function updateCombatUI() {
    let maxhp = getMaxHealth()
    let maxessence = getMaxEssence()
    let maxcd = 1 / getSpeed()

    setProgress("combat-c-health-bar-inner", game.health / maxhp)
    setProgress("combat-c-essence-bar-inner", game.essence / maxessence)
    setProgress("combat-c-cd-bar-inner", Math.min(1, game.attack_cd / maxcd))
    setText("combat-c-health-bar-text", `HP: ${game.health.toFixed(0)} / ${maxhp.toFixed(0)}`)
    setText("combat-c-essence-bar-text", `Essence: ${game.essence.toFixed(0)} / ${maxessence.toFixed(0)}`)

    if (game.enemy !== null) {
        setProgress("combat-e-health-bar-inner", game.enemy.health / game.enemy.maxhp)
        setProgress("combat-e-cd-bar-inner", Math.min(1, game.enemy.attack_cd * game.enemy.speed))
        setText("combat-e-health-bar-text", `HP: ${game.enemy.health.toFixed(0)} / ${game.enemy.maxhp.toFixed(0)}`)
        setText("enemy-names-section", game.enemy.name)
    } else {
        setProgress("combat-e-health-bar-inner", 1)
        setProgress("combat-e-cd-bar-inner", 0)
        setText("combat-e-health-bar-text", `HP: N/A`)
        setText("enemy-names-section", "Nothing yet...")
    }
}

function sendNotification(text, timeout = 5000) {
    const notifbox = document.createElement('div')
    const notif = document.createElement('div')
    notif.innerHTML = text
    notif.classList.add("notification-box")
    notifbox.classList.add("notification-box-outer")
    notifbox.appendChild(notif)
    document.getElementById('notifications-wrapper').appendChild(notifbox)

    setTimeout(() => requestAnimationFrame(() => {
        notifbox.style.right = "30px"
    }), 20)

    function clear() {
        requestAnimationFrame(() => {
            notifbox.style.transition = "right 0.3s cubic-bezier(0.75, 0.0, 0.5, 0.5), scale 0.3s cubic-bezier(0.75, 0.0, 0.5, 0.5)"
            notifbox.style.overflow = "hidden"
            notifbox.style.right = "-350px"
            /* this looks horrible anyways
            notifbox.style.height = notifbox.offsetHeight + "px" // css wdym you can't transition from auto just take the value when the transition happens??
            notifbox.offsetHeight // okay this thing is ai suggested because WHAT DO YOU MEAN ACCESSING THE VALUE CHANGES THE BEHAVIOR????
            notifbox.style.height = "0" 
            */
            notifbox.style.scale = "0" 

            setTimeout(() => {
                // wow great use of setTimeout
                // there is like a 90% chance there's a better way to do this
                document.getElementById('notifications-wrapper').removeChild(notifbox)
            }, 300)
        })
    }

    let dismiss = setTimeout(clear, timeout) // add custom notification timeout later? 

    notifbox.onclick = () => {
        clearTimeout(dismiss)
        clear()
    }
}

load()

// Main Loop

t = Date.now()
let last_stage = getCurrentStage(game.progress)
setInterval(() => {
    let tick_length = (Date.now() - t) / 1000
    let maxhp = getMaxHealth()
    let maxessence = getMaxEssence()
    setProgress("health-bar-inner", game.health / maxhp)
    setProgress("essence-bar-inner", game.essence / maxessence)
    setText("health-bar-text", `HP: ${game.health.toFixed(0)} / ${maxhp.toFixed(0)}`)
    setText("essence-bar-text", `Essence: ${game.essence.toFixed(0)} / ${maxessence.toFixed(0)}`)

    if (game.action == "cultivation") {
        game.progress += progressCultivation() * tick_length
    }
    
    if (game.recovery) {
        game.health = Math.min(game.health + maxhp * 0.01, maxhp)
        if (game.health == maxhp) game.recovery = false
    } else {
        game.health = Math.min(game.health + maxhp * 0.001, maxhp)
    }

    game.essence = Math.min(maxessence, game.essence + maxessence * getEssenceRegen())

    let current_stage = getCurrentStage(game.progress)
    setProgress("qi-bar-inner", (game.progress - (STAGE_REQ_TOTAL[current_stage - 1] ?? 0)) / (STAGE_REQ[current_stage]))
    setText("qi-bar-text", ((current_stage + 1) >= STAGE_REQ.length) ? `${game.progress.toFixed(0)} / ???` : `${(game.progress - (STAGE_REQ_TOTAL[current_stage - 1] ?? 0)).toFixed(0)} / ${STAGE_REQ[current_stage].toFixed(0)}`)
    setProgress("qi-bar-menu-inner", (game.progress - (STAGE_REQ_TOTAL[current_stage - 1] ?? 0)) / (STAGE_REQ[current_stage]))
    setText("qi-bar-menu-text", ((current_stage + 1) >= STAGE_REQ.length) ? `${game.progress.toFixed(0)} / ???` : `${(game.progress - (STAGE_REQ_TOTAL[current_stage - 1] ?? 0)).toFixed(0)} / ${STAGE_REQ[current_stage].toFixed(0)}`)
    setText("qi-current-stage", `Your current stage: ${STAGE_NAMES[current_stage]}`)

    if (game.action == "combat") {
        resolveCombat(tick_length)
        updateCombatUI()
    }

    renderInventory()
    renderAlchemySuccess()

    if (current_stage != last_stage) {
        last_stage = current_stage
        sendNotification(`You broke through to ${STAGE_NAMES[current_stage]}!`)
    }
    t = Date.now()
}, 50)

setInterval(() => {
    save()
}, 15000)

window.addEventListener("mousemove", (e) => {
    document.getElementById("cursor-item").style.transform = `translate(${e.clientX - 36}px, ${e.clientY - 36}px)`
})

window.addEventListener("mousedown", (e) => {
    if (shifting) e.preventDefault()
})

window.addEventListener("keydown", (e) => {
    if (e.shiftKey) {
        shifting = true
    }
})

window.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
        shifting = false
    }
})