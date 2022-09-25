import * as c from "./server-constants.js";
import * as utils from "./utils.js";
import * as display from './display.js';
import * as w from './world.js';
import {playerKeys} from "./astrowar-server.js";
import {world} from "./world.js";


export function mainServerLoop() {
  // Move bullets (reverse so we can remove dead bullets as we go)
  for (let i=world.bullets.length-1; i>=0; i--) {
    const bullet = world.bullets[i];
    bullet.x = bullet.x + bullet.vx;
    bullet.y = bullet.y + bullet.vy;
    bullet.ttl = bullet.ttl - 1;
    const hitObject = hitsPlanetOrShip(bullet.id, bullet.x, bullet.y, bullet.radius);
    if (hitObject) {
      bullet.ttl = 0;
      if (hitObject.objectType === c.OBJECT_TYPE_SHIP) {
        damageShip(hitObject, bullet.damage);
      }
    }
    if (bullet.ttl <=0) {
      // Remove bullet from bullets array
      world.bullets.splice(i, 1);
    }
  } // for bullet

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
    if (!ship.landed) {
      // Gravity
      for (let planet of world.planets) {
        let grav = utils.calcGravity(ship.x, ship.y, planet);
        ship.vx += grav.x;
        ship.vy += grav.y;
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
          landShip(ship, hitObject);
        }
      }
    }
    if (ship.gun.cool > 0) {
      ship.gun.cool = ship.gun.cool - 1;
    }
  }

  // Generate planet resources
  for (const planet of world.planets) {
    planet.resources.titanium += planet.generateResources.titanium;
    planet.resources.gold += planet.generateResources.gold;
    planet.resources.uranium += planet.generateResources.uranium;
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

export function firePrimaryWeapon(ship) {
  if (ship.gun.cool > 0) {
    return;
  }
  const gun = ship.gun;
  const vx = ship.vx + gun.speed * Math.cos(ship.rotation);
  const vy = ship.vy + gun.speed * Math.sin(ship.rotation);
  const x = ship.x + ((ship.radius + gun.radius + 2) * Math.cos(ship.rotation));
  const y = ship.y + ((ship.radius + gun.radius + 2) * Math.sin(ship.rotation));
  gun.cool = gun.coolMax;
  w.createBullet(x, y, vx, vy, gun, ship.rotation);
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
      if (!player?.currentShip?.landed) {
        player.currentShip.rotation = utils.normalizeRadian(player.currentShip.rotation + 0.1);
      }
      break;
    case c.LEFT:
      if (!player?.currentShip?.landed) {
        player.currentShip.rotation = utils.normalizeRadian(player.currentShip.rotation - 0.1);
      }
      break;
    case c.UP:
      if (player?.currentShip?.landed) {
        takeOff(player);
      }
      propelShip(player.currentShip);
      break;
    case c.DOWN:
      brakeShip(player.currentShip);
      break;
    case c.FIRE:
      if (!player?.currentShip?.landed) {
        firePrimaryWeapon(player.currentShip);
      }
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
    const dist = utils.distanceBetween(x, y, ship.x, ship.y);
    if (dist <= (ship.radius + radius)) {
      return ship;
    }
  } // for player

  // Hit planet
  for (let planet of world.planets) {
    if (planet.id === id) {
      continue;
    }
    const dist = utils.distanceBetween(x, y, planet.x, planet.y);
    if (dist <= (planet.radius + radius)) {
      return planet;
    }
  } // for planet

  return null;
}

export function destroyShip(ship) {
  w.createExplosion(ship.x, ship.y);
  ship.alive = false;
  ship.landed = false; // you're no longer on the planet
  const player = world.players.find(p => p.id === ship.playerId);
  if (player) {
    player.deathCount += 1;
    player.selectedPlanet = null;
  }
  console.log('ship died for player ', player);
}

export function damageShip(ship, damage) {
  ship.armor = ship.armor - damage;
  console.log('hit ', ship);
  if (ship.armor <= 0) {
    ship.armor = 0;
    destroyShip(ship);
  }
}

/**
 * Land the ship on the planet
 */
function landShip(ship, planet) {
  console.log('ship landed on planet ', planet, ' ship=', ship);
  //Set ship position and angle on the planet surface
  let dir = utils.directionTo(planet.x, planet.y, ship.x, ship.y)
  let r = planet.radius + ship.radius;
  let {xAmt, yAmt} = utils.dirComponents(dir, r);
  ship.x = planet.x + xAmt;
  ship.y = planet.y + yAmt;
  ship.rotation = dir;
  ship.vx = 0;
  ship.vy = 0;
  ship.landed = true;
  const player = world.players.find(p => p.currentShip.id === ship.id);
  player.selectedPlanet = planet; // currently selected planet (for manage UI)
}

function takeOff(player) {
  console.log('takeoff ', player);
  player.currentShip.landed = false;
  // This will give a little boost for takeoff (a double propulsion)
  propelShip(player.currentShip);
}