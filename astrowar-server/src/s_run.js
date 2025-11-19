import * as c from "./s_constants.js";
import * as b from "./s_blueprints.js";
import * as utils from "./s_utils.js";
import * as display from './s_display.js';
import * as w from './s_world.js';
import * as manage from './s_manage.js';
import * as ai from './s_ai.js';
import {playerKeys} from "./astrowar-server.js";
import {world} from "./s_world.js";
import {removeEquip} from "./s_manage.js";


export function mainServerLoop() {
  moveBullets();

  // Check for player actions
  for (let player of world.players) {
    const keys = playerKeys[player.id];
    checkForPressedKeys(player, keys);
  }

  moveShips();

  coolAllEquip(); // on ships and planets

  // Generate planet resources
  for (const planet of world.planets) {
    planet.resources.titanium += planet.generateResources.titanium * c.GLOBAL_RESOURCE_RATE;
    planet.resources.gold += planet.generateResources.gold * c.GLOBAL_RESOURCE_RATE;
    planet.resources.uranium += planet.generateResources.uranium * c.GLOBAL_RESOURCE_RATE;
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

  // Update Score
  for (const planet of world.planets) {
    if (planet.x == 0 && planet.y == 0) {
      const ownerId = planet.ownerId;
      if (ownerId) {
        const player = world.players.find(p => p.id === ownerId); 
        player.score += 1;
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

/**
 * Called in main loop to move all the bullets
 */
export function moveBullets() {
  // Move bullets (reverse so we can remove dead bullets as we go)
  for (let i = world.bullets.length - 1; i >= 0; i--) {
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
    if (bullet.ttl <= 0) {
      // Remove bullet from bullets array
      world.bullets.splice(i, 1);
    }
  } // for bullet
}

/**
 * Called in main loop to move all the ships (player and non-player)
 */
export function moveShips() {
  for (let ship of world.ships) {
    if (!ship.alive || ship.inStorage) {
      continue;
    }
    if (ship.lifetime) {
      ship.lifetime -= 1;
      if (ship.lifetime <= 0) {
        destroyShip(ship);
        continue;
      }
    }
    if (!ship.landed) {
      // Gravity
      const hasGravityShield = !!utils.getEquip(ship, b.EQUIP_TYPE_GRAVITY_SHIELD);
      if (!hasGravityShield) {
        for (let planet of world.planets) {
          let grav = utils.calcGravity(ship.x, ship.y, planet);
          ship.vx += grav.x;
          ship.vy += grav.y;
        }
      }
      ship.x = ship.x + ship.vx;
      ship.y = ship.y + ship.vy;

      const hitObject = hitsPlanetOrShip(ship.id, ship.x, ship.y, ship.radius);
      if (hitObject) {
        if (hitObject.objectType === c.OBJECT_TYPE_SHIP) {
          shipsCollide(ship, hitObject);
        }
        if (hitObject.objectType === c.OBJECT_TYPE_PLANET) {
          landShip(ship, hitObject);
        }
      }
    }
    runDroids(ship);
    ai.runShipAi(ship);
  }
}

/**
 * Fires the weapon from the location and direction of the ship
 */
export function fireWeapon(weapon, ship) {
  if (!weapon || weapon.cool > 0) {
    return;
  }

  if (weapon && (weapon.cool <= 0)) {
    weapon.bulletRadius = 10; // This should match the image file size and scale
    weapon.cool = weapon.coolTime; // this is decremented in coolWeapons
    const jitterAmt = weapon.jitter ? (weapon.jitter * Math.random() * (utils.randomBool() ? -1 : 1)) : 0;
    const rotation = ship.rotation + jitterAmt;
    const vx = ship.vx + weapon.speed * Math.cos(rotation);
    const vy = ship.vy + weapon.speed * Math.sin(rotation);
    const x = ship.x + ((ship.radius + weapon.bulletRadius + 2) * Math.cos(rotation));
    const y = ship.y + ((ship.radius + weapon.bulletRadius + 2) * Math.sin(rotation));
    w.createBullet(x, y, vx, vy, weapon, rotation);
  }
}


export function firePrimaryWeapon(ship) {
  const gun = utils.getEquip(ship, b.EQUIP_TYPE_PRIMARY_WEAPON);
  if (gun) {
    fireWeapon(gun, ship);
  }
}

export function selectFirstSecondaryWeapon(ship) {
  for (let i = 0; i < ship.equip.length; i++) {
    if (ship.equip[i].type === b.EQUIP_TYPE_SECONDARY_WEAPON) {
      ship.selectedSecondaryWeaponIndex = i;
      return;
    }
  } // for
  // Couldn't find a secondary weapon
  ship.selectedSecondaryWeaponIndex = -1;
}

export function getSecondaryWeapon(ship) {
  if (!ship.selectedSecondaryWeaponIndex || ship.selectedSecondaryWeaponIndex < 0) {
    // Just find any secondary weapon - none was selected
    return utils.getEquip(ship, b.EQUIP_TYPE_SECONDARY_WEAPON);
  }
  // Find the equipped weapon
  let equip = ship.equip[ship.selectedSecondaryWeaponIndex];
  if (equip?.type !== b.EQUIP_TYPE_SECONDARY_WEAPON) {
    selectFirstSecondaryWeapon(ship);
    equip = ship.equip[ship.selectedSecondaryWeaponIndex];
  }
  return equip;
}

export function fireSecondaryWeapon(ship) {
  let weapon = getSecondaryWeapon(ship);
  if (weapon && (weapon.cool <= 0)) {
    if (weapon.createShip) {
      if (!manage.canAfford(null, ship, weapon.createShip.type.cost)) {
        // We don't fire the weapon - we can't afford it
        return;
      }
      manage.payResourceCost(null, ship, weapon.createShip.type.cost);
      // find the player
      const player = w.world.players.find(p => p.id === ship.playerId);
      const child = w.createShip(weapon.createShip.type, player);
      // For a decoy we will mimic the skin of the player's ship
      if (child.name === b.SHIP_DECOY.name) {
        child.imageScale = ship.imageScale;
        child.imageRadius = ship.imageRadius;
        child.imageFile = ship.imageFile;
      }
      const childDistFromShip = ship.radius + child.radius + 20;
      const dir = weapon.createShip.dir === b.DIR_AHEAD_OF_SHIP ? utils.normalizeRadian(ship.rotation - Math.PI) : ship.rotation;
      const {xAmt, yAmt} = utils.dirComponents(dir, childDistFromShip);
      child.x = ship.x - xAmt;
      child.y = ship.y - yAmt;
      if (child.propulsion) {
        child.vx = ship.vx;
        child.vy = ship.vy;
      }
      child.rotation = utils.normalizeRadian(dir);
      w.world.ships.push(child);
      // TODO Since it may not move we need to check if it collides with anything
    }
    if (weapon.shield) {
      // If another shield is already in use - we won't reset the cool
      if (getActiveShield(ship) !== null) {
        return;
      }
      enableShield(ship, weapon.shield);
    }
    if (weapon.lifetime) {
      weapon.lifetime.lifetime = weapon.lifetime.lifetimeMax;
    }
    if (weapon.jump) {
      manage.jumpShip(ship, weapon);
    }
    weapon.cool = weapon.coolTime; // this is decremented in coolWeapons
  }

}

function turnShip(ship, left) {
  let turnSpeed = ship.turnSpeed;
  for (const equip of ship.equip) {
    if (equip.type === b.EQUIP_TYPE_TURN && equip.boostSpeed) {
      turnSpeed += equip.boostSpeed;
    }
  }
  let armorCount = 0;
  for (const equip of ship.equip) {
    if (equip.type === b.EQUIP_TYPE_ARMOR && equip.hinderTurn) {
      turnSpeed = Math.max(turnSpeed - (equip.hinderTurn * armorCount), 0.05);
      armorCount += 1;
    }
  }
  ship.rotation = utils.normalizeRadian(ship.rotation + turnSpeed * (left ? -1 : 1));
}

export function propelShip(ship, boost = 1) {
  let propulsion = ship.propulsion;
  for (const equip of ship.equip) {
    if (equip.type === b.EQUIP_TYPE_SPEED && equip.boostSpeed) {
      propulsion += equip.boostSpeed;
    }
  }
  let armorCount = 0;
  for (const equip of ship.equip) {
    if (equip.type === b.EQUIP_TYPE_ARMOR && equip.hinderPropulsion) {
      propulsion = Math.max((propulsion - (equip.hinderPropulsion * armorCount)), 0.5);
      armorCount += 1;
    }
  }
  console.log('prop=', propulsion);
  ship.vx += propulsion * Math.cos(ship.rotation) * boost;
  ship.vy += propulsion * Math.sin(ship.rotation) * boost;
}

export function brakeShip(ship) {
  let brake = utils.getEquip(ship, b.EQUIP_TYPE_BRAKE);
  if (brake) {
    if (brake.brakeSpeedPct > 0) {
      ship.vx -= ship.vx * brake.brakeSpeedPct;
      ship.vy -= ship.vy * brake.brakeSpeedPct;
    } else {
      // Blink brake pct is 0, immediate stop (no momentum)
      ship.vx = 0;
      ship.vy = 0;
    }
  } else {
    // No break installed - we'll still slow down
    ship.vx -= ship.vx * 0.07;
    ship.vy -= ship.vy * 0.07;
  }
}

function thrustShip(ship, left) {
  let thruster = utils.getEquip(ship, b.EQUIP_TYPE_THRUSTER);
  if (thruster) {
    let dir = utils.normalizeRadian(ship.rotation + ((left ? -1 : 1) * Math.PI / 2)); // 90 deg turn
    const thrustX = thruster.thrustSpeed * Math.cos(dir);
    const thrustY = thruster.thrustSpeed * Math.sin(dir);
    if (thruster.thrustType === b.THRUST_MOMENTUM) {
      ship.vx += thrustX;
      ship.vy += thrustY
    } else if (thruster.thrustType === b.THRUST_BLINK) {
      ship.x += thrustX;
      ship.y += thrustY;
    } else {
      console.warn("Unable to use thruster with type " + thruster.thrustType);
    }
  }
}

export function handlePressedKey(player, key) {
  const ship = player?.currentShip;
  if (!ship) {
    return;
  }
  switch (key) {
    case c.RIGHT:
    case c.KEY_D:
      if (!ship.landed) {
        turnShip(player.currentShip, false);
      }
      break;
    case c.LEFT:
    case c.KEY_A:
      if (!ship.landed) {
        turnShip(player.currentShip, true);
      }
      break;
    case c.UP:
    case c.KEY_W:
      if (ship.landed) {
        takeOff(player);
      }
      propelShip(player.currentShip);
      break;
    case c.KEY_Q:
      if (!ship.landed) {
        thrustShip(ship, true);
      }
      break;
    case c.KEY_E:
      if (!ship.landed) {
        thrustShip(ship, false);
      }
      break;
    case c.DOWN:
    case c.KEY_S:
      if (!ship.landed) {
        brakeShip(player.currentShip);
      }
      break;
    case c.FIRE:
      if (!ship.landed) {
        firePrimaryWeapon(player.currentShip);
      }
      break;
    case c.SECONDARY_WEAPON:
      if (!ship.landed) {
        fireSecondaryWeapon(player.currentShip);
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
export function hitsPlanetOrShip(id, x, y, radius) {
  for (let ship of world.ships) {
    if (!ship.alive || ship.id === id || ship.inStorage) {
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
  manage.scatterResourcesAndEquip(ship);
  w.createExplosion(ship.x, ship.y);
  ship.alive = false;
  ship.landed = false; // you're no longer on the planet
  ship.inStorage = false;
  const player = world.players.find(p => p.id === ship.playerId);
  if (player) {
    player.deathCount += 1;
    if (ship.id === player.currentShip.id) {
      player.selectedPlanet = null;
    }
  }
}

/**
 * collision between two ships
 */
export function shipsCollide(shipA, shipB) {
  if (shipA === shipB) {
    return; // can't collide with yourself
  }

  // Bounce (credits to Blindman67 on stackoverflow.com)
  const mA = shipA.armor; // mass
  const mB = shipB.armor; // mass
  const mm = mA + mB;
  const x = shipA.x - shipB.x; // vector between balls
  const y = shipA.y - shipB.y;
  const e1 = 1; // restitution
  const e2 = 1;
  const d = x * x + y * y;
  const uAB = (shipA.vx * x + shipA.vy * y) / d;  // normal component force A into B
  const u2 = (shipA.vy * x - shipA.vx * y) / d;  // tangent component force A
  const uBA = (shipB.vx * x + shipB.vy * y) / d;  // normal component force B into A
  const u4 = (shipB.vy * x - shipB.vx * y) / d;  // tangent component force B
  // Force from B into A along normal, scaled for mass ratio and restitution
  const uA = ((mA - mB) / mm * uAB + (2 * mB) / mm * uBA) * e1;
  // Force from A into B along normal, scaled for mass ratio and restitution
  const uB = ((mB - mA) / mm * uBA + (2 * mA) / mm * uAB) * e2;

  // Move the ships until they are no longer colliding
  const minDist = shipA.radius + shipB.radius + 2;

  // New Speed and Direction
  if (!shipA.landed && !shipA.explosionDamage) {
    shipA.vx = x * uA - y * u2;
    shipA.vy = y * uA + x * u2;
    shipA.rotation = utils.directionTo(shipA.x, shipA.y, shipA.x + shipA.vx, shipA.y + shipA.vy);
    shipA.x += minDist * Math.cos(shipA.rotation);
    shipA.y += minDist * Math.sin(shipA.rotation);
  }
  if (!shipB.landed && !shipB.explosionDamage) {
    shipB.vx = x * uB - y * u4;
    shipB.vy = y * uB + x * u4;
    shipB.rotation = utils.directionTo(shipB.x, shipB.y, shipB.x + shipB.vx, shipB.y + shipB.vy);
    shipB.x += minDist * Math.cos(shipB.rotation);
    shipB.y += minDist * Math.sin(shipB.rotation);
  }

  // Do damage
  damageShip(shipA, mB * 0.1); // 10% of mass damage
  damageShip(shipB, mA * 0.1);

  // Disable shields
  const shieldA = getActiveShield(shipA);
  if (shieldA) {
    disableShield(shipA);
  }
  const shieldB = getActiveShield(shipB);
  if (shieldB) {
    disableShield(shipB);
  }

  // Equipment loss (to make it less desirable to crash) (only for player - player collisions)
  // If npc hits a player or npc to npc we won't do equip drops (otherwise missiles are too potent!)
  if (w.isPlayerShip(shipA) && w.isPlayerShip(shipB)) {
    manage.dropRandomEquip(shipA);
    manage.dropRandomEquip(shipB);
  }

  // ExplosionDamage (missiles and mines) (do this at the end because the ship gets destroyed)
  if (shipA.explosionDamage) {
    damageShip(shipB, shipA.explosionDamage);
    destroyShip(shipA);
  }
  if (shipB.explosionDamage) {
    damageShip(shipA, shipB.explosionDamage);
    destroyShip(shipB);
  }
}

export function damageShip(ship, damage, useShield = true) {
  if (!ship || damage <= 0) {
    return;
  }
  const shield = getActiveShield(ship);
  if (useShield && shield) {
    shield.armor -= damage;
    if (shield.armor <= 0) {
      shield.armor = 0;
      disableShield(ship, shield);
    }
  } else { // no shield (or damage type ignores shields)
    ship.armor = ship.armor - damage;
    console.log('damage=', damage, ship);
    if (ship.armor <= 0) {
      ship.armor = 0;
      destroyShip(ship);
      ship.vx = 0;
      ship.vy = 0;
    }
  }
}

/**
 * Land the ship on the planet
 */
export function landShip(ship, planet) {
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
  const player = world.players.find(p => p.id === ship.playerId);
  if (player) {
    // If a player is using this ship, then this is the selected planet
    if (player.currentShip.id === ship.id) {
      player.selectedPlanet = planet; // currently selected planet (for manage UI)
      planet.ownerId = player.id; // Player lands and owns the planet
      planet.ownerColor = player.color;
    }
  }
}

function takeOff(player) {
  player.currentShip.landed = false;
  // This will give a little boost for takeoff (a double propulsion)
  propelShip(player.currentShip);
}

/**
 * @return the first active shield the ship is equipped with
 * NOTE: This returns equip.shield (NOT the full equip object)
 */
export function getActiveShield(ship) {
  for (const equip of ship.equip) {
    if (equip.shield && equip.shield.active) {
      return equip.shield;
    }
  }
  return null;
}

/**
 * Called to enable a ship's shield.
 * This will add a shield sprite to the ship and set it to visible
 * NOTE: This will change the ship radius
 */
export function enableShield(ship, shield) {
  if (getActiveShield(ship) !== null) {
    console.log('not enabling shield, as there is already one enabled')
    return;
  }
  shield.active = true;
  shield.lifetime = shield.lifetimeMax;
  shield.armor = shield.armorMax;
  ship.radius = ship.radius * 1.5;
}

/**
 * Called to disable, and stop drawing a shield on a ship
 * NOTE: this will change the ship radius
 */
export function disableShield(ship, shield) {
  if (!ship || !shield) {
    return;
  }
  shield.active = false;
  ship.radius = ship.radius / 1.5;
}

/**
 * Cools the particular piece of equipment (this is run from coolAllEquip, you probably shouldn't call it)
 */
export function coolEquip(source, equip) {
  if (!equip) {
    return;
  }
  // If equip has a cool time
  if (equip.cool) {
    equip.cool -= 1;
  }
  // Cloaks have a lifetime (how long they last) in addition to a cool (how often they shoot)
  if (equip.lifetime && equip.lifetime.lifetime) {
    equip.lifetime.lifetime -= 1;
  }
  // Gunnery Droids are equip with weapons
  if (equip.weapon && equip.weapon.cool) {
    equip.weapon.cool -= 1;
  }
  if (equip.shield && equip.shield.active) {
    equip.shield.lifetime -= 1;
    if (equip.shield.lifetime <= 0) {
      equip.shield.lifetime = 0;
      if (source.objectType === c.OBJECT_TYPE_SHIP) {
        disableShield(source, equip.shield);
      }
    }
  }
  if (equip.self_destruct_lifetime && equip.self_destruct_lifetime > 0) {
    equip.self_destruct_lifetime -= 1;
    if (equip.self_destruct_lifetime <= 0) {
      // The equip self-destructs!
      const equipIndex = source.equip.findIndex(e => e.id === equip.id);
      if (equipIndex >= 0) {
        source.equip.splice(equipIndex, 1);
        removeEquip(source, equip);
        console.log("Self destructing ", source.equip);
      } else {
        console.warn("Cannot self destruct equip", equip, " in ", source.equip);
      }
    }
  }

}

/**
 * Cools all equipment that have cool or lifetime (on all planets and all ships)
 */
export function coolAllEquip() {
  // Ship Equip
  for (const ship of w.world.ships) {
    if (ship.alive) {
      for (const equip of ship.equip) {
        coolEquip(ship, equip);
      } // for equip
    }
  } // for ships

  // Planet Equip
  for (const planet of w.world.planets) {
    for (const equip of planet.equip) {
      coolEquip(planet, equip);
    } // for equip
  } // for planet
}

/**
 * @return the max range of the weapon
 */
export function weaponRange(weapon) {
  if (!weapon) {
    return 0;
  }
  // Not sure what the fudge factor is, but the range seems a little short without it
  return weapon.speed * weapon.lifetime * 1.1;
}

/**
 * @return the max range of the primary weapon on the ship
 */
export function primaryWeaponRange(ship) {
  let gun = utils.getEquip(ship, b.EQUIP_TYPE_PRIMARY_WEAPON);
  return weaponRange(gun);
}

export function runDroids(ship) {
  for (let droid of ship.equip) {
    if ((droid.type === b.EQUIP_TYPE_REPAIR_DROID) && (ship.armor < ship.armorMax)) {
      let cost = {titanium: 0, gold: 0, uranium: 0};
      if (manage.canAfford(null, ship, cost)) {
        ship.armor += droid.repairSpeed;
        manage.payResourceCost(null, ship, cost);
      }
    } else if (droid.type === b.EQUIP_TYPE_GUNNERY_DROID) {
      shootNearestEnemy(ship, droid.weapon);
    }
    // NOTE: Shield droid runs in checkForBulletCollision
  } // for
}


/**
 * Fires the weapon in the direction of the nearest alien (if able to)
 */
export function shootNearestEnemy(ship, weapon) {
  // If we can't shoot, don't waste our time
  if (weapon.cool > 0) {
    return;
  }
  const {target, dist} = ai.getNearestOpponentTarget(ship, true, false);
  if (target && (dist <= weaponRange(weapon))) {
    const origDir = ship.rotation;
    ship.rotation = utils.normalizeRadian(Math.atan2(target.y - ship.y, target.x - ship.x));
    fireWeapon(weapon, ship);
    ship.rotation = origDir;
  }
}