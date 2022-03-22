import * as server from './astrowar-server.js'
import * as util from './utils.js'
import * as c from './server-constants.js'
import {playerKeys} from "./astrowar-server.js";
import {generateUniqueId} from "./utils.js";

// Create the world object in global scope
export function createWorld() {
  return {
    players: [],
    ships: [],
    planets: [],
    bullets: [],
    explosions: [],
  };
}

export const world = createWorld();
setupWorld();

function setupWorld() {
  const planet = createPlanet(c.PLANET_ROCK_FILE, 100, 100, {titanium: 100, gold: 100, uranium: 100})
  planet.x = 300;
  planet.y = 300;
  world.planets.push(planet);
}

export function createPlayer(socket, name) {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  const player = {
    id: generateUniqueId(),
    socketId: socket.id,
    name,
    currentShip: null,
    x: 50,
    y: 50,
    color
  };
  world.players.push(player);
  const ship = {
    id: generateUniqueId(),
    playerId: player.id,
    alive: true,
    objectType: c.OBJECT_TYPE_SHIP,
    x: 50,
    y: 50,
    vx: 0,
    vy: 0,
    rotation: 0,
    radius: 21,
    armor: 100,
    armorMax : 100,
    gun: {
      coolMax: 10,
      cool: 0,
      ttl: 40,
      color: 'FF0000',
      radius: 2,
      damage: 100,
    }
  };
  world.ships.push(ship);
  player.currentShip = ship;
  player.x = ship.x;
  player.y = ship.y;
  server.playerSockets[player.socketId] = socket;
  console.log("Added player ", player);
  return player;
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


export function createPlanet(file, radius, mass, resources) {
  let planet = {};
  planet.id = generateUniqueId();
  planet.objectType = c.OBJECT_TYPE_PLANET;
  planet.file = file;
  planet.x = 0; // temp should get reset
  planet.y = 0; // temp should get reset
  planet.mass = mass;
  planet.resources = {
    stored: {titanium: 0, gold: 0, uranium: 0},
    raw: resources
  };
  planet.ships = []; // stored ships
  planet.equip = []; // stored equipment
  planet.buildings = []; // mines, factories
  planet.radius = radius;
  world.planets.push(planet);
  return planet;
}


// ------ Display ----

export function getShipDisplay(ship) {
  if (ship == null) {
    return null;
  }
  return {id: ship.id, alive: ship.alive, x: ship.x, y: ship.y, rotation: ship.rotation};
}

export function getDisplay(player) {
  const currentShip = player.currentShip;

  const playerDisplay = {
    id: player.id,
    x: currentShip ? currentShip.x : player.x,
    y: currentShip ? currentShip.y : player.y,
    currentShipId: currentShip.id
  }

  const ships = [];
  for (let ship of world.ships) {
    ships.push(getShipDisplay(ship));
  }
  const planets = [];
  for (let planet of world.planets) {
    const planetDisplay = {id: planet.id, x: planet.x, y: planet.y, radius:planet.radius, file:planet.file};
    planets.push(planetDisplay);
  }
  const bullets = [];
  for (let bullet of world.bullets) {
    if (bullet.alive) {
      const bulletDisplay = {id: bullet.id, x: bullet.x, y: bullet.y, color: bullet.color};
      bullets.push(bulletDisplay);
    }
  }
  const explosions = [];
  for (let explosion of world.explosions) {
    if (explosion.ttl > 0) {
      const explosionDisplay = {id: explosion.id, x:explosion.x, y:explosion.y, ttl:explosion.ttl};
      explosions.push(explosionDisplay);
    }
  }
  return {player:playerDisplay, ships, planets, bullets, explosions};
}

// Makes a new bullet (reusing objects in the world.bullets array)
export function createBullet(x, y, vx, vy, gun) {
  let bullet = null;
  for (const existingBullet of world.bullets) {
    if (!existingBullet.alive) {
      bullet = existingBullet;
    }
  }
  // No dead bullet found, so we'll make a new one
  if (!bullet) {
    bullet = {};
    world.bullets.push(bullet);
  }
  // Set all the bullet fields
  bullet.id = util.generateUniqueId();
  bullet.objectType = c.OBJECT_TYPE_BULLET;
  bullet.alive = true;
  bullet.x = x;
  bullet.y = y;
  bullet.vx = vx;
  bullet.vy = vy;
  bullet.ttl = gun.ttl;
  bullet.color = gun.color;
  bullet.radius = gun.radius;
  bullet.damage = gun.damage;
  return bullet;
}

export function firePrimaryWeapon(ship) {
  if (ship.gun.cool > 0) {
    return;
  }
  const bulletSpeed = 8;
  const gun = ship.gun;
  const vx = ship.vx + bulletSpeed * Math.cos(ship.rotation);
  const vy = ship.vy + bulletSpeed * Math.sin(ship.rotation);
  const x = ship.x + ((ship.radius + gun.radius + 2) * Math.cos(ship.rotation));
  const y = ship.y + ((ship.radius + gun.radius + 2) * Math.sin(ship.rotation));
  gun.cool = gun.coolMax;
  createBullet(x, y, vx, vy, gun);
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
  explosion.ttl =  c.EXPLOSION_TTL_TICKS;
}

export function propelShip(ship) {
  let propulsion = 1;
  ship.vx += propulsion * Math.cos(ship.rotation);
  ship.vy += propulsion * Math.sin(ship.rotation);
}

function brakeShip(ship) {
  ship.vx = 0;
  ship.vy = 0;
}

export function handlePressedKey(player, key) {
  switch (key) {
    case c.RIGHT:
      player.currentShip.rotation = util.normalizeRadian(player.currentShip.rotation + 0.1);
      break;
    case c.LEFT:
      player.currentShip.rotation = util.normalizeRadian(player.currentShip.rotation - 0.1);
      break;
    case c.UP:
      propelShip(player.currentShip);
      break;
    case c.DOWN:
      brakeShip(player.currentShip);
      break;
    case c.FIRE:
      firePrimaryWeapon(player.currentShip);
      break;
  }
}

export function checkForPressedKeys(player, playerKeys) {
  if (playerKeys) {
    for (let key of c.ALL_KEY_CODES) {
      if (key && playerKeys[key]) {
        handlePressedKey(player, key);
      }
    }
  }
}

// Return the object hit : should be a planet or ship
// id will be the calling object - don't collide with this
export function hitsPlanetOrShip(id, x,y, radius) {
  for (let ship of world.ships) {
    if (!ship.alive || ship.id === id) {
      continue;
    }
    const dist = util.distanceBetween(x, y, ship.x, ship.y);
    if (dist <= (ship.radius + radius)) {
      return ship;
    }
  } // for player

  // Hit planet
  for (let planet of world.planets) {
    if (planet.id === id) {
      continue;
    }
    const dist = util.distanceBetween(x, y, planet.x, planet.y);
    if (dist <= (planet.radius + radius)) {
      return planet;
    }
  } // for planet

  return null;
}

export function destroyShip(ship) {
  createExplosion(ship.x, ship.y);
  ship.alive = false;
  console.log('ship died');
}

export function damageShip(ship, damage) {
  ship.armor = ship.armor - damage;
  console.log('hit ', ship);
  if (ship.armor <= 0) {
    ship.armor = 0;
    destroyShip(ship);
  }
}

export function mainServerLoop() {
  // Move bullets
  for (const bullet of world.bullets) {
    if (bullet.alive) {
      bullet.x = bullet.x + bullet.vx;
      bullet.y = bullet.y + bullet.vy;
      bullet.ttl = bullet.ttl - 1;
      if (bullet.ttl < 0) {
        bullet.alive = false;
      }
      const hitObject = hitsPlanetOrShip(bullet.id, bullet.x, bullet.y, bullet.radius);
      if (hitObject) {
        bullet.alive = false;
        bullet.ttl = 0;
        if (hitObject.objectType === c.OBJECT_TYPE_SHIP) {
          damageShip(hitObject, bullet.damage);
        }
      }
    }
  }

  // Check for player actions
  for (let player of world.players) {
    const keys = playerKeys[player.id];
    checkForPressedKeys(player, keys);
  }

  // Move ships
  for (let ship of world.ships) {
    if (!ship.alive) {
      continue;
    }
    ship.x = ship.x + ship.vx;
    ship.y = ship.y + ship.vy;

    const hitObject = hitsPlanetOrShip(ship.id, ship.x, ship.y, ship.radius);
    if (hitObject) {
      if (hitObject.objectType === c.OBJECT_TYPE_SHIP) {
        console.log('TODO ship hit ship', hitObject);
        damageShip(hitObject, ship.armor);
      }
      if (hitObject.objectType === c.OBJECT_TYPE_PLANET) {
        ship.armor = 0;
        destroyShip(ship);
        console.log('ship hit planet ', hitObject, ' ship=', ship);
      }
    }
    if (ship.gun.cool > 0) {
      ship.gun.cool = ship.gun.cool - 1;
    }
  }

  // Expire explosions
  for (let explosion of world.explosions) {
    if (explosion.ttl > 0) {
      explosion.ttl = explosion.ttl - 1;
      if (explosion.ttl <= 0) {
        explosion.alive = false;
        explosion.ttl = 0;
      }
    }
  }

  // Update the display for all players
  for (let player of world.players) {
    const socket = getPlayerSocket(player.socketId);
    if (socket) {
      socket.emit("update", getDisplay(player));
    }
  }

}
