import * as utils from './s_utils.js'
import * as c from './s_constants.js'
import * as b from './s_blueprints.js'
import * as server from "./astrowar-server.js";
import * as manage from './s_manage.js'

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
}
setupWorld();

// Go through all the rings and create planet objects
function createPlanets() {
  for (let ring of c.UNIVERSE_RINGS) {
    for (let i = 0; i < ring.planetCount; i++) {
      let fileName = ring.planetFiles[utils.randomInt(0, ring.planetFiles.length - 1)];
      let radius = utils.randomInt(ring.minPlanetRadius, ring.maxPlanetRadius);
      let mass = radius * radius * c.PLANET_DENSITY.get(fileName);

      const generateResources = {titanium:0, gold:0, uranium:0};
      if (fileName === c.PLANET_ROCK_FILE) {
        generateResources.titanium = 1;
      } else if (fileName === c.PLANET_RED_FILE) {
        generateResources.gold = 1;
      } else if (fileName === c.PLANET_PURPLE_FILE) {
        generateResources.uranium = 1;
      } else if (fileName === c.PLANET_GREEN_FILE) {
        generateResources.titanium = 2;
        generateResources.gold = 2;
        generateResources.uranium = 2;
      }

      // Setup the planet
      let planet = createPlanet(fileName, radius, mass, generateResources);
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
function getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, failCount = 0) {
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
function nearestPlanetDistance(origPlanet, x, y) {
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
  ship.radius =  21;  // This needs to match the scale and imageSize (how to calculate on the server?)
  ship.resources = {titanium: 0, gold: 0, uranium: 0};
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
  player.x = utils.randomInt(0, 1000) * (utils.randomBool() ? 1 : -1);
  player.y = utils.randomInt(0, 1000) * (utils.randomBool() ? 1 : -1);
  const ship = createShip(b.SHIP_EXPLORER, player);
  world.ships.push(ship);
  player.currentShip = ship;
  player.alive = true;
}

export function startUsingShip(player, newShip, planet) {
  if (!player) {
    console.warn("Cannot use ship without a player");
    return null;
  }
  const oldShip = player.currentShip;
  newShip.playerId = player.id;
  newShip.color = player.color;
  // Remove the new ship from the planet
  const shipIndex = planet.ships.find(s => s.id === newShip.id);
  if (shipIndex) {
    planet.ships.splice(shipIndex, 1);
  } else {
    console.warn("unable to remove newShip ", newShip, " from ", planet.ships);
  }
  // Add the old ship to the planet
  planet.ships.push(oldShip);
  oldShip.inStorage = true;
  // Set the new ship's location
  player.x = oldShip.x;
  player.y = oldShip.y;
  newShip.x = oldShip.x;
  newShip.y = oldShip.y;
  newShip.inStorage = false;
  player.currentShip = newShip;
}

export function createPlayer(socket, name) {
  const color = getRandomPlayerColor();
  const player = {
    id: generateUniqueId(),
    color: color,
    socketId: socket.id,
    name,
    currentShip: null,
    x: 0, // replaced soon
    y: 0, // replaced soon
    deathCount: 0
  };
  world.players.push(player);
  setupNewShipForPlayer(player);
  server.playerSockets[player.socketId] = socket;
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
  return "0xEFEFEF";
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

export function createPlanet(imageFile, radius, mass, generateResources) {
  let planet = {};
  planet.id = generateUniqueId();
  planet.objectType = c.OBJECT_TYPE_PLANET;
  planet.imageFile = imageFile;
  planet.x = 0; // temp should get reset
  planet.y = 0; // temp should get reset
  planet.mass = mass;
  planet.resources = {titanium:0, gold:0, uranium:0};
  planet.generateResources = generateResources;
  planet.ships = []; // stored ships
  planet.equip = []; // stored equipment
  planet.radius = radius;
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

export function createExplosion(x, y) {
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
}

export function generateUniqueId() {
  world.maxId = world.maxId + 1;
  return world.maxId;
}
