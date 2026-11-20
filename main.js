const game = {
    progress: 0,
    health: 100,
    qi: 100,
    essence: 0,
    action: "none"
}

const STAGE_REQ = [
    // Qi Condense
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100
]

const STAGE_NAMES = [
    "Mortal Body", "Qi Condensation Onefold", "Qi Condensation Twofold", "Qi Condensation Threefold", "Qi Condensation Fourfold", "Qi Condensation Fivefold", "Qi Condensation Sixfold", "Qi Condensation Sevenfold", "Qi Condensation Eightfold", "Qi Condensation Ninefold", "Qi Condensation Pinnacle", 
]

const STAGE_REQ_TOTAL = []

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
    return maxhp
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
    game.cultivating = true
}

function stopCultivate() {
    switchTab("cultivation")
    game.cultivating = false
}

// Main Loop

t = Date.now()
setInterval(() => {
    let tick_length = (Date.now() - t) / 1000
    let maxhp = getMaxHealth()
    let maxessence = getMaxEssence()
    setProgress("health-bar-inner", game.health / maxhp)
    setProgress("essence-bar-inner", game.essence / maxessence)
    setText("health-bar-text", `HP: ${game.health.toFixed(0)} / ${maxhp.toFixed(0)}`)
    setText("essence-bar-text", `Essence: ${game.essence.toFixed(0)} / ${maxessence.toFixed(0)}`)

    if (game.cultivating) {
        game.progress += progressCultivation() * tick_length
    }

    game.essence = Math.min(maxessence, game.essence + maxessence * getEssenceRegen())

    let current_stage = getCurrentStage(game.progress)
    setProgress("qi-bar-inner", (game.progress - (STAGE_REQ_TOTAL[current_stage - 1] ?? 0)) / (STAGE_REQ[current_stage]))
    setText("qi-bar-text", ((current_stage + 1) >= STAGE_REQ.length) ? `${game.progress.toFixed(0)} / ???` : `${(game.progress - (STAGE_REQ_TOTAL[current_stage - 1] ?? 0)).toFixed(0)} / ${STAGE_REQ[current_stage].toFixed(0)}`)
    setText("qi-current-stage", `Your current stage: ${STAGE_NAMES[current_stage]}`)
    t = Date.now()
}, 50)