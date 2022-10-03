import {c, game, manage, utils} from './';
import {generateUniqueId} from "./game";

// Main play mode - flying
export function flyLoop(delta) {
  if (delta > 1.005) {
    console.log('Lagging with delta=' + delta);
  }
  drawScreen();
}

// Main drawing function (called repeatedly even if data hasn't changed)
export function drawScreen() {
  const displayData = window.world.displayData;
  if (!displayData) {
    return;
  }
  updatePlayer(displayData.player);
  moveBackground();
  drawAllPlanets();
  drawAllShips(displayData.ships);
  drawAllBullets(displayData.bullets);
  drawExplosions(displayData.explosions);
  drawMiniMap();
}


function updatePlayer(player) {
  window.world.view.x = player.x;
  window.world.view.y = player.y;
}

function moveBackground() {
  const { viewX, viewY } = game.getViewXy();
  const system = window.world.system;
  system.bgSprite.tilePosition.x = (100 - viewX) + (system.screenWidth / 2);
  system.bgSprite.tilePosition.y = (100 - viewY) + (system.screenHeight / 2);
}

function drawAllShips(ships) {
  const system = window.world.system;
  const { viewX, viewY } = game.getViewXy();
  for (const ship of ships) {
    const sprite = getShipSprite(ship);
    const x = (ship.x - viewX) + (system.screenHeight / 2);
    const y = (ship.y - viewY) + (system.screenHeight / 2);
    sprite.position.set(x, y);
    sprite.rotation = ship.rotation;
  }
  // Check for sprites with no ship (ship died on server) - need to set visible to false
  const shipIds = ships.map(ship => ship.id);
  for (let [imageFile, spriteDataList] of Object.entries(window.world.system.shipSpriteCache)) {
    const deadShipDataList = spriteDataList.filter(data => data.shipId != null && !shipIds.includes(data.shipId));
    for (const deadShipData of deadShipDataList) {
      console.log('marked ship as dead ', deadShipData.shipId);
      deadShipData.shipId = null;
      deadShipData.sprite.visible = false;
    }
  }
}

/**
 * Finds or creates a sprite for the ship
 * if no free sprite is found, then a free one will be looked up, failing that new one will be created
 */
function getShipSprite(ship) {
  let shipSpriteDataList = window.world.system.shipSpriteCache[ship.imageFile];
  // No list of sprites for this kind of ship yet - make a new list
  if (!shipSpriteDataList) {
    shipSpriteDataList = [];
    window.world.system.shipSpriteCache[ship.imageFile] = shipSpriteDataList;
  }
  let spriteData = shipSpriteDataList.find(data => data.shipId === ship.id);
  if (spriteData) {
    return spriteData.sprite;
  }
  // Ship is not found in spriteDataList we will look for a free ship (died earlier)
  spriteData = shipSpriteDataList.find(data => data.shipId == null);
  if (spriteData) {
    // We will assign this spriteData to this ship (reserve the sprite until the ship dies)
    spriteData.shipId = ship.id;
    const sprite = spriteData.sprite;
    sprite.scale.set(1, 1); // need to set scale to 1 so we can get sprite width accurately
    const scale = (ship.radius * 2) / sprite.width; // Recalculate scale as it's a different ship
    sprite.scale.set(scale, scale);
    sprite.visible = true;
    return sprite;
  }
  // Here we could not find any sprite for this ship, and there are no free ones left - create a new one
  let spriteSheet = window.PIXI.loader.resources[c.SPRITESHEET_JSON];
  const sprite = new window.PIXI.Sprite(spriteSheet.textures[ship.imageFile]);
  sprite.anchor.set(0.5, 0.5);  // pivot on ship center
  sprite.visible = true;
  sprite.position.set(100, 100); // will be changed later
  const scale = (ship.radius * 2) / sprite.width;
  sprite.scale.set(scale, scale);
  window.world.system.spriteContainers.ships.addChild(sprite);
  shipSpriteDataList.push({shipId:ship.id, sprite:sprite });
  return sprite;
}


function drawAllPlanets() {
  for (const planet of window.world.planets) {
    drawPlanetSprite(planet);
  }
}

function drawPlanetSprite(planet) {
  const system = window.world.system;
  let sprite = system.planetSprites[planet.id];
  if (!sprite) {
    let spriteSheet = window.PIXI.loader.resources[c.SPRITESHEET_JSON];
    sprite = new window.PIXI.Sprite(spriteSheet.textures[planet.imageFile]);
    sprite.anchor.set(0.5, 0.5);
    const scale = (planet.radius * 2) / sprite.width;
    sprite.scale.set(scale, scale);
    sprite.visible = true;
    system.spriteContainers.planets.addChild(sprite);
    system.planetSprites[planet.id] = sprite;
  }
  const { viewX, viewY } = game.getViewXy();
  const x = (planet.x - viewX) + (system.screenHeight / 2);
  const y = (planet.y - viewY) + (system.screenHeight / 2);
  sprite.position.set(x,y);
}

function drawAllBullets(bullets) {
  const system = window.world.system;
  const { viewX, viewY } = game.getViewXy();
  for (const bullet of bullets) {
    const sprite = getBulletSprite(bullet);
    const x = (bullet.x - viewX) + (system.screenHeight / 2);
    const y = (bullet.y - viewY) + (system.screenHeight / 2);
    sprite.position.set(x, y);
  }
  // Check for sprites with no bullet (died on server) - need to set visible to false
  const bulletIds = bullets.map(bullet => bullet.id);
  for (let [imageFile, dataList] of Object.entries(window.world.system.bulletSpriteCache)) {
    const deadBulletDataList = dataList.filter(data => data.bulletId != null && !bulletIds.includes(data.bulletId));
    for (const deadBulletData of deadBulletDataList) {
      deadBulletData.bulletId = null;
      deadBulletData.sprite.visible = false;
    }
  }
}

/**
 * Finds or creates a sprite for the bullet
 * if no assigned sprite is found, then a free sprite will be looked up, failing that a new one will be created
 */
function getBulletSprite(bullet) {
  let bulletSpriteDataList = window.world.system.bulletSpriteCache[bullet.imageFile];
  // No list of sprites for this kind of bullet yet - make a new list
  if (!bulletSpriteDataList) {
    bulletSpriteDataList = [];
    window.world.system.bulletSpriteCache[bullet.imageFile] = bulletSpriteDataList;
  }
  let spriteData = bulletSpriteDataList.find(data => data.bulletId === bullet.id);
  if (spriteData) {
    return spriteData.sprite;
  }
  // Bullet is not found in spriteDataList we will look for a free bullet sprite
  spriteData = bulletSpriteDataList.find(data => data.bulletId == null);
  if (spriteData) {
    // We will assign this spriteData to this bullet (reserve the sprite until the bullet dies)
    spriteData.bulletId = bullet.id;
    const sprite = spriteData.sprite;
    sprite.scale.set(1, 1); // need to set scale to 1 so we can get sprite width accurately
    const scale = (bullet.radius * 2) / sprite.width; // Recalculate scale as it's a different bullet
    sprite.scale.set(scale, scale);
    sprite.visible = true;
    sprite.rotation = bullet.rotation;
    return sprite;
  }
  // Here we could not find any sprite for this bullet, and there are no free ones left - create a new one
  let spriteSheet = window.PIXI.loader.resources[c.SPRITESHEET_JSON];
  const sprite = new window.PIXI.Sprite(spriteSheet.textures[bullet.imageFile]);
  sprite.anchor.set(0.5, 0.5);  // pivot on bullet center
  sprite.visible = true;
  sprite.rotation = bullet.rotation;
  sprite.position.set(100, 100); // will be changed later
  const scale = (bullet.radius * 2) / sprite.width;
  sprite.scale.set(scale, scale);
  window.world.system.spriteContainers.bullets.addChild(sprite);
  bulletSpriteDataList.push({bulletId:bullet.id, sprite:sprite });
  return sprite;
}

function drawExplosions(explosions) {
  const system = window.world.system;
  const { viewX, viewY } = game.getViewXy();
  // We need to keep updating explosions that are no longer being sent from the server until the animation is done
  for (const data of system.explosionSpriteDataList) {
    // If we have an id this is an already playing explosion - we have all the data we need
    if (data.id) {
      const sprite = data.sprite;
      const x = (data.x - viewX) + (system.screenHeight / 2);
      const y = (data.y - viewY) + (system.screenHeight / 2);
      sprite.position.set(x, y);
    }
  } // for data

  for (const explosion of explosions) {
    // For any new explosions showing up on the screen for the first time
    if (!system.explosionSpriteDataList.find(data => data.id === explosion.id)) {
      const sprite = getExplosionSprite(explosion);
      const x = (explosion.x - viewX) + (system.screenHeight / 2);
      const y = (explosion.y - viewY) + (system.screenHeight / 2);
      sprite.position.set(x, y);
    }
  }
}

/**
 * Finds or creates a sprite for the explosion
 * These are animations, they are started, then the x,y position is updated, when the animations finishes they unresgister themself
 */
function getExplosionSprite(explosion) {
  const system = window.world.system;
  let spriteData = system.explosionSpriteDataList.find(data => data.id == null);
  if (spriteData) {
    spriteData.id = explosion.id;
    spriteData.x = explosion.x;
    spriteData.y = explosion.y;
    spriteData.sprite.visible = true;
    spriteData.sprite.play();
    console.log('re-using explosion');
    return spriteData.sprite;
  }
  const explosionSpritesheet = window.PIXI.Loader.shared.resources[c.CRASH_JSON].spritesheet;
  const sprite = new window.PIXI.AnimatedSprite(explosionSpritesheet.animations[c.CRASH]);
  sprite.id = generateUniqueId();
  sprite.animationSpeed = 0.4;
  sprite.loop = false;
  sprite.anchor.set(0.5, 0.5);
  sprite.scale.set(2, 2);
  sprite.x = 100; // has to be calculated based on view
  sprite.y = 100;
  sprite.loop = true;
  sprite.visible = true;
  system.spriteContainers.explosions.addChild(sprite);
  system.explosionSpriteDataList.push({id:explosion.id, x:explosion.x, y:explosion.y, sprite:sprite});
  sprite.play();
  // This function runs after the animation finishes
  sprite.onLoop = () => {
    console.log('explosion finished');
    sprite.stop(); // pause until we crash again
    sprite.visible = false;
    // When the animation is finished, release this explosion so it can be reused
    const data = system.explosionSpriteDataList[explosion.id];
    if (data) {
      data.id = null;
    }
  };
  console.log('new explosion');
  return sprite;
}

export function drawMiniMap() {
  const selectedPlanet = window.world?.displayData?.player?.selectedPlanet;
  let g = window.world.system.miniMapGraphics;
  let view = window.world.view;
  let l = 0;
  let t = c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT;
  let r = c.MINIMAP_WIDTH;
  let b = c.SCREEN_HEIGHT;
  g.clear();
  // Background
  g.beginFill(c.MINIMAP_BACKGROUND_COLOR);
  g.lineStyle(1, c.MINIMAP_BORDER_COLOR);
  g.drawRect(l, t, r, b);
  g.endFill();
  // Planets
  for (let planet of window.world.planets) {
    if (planetOnMap(view, planet)) {
      let x = l + c.HALF_MINIMAP_WIDTH + ((planet.x - view.x) * c.MINIMAP_SCALE_X);
      let y = t + c.HALF_MINIMAP_HEIGHT + ((planet.y - view.y) * c.MINIMAP_SCALE_Y);
      const planetColor = selectedPlanet && selectedPlanet.id === planet.id ? c.MINIMAP_SELECTED_PLANET_COLOR : c.PLANET_COLORS[planet.imageFile];
      g.lineStyle(2, planetColor);
      g.beginFill(planetColor);
      g.drawCircle(x, y, planet.radius * c.MINIMAP_SCALE_X);
      g.endFill();
    }
  }
  // Ships
  for (let ship of window.world.displayData.ships) {
    const x = l + c.HALF_MINIMAP_WIDTH + ((ship.x - view.x) * c.MINIMAP_SCALE_X);
    const y = t + c.HALF_MINIMAP_HEIGHT + ((ship.y - view.y) * c.MINIMAP_SCALE_Y);
    g.lineStyle(1, ship.color);
    g.beginFill(ship.color);
    g.drawCircle(x, y, 2);
    g.endFill();
  }

}

function planetOnMap(view, planet) {
  // Right side
  return !((view.x + c.HALF_MINIMAP_VIEW_WIDTH + planet.radius < planet.x) || // Right
      (view.x - c.HALF_MINIMAP_VIEW_WIDTH - planet.radius > planet.x) || // Left
      (view.y + c.HALF_MINIMAP_VIEW_HEIGHT + planet.radius < planet.y) || // Bottom
      (view.y - c.HALF_MINIMAP_VIEW_HEIGHT - planet.radius > planet.y));
}