import * as c from './s_constants.js';

export const BULLET_FILE = "bullet.png";
export const BULLET_BLUE_FILE = "bullet_blue.png";
export const BULLET_WHITE_FILE = "bullet_white.png";
export const SHIELD_BLUE_FILE = "shield_blue.png";
export const SHIELD_GREEN_FILE = "shield_green.png";
export const SHIELD_WHITE_FILE = "shield_white.png";
export const SHIP_BALL_FILE = "ship_ball.png";
export const SHIP_CARGO_FILE = "ship_cargo.png";
export const SHIP_EXPLORER_FILE = "ship_explorer.png";
export const SHIP_FAST_FILE = "ship_fast.png";
export const SHIP_FIGHTER_FILE = "ship_fighter.png";
export const SHIP_HEAVY_FILE = "ship_heavy.png";
export const SHIP_MISSILE_FILE = "ship_missile.png";
export const SHIP_RED_WINGS_FILE = "ship_red_wings.png";
export const SHIP_SKELETON_FILE = "ship_skeleton.png";
export const ALIEN_SHIP_BLACK_FILE = "alien_black.png";
export const ALIEN_SHIP_BLUE_FILE = "alien_blue.png";
export const ALIEN_SHIP_BLUE_LARGE_FILE = "alien_blue_large.png";
export const ALIEN_SHIP_BLUE_SMALL_FILE = "alien_blue_small.png";
export const ALIEN_SHIP_FIRE_FILE = "alien_fire.png";
export const ALIEN_SHIP_GREEN_FILE = "alien_green.png";
export const ALIEN_SHIP_GREEN_SMALL_FILE = "alien_green_small.png";
export const ALIEN_SHIP_GREEN_LARGE_FILE = "alien_green_large.png";
export const ALIEN_SHIP_RED_FILE = "alien_red.png";
export const ALIEN_SHIP_RED_SMALL_FILE = "alien_red_small.png";
export const ALIEN_SHIP_RED_LARGE_FILE = "alien_red_large.png";

// Equip Type exists on client as well as server
export const EQUIP_TYPE_BRAKE = "Brake";
export const EQUIP_TYPE_PRIMARY_WEAPON = "Primary Weapon";
export const EQUIP_TYPE_SECONDARY_WEAPON = "Secondary Weapon";
export const EQUIP_TYPE_THRUSTER = "Thruster";
export const EQUIP_TYPE_ARMOR = "Armor";
export const EQUIP_TYPE_REPAIR_DROID = "Repair Droid";
export const EQUIP_TYPE_GUNNERY_DROID = "Gunnery Droid";
export const EQUIP_TYPE_SHIELD_DROID = "Shield Droid";
export const EQUIP_TYPE_SPEED = "Speed";
export const EQUIP_TYPE_TURN = "Turn";

export const THRUST_MOMENTUM = "Thrust Momentum";
export const THRUST_BLINK = "Thrust Blink";

export const AI_NONE = "NONE";
export const AI_MINE = "MINE";
export const AI_CREEPER = "AI_CREEPER";
export const AI_TURRET = "AI_TURRET";
export const AI_MISSILE = "AI_MISSILE";
export const AI_MISSILE_NO_MOMENTUM = "AI_MISSILE_NO_MOMENTUM";

export const DIR_AHEAD_OF_SHIP = "ahead";
export const DIR_BEHIND_SHIP = "behind";

// Ship Upgrades
// brakeSpeedPct is best between 0.02 - 0.1 (higher is ok)
export const EQUIP_BRAKE = {
  name: "Brake", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_BRAKE, brakeSpeedPct: 0.35,
  description: "Slows your ship down.",
};
export const EQUIP_BLINK_BRAKE = {
  name: "Blink Brake", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_BRAKE, brakeSpeedPct: 0,
  description: "Stops your ship immediately.",
};
export const EQUIP_SPEED_BOOST = { // Speed is best between 0.75 and 2
  name: "Speed Booster", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SPEED, boostSpeed: 1,
  description: "Increase the ship's acceleration. Helps slow ships take off of large planets.",
};
export const EQUIP_TURN_BOOST = { // Turn is best between 0.1 and 0.2
  name: "Turn Booster", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_TURN, boostSpeed: 0.1,
  description: "Increase turning speed.",
};
export const EQUIP_ARMOR = {
  name: "Armor Plate", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_ARMOR, armorAmt: 100, hinderPropulsion:0.5, hinderTurn: 0.05,
  description: "Increase armor by 100, slows propulsion and turning.",
};
export const EQUIP_THRUSTER = {
  name: "Thruster", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_THRUSTER, thrustSpeed: 1.2, thrustType: THRUST_MOMENTUM,
  description: "Enable lateral movement. Use 'q' and 'e' keys.",
};
export const EQUIP_BLINK_THRUSTER = {
  name: "Blink Thruster", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_THRUSTER, thrustSpeed: 12, thrustType: THRUST_BLINK,
  description: "Lateral movement without momentum. Use 'q' and 'e' keys.",
};

// Primary Weapons
export const EQUIP_BLASTER = {
  name: "Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 15,
  cool: 0,
  damage: 20,
  speed: 10,
  lifetime: 40,
  jitter: 0.05,
  imageFile: BULLET_FILE,
};
export const EQUIP_FAST_BLASTER = {
  name: "Fast Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 20,
  speed: 15,
  lifetime: 35,
  jitter: 0.05,
  imageFile: BULLET_FILE,
};
export const EQUIP_SPRINKLER_BLASTER = {
  name: "Sprinkler Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 2,
  cool: 0,
  damage:20,
  speed: 12,
  lifetime: 70,
  jitter: 1,
  imageFile: BULLET_FILE,
};
export const EQUIP_STREAM_BLASTER = {
  name: "Stream Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 17,
  speed: 25,
  lifetime: 30,
  jitter: 0.04,
  imageFile: BULLET_FILE,
};
export const EQUIP_MELEE_GUN = {
  name: "Melee Gun",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 2,
  cool: 0,
  damage: 25,
  speed: 15,
  lifetime: 15,
  jitter: 0.3,
  imageFile: BULLET_FILE,
};
export const EQUIP_SNIPER_RIFLE = {
  name: "Sniper Rifle",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 100,
  cool: 0,
  damage: 300,
  speed: 50,
  lifetime: 70,
  jitter: 0.0,
  imageFile: BULLET_FILE,
};
export const EQUIP_ALIEN_BLASTER_LIGHTNING = {
  name: "Lighting Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 50,
  speed: 35,
  lifetime: 28,
  jitter: 0.08,
  imageFile: BULLET_BLUE_FILE,
};
export const EQUIP_STAPLE_GUN_HEAVY = {
  name: "Staple Gun",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 20,
  speed: 15,
  lifetime: 100,
  jitter: 0.15,
  imageFile: BULLET_WHITE_FILE,
};

// Secondary (more at end of file after the ships)
export const EQUIP_SHIELD = {
  name: "Force Shield", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 500,
  shield: {
    active: false,
    armor: 500,
    armorMax: 500,
    lifetime: 400,
    lifetimeMax: 400,
    spriteFile: SHIELD_BLUE_FILE,
    radius: 0
  },
};

// Droids
export const EQUIP_R2D2 = {
  name: "R2D2 Repair Droid", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_REPAIR_DROID, repairSpeed: 0.75,
  description: "Repairs your ship while you are flying."
};
export const EQUIP_GUNNERY_DROID = {
  name: "Gunnery Droid", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_GUNNERY_DROID,
  weapon: EQUIP_FAST_BLASTER,
  description: "Fires a stream blaster at the nearest enemy.",
};
export const EQUIP_SHIELD_DROID = {
  name: "Shield Droid", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SHIELD_DROID,
  description: "Deploys your shields automatically when bullets are flying.",
};

// Ships
export const SHIP_EXPLORER = {
  name: "Explorer",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.85, // good between 0.75 and 2.0
  turnSpeed: 0.12,  // Good range is 0.1 - 0.2
  resourcesMax: 50,
  equipMax: 10,
  equip: [],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.5,
  imageRadius: 20,  // 61w x 84h radius 40 * 0.5 = 20
  imageFile: SHIP_EXPLORER_FILE,
  description: "A basic ship",
};

export const SHIP_FAST = {
  name: "Fast",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 2.3,
  turnSpeed: 0.25,
  resourcesMax: 40,
  equipMax: 9,
  equip: [],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.6,
  imageRadius: 27, // 100w x 74h radius 45 * 0.6 = 54
  imageFile: SHIP_FAST_FILE,
  description: "A fast ship",
};

export const SHIP_HEAVY = {
  name: "Heavy",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 1.1,
  turnSpeed: 0.13,
  resourcesMax: 300,
  equipMax: 7,
  equip: [],
  armorMax: 300,
  armor: 300,
  crashSpeed: 1.5,
  crashAngle: 0.4,
  imageScale: 0.60,
  imageRadius: 48, // 205w x 132h radius=80 * 0.625 = 60
  imageFile: SHIP_HEAVY_FILE,
  description: "A heavily armored ship",
};

export const SHIP_FIGHTER = {
  name: "Fighter",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 2.0,
  turnSpeed: 0.20,
  resourcesMax: 200,
  equipMax: 7,
  equip: [EQUIP_STREAM_BLASTER, EQUIP_BRAKE],
  armorMax: 200,
  armor: 200,
  crashSpeed: 1.5,
  crashAngle: 0.6,
  imageScale: 0.8,
  imageRadius: 46, // 118w x 116h radius=58 * 0.8 = 46
  imageFile: SHIP_FIGHTER_FILE,
  description: "A fast, armored ship",
};

export const SHIP_WING = {
  name: "Wing Ship",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 1.5,
  turnSpeed: 0.15,
  resourcesMax: 300,
  equipMax: 7,
  equip: [],
  armorMax: 250,
  armor: 250,
  crashSpeed: 3,
  crashAngle: 0.5,
  imageScale: 0.9,
  imageRadius: 72, //  152w 152h radius=80 * 0.9 = 72
  imageFile: SHIP_RED_WINGS_FILE,
  description: "A large ship",
};

export const SHIP_ALIEN_STEALTH = {
  name: "Stealth",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 1.5,
  turnSpeed: 0.15,
  resourcesMax: 100,
  equipMax: 9,
  equip: [],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.5,
  imageRadius: 51, // 70w x 67h radius=34 * 1.5 = 51
  imageFile: ALIEN_SHIP_BLACK_FILE,
  aiType: AI_CREEPER,
  description: "A cloaked ship",
};

export const SHIP_DECOY = {
  name: "Decoy",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.0,
  turnSpeed: 0.0,
  resourcesMax: 0,
  equipMax: 0,
  equip: [],
  armorMax: 400,
  armor: 400,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.55,
  imageRadius: 20, // This may change based on the sprite we are decoying
  imageFile: SHIP_EXPLORER_FILE,
  aiType: AI_NONE,
  description: "An empty shell of a ship.",
};

export const SHIP_TURRET = {
  name: "Turret",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.0,
  turnSpeed: 0.0,
  resourcesMax: 0,
  equipMax: 1,
  equip: [EQUIP_FAST_BLASTER],
  armorMax: 350,
  armor: 350,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.6,
  imageRadius: 30, // 98w x 98h = 49 * 0.6 = 30
  imageFile: ALIEN_SHIP_BLUE_LARGE_FILE,
  aiType: AI_TURRET,
  lifetime: 1400,
  description: "A turret with a fast blaster.",
};

export const SHIP_SPRINKLER_TURRET = {
  name: "Sprinkler Turret",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.0,
  turnSpeed: 0.0,
  resourcesMax: 0,
  equipMax: 1,
  equip: [EQUIP_SPRINKLER_BLASTER],
  armorMax: 250,
  armor: 250,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.4,
  imageRadius: 20, // 98w x 98h = 49 * 0.4 = 20
  imageFile: ALIEN_SHIP_BLUE_LARGE_FILE,
  aiType: AI_TURRET,
  lifetime: 1400,
  description: "A pop-up sprinkler turret.",
};

export const SHIP_MISSILE = {
  name: "Missile",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.3,
  turnSpeed: 0.5,
  resourcesMax: 0,
  equipMax: 0,
  equip: [],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.0,
  imageRadius: 13, // 26w x 26h radius = 13 * 1.0 = 13
  imageFile: SHIP_BALL_FILE,
  viewRange: 3000,
  lifetime: 400,
  explosionDamage: 300,
  aiType: AI_MISSILE,
  description: "An enemy seeking missile.",
};

export const SHIP_BOMB = {
  name: "Bomb",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.01, // no propulsion pure momentum
  turnSpeed: 0.10, // not really used
  resourcesMax: 0,
  equipMax: 0,
  equip: [],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.5,
  imageRadius: 12, // 48w x 48h radius = 24 0.5 = 12
  imageFile: ALIEN_SHIP_RED_FILE,
  aiType: AI_MINE,
  viewRange: 150, // size of explosion
  lifetime: 1000,
  explosionDamage: 400,
  description: "When it dies it detonates damaging everything nearby",
};

export const SHIP_ALIEN_TURRET = {
  name: "Alien Turret",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.0,
  turnSpeed: 0.0,
  equipMax: 3,
  equip: [EQUIP_FAST_BLASTER],
  armorMax: 200,
  armor: 200,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.5,
  imageRadius: 24,  // 32w x 32h * scale = 16 * 1.5 = 24
  imageFile: ALIEN_SHIP_BLUE_SMALL_FILE,
  aiType: AI_TURRET,
  description: "An unfriendly alien turret.",
};

export const SHIP_ALIEN_HEAVY = {
  name: "Alien Heavy",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.35,
  turnSpeed: 0.2,
  equipMax: 3,
  equip: [EQUIP_FAST_BLASTER],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1,
  imageRadius: 47,  // 98w x 93h * scale = 47 * 1 = 47
  imageFile: ALIEN_SHIP_GREEN_LARGE_FILE,
  aiType: AI_CREEPER,
  viewRange: 500,
  description: "An unfriendly alien.",
};


export const ALL_ALIENS = [SHIP_ALIEN_STEALTH];
export const ALL_SHIPS = [SHIP_EXPLORER, SHIP_FAST, SHIP_HEAVY, SHIP_FIGHTER, SHIP_WING, ...ALL_ALIENS];

// This equipment needs to go after the ships (ugh)
export const EQUIP_DECOY_DEPLOYER = {
  name: "Decoy Deployer", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 25, cool: 0,
  createShip: {type: SHIP_DECOY, dir: DIR_BEHIND_SHIP},
  description: "Drops a fake ship."
};
export const EQUIP_TURRET_DEPLOYER = {
  name: "Turret Deployer", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_TURRET, dir: DIR_BEHIND_SHIP},
  description: "Drops a turret.",
};
export const EQUIP_SPRINKLER_TURRET_DEPLOYER = {
  name: "Sprinkler Turret Deployer", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_SPRINKLER_TURRET, dir: DIR_BEHIND_SHIP},
  description: "Drops pop-up sprinkler.",
};
export const EQUIP_MISSILE_LAUNCHER = {
  name: "Missile Launcher", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_MISSILE, dir: DIR_AHEAD_OF_SHIP},
  description: "Fires enemy-seeking missiles.",
};
export const EQUIP_BOMB_LAUNCHER = {
  name: "Bomb Launcher", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 80, cool: 0,
  createShip: {type: SHIP_BOMB, dir: DIR_AHEAD_OF_SHIP},
  description: "Fires explosive missiles.",
};
export const EQUIP_CLOAK = {
  name: "Scanner Cloak", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 450, cool: 0, cloak: true,
  lifetime: {lifetime:0, lifetimeMax:400},
  description: "Hide your ship from all scanners.",
};
export const EQUIP_STEALTH_SKIN = {
  name: "Stealth Skin", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 450, cool: 0, stealth: true,
  lifetime: {lifetime: 0, lifetimeMax: 400},
  description: "Makes you hard to see in deep space.",
};
export const EQUIP_JUMP = {
  name: "Emergency Jump", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 200, cool: 0,
  jump: {distance: 4000},
  description: "A tiny hyperspace jump to get out of difficult situations.",
};

export const EQUIP_UPGRADES = [EQUIP_BRAKE, EQUIP_BLINK_BRAKE, EQUIP_THRUSTER, EQUIP_BLINK_THRUSTER, EQUIP_ARMOR, EQUIP_SPEED_BOOST, EQUIP_TURN_BOOST];
export const EQUIP_PRIMARY_WEAPONS = [EQUIP_BLASTER, EQUIP_FAST_BLASTER, EQUIP_STREAM_BLASTER, EQUIP_SPRINKLER_BLASTER, EQUIP_MELEE_GUN, EQUIP_SNIPER_RIFLE, EQUIP_STAPLE_GUN_HEAVY, EQUIP_ALIEN_BLASTER_LIGHTNING];
export const EQUIP_SECONDARY_WEAPONS = [EQUIP_DECOY_DEPLOYER, EQUIP_TURRET_DEPLOYER, EQUIP_SPRINKLER_TURRET_DEPLOYER, EQUIP_MISSILE_LAUNCHER, EQUIP_BOMB_LAUNCHER, EQUIP_SHIELD, EQUIP_CLOAK, EQUIP_STEALTH_SKIN, EQUIP_JUMP];
export const EQUIP_DROIDS = [EQUIP_R2D2, EQUIP_GUNNERY_DROID, EQUIP_SHIELD_DROID];
export const ALL_EQUIP = [...EQUIP_UPGRADES, ...EQUIP_PRIMARY_WEAPONS, ...EQUIP_SECONDARY_WEAPONS, ...EQUIP_DROIDS];
export const ALL_BLUEPRINTS = [...ALL_EQUIP, ...ALL_SHIPS];

export const UNIVERSE_RINGS = [
  {
    planetCount: 1,
    minDist: 0, maxDist: 0,
    minDistToOtherPlanet: 500,
    minPlanetRadius: 300, maxPlanetRadius: 300,
    planetFiles: [c.PLANET_GREEN_FILE],
  },
  {
    planetCount: 6,
    minDist: 750, maxDist: 1000,
    minDistToOtherPlanet: 250,
    minPlanetRadius: 80, maxPlanetRadius: 100,
    planetFiles: [c.PLANET_PURPLE_FILE],
  },
  {
    planetCount: 12,
    minDist: 1100, maxDist: 1600,
    minDistToOtherPlanet: 250,
    minPlanetRadius: 100, maxPlanetRadius: 250,
    planetFiles: [c.PLANET_RED_FILE],
  },

  {
    planetCount: 45,
    minDist: 2000, maxDist: 3000,
    minDistToOtherPlanet: 250,
    minPlanetRadius: 100, maxPlanetRadius: 400,
    planetFiles: [c.PLANET_ROCK_FILE],
  },
];
