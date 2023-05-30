// Main Version
export const APP_VERSION = "0.01a";
// Colors
export const BLACK = 0X000000;
export const YELLOW = 0xFFCC55;
export const BLUE = 0x00AAFF;
export const WHITE = 0xFFFFFF;
export const DARKER_GREY = 0x202020;
export const DARK_GREY = 0x303030;
export const LIGHT_GREY = 0x909090;
export const GREY = 0x808080;
export const RED = 0x500000;
export const GREEN = 0x005000;
export const PURPLE = 0x500050;

export const SERVER_URL = "http://192.168.2.17:8080";

// Saved games
export const LOCALSTORAGE_GAME_NAMES_KEY = 'saved-game-names';

// Screen Layout
export const SCREEN_WIDTH = 1000;
export const SCREEN_HEIGHT = 1000;
export const HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
export const HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;
export const NEARBY_WIDTH = SCREEN_WIDTH * 3;
export const NEARBY_HEIGHT = SCREEN_HEIGHT * 3;
// size of minimap on screen
export const MINIMAP_WIDTH = 250;
export const MINIMAP_HEIGHT = 250;
export const HALF_MINIMAP_WIDTH = MINIMAP_WIDTH / 2;
export const HALF_MINIMAP_HEIGHT = MINIMAP_HEIGHT / 2;
// how far the minimap can view
export const MINIMAP_VIEW_WIDTH = 8000;
export const MINIMAP_VIEW_HEIGHT = 8000;
export const HALF_MINIMAP_VIEW_WIDTH = MINIMAP_VIEW_WIDTH / 2;
export const HALF_MINIMAP_VIEW_HEIGHT = MINIMAP_VIEW_HEIGHT / 2;
// convert minimap pixels to real pixels
export const MINIMAP_SCALE_X = MINIMAP_WIDTH / MINIMAP_VIEW_WIDTH;
export const MINIMAP_SCALE_Y = MINIMAP_HEIGHT / MINIMAP_VIEW_HEIGHT;

// OBJECT_TYPEs need to match client and server
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

// Files
export const SPRITESHEET_JSON = "images/spritesheet.json";
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
export const STAR_BACKGROUND_FILE = "images/stars.png";
export const CRASH_JSON = "images/crash.json";
export const CRASH = "crash"; // animation name in json
export const SMOKE_JSON = "images/smoke.json"
export const SMOKE = "smoke";


// MiniMap colors
export const MINIMAP_BORDER_COLOR = LIGHT_GREY;
export const MINIMAP_BACKGROUND_COLOR = DARK_GREY;
export const MINIMAP_SELECTED_PLANET_COLOR = YELLOW;
export const PLANET_COLORS = {
  [PLANET_ROCK_FILE]: GREY,
  [PLANET_RED_FILE]: RED,
  [PLANET_GREEN_FILE]: GREEN,
  [PLANET_PURPLE_FILE]: PURPLE,
  [WORMHOLE_SPRITE]: DARKER_GREY,
};
// Amount of space on the planet sprite (in pixels)
export const PLANET_SPRITE_GAP = {
  [PLANET_ROCK_FILE]: 10,
  [PLANET_RED_FILE]: 10,
  [PLANET_GREEN_FILE]: 30,
  [PLANET_PURPLE_FILE]: 35,
};
