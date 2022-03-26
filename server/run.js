import * as c from "./server-constants.js";
import * as util from "./utils.js";
import * as display from './display.js';
import * as w from './world.js';
import {playerKeys} from "./astrowar-server.js";
import {world} from "./world.js";


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
  w.createBullet(x, y, vx, vy, gun);
}

export function propelShip(ship) {
  let propulsion = 1;
  ship.vx += propulsion * Math.cos(ship.rotation);
  ship.vy += propulsion * Math.sin(ship.rotation);
}

export function brakeShip(ship) {
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
  w.createExplosion(ship.x, ship.y);
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
        const hitArmor = hitObject.armor;
        damageShip(hitObject, ship.armor);
        damageShip(ship, hitArmor);
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
    const socket = w.getPlayerSocket(player.socketId);
    if (socket) {
      socket.emit("update", display.getDisplay(player));
    }
  }

}
