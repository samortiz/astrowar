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
export const EQUIP_TYPE_STORAGE = "Storage";
export const EQUIP_TYPE_AUTOLANDER = "Autolander";
export const EQUIP_TYPE_GRAVITY_SHIELD = "GravityShield";

export const THRUST_MOMENTUM = "Thrust Momentum";
export const THRUST_BLINK = "Thrust Blink";

export const ALIEN_AI_TURRET = "ALIEN_AI_TURRET";
export const ALIEN_AI_CREEPER = "ALIEN_AI_CREEPER";
export const ALIEN_AI_MOTHERSHIP = "ALIEN_AI_MOTHERSHIP";
export const ALIEN_AI_KAMIKAZI = "ALIEN_AI_KAMIKAZI";
export const EQUIP_AI_MINE = "EQUIP_AI_MINE";
export const EQUIP_AI_TURRET = "EQUIP_AI_TURRET";
export const EQUIP_AI_MISSILE = "EQUIP_AI_MISSILE";
export const EQUIP_AI_RESOURCE_DROID = "EQUIP_AI_RESOURCE_DROID";

export const DIR_AHEAD_OF_SHIP = "ahead";
export const DIR_BEHIND_SHIP = "behind";

// Ship Upgrades
// brakeSpeedPct is best between 0.02 - 0.1 (higher is ok)
export const EQUIP_BRAKE = {
  name: "Brake", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_BRAKE, brakeSpeedPct: 0.15,
  cost: {titanium: 20, gold: 10, uranium: 0},
  description: "Slows your ship down.",
};
export const EQUIP_BLINK_BRAKE = {
  name: "Blink Brake", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_BRAKE, brakeSpeedPct: 0,
  cost: {titanium: 50, gold: 50, uranium: 30},
  description: "Stops your ship immediately.",
};
export const EQUIP_SPEED_BOOST = { // Speed is best between 0.75 and 2
  name: "Speed Booster", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SPEED, boostSpeed: 1,
  cost: {titanium: 0, gold: 20, uranium: 10},
  description: "Increase the ship's acceleration. Helps slow ships take off of large planets.",
};
export const EQUIP_TURN_BOOST = { // Turn is best between 0.1 and 0.2
  name: "Turn Booster", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_TURN, boostSpeed: 0.1,
  cost: {titanium: 0, gold: 10, uranium: 20},
  description: "Increase turning speed.",
};
export const EQUIP_ARMOR = {
  name: "Armor Plate", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_ARMOR, armorAmt: 100,
  cost: {titanium: 50, gold: 0, uranium: 0},
  description: "Increase armor by 100.",
};
export const EQUIP_ENHANCED_ARMOR = {
  name: "Enhanced Armor", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_ARMOR, armorAmt: 300,
  cost: {titanium: 300, gold: 0, uranium: 0},
  description: "Increase armor by 300.",
};
export const EQUIP_THRUSTER = {
  name: "Thruster", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_THRUSTER, thrustSpeed: 1.2, thrustType: THRUST_MOMENTUM,
  cost: {titanium: 40, gold: 40, uranium: 10},
  description: "Enable lateral movement. Use 'q' and 'e' keys.",
};
export const EQUIP_BLINK_THRUSTER = {
  name: "Blink Thruster", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_THRUSTER, thrustSpeed: 12, thrustType: THRUST_BLINK,
  cost: {titanium: 60, gold: 50, uranium: 10},
  description: "Lateral movement without momentum. Use 'q' and 'e' keys.",
};
export const EQUIP_GRAVITY_SHIELD = {
  name: "Gravity Shield", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_GRAVITY_SHIELD,
  cost: {titanium: 100, gold: 200, uranium: 150},
  description: "Be free from the effect of gravity.",
};

// Primary Weapons
export const EQUIP_BLASTER = {
  name: "Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 25,
  cool: 0,
  damage: 10,
  speed: 2.5,
  lifetime: 100,
  jitter: 0.05,
  imageFile: BULLET_FILE,
  cost: {titanium: 0, gold: 0, uranium: 10}
};
export const EQUIP_FAST_BLASTER = {
  name: "Fast Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 7.5,
  speed: 4,
  lifetime: 75,
  jitter: 0.05,
  imageFile: BULLET_FILE,
  cost: {titanium: 20, gold: 20, uranium: 40}
};
export const EQUIP_SPRINKLER_BLASTER = {
  name: "Sprinkler Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 2,
  cool: 0,
  damage: 8,
  speed: 2.5,
  lifetime: 150,
  jitter: 1,
  imageFile: BULLET_FILE,
  cost: {titanium: 10, gold: 10, uranium: 80}
};
export const EQUIP_STREAM_BLASTER = {
  name: "Stream Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 4,
  cool: 0,
  damage: 8,
  speed: 7,
  lifetime: 70,
  jitter: 0.04,
  imageFile: BULLET_FILE,
  cost: {titanium: 0, gold: 50, uranium: 150}
};
export const EQUIP_MELEE_GUN = {
  name: "Melee Gun",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 12,
  speed: 3,
  lifetime: 40,
  jitter: 0.25,
  imageFile: BULLET_FILE,
  cost: {titanium: 0, gold: 150, uranium: 200}
};
export const EQUIP_SNIPER_RIFLE = {
  name: "Sniper Rifle",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 100,
  cool: 0,
  damage: 160,
  speed: 9,
  lifetime: 90,
  jitter: 0.0,
  imageFile: BULLET_FILE,
  cost: {titanium: 0, gold: 200, uranium: 300}
};
export const EQUIP_ALIEN_BLASTER = {
  name: "Alien Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 20,
  cool: 0,
  damage: 5,
  speed: 2,
  lifetime: 120,
  jitter: 0.12,
  imageFile: BULLET_BLUE_FILE,
  cost: {titanium: 0, gold: 0, uranium: 5}
};
export const EQUIP_ALIEN_BLASTER_FAST = {
  name: "Alien Fast Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 12,
  speed: 5,
  lifetime: 110,
  jitter: 0.1,
  imageFile: BULLET_BLUE_FILE,
  cost: {titanium: 0, gold: 50, uranium: 80}
};
export const EQUIP_ALIEN_BLASTER_LIGHTNING = {
  name: "Alien Lighting Blaster",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 25,
  speed: 12,
  lifetime: 50,
  jitter: 0.08,
  imageFile: BULLET_BLUE_FILE,
  cost: {titanium: 0, gold: 300, uranium: 500}
};
export const EQUIP_STAPLE_GUN = {
  name: "Staple Gun",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 5,
  speed: 3,
  lifetime: 250,
  jitter: 0.2,
  imageFile: BULLET_WHITE_FILE,
  cost: {titanium: 0, gold: 50, uranium: 200}
};
export const EQUIP_STAPLE_GUN_HEAVY = {
  name: "Heavy Staple Gun",
  objectType: c.OBJECT_TYPE_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 6,
  speed: 3,
  lifetime: 250,
  jitter: 0.15,
  imageFile: BULLET_WHITE_FILE,
  cost: {titanium: 0, gold: 250, uranium: 400}
};

// Secondary (more at end of file after the ships)
export const EQUIP_SHIELD = {
  name: "Force Shield", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 600,
  shield: {
    active: false,
    armor: 500,
    armorMax: 500,
    lifetime: 300,
    lifetimeMax: 300,
    spriteFile: SHIELD_BLUE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 100, uranium: 10}
};
export const EQUIP_SHIELD_LONG = {
  name: "Long Shield", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 1200,
  shield: {
    active: false,
    armor: 500,
    armorMax: 500,
    lifetime: 1100,
    lifetimeMax: 1100,
    spriteFile: SHIELD_WHITE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 200, uranium: 10}
};
export const EQUIP_SHIELD_STRONG = {
  name: "Strong Shield", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 1000,
  shield: {
    active: false,
    armor: 1500,
    armorMax: 1500,
    lifetime: 400,
    lifetimeMax: 400,
    spriteFile: SHIELD_GREEN_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 200, uranium: 10}
};
export const EQUIP_SHIELD_ULTRA = {
  name: "Ultra Shield", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 1000,
  shield: {
    active: false,
    armor: 1200,
    armorMax: 1200,
    lifetime: 800,
    lifetimeMax: 800,
    spriteFile: SHIELD_BLUE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 300, uranium: 100}
};
export const EQUIP_SHIELD_BLINK = {
  name: "Blink Shield", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 600,
  shield: {
    active: false,
    armor: 900,
    armorMax: 900,
    lifetime: 500,
    lifetimeMax: 500,
    spriteFile: SHIELD_BLUE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 500, uranium: 100}
};

export const SHIP_RED_MISSILE = {
  name: "Alien Missile",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.08,
  turnSpeed: 0.3,
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [],
  armorMax: 200,
  armor: 200,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.8,
  imageFile: ALIEN_SHIP_RED_SMALL_FILE,
  cost: {titanium: 5, gold: 5, uranium: 10},
  viewRange: 3000,
  aiType: ALIEN_AI_KAMIKAZI,
};

export const EQUIP_ALIEN_MISSILE_LAUNCHER = {
  name: "Alien Missile Launcher", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 100,
  createShip: {type: SHIP_RED_MISSILE, dir: DIR_AHEAD_OF_SHIP},
  cost: {titanium: 150, gold: 150, uranium: 200},
  description: "Fires red alien missiles that persistently follow enemies.",
};

// Droids
export const EQUIP_R2D2 = {
  name: "R2D2 Repair Droid", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_REPAIR_DROID, repairSpeed: 0.2,
  cost: {titanium: 50, gold: 300, uranium: 100},
  description: "Repairs your ship while you are flying."
};
export const EQUIP_GUNNERY_DROID = {
  name: "Gunnery Droid", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_GUNNERY_DROID,
  weapon: EQUIP_FAST_BLASTER, cost: {titanium: 100, gold: 400, uranium: 200},
  description: "Fires a fast blaster at the nearest enemy.",
};
export const EQUIP_LIGHTING_DROID = {
  name: "Lightning Droid", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_GUNNERY_DROID,
  weapon: EQUIP_ALIEN_BLASTER_LIGHTNING, cost: {titanium: 100, gold: 500, uranium: 300},
  description: "Fires a lightning blaster at the nearest enemy.",
};
export const EQUIP_SHIELD_DROID = {
  name: "Shield Droid", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SHIELD_DROID,
  cost: {titanium: 50, gold: 600, uranium: 50},
  description: "Deploys your shields automatically when bullets are flying.",
};

// Ships
export const SHIP_EXPLORER = {
  name: "Explorer",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.75, // good between 0.75 and 2.0
  turnSpeed: 0.1,  // Good range is 0.1 - 0.2
  resourcesMax: 50,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 4,
  equip: [EQUIP_BRAKE, EQUIP_BLASTER],
  armorMax: 50,
  armor: 50,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.6,
  imageFile: SHIP_EXPLORER_FILE,
  cost: {titanium: 40, gold: 20, uranium: 10},
  description: "A basic ship with good handling and 4 slots.",
};

export const SHIP_FAST = {
  name: "Fast",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 1.5,
  turnSpeed: 0.2,
  resourcesMax: 40,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 5,
  equip: [EQUIP_BRAKE],
  armorMax: 50,
  armor: 50,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.6,
  imageFile: SHIP_FAST_FILE,
  cost: {titanium: 200, gold: 100, uranium: 50},
  description: "A fast ship with good handling and 5 slots.",
};

export const SHIP_HEAVY = {
  name: "Heavy",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 1.0,
  turnSpeed: 0.12,
  resourcesMax: 300,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 8,
  equip: [EQUIP_BRAKE],
  armorMax: 500,
  armor: 500,
  crashSpeed: 1.5,
  crashAngle: 0.4,
  imageScale: 0.5,
  imageFile: SHIP_HEAVY_FILE,
  cost: {titanium: 500, gold: 400, uranium: 300},
  description: "A large ship with 500 armor, 300 resources and 8 slots.",
};

export const SHIP_FIGHTER = {
  name: "Fighter",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 2.0,
  turnSpeed: 0.20,
  resourcesMax: 200,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 10,
  equip: [EQUIP_BRAKE],
  armorMax: 300,
  armor: 300,
  crashSpeed: 1.5,
  crashAngle: 0.6,
  imageScale: 0.6,
  imageFile: SHIP_FIGHTER_FILE,
  cost: {titanium: 500, gold: 500, uranium: 500},
  description: "A fast, ship with 300 armor, 200 resources and 10 slots.",
};

export const SHIP_WING = {
  name: "Wing Ship",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 2.0,
  turnSpeed: 0.20,
  resourcesMax: 300,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 12,
  equip: [EQUIP_BLINK_BRAKE],
  armorMax: 500,
  armor: 500,
  crashSpeed: 3,
  crashAngle: 0.5,
  imageScale: 0.7,
  imageFile: SHIP_RED_WINGS_FILE,
  cost: {titanium: 1000, gold: 1000, uranium: 1000},
  description: "A large ship with good handling 500 armor, 300 resources and 12 slots.",
};

export const SHIP_ALIEN_TURRET = {
  name: "Alien Turret",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.01,
  turnSpeed: 0.05,
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 3,
  equip: [EQUIP_GRAVITY_SHIELD, EQUIP_ALIEN_BLASTER],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.8,
  imageFile: ALIEN_SHIP_GREEN_SMALL_FILE,
  cost: {titanium: 50, gold: 50, uranium: 50},
  aiType: ALIEN_AI_TURRET,
  description: "A basic turret with an alien blaster",
};

export const SHIP_ALIEN = {
  name: "Alien Ship",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 1.0,
  turnSpeed: 0.1,
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 5,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.9,
  imageFile: ALIEN_SHIP_GREEN_FILE,
  cost: {titanium: 150, gold: 100, uranium: 80},
  aiType: ALIEN_AI_CREEPER,
  description: "The basic alien scout ship.",
};

export const SHIP_ALIEN_LARGE = {
  name: "Alien Large",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 1,
  turnSpeed: .15,
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 8,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER_FAST],
  armorMax: 300,
  armor: 300,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1,
  imageFile: ALIEN_SHIP_GREEN_LARGE_FILE,
  cost: {titanium: 150, gold: 100, uranium: 80},
  aiType: ALIEN_AI_CREEPER,
  description: "A large heavily armored alien.",
};

export const SHIP_ALIEN_STAPLE_TURRET = {
  name: "Alien Staple Turret",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.00,
  turnSpeed: 0.001,
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 3,
  equip: [EQUIP_GRAVITY_SHIELD, EQUIP_STAPLE_GUN_HEAVY],
  armorMax: 230,
  armor: 230,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.3,
  imageFile: ALIEN_SHIP_BLUE_SMALL_FILE,
  cost: {titanium: 150, gold: 150, uranium: 200},
  aiType: ALIEN_AI_TURRET,
  description: "A hard-to-hit turret with a heavy staple gun.",
};

export const SHIP_ALIEN_LIGHTNING_TURRET = {
  name: "Alien Lightning Turret",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.00,
  turnSpeed: 0.001,
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 1,
  equip: [EQUIP_GRAVITY_SHIELD, EQUIP_ALIEN_BLASTER_LIGHTNING],
  armorMax: 300,
  armor: 300,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.5,
  imageFile: ALIEN_SHIP_BLUE_SMALL_FILE,
  cost: {titanium: 100, gold: 200, uranium: 300},
  aiType: ALIEN_AI_TURRET,
  description: "A turret that shoots lightning bolts.",
};

export const SHIP_ALIEN_FIRE = {
  name: "Alien Fire",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 2.0,
  turnSpeed: 0.2,
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 8,
  equip: [EQUIP_BRAKE, EQUIP_STAPLE_GUN_HEAVY, EQUIP_SHIELD_LONG],
  armorMax: 450,
  armor: 450,
  crashSpeed: 2,
  crashAngle: 0.4,
  imageScale: 1.5,
  imageFile: ALIEN_SHIP_FIRE_FILE,
  cost: {titanium: 250, gold: 200, uranium: 80},
  aiType: ALIEN_AI_CREEPER,
  description: "A tough alien ship with a shield and heavy staple gun.",
};

export const SHIP_ALIEN_STEALTH = {
  name: "Alien Stealth",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 1.5,
  turnSpeed: 0.15,
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 6,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER_FAST],
  armorMax: 150,
  armor: 150,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.5,
  imageFile: ALIEN_SHIP_BLACK_FILE,
  cost: {titanium: 100, gold: 200, uranium: 150},
  aiType: ALIEN_AI_CREEPER,
  description: "An alien with a cloak making it hard to see.",
};

export const SHIP_DECOY = {
  name: "Decoy",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.0,
  turnSpeed: 0.0,
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [],
  armorMax: 350,
  armor: 350,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.55,
  imageFile: SHIP_EXPLORER_FILE,
  cost: {titanium:10, gold: 0, uranium: 0},
  aiType: EQUIP_AI_MINE,
  description: "An empty shell of a ship.",
};

export const SHIP_TURRET = {
  name: "Turret",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.0,
  turnSpeed: 0.0,
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 1,
  equip: [EQUIP_GRAVITY_SHIELD, EQUIP_FAST_BLASTER],
  armorMax: 350,
  armor: 350,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.6,
  imageFile: ALIEN_SHIP_BLUE_LARGE_FILE,
  cost: {titanium: 5, gold: 10, uranium: 5},
  aiType: EQUIP_AI_TURRET,
  description: "A turret with a fast blaster.",
};

export const SHIP_STREAM_TURRET = {
  name: "Stream Turret",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.0,
  turnSpeed: 0.0,
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 1,
  equip: [EQUIP_GRAVITY_SHIELD, EQUIP_STREAM_BLASTER],
  armorMax: 250,
  armor: 250,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.4,
  imageFile: ALIEN_SHIP_BLUE_LARGE_FILE,
  cost: {titanium: 10, gold: 30, uranium: 20},
  aiType: EQUIP_AI_TURRET,
  description: "A turret with a stream blaster",
};

export const SHIP_MISSILE = {
  name: "Missile",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 2,
  turnSpeed: 0.5,
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [],
  armorMax: 250,
  armor: 250,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1,
  imageFile: SHIP_BALL_FILE,
  cost: {titanium: 0, gold: 15, uranium: 15},
  viewRange: 3000,
  aiType: EQUIP_AI_MISSILE,
  description: "An enemy seeking missile.",
};

export const SHIP_BOMB = {
  name: "Bomb",
  objectType: c.OBJECT_TYPE_SHIP,
  propulsion: 0.05,
  turnSpeed: 0.10, // not really used
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [EQUIP_GRAVITY_SHIELD],
  armorMax: 70,
  armor: 70,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.5,
  imageFile: ALIEN_SHIP_RED_FILE,
  cost: {titanium: 0, gold: 0, uranium: 30},
  aiType: EQUIP_AI_MISSILE,
  description: "When it dies it detonates damaging everything nearby",
};

export const ALL_ALIENS = [SHIP_ALIEN_TURRET, SHIP_ALIEN, SHIP_ALIEN_LARGE, SHIP_ALIEN_STEALTH,  SHIP_ALIEN_STAPLE_TURRET, SHIP_ALIEN_LIGHTNING_TURRET, SHIP_ALIEN_FIRE];
export const ALL_SHIPS = [SHIP_EXPLORER, SHIP_FAST, SHIP_HEAVY, SHIP_FIGHTER, SHIP_WING, ...ALL_ALIENS];

// This equipment needs to go after the ships (ugh)
export const EQUIP_DECOY_DEPLOYER = {
  name: "Decoy Deployer", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 25, cool: 0,
  createShip: {type: SHIP_DECOY, dir: DIR_BEHIND_SHIP},
  cost: {titanium: 0, gold: 50, uranium: 100},
  description: "Drops a fake ship."
};
export const EQUIP_TURRET_DEPLOYER = {
  name: "Turret Deployer", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_TURRET, dir: DIR_BEHIND_SHIP},
  cost: {titanium: 0, gold: 200, uranium: 100},
  description: "Drops a turret with a fast blaster.",
};
export const EQUIP_STREAM_TURRET_DEPLOYER = {
  name: "Stream Turret Deployer", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_STREAM_TURRET, dir: DIR_BEHIND_SHIP},
  cost: {titanium: 100, gold: 400, uranium: 400},
  description: "Drops a turret with a stream blaster.",
};
export const EQUIP_MISSILE_LAUNCHER = {
  name: "Missile Launcher", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_MISSILE, dir: DIR_AHEAD_OF_SHIP},
  cost: {titanium: 50, gold: 250, uranium: 300},
  description: "Fires enemy-seeking missiles.",
};
export const EQUIP_BOMB_LAUNCHER = {
  name: "Bomb Launcher", objectType: c.OBJECT_TYPE_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 80, cool: 0,
  createShip: {type: SHIP_BOMB, dir: DIR_AHEAD_OF_SHIP},
  cost: {titanium: 250, gold: 300, uranium: 400},
  description: "Fires explosive missiles.",
};

export const EQUIP_UPGRADES = [EQUIP_BRAKE, EQUIP_BLINK_BRAKE, EQUIP_THRUSTER, EQUIP_BLINK_THRUSTER, EQUIP_ARMOR, EQUIP_SPEED_BOOST, EQUIP_TURN_BOOST, EQUIP_ENHANCED_ARMOR, EQUIP_GRAVITY_SHIELD];
export const EQUIP_PRIMARY_WEAPONS = [EQUIP_BLASTER, EQUIP_FAST_BLASTER, EQUIP_STREAM_BLASTER, EQUIP_SPRINKLER_BLASTER, EQUIP_MELEE_GUN, EQUIP_SNIPER_RIFLE, EQUIP_ALIEN_BLASTER, EQUIP_STAPLE_GUN, EQUIP_STAPLE_GUN_HEAVY, EQUIP_ALIEN_BLASTER_FAST, EQUIP_ALIEN_BLASTER_LIGHTNING];
export const EQUIP_SECONDARY_WEAPONS = [EQUIP_DECOY_DEPLOYER, EQUIP_TURRET_DEPLOYER, EQUIP_STREAM_TURRET_DEPLOYER, EQUIP_MISSILE_LAUNCHER, EQUIP_BOMB_LAUNCHER, EQUIP_ALIEN_MISSILE_LAUNCHER, EQUIP_SHIELD, EQUIP_SHIELD_LONG, EQUIP_SHIELD_STRONG, EQUIP_SHIELD_ULTRA, EQUIP_SHIELD_BLINK];
export const EQUIP_DROIDS = [EQUIP_R2D2, EQUIP_GUNNERY_DROID, EQUIP_LIGHTING_DROID, EQUIP_SHIELD_DROID];
export const ALL_EQUIP = [...EQUIP_UPGRADES, ...EQUIP_PRIMARY_WEAPONS, ...EQUIP_SECONDARY_WEAPONS, ...EQUIP_DROIDS];
export const ALL_BLUEPRINTS = [...ALL_EQUIP, ...ALL_SHIPS];