import {c, fly, game, manage} from './'
import io from 'socket.io-client'

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
    currentPlayer: null,
    planets: [], // planet data
    gameTickCount: 0,
    maxId: 1000, // generating unique id (unique to front-end only)
    displayData: null, // sent from the server
    // everything in system is transient and not serialized when saving the game
    system: {
      socket:null, // socket to talk to the server
      keys: {}, // Global keypress handlers
      buttonKeyDown : {up:false, right:false, down:false, left:false, shoot:false}, // true when a button is depressed
      app: null, // Pixi App
      gameState: c.GAME_STATE.INIT, // Current game state
      isTyping: false, // used to stop keypress events ('w') when user is typing in input
      gameLoop: null, // loop function in this state
      bgSprite: null, // star background
      smokeSheet: null, // spritesheet for smoke animation
      explosionSheet: null, // spritesheet for explosions
      planetSprites: {}, // {"123" : sprite }
      shipSpriteCache: {}, //  {"explorer.png" : [{ id:242|null, sprite:obj }]}
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

export function changeGameState(newState) {
  const world = window.world;
  world.system.gameState = newState;
  console.log('set state to ', newState);
  if (newState === c.GAME_STATE.FLY) {
    fly.enterFlyState();
    world.system.gameLoop = fly.flyLoop;
  } else if (newState === c.GAME_STATE.MANAGE) {
    manage.enterManageState();
    world.system.gameLoop = manage.manageLoop;
  } else {
    world.system.gameLoop = null;
  }
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
