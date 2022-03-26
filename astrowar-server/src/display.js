import {world} from "./world.js";

export function getShipDisplay(ship) {
  if (ship == null) {
    return null;
  }
  return {
    id: ship.id,
    alive: ship.alive,
    x: ship.x,
    y: ship.y,
    rotation: ship.rotation
  };
}

export function getPlanetDisplay(planet) {
  return {
    id: planet.id,
    x: planet.x,
    y: planet.y,
    radius: planet.radius,
    file: planet.file
  };
}

export function getBulletDisplay(bullet) {
  return {
    id: bullet.id,
    x: bullet.x,
    y: bullet.y,
    filename: bullet.filename,
    color: bullet.color
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
  for (let ship of world.ships) {
    // Check if ship is alive
    ships.push(getShipDisplay(ship));
  }
  const planets = [];
  for (let planet of world.planets) {
    planets.push(getPlanetDisplay(planet));
  }
  const bullets = [];
  for (let bullet of world.bullets) {
    if (bullet.alive) {
      bullets.push(getBulletDisplay(bullet));
    }
  }
  const explosions = [];
  for (let explosion of world.explosions) {
    if (explosion.ttl > 0) {
      explosions.push(getExplosionDisplay(explosion));
    }
  }
  return {player: playerDisplay, ships, planets, bullets, explosions};
}
