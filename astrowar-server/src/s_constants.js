export const APP_VERSION = "0.01a";
export const PORT = 8080;
export const SERVER_TICK_MS = 50;

export const RIGHT = 'arrowright';
export const LEFT = 'arrowleft';
export const UP = 'arrowup';
export const DOWN = 'arrowdown';
export const FIRE = ' ';
export const KEY_W = 'w';
export const KEY_A = 'a';
export const KEY_S = 's';
export const KEY_D = 'd';
export const KEY_Q = 'q';
export const KEY_E = 'e';
export const SECONDARY_WEAPON = 'x';
export const ALL_KEY_CODES = [RIGHT, LEFT, DOWN, UP, FIRE, KEY_W, KEY_A, KEY_S, KEY_D, KEY_Q, KEY_E, SECONDARY_WEAPON];

export const EXPLOSION_TTL_TICKS = 20;

// OBJECT TYPES need to match in client and server
export const OBJECT_TYPE_PLANET = "planet";
export const OBJECT_TYPE_SHIP = "ship";
export const OBJECT_TYPE_BULLET = "bullet";
export const OBJECT_TYPE_EQUIP = "equip";

// EQUIP_TYPES exist on client and server (and need to match)
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

export const PLANET_GREEN_FILE = "planet_green.png";
export const PLANET_PURPLE_FILE = "planet_purple.png";
export const PLANET_RED_FILE = "planet_red.png";
export const PLANET_ROCK_FILE = "planet_rock.png";
export const PLANET_TYPES = [PLANET_ROCK_FILE, PLANET_RED_FILE, PLANET_GREEN_FILE, PLANET_PURPLE_FILE];
export const WORMHOLE_SPRITE = "wormhole_sprite" // Flag value to do wormhole sprite handling

export const PLAYER_COLORS = ["0xFF1050","0x20CC20","0x5050EE","0xFFFF00","0xFF00FF","0x00FFFF","0xAA5510","0x999999"];

export const GLOBAL_RESOURCE_RATE = 0.1; // rate for all resources (more is faster generation)
export const GRAVITATIONAL_CONST = 2;
export const PLANET_DENSITY = new Map();
PLANET_DENSITY.set(PLANET_ROCK_FILE, 0.3);
PLANET_DENSITY.set(PLANET_RED_FILE, 0.3);
PLANET_DENSITY.set(PLANET_GREEN_FILE, 0.3);
PLANET_DENSITY.set(PLANET_PURPLE_FILE, 0.3);
PLANET_DENSITY.set(WORMHOLE_SPRITE, 15);

export const OUTER_RING_MIN = 10000; // This is where we dump extra planets that won't fit into the universe
export const OUTER_RING_MAX = 11000;

export const UNIVERSE_RINGS = [
  {
    planetCount: 1,
    minDist: 0, maxDist: 0,
    minDistToOtherPlanet: 500,
    minPlanetRadius: 300, maxPlanetRadius: 300,
    planetFiles: [PLANET_GREEN_FILE],
  },
  {
    planetCount: 6,
    minDist: 750, maxDist: 1000,
    minDistToOtherPlanet: 200,
    minPlanetRadius: 80, maxPlanetRadius: 100,
    planetFiles: [PLANET_PURPLE_FILE],
  },
  {
    planetCount: 12,
    minDist: 1100, maxDist: 1600,
    minDistToOtherPlanet: 150,
    minPlanetRadius: 100, maxPlanetRadius: 250,
    planetFiles: [PLANET_RED_FILE],
  },

  {
    planetCount: 70,
    minDist: 2000, maxDist: 3000,
    minDistToOtherPlanet: 150,
    minPlanetRadius: 100, maxPlanetRadius: 400,
    planetFiles: [PLANET_ROCK_FILE],
  },
];
