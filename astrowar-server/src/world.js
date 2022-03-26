import * as util from './utils.js'
import * as c from './server-constants.js'
import {generateUniqueId, randomInt} from "./utils.js";
import * as server from "./astrowar-server.js";

export const world = {
  players: [],
  ships: [],
  planets: [],
  bullets: [],
  explosions: [],
};

function setupWorld() {
  createPlanets();
}
setupWorld();

function createPlanets() {
  const planetCount = 40;
  const ringRadius = 3000;
  const minRadius = 100;
  const maxRadius = 400;

  for (let planetNum=0; planetNum<=planetCount; planetNum++) {
    const planetType = c.PLANET_TYPES[randomInt(0, c.PLANET_TYPES.length-1)];
    const radius = randomInt(minRadius, maxRadius);
    const planet = createPlanet(planetType, radius, 100, {titanium: 100, gold: 100, uranium: 100})
    planet.x = randomInt(100, ringRadius*2) - ringRadius;
    planet.y = randomInt(100, ringRadius*2) - ringRadius;
  }
}


export function createShip(playerId) {
  return {
    id: generateUniqueId(),
    playerId: playerId,
    alive: true,
    objectType: c.OBJECT_TYPE_SHIP,
    x: util.randomInt(100, 300) * (util.randomBool() ? 1 : -1),
    y: util.randomInt(100, 300) * (util.randomBool() ? 1 : -1),
    vx: 0,
    vy: 0,
    rotation: 0,
    radius: 21,
    armor: 100,
    armorMax: 100,
    gun: {
      coolMax: 5,
      cool: 0,
      ttl: 40,
      color: 'FF0000',
      radius: 2,
      damage: 50,
      filename: c.BULLET_FILE,
    }
  };
}

export function setupNewShipForPlayer(player) {
  // TODO Remove old ship
  const ship = createShip(player.id);
  world.ships.push(ship);
  player.currentShip = ship;
  player.x = ship.x;
  player.y = ship.y;
  player.alive = true;
}


export function createPlayer(socket, name) {
  const color = Math.floor(Math.random() * 16777215).toString(16);
  const player = {
    id: generateUniqueId(),
    socketId: socket.id,
    name,
    currentShip: null,
    x: 0, // replaced soon
    y: 0, // replaced soon
    color
  };
  world.players.push(player);
  setupNewShipForPlayer(player);
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
  bullet.filename = gun.filename;
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

