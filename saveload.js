function save() {
    localStorage.setItem("athsave", JSON.stringify(game))
    sendNotification("Saved game")
}

function load() {
    let s = localStorage.getItem("athsave")
    if (s === null) return false
    let unpacked_save = JSON.parse(s)
    if (unpacked_save === null) return false

    sendNotification("Loaded game")
    game = unpacked_save
    game.enemy = null
    game.action = "world"
}

function reset() {
    if (confirm("Are you sure you want to reset?")) {
        game = null
        save()
        document.location.reload()
    }
}