import * as b from './s_blueprints.js'
import * as c from './s_constants.js'
import * as w from './s_world.js'
import * as utils from './s_utils.js'
import * as run from './s_run.js'

export function repairShip(ship, planet) {
  let addArmor = ship.armorMax - ship.armor; // armor needed
  ship.armor += addArmor;
}

/**
 * Create a new piece of equipment from the template
 */
export function makeEquip(blueprint) {
  let equip = utils.cloneDeep(blueprint);
  equip.id = w.generateUniqueId();
  return equip;
}

/**
 * @return true if the equip can be added to the ship
 */
function canEquip(ship, equip) {
  if (!ship || !ship.equip || !equip) {
    return false;
  }
  // No more space
  if (ship.equip.length >= ship.equipMax) {
    return false;
  }
  console.log('equip type ', equip.type, ' c=',c.EQUIP_TYPE_PRIMARY_WEAPON);
  // Some equip you can only have one
  if ([c.EQUIP_TYPE_BRAKE, c.EQUIP_TYPE_PRIMARY_WEAPON, c.EQUIP_TYPE_THRUSTER].includes(equip.type)) {
    if (ship.equip.find((eq) => eq.type === equip.type)) {
      return false;
    }
  }
  return true;
}

/**
 * Builds equipment or a ship and puts it into storage on the planet
 * @param clientBlueprint to build (sent from client and not trusted)
 * @param planet planet to store finished product
 * @param player owns ship
 */
export function build(clientBlueprint, planet, player) {
  // Lookup blueprint (don't trust the client to send a valid one)
  const blueprint = b.ALL_BLUEPRINTS.find(bp => bp.objectType === clientBlueprint.objectType && bp.name === clientBlueprint.name);
  if (!blueprint) {
    console.log("Unable to find matching blueprint for ", clientBlueprint);
    return;
  }
  const ship = player.currentShip;

  if (blueprint.objectType === c.OBJECT_TYPE_SHIP) {
    let newShip = w.createShip(blueprint, player);
    newShip.inStorage = true;
    planet.ships.push(newShip);
    w.world.ships.push(newShip);
    // Switch to the newly built ship immediately
    w.startUsingShip(player, newShip, planet);
  } else if (blueprint.objectType === c.OBJECT_TYPE_EQUIP) {
    let newEquip = makeEquip(blueprint);
    planet.equip.push(newEquip);
    // Move equip directly onto the current ship
    if (canEquip(player.currentShip, newEquip)) {
      moveEquip(planet, player.currentShip, newEquip, player);  
    }
  } else {
    console.warn("Cannot build object of unknown type ", blueprint.objectType);
  }
}

/**
 * Move equipment from ship to planet or planet to ship
 * @param sourceP ship/planet (user copy, not real object)
 * @param targetP ship/planet (user copy not the real object)
 * @param equipP (user supplied equip - don't trust this it's a copy)
 * @param player contains real ship and planet
 */
export function moveEquip(sourceP, targetP, equipP, player) {
  const planet = player.selectedPlanet;
  const ship = player.currentShip;

  // Get the real source/target objects
  let source = null;
  let target = null;
  if (sourceP.id === planet.id) {
    source = planet;
  } else if (sourceP.id === ship.id) {
    source = ship;
  } else if (planet.ships.find(s => s.id === sourceP.id))  {
    source = planet.ships.find(s => s.id === sourceP.id)
  } else {
    console.warn("Unable to equip as source is not selected planet or current ship source=",sourceP.id, " planetId=",planet.id, " shipId=",ship.id);
    return;
  }
  if (targetP.id === planet.id) {
    target = planet;
  } else if (targetP.id === ship.id) {
    target = ship;
  } else if (planet.ships.find(s => s.id === targetP.id))  {
    target = planet.ships.find(s => s.id === targetP.id)
  } else {
    console.warn("Unable to equip as target is not selected planet or current ship ",targetP, " planet=",planet, " ship=",ship);
    return;
  }
  // Get the equip from the source
  const equip = source.equip.find(e => e.id === equipP.id);
  if (!equip) {
    console.warn("Unable to find equip on source equipP=", equipP, " source=",source);
    return;
  }
  // Add equip to the target
  target.equip.push(equip)
  // Remove equip from the source
  utils.arrayRemoveItemOnce(source.equip, equip)

  if (target.objectType === c.OBJECT_TYPE_SHIP) {
    addEquip(target, equip);
  }
  if (source.objectType === c.OBJECT_TYPE_SHIP) {
    removeEquip(source, equip);
  }
}

export function selectSecondaryWeaponIndex(ship, selectedSecondaryWeaponIndex) {
  if (!ship) {
    console.log('Cannot select secondary weapon without a ship');
    return;
  }
  ship.selectedSecondaryWeaponIndex = selectedSecondaryWeaponIndex;
}

/**
 * Handles all the extra stuff besides actually adding the equip to the ship
 **/
export function addEquip(ship, newEquip) {
  if (newEquip.type === b.EQUIP_TYPE_ARMOR) {
    // Only add armor if the ship is in full repair
    if (ship.armor === ship.armorMax) {
      ship.armor += newEquip.armorAmt;
    }
    ship.armorMax += newEquip.armorAmt;
  }
}

/**
 * Handles all the effects of removing equip besides actually removing it from ship.equip
 */
export function removeEquip(ship, equip) {
  if (equip.type === b.EQUIP_TYPE_ARMOR) {
    ship.armorMax -= equip.armorAmt;
    if (ship.armor > ship.armorMax) {
      ship.armor = ship.armorMax;
    }
  }
  // We need to call disable to restore the ship radius (cool will still apply)
  if (equip.shield) {
    run.disableShield(ship, equip.shield);
  }
  // If we removed any equipment, we need to reset the secondaryWeaponIndex as all the items may have shifted
  ship.selectedSecondaryWeaponIndex = -1;
}

/**
 * Removes a piece of random equipment and drops it on a nearby planet
 */
export function dropRandomEquip(ship) {
  if (!ship || !ship.equip || ship.equip.length === 0) {
    return;
  }
  const equipIndex = utils.randomInt(0, ship.equip.length-1);
  const equip = ship.equip[equipIndex];
  ship.equip.splice(equipIndex, 1);
  removeEquip(ship, equip); // remove from ship
  // Drop equip on planet
  const nearestPlanets = findNearestPlanets(ship.x, ship.y, 3);
  const nearestPlanet = nearestPlanets[utils.randomInt(0, nearestPlanets.length-1)].planet;
  nearestPlanet.equip.push(equip);
}

/**
 * Finds the nearest X planets and their distances
 * @return [{planet:planetObj, dist:123}, {...}...]
 */
export function findNearestPlanets(x, y, planetCount) {
  const retVal = [];
  for (let planet of w.world.planets) {
    const dist = utils.distanceBetween(x, y, planet.x, planet.y);
    // Get the farthest planet found so far
    let maxIndex = -1;
    let maxDist = -1;
    for (let i=0; i<retVal.length; i++) {
      const val = retVal[i];
      if (val.dist > maxDist) {
        maxDist = val.dist;
        maxIndex = i;
      }
    } // for i
    if (maxDist === -1 || maxDist > dist) {
      const val = {planet:planet, dist:dist};
      if (retVal.length < planetCount) {
        // Add the val to the list of planets we've found
        retVal.push(val);
      } else {
        // Replace the farthest planet with this one
        retVal.splice(maxIndex, 1, val);
      }
    }
  } // for planet
  retVal.sort((a,b) => a.dist - b.dist);
  return retVal;
}

/**
 * @return true if the ship is currently cloaked
 */
export function isCloaked(ship) {
  const equipCloak = ship.equip.find(e => e.type === b.EQUIP_TYPE_SECONDARY_WEAPON && e.cloak);
  if (!equipCloak || !equipCloak.lifetime) {
    return false;
  }
  return equipCloak.lifetime.lifetime > 0;
}

/**
 * @return true if the ship is hidden by a stealth skin
 */
export function isStealth(ship) {
  const equipStealth = ship.equip.find(e => e.type === b.EQUIP_TYPE_SECONDARY_WEAPON && e.stealth);
  if (!equipStealth || !equipStealth.lifetime) {
    return false;
  }
  return equipStealth.lifetime.lifetime > 0;
}

/**
 * Jumps the ship to a nearby location
 */
export function jumpShip(ship, jumpEquip) {
  if (!ship || !jumpEquip || !jumpEquip.jump) {
    console.log("Unable to jump without ship and jump ", jumpEquip, ship);
    return;
  }
  const jump = jumpEquip.jump;
  let {x, y} = utils.getPointFrom(ship.x, ship.y, ship.rotation, jump.distance);
  ship.x = x;
  ship.y = y;
}