import * as w from "./world.js";

export function getShipDisplay(ship) {
  if (ship == null) {
    return null;
  }
  return {
    id: ship.id,
    alive: ship.alive,
    x: ship.x,
    y: ship.y,
    rotation: ship.rotation,
    imageFile: ship.imageFile,
    radius: ship.radius,
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
    ttl: explosion.ttl
  };
}

export function getAllPlanetsDisplay() {
  const planets = [];
  for (let planet of w.world.planets) {
    planets.push(getPlanetDisplay(planet));
  }
  return planets;
}

export function getDisplay(player) {
  const currentShip = player.currentShip;

  const playerDisplay = {
    id: player.id,
    x: currentShip ? currentShip.x : player.x,
    y: currentShip ? currentShip.y : player.y,
    currentShipId: currentShip.id,
    alive: currentShip.alive,
  }

  const ships = [];
  for (let ship of w.world.ships) {
    if (ship.alive) {
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
  return {player: playerDisplay, ships, bullets, explosions};
}


export function getJoinData(socket, name) {
  const player = w.createPlayer(socket, name);
  const planets = getAllPlanetsDisplay();
  return {player, planets};
}