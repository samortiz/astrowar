import * as w from "./s_world.js";
import * as b from "./s_blueprints.js";
import * as manage from "./s_manage.js";
import * as run from "./s_run.js";

export function getShipDisplay(ship) {
  if (ship == null) {
    return null;
  }
  return {
    id: ship.id,
    playerId: ship.playerId,
    color: ship.color,
    alive: ship.alive,
    x: ship.x,
    y: ship.y,
    rotation: ship.rotation,
    imageFile: ship.imageFile,
    imageScale: ship.imageScale,
    radius: ship.radius,
    cloaked : manage.isCloaked(ship),
    stealth: manage.isStealth(ship),
    shield: run.getActiveShield(ship),
  };
}

export function getPlanetDisplay(planet) {
  return {
    id: planet.id,
    x: planet.x,
    y: planet.y,
    radius: planet.radius,
    imageFile: planet.imageFile
  };
}

export function getBulletDisplay(bullet) {
  return {
    id: bullet.id,
    x: bullet.x,
    y: bullet.y,
    radius: bullet.radius,
    imageFile: bullet.imageFile,
    rotation: bullet.rotation,
  };
}

export function getExplosionDisplay(explosion) {
  return {
    id: explosion.id,
    x: explosion.x,
    y: explosion.y,
    ttl: explosion.ttl,
    scale: explosion.scale,
  };
}

export function getAllPlanetsDisplay() {
  const planets = [];
  for (let planet of w.world.planets) {
    planets.push(getPlanetDisplay(planet));
  }
  return planets;
}

export function getScores() {
  const scores = [];
  for (let player of w.world.players) {
    scores.push({id:player.id, color: player.color, score: 0});
  }
  for (let planet of w.world.planets) {
    if (planet.ownerId) {
      const scoreObj = scores.find(s => s.id === planet.ownerId);
      if (scoreObj) {
        scoreObj.score += planet.resources.titanium;
        scoreObj.score += planet.resources.gold;
        scoreObj.score += planet.resources.uranium;
      }
    }
  }
  return scores;
}

export function getDisplay(player) {
  const currentShip = player.currentShip;

  const playerDisplay = {
    id: player.id,
    color: player.color,
    deathCount : player.deathCount,
    x: currentShip ? currentShip.x : player.x,
    y: currentShip ? currentShip.y : player.y,
    currentShip: currentShip,
    selectedPlanet: player.selectedPlanet,
  }

  const ships = [];
  for (let ship of w.world.ships) {
    if (ship.alive && !ship.inStorage) {
      ships.push(getShipDisplay(ship));
    }
  }
  const bullets = [];
  for (let bullet of w.world.bullets) {
    bullets.push(getBulletDisplay(bullet));
  }
  const explosions = [];
  for (let explosion of w.world.explosions) {
    if (explosion.ttl > 0) {
      explosions.push(getExplosionDisplay(explosion));
    }
  }
  const planetOwners = {};
  for (let planet of w.world.planets) {
    planetOwners[planet.id] = planet.ownerColor;
  }
  const scores = getScores();
  return {player: playerDisplay, ships, bullets, explosions, planetOwners, scores};
}

export function getJoinData(socket, name) {
  const player = w.createPlayer(socket, name);
  const planets = getAllPlanetsDisplay();
  const blueprints = {
    upgrades: b.EQUIP_UPGRADES,
    primary: b.EQUIP_PRIMARY_WEAPONS,
    secondary: b.EQUIP_SECONDARY_WEAPONS,
    droids: b.EQUIP_DROIDS,
    ships: b.ALL_SHIPS}
  return {player, planets, blueprints};
}