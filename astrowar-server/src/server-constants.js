export const APP_VERSION = "0.01a";
export const PORT = 8080;
export const SERVER_TICK_MS = 50;

export const RIGHT = 'arrowright';
export const LEFT = 'arrowleft';
export const UP = 'arrowup';
export const DOWN = 'arrowdown';
export const FIRE = ' ';
export const ALL_KEY_CODES = [RIGHT, LEFT, DOWN, UP, FIRE];

export const EXPLOSION_TTL_TICKS = 20;

export const OBJECT_TYPE_PLANET = "planet";
export const OBJECT_TYPE_SHIP = "ship";
export const OBJECT_TYPE_BULLET = "bullet";

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
export const BULLET_FILE = "bullet.png";
export const BULLET_BLUE_FILE = "bullet_blue.png";
export const BULLET_WHITE_FILE = "bullet_white.png";
export const FACTORY_FILE = "factory.png";
export const MINE_FILE = "mine"; // animation name in json
export const PLANET_GREEN_FILE = "planet_green.png";
export const PLANET_PURPLE_FILE = "planet_purple.png";
export const PLANET_RED_FILE = "planet_red.png";
export const PLANET_ROCK_FILE = "planet_rock.png";
export const PLANET_TYPES = [PLANET_ROCK_FILE, PLANET_RED_FILE, PLANET_GREEN_FILE, PLANET_PURPLE_FILE];
export const WORMHOLE_SPRITE = "wormhole_sprite" // Flag value to do wormhole sprite handling
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
    planetCount: 25,
    minDist: 6000, maxDist: 8000,
    minDistToOtherPlanet: 150,
    minPlanetRadius: 300, maxPlanetRadius: 500,
    planetFiles: [PLANET_GREEN_FILE],
  },
  {
    planetCount: 400,
    minDist: 1500, maxDist: 12000,
    minDistToOtherPlanet: 200,
    minPlanetRadius: 150, maxPlanetRadius: 500,
    planetFiles: [PLANET_ROCK_FILE, PLANET_RED_FILE, PLANET_PURPLE_FILE],
  },

];
