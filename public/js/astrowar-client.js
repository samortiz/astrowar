import * as c  from './client-constants.js'

// Connect to the server socket
const socket = io.connect(c.SERVER_URL);
socket.emit("connect-to-server");

let currentPlayer; // Player object for this player
let displayData = null; // data for drawing the screen
let keys = {}; // keypress handlers

let app; // PixiJS app

const system = {
  mainStage: null, // Pixi main
  screenWidth: c.SCREEN_WIDTH,   // can change
  screenHeight: c.SCREEN_HEIGHT,
  backgroundContainer: null,
  bgSprite: null, // stars
  planetSprites: [],
  planetContainer: null,
  bulletContainer: null,
  bulletSpriteMap: new Map(), // { filename: [bulletSprite, bulletSprite]}
};

let shipContainer;
let shipSprites = {}; // {player.id : sprite}

let explosionSprites = [];  // contains sprites
let explosionSpriteSheet = null;
let explosionContainer = null; // PixiJS container

window.playerJoinsGame = () => {
  const name = document.getElementById("name-input").value;
  document.getElementById("name-input").disabled = true;
  document.getElementById("join-btn").hidden = true;
  document.getElementById("move-btn").hidden = false;
  console.log('client calling join ');
  socket.emit("join", name);
}

// Player joins the game
socket.on("joined", (player) => {
  currentPlayer = player;
  console.log('Player has joined', player);
});

document.getElementById("move-btn").addEventListener("click", () => {
  const moveData = {dir:'x', amt: 10};
  console.log('called move ',moveData);
  socket.emit("move", moveData);
});

socket.on("update", newDisplayData => {
  displayData = newDisplayData;
  // console.log('updated', displayData);
});

// Setup the App
function setupGame() {
  system.mainStage = app.stage;
  setupBackground();
  setupPlanets();
  setupShips();
  setupBullets();
  setupExplosionGraphics();
  setupKeyboardListeners();
  app.ticker.add(delta => mainLoop(delta));
}

function createPixiApp() {
  app = new window.PIXI.Application({width: system.screenWidth, height: system.screenHeight});
  app.renderer.backgroundColor = "#efefef";
  window.PIXI.loader
      .add(c.SPRITE_SHEET_JSON)
      .add(c.CRASH_JSON)
      .load(setupGame);
  document.getElementById("main-display").appendChild(app.view);
}

function setupBackground() {
  system.backgroundContainer = new window.PIXI.Container();
  system.bgSprite = new window.PIXI.TilingSprite(
      window.PIXI.Texture.from(c.STAR_BACKGROUND_FILE),
      c.SCREEN_WIDTH,
      c.SCREEN_HEIGHT,
  );
  system.backgroundContainer.addChild(system.bgSprite);
  system.mainStage.addChild(system.backgroundContainer);
}


function setupShips() {
  shipContainer = new window.PIXI.Container();
  system.mainStage.addChild(shipContainer);
}

function setupBullets() {
  system.bulletContainer = new window.PIXI.Container();
  system.mainStage.addChild(system.bulletContainer);
}

function setupPlanets() {
  system.planetContainer = new window.PIXI.Container();
  system.mainStage.addChild(system.planetContainer);

}

// Main loop runs 60 times per sec
function mainLoop(delta) {
  drawScreen();
}

function setupKeyboardListeners() {
  keys.left = addKeyboardListener("ArrowLeft");
  keys.right = addKeyboardListener("ArrowRight");
  keys.up = addKeyboardListener("ArrowUp");
  keys.down = addKeyboardListener("ArrowDown");
  keys.space = addKeyboardListener(" ");
}

function getShipSprite(ship) {
  let sprite = shipSprites[ship.id];
  if (sprite) {
    return sprite;
  }
  let spriteSheet = window.PIXI.loader.resources[c.SPRITE_SHEET_JSON];
  sprite = new window.PIXI.Sprite(spriteSheet.textures["ship_explorer.png"]);
  sprite.position.set(ship.x, ship.y);
  sprite.anchor.set(0.5, 0.5);  // pivot on ship center
  sprite.scale.set(0.7, 0.7);
  sprite.rotation = 0;
  sprite.visible = true;
  shipContainer.addChild(sprite);
  shipSprites[ship.id] = sprite;
  console.log('ship sprite width ', sprite.width);
  return sprite;
}


function drawPlanetSprite(planet) {
  let sprite = system.planetSprites[planet.id];
  if (!sprite) {
    let spriteSheet = window.PIXI.loader.resources[c.SPRITE_SHEET_JSON];
    sprite = new window.PIXI.Sprite(spriteSheet.textures[planet.file]);
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(0.5, 0.5); // radius
    sprite.visible = true;
    system.planetContainer.addChild(sprite);
    system.planetSprites[planet.id] = sprite;
    console.log('new planet ', planet);
  }
  const { viewX, viewY } = getViewXy();
  const x = (planet.x - viewX) + (system.screenWidth / 2);
  const y = (planet.y - viewY) + (system.screenHeight / 2);
  sprite.position.set(x,y);
}

/**
 * Sets up a keyboard listener
 */
function addKeyboardListener(value) {
  let key = {};
  key.value = value.toLowerCase();
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key.toLowerCase() === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      socket.emit("keypress", {key:key.value, isDown:true});
    }
  };
  //The `upHandler`
  key.upHandler = event => {
    if (event.key.toLowerCase() === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      socket.emit("keypress", {key:key.value, isDown:false});
    }
  };
  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  window.addEventListener(
      "keydown", downListener, false
  );
  window.addEventListener(
      "keyup", upListener, false
  );
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  return key;
}

function getViewXy() {
  if (!displayData || !displayData.player) {
    return {viewX: 0, viewY: 0}
  }
  return {viewX: displayData.player.x, viewY:displayData.player.y};
}

function drawShip(ship) {
  const sprite = getShipSprite(ship);
  if (!ship.alive) {
    sprite.visible = false;
    // Hmm... we leak ship sprites here, should probably re-use them or remove them from the container
  }
  const { viewX, viewY } = getViewXy();
  const x = (ship.x - viewX) + (system.screenWidth / 2);
  const y = (ship.y - viewY) + (system.screenHeight / 2);
  sprite.position.set(x, y);
  sprite.rotation = ship.rotation;
}

function moveBackground() {
  const { viewX, viewY } = getViewXy();
  system.bgSprite.tilePosition.x = (100 - viewX) + (system.screenWidth / 2);
  system.bgSprite.tilePosition.y = (100 - viewY) + (system.screenHeight / 2);
}

function clearAllBulletSprites() {
  system.bulletSpriteMap.forEach((bulletSprites, filename) => {
    for (const bulletSprite of bulletSprites) {
      bulletSprite.visible = false;
    }
  });
}

function getBulletSprite(bullet) {
  let bulletSprites = system.bulletSpriteMap.get(bullet.filename);
  if (!bulletSprites || !bulletSprites.length) {
    bulletSprites = [];
    system.bulletSpriteMap.set(bullet.filename, bulletSprites);
  }
  let sprite = bulletSprites.find(bulletSprite => bulletSprite.visible === false);
  if (!sprite) {
    console.log('creating sprite for ', bullet);
    let spriteSheet = window.PIXI.loader.resources[c.SPRITE_SHEET_JSON];
    sprite = new window.PIXI.Sprite(spriteSheet.textures[bullet.filename]);
    sprite.x = -100;
    sprite.y = -100;
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(0.5, 0.5);
    system.bulletContainer.addChild(sprite);
    bulletSprites.push(sprite);
  }
  sprite.visible = true;
  return sprite;
}

function drawScreen() {
  if (!displayData) {
    return;
  }

  moveBackground();

  for (const ship of displayData.ships) {
    drawShip(ship);
  }

  for (const planet of displayData.planets) {
    drawPlanetSprite(planet);
  }

  const bullets = displayData.bullets;
  clearAllBulletSprites();
  for (const bullet of bullets) {
    const bulletSprite = getBulletSprite(bullet);
    const { viewX, viewY } = getViewXy();
    bulletSprite.x = (bullet.x - viewX) + (system.screenWidth / 2);
    bulletSprite.y = (bullet.y - viewY) + (system.screenHeight / 2);
  }

  for (let explosion of displayData.explosions) {
    showExplosion(explosion);
  }
}

function setupExplosionGraphics() {
  explosionSpriteSheet = window.PIXI.Loader.shared.resources[c.CRASH_JSON].spritesheet;
  explosionContainer = new window.PIXI.Container();
  system.mainStage.addChild(explosionContainer);
  // Preload an explosion sprite animation (these will be cached and reused in world.system.explosions)
  createExplosionSprite();
}

function createExplosionSprite() {
  let sprite = new window.PIXI.AnimatedSprite(explosionSpriteSheet.animations[c.CRASH]);
  sprite.id = "temp"; // will be assigned later (with x,y, and starting)
  sprite.animationSpeed = 0.4;
  sprite.loop = false;
  sprite.anchor.set(0.5, 0.5);
  sprite.scale.set(2, 2);
  sprite.x = 100;
  sprite.y = 100;
  sprite.loop = true;
  sprite.visible = false;
  explosionSprites.push(sprite);
  explosionContainer.addChild(sprite);
  // This function runs after the animation finishes a loop
  sprite.onLoop = () => {
    sprite.stop(); // pause until we crash again
    sprite.visible = false;
  };
  return sprite;
}

function showExplosion(explosionData) {
  if (explosionSprites.find(sprite => sprite.id === explosionData.id)) {
    // Explosion is already showing
    return;
  }
  let sprite = null;
  for (let explosionSprite of explosionSprites) {
    if (!explosionSprite.visible) {
      sprite = explosionSprite;
    }
  }
  if (!sprite) {
    sprite = createExplosionSprite();
  }
  const { viewX, viewY } = getViewXy();
  const x = (explosionData.x - viewX) + (system.screenWidth / 2)
  const y = (explosionData.y - viewY) + (system.screenHeight / 2)
  sprite.id = explosionData.id;
  sprite.x = x;
  sprite.y = y;
  sprite.visible = true;
  sprite.play(); // visible set to false when animation is done
}


createPixiApp();




