const cultivator = {
    progress: 0,
    health: 100,
    qi: 100,
    action: "none"
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

// Functionals

function setProgress(id, width) {
    if (isNaN(width)) width = 0;
    width = Math.min(Math.max(width, 0), 1)
    document.getElementById(id).style.transform = `scale(${width}, 1)`
}

function setText(id, content) {
    document.getElementById(id).textContent = content
}

// Main Loop

t = Date.now()
setInterval(() => {
    //cultivator.progress += progressCultivation() * (Date.now() - t) / 1000
    let maxhp = getMaxHealth()
    setProgress("health-bar-inner", cultivator.health / maxhp)
    setText("health-bar-text", `${cultivator.health} / ${maxhp}`)

    t = Date.now()
}, 50)