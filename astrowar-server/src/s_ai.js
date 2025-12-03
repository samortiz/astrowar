import * as b from './s_blueprints.js';
import * as c from './s_constants.js';
import * as w from './s_world.js';
import * as utils from './s_utils.js';
import * as run from './s_run.js';
import * as manage from './s_manage.js';
import {getRandomPointDistanceFrom} from "./s_utils.js";
import {SHIP_EXPLORER as dirToMove} from "./s_blueprints.js";


export function runShipAi(ship) {
  if (!ship.alive || !ship.aiType) {
    return;
  }
  let hasMoved = false;
  if (ship.aiType === b.AI_TURRET) {
    hasMoved = turretAi(ship);
  } else if (ship.aiType === b.AI_CREEPER) {
    hasMoved = creeperAi(ship, false, true);
  } else if (ship.aiType === b.AI_MISSILE) {
    hasMoved = missileAi(ship);
  } else if (ship.aiType === b.AI_MISSILE_NO_MOMENTUM) {
    hasMoved = missileAiNoMomentum(ship);
  } else if (ship.aiType === b.AI_MINE) {
    hasMoved = mineAi(ship);
  } else if (ship.aiType === b.AI_NONE) {
    hasMoved = noneAi(ship);
  }
  if (hasMoved) {
    checkForCollisionWithShip(ship);
  }
}

/**
 * Fire primary weapon in the direction of x,y
 * @ship ship with gun to fire
 * @x/y  the location to aim at
 * @jitter amount (in radians) of randomness added to direction component
 *         0 - shoots directly at player
 *         PI - shoot completely randomly
 */
export function shootAt(shooter, x, y, jitter) {
  shooter.rotation = utils.normalizeRadian(Math.atan2(y - shooter.y, x - shooter.x));
  run.firePrimaryWeapon(shooter, jitter);
}

export function turretAi(turretShip) {
  const {target, dist} = getNearestOpponentTarget(turretShip, true, false);
  if (!target || !target.alive) {
    return false;
  }
  // we start shooting a little early before we can actually hit something
  if (dist < (run.primaryWeaponRange(turretShip) + 150)) {
    aimShotAt(turretShip, target, null);
  }
  return false;
}

/**
 * Finds the nearest opponent target
 * @currShip : the current ship to find nearby opponents for
 * returns {target:ship, dist:int }  x and y will be null if no living targets are found
 */
export function getNearestOpponentTarget(currShip, seeCloaked = false, seeStealth = false) {
  let target = null;
  let minDist = null;
  for (let ship of w.world.ships) {
    const canSee = (seeCloaked || !manage.isCloaked(ship)) && (seeStealth || !manage.isStealth(ship));
    if (ship.alive && canSee && ship.playerId !== currShip.playerId && !ship.inStorage) {
      let dist = utils.distanceBetween(currShip.x, currShip.y, ship.x, ship.y);
      if (!target || (dist < minDist)) {
        target = ship;
        minDist = dist;
      }
    }
  } // for
  return {target: target, dist: minDist};
}

/**
 * Finds the nearest friendly target to the ship
 * @currShip : any friendly ship except the one matching currShip.id
 * returns {target:X, dist:Y }  x and y will be null if no living targets are found
 */
export function getNearestFriendlyTarget(currShip, seeCloaked = false, seeStealth = false) {
  let target = null;
  let minDist = null;
  for (let ship of w.world.ships) {
    const canSee = (seeCloaked || !manage.isCloaked(ship)) && (seeStealth || !manage.isStealth(ship));
    if (ship.alive && canSee && ship.playerId === currShip.playerId && ship.id !== currShip.id) {
      let dist = utils.distanceBetween(currShip.x, currShip.y, ship.x, ship.y);
      if (!target || (dist < minDist)) {
        target = ship;
        minDist = dist;
      }
    }
  } // for
  return {target: target, dist: minDist};
}

/**
 * Simple AI for missiles - find nearest target and move toward it attempting to crash
 */
export function missileAi(missile) {
  if (!missile.viewRange) {
    console.warn("Missile cannot see, no view range");
    return false;
  }
  const {target, dist} = getNearestOpponentTarget(missile, false, true);
  // Missiles don't track targets really far away
  if (target && dist <= missile.viewRange) {
    if (missile.landed) {
      missile.landed = false;
      run.propelShip(missile, 30);
    } else {
      let dirToTarget = utils.directionTo(missile.x, missile.y, target.x, target.y);
      let {xAmt, yAmt} = utils.dirComponents(dirToTarget, missile.propulsion);
      missile.vx += xAmt;
      missile.vy += yAmt;
    }
    return true;
  }
  // Don't move if there's nobody to move towards
  return false;
}

/**
 * AI that tries to crash into the nearest enemy
 */
export function missileAiNoMomentum(missile) {
  if (!missile.viewRange) {
    console.warn("missileAiNoMomentum cannot see, no view range");
    return false;
  }
  const {target, dist} = getNearestOpponentTarget(missile, false, true);
  if (target && dist <= missile.viewRange) {
    if (missile.landed) {
      missile.landed = false;
      run.propelShip(missile, 100);
    } else {
      let dirToTarget = utils.directionTo(missile.x, missile.y, target.x, target.y);
      // We are moving without momentum, so propulsion is not our acceleration but distance
      let {xAmt, yAmt} = utils.dirComponents(dirToTarget, (missile.propulsion * 50));
      missile.x += xAmt;
      missile.y += yAmt;
      console.log('moving towards ', target.name, ' => ', xAmt, ',', yAmt);
      if (missile.vx > 0) {
        missile.vx = 0;
      }
      if (missile.vy > 0) {
        missile.vy = 0;
      }
    }
    return true;
  }
  // Don't move if there's nobody to move towards
  return false;
}

/**
 * AI that doesn't move and explodes when near enough to an enemy
 */
export function mineAi(mine) {
  if (!mine.viewRange) {
    console.log("Mine cannot see, no view range");
    return false;
  }
  const {target, dist} = getNearestOpponentTarget(mine, true, false);
  if (target && dist <= mine.viewRange) {
    // Blow up the missile
    run.damageShip(mine, mine.armor);
    // Explosion crash.jpg is 128 x 128 - explosion visually is about 40px
    const explosionScale = mine.viewRange / 40;
    w.createExplosion(mine.x, mine.y, explosionScale);
    // Damage nearby ships
    for (let ship of w.world.ships) {
      if (ship.alive && utils.distanceBetween(mine.x, mine.y, ship.x, ship.y) < mine.viewRange) {
        run.damageShip(ship, mine.explosionDamage);
      }
    }
  }
  // Doesn't move
  return false;
}

/**
 * AI that doesn't do anything
 */
export function noneAi(ship) {
  // Doesn't move
  return false;
}

/**
 * Determine x,y amounts needed to move around an obstacle, moving right or left from dirToTarget
 */
export function goAround(x, y, propulsion, obstacleX, obstacleY, dirToTarget) {
  const dirToObstacle = utils.directionTo(x, y, obstacleX, obstacleY);
  let dirDiff = dirToObstacle - dirToTarget;
  let rightLeft = (dirDiff >= 0) ? -1 : 1;
  if (Math.abs(dirDiff) > Math.PI) {
    rightLeft = rightLeft * -1;
  }
  const turnDir = dirToObstacle + (rightLeft * Math.PI / 2);
  const moveAmts = utils.dirComponents(turnDir, 20 * propulsion);
  const xAmt = moveAmts.xAmt;
  const yAmt = moveAmts.yAmt;
  return {xAmt, yAmt};
}

/**
 * This will return xAmt, yAmt which would be a reasonable next step to get to targetX, targetY from your current position.
 * This will go around planets and other ships, trying not to crash into things.
 * @param shipToMove : ship that will be moving - NOTE: This function does NOT move the ship, you need to do that.
 * @param targetX amount to move in X
 * @param targetY amount to move in Y
 * @param crashIntoEnemy if true will crash into enemy ships, if false will avoid all ships
 * @ret {xAmt, yAmt} amount to add to the X/y coord to move in the right direction
 */
export function getXYToMoveTowards(shipToMove, targetX, targetY, crashIntoEnemy) {
  if (!shipToMove || !shipToMove.alive) {
    return;
  }
  let dirToTarget = utils.directionTo(shipToMove.x, shipToMove.y, targetX, targetY);
  let {xAmt, yAmt} = utils.dirComponents(dirToTarget, 25 * shipToMove.propulsion);

  // Check if we are too close to a planet (need to move around the planet)
  for (let planet of w.world.planets) {
    if (utils.distanceBetween(shipToMove.x + xAmt, shipToMove.y + yAmt, planet.x, planet.y) < (planet.radius + shipToMove.radius + 10)) {
      const moveAmt = goAround(shipToMove.x, shipToMove.y, shipToMove.propulsion, planet.x, planet.y, dirToTarget);
      if (willCollideWithPlanet(shipToMove.x + moveAmt.xAmt, shipToMove.y + moveAmt.yAmt, shipToMove.radius)) {
        // If we are going to collide with a planet, we wil try backing away from the planet to prevent planet-hugging
        const dirToPlanet = utils.directionTo(shipToMove.x, shipToMove.y, planet.x, planet.y);
        const distToPlanetSurface = (planet.radius + shipToMove.radius) - utils.distanceBetween(planet.x, planet.y, shipToMove.x, shipToMove.y);
        let newAmounts = utils.dirComponents(utils.normalizeRadian(dirToPlanet + Math.PI), Math.max(distToPlanetSurface, 20));
        xAmt = newAmounts.xAmt;
        yAmt = newAmounts.yAmt;
      } else {
        xAmt = moveAmt.xAmt;
        yAmt = moveAmt.yAmt;
      }
    }
  } // for planet

  // Check for ships we should go around
  const nearestShip = crashIntoEnemy ? getNearestFriendlyTarget(shipToMove) :
    getNearestShip(shipToMove.x + xAmt, shipToMove.y + yAmt, shipToMove.id);
  if (nearestShip.target && nearestShip.dist <= nearestShip.target.radius + shipToMove.radius + 20) {
    const moveAmt = goAround(shipToMove.x, shipToMove.y, shipToMove.propulsion, nearestShip.target.x, nearestShip.target.y, dirToTarget);
    if (willCollideWithShip(shipToMove.x + moveAmt.xAmt, shipToMove.y + moveAmt.yAmt, shipToMove.id, shipToMove.radius)) {
      xAmt = 0;
      yAmt = 0;
    } else {
      xAmt = moveAmt.xAmt;
      yAmt = moveAmt.yAmt;
    }
  }
  return {xAmt, yAmt};
}

export function willCollideWithShip(x, y, shipId, shipRadius) {
  for (let ship of w.world.ships) {
    if (ship.alive && ship.id !== shipId) {
      let dist = utils.distanceBetween(ship.x, ship.y, x, y);
      if (dist <= (ship.radius + shipRadius)) {
        return true;
      }
    }
  } // for
  return false;
}

export function willCollideWithPlanet(x, y, shipRadius) {
  for (let planet of w.world.planets) {
    let dist = utils.distanceBetween(planet.x, planet.y, x, y);
    if (dist <= (planet.radius + shipRadius)) {
      return true;
    }
  } // for
  return false;
}

export function getNearestShip(x, y, shipId,) {
  let minDist = null;
  let target = null;
  for (let ship of w.world.ships) {
    if (ship.alive && ship.id !== shipId) {
      let dist = utils.distanceBetween(x, y, ship.x, ship.y);
      if (!target || (dist < minDist)) {
        target = ship;
        minDist = dist;
      }
    }
  } // for
  return {target: target, dist: minDist};
}

export function checkForCollisionWithShip(ship) {
  for (let otherShip of w.world.ships) {
    if (otherShip.alive && ship !== otherShip) {
      let dist = utils.distanceBetween(ship.x, ship.y, otherShip.x, otherShip.y);
      if (dist <= (ship.radius + otherShip.radius)) {
        run.shipsCollide(ship, otherShip);
      }
    }
  } // for
}

export function enableShieldIfNeeded(ship) {
  const shieldEquip = getShield(ship);
  if (!shieldEquip || shieldEquip.cool > 0) {
    return;
  }
  run.enableShield(ship, shieldEquip.shield);
  shieldEquip.cool = shieldEquip.coolTime;
}

export function getShield(ship) {
  for (let i = 0; i < ship.equip.length; i++) {
    const equip = ship.equip[i];
    if ((equip.type === b.EQUIP_TYPE_SECONDARY_WEAPON) && equip.shield) {
      return equip;
    }
  } // for
  return null;
}

/**
 * Fire primary weapon in a best attempt to hit target ship
 * This will take into account the target's movement and lead the shot
 * @shooter ship with gun to fire
 * @target ship to try to hit
 * @weapon weapon to fire, if null it will fire the primary weapon on shooter
 */
export function aimShotAt(shooter, target, weapon) {
  const gun = weapon ? weapon : utils.getEquip(shooter, c.EQUIP_TYPE_PRIMARY_WEAPON);
  if (!gun) {
    return;
  }
  const bulletSpeed = gun.speed;
  const deltaX = target.x - shooter.x;
  const deltaY = target.y - shooter.y;

  // Target speed squared (v_t^2)
  const targetSpeedSquared = target.vx * target.vx + target.vy * target.vy;

  // Quadratic coefficients: a*t^2 + b*t + c = 0
  const a = targetSpeedSquared - bulletSpeed * bulletSpeed;
  const b = 2 * (deltaX * target.vx + deltaY * target.vy);
  const cee = deltaX * deltaX + deltaY * deltaY;

  // Calculate discriminant
  const discriminant = b * b - 4 * a * cee;

  // Check if a solution exists (discriminant >= 0)
  if (discriminant < 0) {
    // We can't make a shot, so shoot in their general direction
    run.fireWeapon(gun, shooter);
    return;
  }

  // Solve quadratic equation for time (take the positive root)
  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t = (t1 > 0 && (t2 < 0 || t1 < t2)) ? t1 : t2;

  if (t <= 0) {
    // We can't make the shot, so shoot generally over that-a-way
    run.fireWeapon(gun, shooter);
    return;
  }

  // Calculate interception point
  const interceptX = target.x + target.vx * t;
  const interceptY = target.y + target.vy * t;

  // Calculate direction vector and angle (in radians)
  const dirX = interceptX - shooter.x;
  const dirY = interceptY - shooter.y;
  const angle = Math.atan2(dirY, dirX); // Angle in radians

  // Fire
  shooter.rotation = utils.normalizeRadian(angle);
  run.fireWeapon(gun, shooter);
}

/**
 * AI for aliens that move toward the player and shoots
 * @ aimed : use good aim
 * @return true if alien moved false otherwise
 */
export function creeperAi(alien, crashIntoPlayer = false, aimed = false) {
  const viewRange = alien.viewRange || 1000;
  let moved = false;
  const {target: playerTarget, dist: distToOpponent} = getNearestOpponentTarget(alien);
  if (!playerTarget) {
    return;
  }
  if (distToOpponent < viewRange) {
    let dirToTarget = utils.directionTo(alien.x, alien.y, playerTarget.x, playerTarget.y);
    let {xAmt, yAmt} = getXYToMoveTowards(alien, playerTarget.x, playerTarget.y, crashIntoPlayer);
    // Too close to an enemy, don't move as you might crash
    if (!crashIntoPlayer && distToOpponent < (playerTarget.radius + alien.radius + 20)) {
      xAmt = 0;
      yAmt = 0;
    }
    // Don't crash into friends
    const {target: friend} = getNearestFriendlyTarget(alien);
    if (friend &&
      (utils.distanceBetween(alien.x + xAmt, alien.y + yAmt, friend.x, friend.y) < (alien.radius + friend.radius + 10))) {
      xAmt = 0;
      yAmt = 0;
    }
    if (alien.armor < alien.armorMax) {
      enableShieldIfNeeded(alien);
    }
    alien.x += xAmt;
    alien.y += yAmt;
    alien.rotation = dirToTarget;
    moved = true;
  } else {
    // If nobody is in view, move back to the center
    let {xAmt, yAmt} = getXYToMoveTowards(alien, 0, 0, crashIntoPlayer);
    if (utils.distanceBetween(alien.x + xAmt, alien.y + yAmt, 0, 0,) > (300 + alien.radius)) {
      alien.x += xAmt;
      alien.y += yAmt;
      moved = true;
    }
  }
  if (distToOpponent < run.primaryWeaponRange(alien)) {
    if (aimed) {
      aimShotAt(alien, playerTarget, null);
    } else {
      shootAt(alien, playerTarget.x, playerTarget.y, 0.15);
    }
  }
  return moved;
}
