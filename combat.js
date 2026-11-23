class Enemy {
    constructor(name, hp = 30, damage = 5, armor = 0, penetration = 0, speed = 1, evade = 0, rewards = 1) {
        this.name = name
        this.health = hp
        this.maxhp = hp
        this.damage = damage
        this.armor = armor
        this.penetration = penetration
        this.speed = speed
        this.evade = evade
        this.rewards = rewards

        this.attack_cd = 0
    }

    take_damage(val, ap) {
        this.health -= Math.round((val - this.armor * (0.99 ** ap)) * 10) / 10
        if (this.health <= 0) {
            return 1
        }

        return 0
    }

    perturb_self() {
        this.health *= Math.random()*0.5+0.75
        this.health = Math.round(this.health * 10) / 10
        this.maxhp = this.health
        this.damage *= Math.random()*0.2+0.9
        this.damage = Math.round(this.damage * 10) / 10
        this.armor *= Math.random()*0.2+0.9
        this.armor = Math.round(this.armor * 10) / 10
        this.penetration *= Math.random()*0.1+0.95
        this.penetration = Math.round(this.penetration * 10) / 10
        this.speed *= Math.random()*0.1+0.95
        this.speed = Math.round(this.speed * 100) / 100
        
        if (Math.random() < 0.1) {
            this.evade = Math.round(Math.random() * 0.05 * 100) / 100
        }
        this.rewards += Math.random()*0.1+0.95
    }

    tick(dt) {
        this.attack_cd = Math.min(this.attack_cd + dt, 1 / this.speed)
    }

    can_attack() {
        return Math.abs(this.attack_cd - (1 / this.speed)) < 1e-9
    }
}

const ENEMY_TEMPLATES_NUM = [
    // [hp, damage, armor, penetration, speed]
    // Qi Condensation
    [10, 5, 0, 0, 1],
    [15, 6, 0, 0, 1.01],
    [20, 7, 1, 1, 1.02],
    [25, 8, 1, 1, 1.03],
    [30, 9, 2, 2, 1.04],
    [30, 10, 2, 2, 1.05],
    [35, 11, 3, 2, 1.06],
    [45, 12, 3, 3, 1.07],
    [50, 13, 4, 3, 1.08],
    [60, 15, 5, 3, 1.10],
    
    // Foundation Building
    [75, 17, 6, 4, 1.11],
    [90, 20, 7, 5, 1.13],
    [120, 22, 8, 6, 1.14],
    [150, 25, 10, 7, 1.15],

    // Placeholders
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],

    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15],
    [300, 25, 10, 7, 1.15]
]

const name_buffs = [
    // HP, damage, armor, AP, Speed
    // Tigers are strong and fierce.
    [1, 1.1, 1, 1, 1.1],
    // Wolfs are well-defended and strong. (Most of these are bullshit justifications ngl)
    [1.2, 1, 1.1, 1, 1],
    // Snakes are quick but squishy.
    [0.5, 1.1, 0.8, 1.2, 1.3],
    // Pythons are huge and slow but tanky.
    [2.5, 0.75, 1.75, 0.4, 0.6],
    // Dunno how to justify spiders.
    [0.4, 1.35, 0.7, 2, 1.1],
    // Bears are tough creatures who won't go down without a fihgt.
    [1.3, 0.9, 1.1, 0.5, 0.9],
    // Eagles are flying critters which are annoying to hit. (I could add an evasion score entry, but it's used by like two things)
    [0.9, 1.2, 1, 1, 1.2],
    // Bats are extremely fast and evasive, but have little health.
    [0.2, 1, 0.3, 0.3, 2.5],
    // Boars are silly :)
    [0.8, 0.8, 0.8, 0.8, 0.8],
    // Tortoises are slow but heavily armored
    [1.5, 0.5, 4, 1, 0.5],
    // Dragons are huge creatures that are pretty much difficult bosses that drop more rewards.
    [4, 2, 2, 2, 2]
]

const mod_buffs = [
    // HP, damage, armor, AP, Speed
    // No justifications because I'm not skilled enough to justify more :(
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1.1, 1, 1, 1.1],
    [1.2, 1, 1, 1, 0.95],
    [0.8, 1.4, 0.8, 1, 1.1],
    [1, 1, 1.5, 1, 1],
    [0.8, 0.8, 0.8, 0.8, 1.6], // Will have evasion!
    [1.3, 1, 1.3, 0.8, 0.8],
    [1.3, 1.3, 1.3, 1.3, 1.3],
    [1, 1.6, 0.8, 0.8, 1],
    [1.2, 0.9, 1.3, 1.3, 1],
    [1.1, 1.1, 1.1, 1.1, 1.8],
    [1, 1.4, 1.1, 0.9, 1], // Will have evasion!
    [2, 0.5, 1, 1, 1]
]


function generateRandomEnemy(stage) {
    let base = ["Tiger", "Wolf", "Snake", "Python", "Spider", "Bear", "Eagle", "Bat", "Boar", "Tortoise", "Dragon"]
    let modifier = ["", "", "", "", "", "", "", "Fiery ", "Frosted ", "Thundering ", "Armored ", "Ghostlike ", "Ironskin ", "Crimson ", "Sanguine ", "Greenscaled ", "Soul-devouring ", "Shadowed ", "Sky-covering "]
    let rank = ["", " Demon", " Spirit", " Fiend", " King", " Elder", " Greater", " Demon King"]

    let stage_breakpoints = [10, 10 + 4, 10 + 4 + (2+2+3+3), 10 + 4 + (2+2+3+3) + (4+4+5+5), 10 + 4 + (2+2+3+3) + (4+4+5+5) + (6+7+8+9)]
    let min_stage = 0
    while (stage > stage_breakpoints[min_stage] && min_stage < 5) {
        min_stage += 1
    }

    let enemy_base = ENEMY_TEMPLATES_NUM[Math.max(Math.min(stage, 10 + 4 + (2+2+3+3) + (4+4+5+5) + (6+7+8+9)), 0)]
    let chosen_mob_base = Math.floor(Math.random() * base.length)
    let chosen_mob_modifier = Math.floor(Math.random() * modifier.length)

    let mob_name = `${modifier[chosen_mob_modifier]}${base[chosen_mob_base]}${rank[Math.floor(Math.random() * min_stage)]}`

    let enemy = new Enemy(
        mob_name,
        enemy_base[0] * name_buffs[chosen_mob_base][0] * mod_buffs[chosen_mob_modifier][0],
        enemy_base[1] * name_buffs[chosen_mob_base][1] * mod_buffs[chosen_mob_modifier][1],
        enemy_base[2] * name_buffs[chosen_mob_base][2] * mod_buffs[chosen_mob_modifier][2],
        enemy_base[3] * name_buffs[chosen_mob_base][3] * mod_buffs[chosen_mob_modifier][3],
        enemy_base[4] * name_buffs[chosen_mob_base][4] * mod_buffs[chosen_mob_modifier][4],
        ((chosen_mob_base == 6 ? 15 : 0) + ((chosen_mob_modifier == 11 || chosen_mob_modifier == 17) ? 15 : 0)),
        (chosen_mob_base == 10 ? 3 : 1) * (chosen_mob_modifier > 15 ? 2 : 1)
    )

    enemy.perturb_self()
    return enemy
}