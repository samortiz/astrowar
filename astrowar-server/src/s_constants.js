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

export const PLANET_GREEN_FILE = "planet_green.png";
export const PLANET_PURPLE_FILE = "planet_purple.png";
export const PLANET_RED_FILE = "planet_red.png";
export const PLANET_ROCK_FILE = "planet_rock.png";
export const PLANET_TYPES = [PLANET_ROCK_FILE, PLANET_RED_FILE, PLANET_GREEN_FILE, PLANET_PURPLE_FILE];
export const WORMHOLE_SPRITE = "wormhole_sprite" // Flag value to do wormhole sprite handling

export const PLAYER_COLORS = ["0xFF1050","0x20CC20","0x5050EE","0xFFFF00","0xFF00FF","0x00FFFF","0xAA5510","0x999999"];

export const GRAVITATIONAL_CONST = 2;
export const PLANET_DENSITY = new Map();
PLANET_DENSITY.set(PLANET_ROCK_FILE, 0.3);
PLANET_DENSITY.set(PLANET_RED_FILE, 0.3);
PLANET_DENSITY.set(PLANET_GREEN_FILE, 0.3);
PLANET_DENSITY.set(PLANET_PURPLE_FILE, 0.3);
PLANET_DENSITY.set(WORMHOLE_SPRITE, 15);

export const OUTER_RING_MIN = 50000; // This is where we dump extra planets that won't fit into the universe
export const OUTER_RING_MAX = 60000;

export const UNIVERSE_RINGS = [
  {
    planetCount: 50,
    minDist: 1500, maxDist: 6000,
    minDistToOtherPlanet: 200,
    minPlanetRadius: 150, maxPlanetRadius: 500,
    planetFiles: [PLANET_GREEN_FILE, PLANET_ROCK_FILE, PLANET_RED_FILE, PLANET_PURPLE_FILE],
  },

  {
    planetCount: 60,
    minDist: 3000, maxDist: 4000,
    minDistToOtherPlanet: 100,
    minPlanetRadius: 150, maxPlanetRadius: 500,
    planetFiles: [PLANET_GREEN_FILE, PLANET_ROCK_FILE, PLANET_RED_FILE, PLANET_PURPLE_FILE],
  },
];
