CURRENT_TAB = "world"
ALL_TABS = ["world", "cultivation", "cultivation-in-progress", "alchemy"]

function switchTab(shown) {
    for (let tab of ALL_TABS) {
        document.getElementById(`${tab}-tab`).style.display = "none";
    }

    document.getElementById(`${shown}-tab`).style.display = "block";
}