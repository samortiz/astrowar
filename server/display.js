import {world} from "./world.js";

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
      const bulletDisplay = {id: bullet.id, x: bullet.x, y: bullet.y, filename: bullet.filename, color: bullet.color};
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
