import {c} from './'
import io from 'socket.io-client'
import * as utils from './utils.js'

/**
 * Creates an empty world object, with only basic properties.
 * This will be populated by setupWorld()
 */
export function createEmptyWorld() {
  return {
    appVersion: c.APP_VERSION,
    ship: null,
    view: { // global XY for current view (in manage mode, always ship.xy in fly mode)
      x: 0,
      y: 0,
    },
    planets: [], // from server getJoinData()
    equip: {upgrades:[], primary_weapons:[], secondary_weapons:[], droids:[], ships:[] }, // from server getJoinData()
    gameTickCount: 0,
    maxId: 1000, // generating unique id (unique to front-end only)
    displayData: null, // sent from the server
    // everything in system is transient and not serialized when saving the game
    system: {
      socket:null, // socket to talk to the server
      keys: {}, // Global keypress handlers
      buttonKeyDown : {up:false, right:false, down:false, left:false, shoot:false}, // true when a button is depressed
      app: null, // Pixi App
      isTyping: false, // used to stop keypress events ('w') when user is typing in input
      gameLoop: null, // loop function in this state
      bgSprite: null, // star background
      smokeSheet: null, // spritesheet for smoke animation
      explosionSheet: null, // spritesheet for explosions
      planetSprites: {}, // {"123" : sprite }
      shipSpriteCache: {}, //  {"explorer.png" : [{ id:242|null, sprite:obj, shieldSprites: {"shield_white.png" : spriteObj ... } }]}
      bulletSpriteCache: {}, //  {"bullet.png" : [{ id:242|null, sprite:obj }]}
      explosionSpriteDataList: [], //  [{ id:242|null, x:123, y:123, sprite:obj }]
      spriteContainers: {background: null, planets: null, bullets: null, ships: null, minimap: null, explosions:null},
      screenHeight: c.SCREEN_HEIGHT, // changed based on window size
      screenWidth: c.SCREEN_WIDTH, // changed in App.js based on window size
      screenScale: 1, // scale due to window sizing
      miniMapGraphics: null, // used as a canvas for drawing the miniMap
      initializing: true, // set to false when the game fully running (after first draw)
    },
  };
}

export function setupWorld() {
  connectToServer();
  setupSpriteContainers();
  createBackground();
}

/**
 * Connect to the server socket
 */
export function connectToServer() {
  window.world.system.socket = io.connect(c.SERVER_URL);
  window.world.system.socket.emit("connect-to-server");
}


/**
 * Sets up the sprite containers in the correct display order
 */
export function setupSpriteContainers() {
  let mainStage = window.world.system.app.stage;
  let spriteContainers = window.world.system.spriteContainers;

  // Add all the containers, the order here will control which images are on top
  spriteContainers.background = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.background);

  spriteContainers.planets = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.planets);

  spriteContainers.bullets = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.bullets);

  spriteContainers.ships = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.ships);

  spriteContainers.explosions = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.explosions);

  spriteContainers.minimap = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.minimap);
  setupMiniMap();
}

export function setupMiniMap() {
  let container = window.world.system.spriteContainers.minimap;
  let miniMapContainer = new window.PIXI.Container();
  container.addChild(miniMapContainer);

  // Mask so drawings don't spill out of the map
  let mask = new window.PIXI.Graphics();
  mask.drawRect(0, c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT, c.MINIMAP_WIDTH, c.SCREEN_HEIGHT);
  mask.renderable = true;
  mask.cacheAsBitmap = true;
  miniMapContainer.addChild(mask);
  miniMapContainer.mask = mask;

  // Graphics for drawing shapes on
  let g = new window.PIXI.Graphics();
  miniMapContainer.addChild(g);
  window.world.system.miniMapGraphics = g;
}

export function createBackground() {
  let container = window.world.system.spriteContainers.background;
  window.world.system.bgSprite = new window.PIXI.TilingSprite(
    window.PIXI.Texture.from(c.STAR_BACKGROUND_FILE),
    c.SCREEN_WIDTH,
    c.SCREEN_HEIGHT,
  );
  container.addChild(window.world.system.bgSprite);
}

/**
 * Called when the user clicks on the screen
 */
export function click(event) {
  let x = event.data.global.x;
  let y = event.data.global.y;
  const screenScale = window.world.system.screenScale;
  let scaledX = x / screenScale;
  let scaledY = y / screenScale;
  console.log(`click on ${scaledX}, ${scaledY}`);
}

export function getViewXy() {
  const displayData = window.world.displayData;
  if (!displayData || !displayData.player) {
    return {viewX: 0, viewY: 0}
  }
  return {viewX: displayData.player.x, viewY:displayData.player.y};
}

export function generateUniqueId() {
  window.world.maxId += 1;
  return window.world.maxId;
}

/**
 * Client-Side afford check!  NOTE: This is not guaranteed to work the server will make the final call!
 * Checks if the combined resources of planet and ship can afford the resources
 * Call this before calling payResourceCost
 * @return true if there are enough resources available
 */
export function canAfford(planet, ship, resources) {
  let titanium = 0;
  let gold = 0;
  let uranium = 0;
  if (planet && planet.resources) {
    titanium += utils.getInt(planet.resources.titanium, 0);
    gold += utils.getInt(planet.resources.gold, 0);
    uranium += utils.getInt(planet.resources.uranium, 0);
  }
  if (ship && ship.resources) {
    titanium += utils.getInt(ship.resources.titanium, 0);
    gold += utils.getInt(ship.resources.gold, 0);
    uranium += utils.getInt(ship.resources.uranium, 0);
  }
  return (titanium >= resources.titanium)
      && (gold >= resources.gold)
      && (uranium >= resources.uranium);
}
