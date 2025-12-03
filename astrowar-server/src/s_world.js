import * as utils from './s_utils.js'
import * as c from './s_constants.js'
import * as b from './s_blueprints.js'
import * as server from "./astrowar-server.js";
import * as manage from './s_manage.js'
import * as run from './s_run.js'

export const world = {
  players: [],
  ships: [],
  planets: [],
  bullets: [],
  explosions: [],
  maxId: 1000, // unique to back-end only (may conflict with BE id)
};

function setupWorld() {
  createPlanets();
  createPlayer(null, c.ALIEN_PLAYER_NAME);
}
setupWorld();

// Go through all the rings and create planet objects
function createPlanets() {
  for (let ring of b.UNIVERSE_RINGS) {
    for (let i = 0; i < ring.planetCount; i++) {
      let fileName = ring.planetFiles[utils.randomInt(0, ring.planetFiles.length - 1)];
      let radius = utils.randomInt(ring.minPlanetRadius, ring.maxPlanetRadius);
      let mass = radius * radius * c.PLANET_DENSITY.get(fileName);
      // Setup the planet
      let planet = createPlanet(fileName, radius, mass);
      let {x, y} = getFreeXy(planet, ring.minDistToOtherPlanet, 0, ring.minDist, ring.maxDist);
      planet.x = x;
      planet.y = y;
      console.log('created planet at ', x, ',', y, ' mass=',mass);
    } // for i
  } // for ring
}

/**
 * Find a free spot of space to stick something
 * This will recurse until it finds a free spot.
 * @return {{x, y}}
 */
export function getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, failCount = 0) {
  let dir = utils.randomFloat(0, Math.PI * 2);
  let dist = utils.randomInt(minDist, maxDist);
  let {x, y} = utils.getPointFrom(0, 0, dir, dist);
  if (failCount > 200) {
    // If we tried a lot of times and can't find a spot, we will dump the object into the outer ring
    console.warn("Had a hard time finding a spot in ring "+minDist+"-"+maxDist+" dumping to outer ring");
    return getFreeXy(planet, minDistToPlanet, minDistToAlien, c.OUTER_RING_MIN, c.OUTER_RING_MAX, 0);
  }
  if (minDistToPlanet > 0) {
    let {nearestPlanetDist} = nearestPlanetDistance(planet, x, y);
    if (nearestPlanetDist < minDistToPlanet) {
      return getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, ++failCount);
    }
  }
  return {x, y};
}

/**
 * Distance to the nearest planet that is not equal to origPlanet
 * @return {{nearestPlanetDist: number, nearestPlanet: null}}
 */
export function nearestPlanetDistance(origPlanet, x, y) {
  let minDist = 99999999999;
  let nearestPlanet = null;
  for (let planet of world.planets) {
    if (planet !== origPlanet) {
      let dist = utils.distanceBetween(x, y, planet.x, planet.y) - planet.radius;
      if (origPlanet) {
        dist -= origPlanet.radius;
      }
      if (!nearestPlanet || (dist < minDist)) {
        minDist = dist;
        nearestPlanet = planet;
      }
    }
  } // for planet
  return {nearestPlanet: nearestPlanet, nearestPlanetDist: minDist};
}

export function createShip(shipBlueprint, player) {
  const ship  = utils.cloneDeep(shipBlueprint);
  ship.id =  generateUniqueId();
  ship.playerId = player?.id;
  ship.color = player?.color;
  ship.alive = true;
  ship.inStorage = false;
  ship.landed = false;
  ship.x = player.x;
  ship.y = player.y;
  ship.vx = 0;
  ship.vy = 0;
  ship.rotation = 0;
  ship.radius =  ship.imageRadius;
  ship.armor = ship.armorMax;
  // Create copies of all the equip on the ship
  ship.equip = []
  for (const equipBlueprint of shipBlueprint.equip) {
    ship.equip.push(manage.makeEquip(equipBlueprint));
  }
  ship.selectedSecondaryWeaponIndex = null; // no secondary weapon selected initially
  return ship;
}

export function setupNewShipForPlayer(player) {
  if (!player) {
    console.warn("Cannot make new ship without a player");
    return null;
  }
  // Remove the old ship (if it's still around)
  if (player && player.currentShip && player.currentShip.alive) {
    player.currentShip.alive = false;
  }
  // Spawn somewhere in the outside ring
  let {x, y} = utils.getRandomPointDistanceFrom(0,0, 2000, 3000);
  player.x = x;
  player.y = y;
  const ship = createShip(b.SHIP_FIGHTER, player);
  for (let i=0; i<2; i++) {
    const armor = manage.makeEquip(b.EQUIP_ARMOR);
    ship.equip.push(armor);
    manage.addEquip(ship, armor);
  }
  // setupTempStartupItems(ship);  // Not needed right now, maybe we want this later
  world.ships.push(ship);
  player.currentShip = ship;
  player.alive = true;
}

/**
 * This will add some temporary items to help a new player survive the first minute
 */
export function setupTempStartupItems(ship) {
  // A jump to help the player get out of range of aggressive enemies
  const jump = manage.makeEquip(b.EQUIP_JUMP);
  jump.self_destruct_lifetime = 500;
  ship.equip.push(jump);

  // Scanner cloak will keep the player alive for a while
  const cloak = manage.makeEquip(b.EQUIP_CLOAK);
  cloak.self_destruct_lifetime = 500;
  ship.equip.push(cloak);
  const cloakIndex = ship.equip.findIndex(e => e.id === cloak.id);
  manage.selectSecondaryWeaponIndex(ship, cloakIndex);
  run.fireSecondaryWeapon(ship);
  cloak.lifetime.lifetime = 500; // give the user enough time to get away from enemies!

  // Select the jump
  const jumpIndex = ship.equip.findIndex(e => e.id === jump.id);
  manage.selectSecondaryWeaponIndex(ship, jumpIndex);
}

export function startUsingShip(player, newShip, planet) {
  if (!player) {
    console.warn("Cannot use ship without a player");
    return null;
  }
  const oldShip = player.currentShip;
  newShip.playerId = player.id;
  newShip.color = player.color;
  // Remove the new ship from the planet storage
  const shipIndex = planet.ships.findIndex(s => s.id === newShip.id);
  if (shipIndex >= 0) {
    planet.ships.splice(shipIndex, 1);
  } else {
    console.warn("unable to remove newShip ", newShip, " from ", planet.ships);
    return;
  }
  // Add the old ship to the planet
  planet.ships.push(oldShip);
  oldShip.inStorage = true;
  newShip.inStorage = false;
  player.currentShip = newShip;

  // Set the new ship's location
  newShip.x = oldShip.x;
  newShip.y = oldShip.y;
  run.landShip(newShip, planet) // land so we end up on the surface with different ship sizes
  player.x = newShip.x;
  player.y = newShip.y;
}

export function createPlayer(socket, name) {
  const color = getRandomPlayerColor();
  const player = {
    id: generateUniqueId(),
    color: color,
    socketId: socket ? socket.id : null,
    name,
    currentShip: null,
    x: 0, // replaced soon
    y: 0, // replaced soon
    deathCount: 0,
    score: 0,
    loadouts: [], // {name:'asf', blueprint:{...}}  Ship blueprints to make equipping faster
  };
  world.players.push(player);
  if (socket) {
    setupNewShipForPlayer(player);
    server.playerSockets[player.socketId] = socket;
  }
  console.log("Added player ", player);
  return player;
}

/**
 * Choose a random color for the player
 */
export function getRandomPlayerColor() {
  const usedColors = world.players.map(p => p.color);
  for (let i=0; i<c.PLAYER_COLORS.length; i++) {
    if (!usedColors.includes(c.PLAYER_COLORS[i])) {
      return c.PLAYER_COLORS[i];
    }
  }
  return "0x"+utils.randomHex(6);
}

export function getPlayer(socketId) {
  const player = world.players.find(player => player.socketId === socketId);
  if (!player) {
    console.warn('Unable to find player with id ', socketId);
    return null;
  }
  return player;
}

export function getPlayerSocket(socketId) {
  const socket = server.playerSockets[socketId];
  if (!socket) {
    console.warn('Unable to find socket for player with id ', socketId);
    return null;
  }
  return socket;
}

export function createPlanet(imageFile, radius, mass) {
  let planet = {};
  planet.id = generateUniqueId();
  planet.objectType = c.OBJECT_TYPE_PLANET;
  planet.imageFile = imageFile;
  planet.x = 0; // temp should get reset
  planet.y = 0; // temp should get reset
  planet.mass = mass;
  planet.ships = []; // stored ships
  planet.equip = []; // stored equipment
  planet.radius = radius;
  planet.ownerId = null; // set when landing
  planet.ownerColor = null; // set when landing
  world.planets.push(planet);
  return planet;
}

// Makes a new bullet (reusing objects in the world.bullets array)
export function createBullet(x, y, vx, vy, gun, rotation) {
  const bullet = {
    id: generateUniqueId(),
    objectType: c.OBJECT_TYPE_BULLET,
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    ttl: gun.lifetime,
    damage: gun.damage,
    imageFile: gun.imageFile,
    radius: gun.bulletRadius,
    rotation: rotation,
  };
  world.bullets.push(bullet);
  return bullet;
}

export function createExplosion(x, y, scale=2.0) {
  let explosion = null;
  for (let existingExplosion of world.explosions) {
    if (existingExplosion.ttl <= 0) {
      explosion = existingExplosion;
    }
  }
  // No old explosions found, we'll make a new one
  if (!explosion) {
    explosion = {};
    world.explosions.push(explosion);
  }
  explosion.id = generateUniqueId();
  explosion.x = x;
  explosion.y = y;
  explosion.ttl = c.EXPLOSION_TTL_TICKS;
  explosion.scale = scale;
}

export function generateUniqueId() {
  world.maxId = world.maxId + 1;
  return world.maxId;
}

/**
 * @returns true if this ship is the current ship for any player
 */
export function isPlayerShip(ship) {
  for (const player of world.players) {
    if (player.currentShip && player.currentShip.id === ship.id) {
      return true;
    }
  }
  return false;
}


/**
 * Saves a loadout ship
 */
export function saveLoadout(player, ship, name) {
  const shipBlueprint = utils.cloneDeep(ship);
  shipBlueprint.id = null;
  let loadout = player.loadouts.find(l => l.name === name);
  if (!loadout) {
    loadout = {'name':name, blueprint:shipBlueprint}
    player.loadouts.push(loadout);
  } else {
    loadout.blueprint = shipBlueprint;
  }
}

/**
 * Equips a ship with loadout data
 */
export function equipLoadout(player, name) {
  let loadout = player.loadouts.find(l => l.name === name);
  if (!loadout || !loadout.blueprint) {
    console.log('Could not find loadout named ', name, ' with blueprint in player.loadouts ', player.loadouts);
    return;
  }
  const planet = player.selectedPlanet;
  if (!player.selectedPlanet) {
    console.log('Cannot equip loadout with no selected planet');
    return;
  }
  const oldShip = player.currentShip;

  let newShip = createShip(loadout.blueprint, player);
  newShip.inStorage = true;
  planet.ships.push(newShip);
  world.ships.push(newShip);
  startUsingShip(player, newShip, planet);
  // Remove the old ship from the planet (it ceases to exist)
  planet.ships = planet.ships.filter(s => s.id !== oldShip.id);
}
