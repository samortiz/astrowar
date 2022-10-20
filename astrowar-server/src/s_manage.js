import * as b from './s_blueprints.js'
import * as c from './s_constants.js'
import * as w from './s_world.js'
import * as utils from './s_utils.js'
import {arrayRemoveItemOnce} from "./s_utils.js";
import {EQUIP_TYPE_CLOAK, EQUIP_TYPE_SECONDARY_WEAPON} from "./s_blueprints.js";

/**
 * Move a resource ship <-> planet
 */
export function transferResource(source, target, resourceType, requestedAmtStr) {
  let requestedAmt = Number(requestedAmtStr);
  if (isNaN(requestedAmt)) {
    requestedAmt = 0;
  }
  let amt = requestedAmt;
  // requesting '' is requesting the entire source (same as requesting too much)
  if (requestedAmtStr === '' || (source[resourceType] - requestedAmt < 0)) {
    amt = source[resourceType];
  }
  target[resourceType] += amt;
  source[resourceType] -= amt;
}

/**
 * Move all resources to the planet
 */
export function unloadShip(ship, planet) {
  transferResource(ship.resources, planet.resources, 'titanium', ship.resources.titanium, null);
  transferResource(ship.resources, planet.resources, 'gold', ship.resources.gold, null);
  transferResource(ship.resources, planet.resources, 'uranium', ship.resources.uranium, null);
}

/**
 * Take all the resources from the planet. This is for quick restocking of resources
 */
export function loadShip(ship, planet) {
  transferResource(planet.resources, ship.resources, 'titanium', planet.resources.titanium, null);
  transferResource(planet.resources, ship.resources, 'gold', planet.resources.gold, null);
  transferResource(planet.resources, ship.resources, 'uranium', planet.resources.uranium, null);
  console.log('loaded ', ship, ' from ',planet);
}

export function costToRepair(ship) {
  const damageToRepair = ship.armorMax - ship.armor;
  // If you change the /5 remember to change the same in repairShip... maybe should be a constant
  return {titanium:(damageToRepair / 5), gold:0, uranium:0};
}

export function repairShip(ship, planet) {
  let cost = costToRepair(ship);
  let addArmor = ship.armorMax - ship.armor; // armor needed
  if (!canAfford(planet, ship, cost)) {
    let titaniumOnHand = planet.resources.titanium + ship.resources.titanium;
    cost.titanium = titaniumOnHand;
    addArmor = titaniumOnHand * 5;
  }
  payResourceCost(planet, ship, cost);
  ship.armor += addArmor;
}


/**
 * Checks if the combined resources of planet and ship can afford the resources
 * Call this before calling payResourceCost
 * @return true if there are enough resources available
 */
export function canAfford(planet, ship, resources) {
  let titanium = 0;
  let gold = 0;
  let uranium = 0;
  if (planet) {
    titanium += planet.resources.titanium;
    gold += planet.resources.gold;
    uranium += planet.resources.uranium;
  }
  if (ship) {
    titanium += ship.resources.titanium;
    gold += ship.resources.gold;
    uranium += ship.resources.uranium;
  }
  return (titanium >= resources.titanium)
      && (gold >= resources.gold)
      && (uranium >= resources.uranium);
}

/**
 * Pays the cost, taking from the planet and the ship as available
 * NOTE: This will not ensure you have enough resources, you can go into debt if you call this without checking
 * first using canAfford()
 * @param planet planet to get resources from
 * @param ship ship to get resources from
 * @param resources amount to pay
 */
export function payResourceCost(planet, ship, resources) {
  payResource(planet, ship, 'titanium', resources.titanium);
  payResource(planet, ship, 'gold', resources.gold);
  payResource(planet, ship, 'uranium', resources.uranium);
}

export function payResource(planet, ship, resourceType, amount) {
  let paid = -amount; // amount owing (overwritten if some payment comes from the planet)
  if (planet) {
    paid = planet.resources[resourceType] - amount;
    if (paid >= 0) {
      planet.resources[resourceType] -= amount;
      return;
    } else {
      // Planet can't afford this purchase, take some from the ship
      planet.resources[resourceType] = 0;
    }
  }
  if (ship) {
    ship.resources[resourceType] = ship.resources[resourceType] + paid;
    if (ship.resources[resourceType] < 0) {
      console.warn("Ship is in debt " + ship.resources[resourceType] + " " + resourceType);
    }
  } else if (paid < 0) {
    planet.resources[resourceType] = planet.resources[resourceType] + paid;
    console.warn("Planet is in debt " + planet.resources[resourceType] + " " + resourceType);
  }
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
 * Builds equipment or a ship and puts it into storage on the planet
 * @param clientBlueprint to build (sent from client and not trusted)
 * @param planet planet to pull resources and store finished product
 * @param player used to pull resources from ship if needed, player owns ship
 */
export function build(clientBlueprint, planet, player) {
  // Lookup blueprint (don't trust the client to send a valid one)
  const blueprint = b.ALL_BLUEPRINTS.find(bp => bp.objectType === clientBlueprint.objectType && bp.name === clientBlueprint.name);
  if (!blueprint) {
    console.log("Unable to find matching blueprint for ", clientBlueprint);
    return;
  }
  const ship = player.currentShip;
  payResourceCost(planet, ship, blueprint.cost);

  if (blueprint.objectType === c.OBJECT_TYPE_SHIP) {
    let newShip = w.createShip(blueprint, player);
    newShip.inStorage = true;
    planet.ships.push(newShip);
    w.world.ships.push(newShip);
  } else if (blueprint.objectType === c.OBJECT_TYPE_EQUIP) {
    let newEquip = makeEquip(blueprint);
    planet.equip.push(newEquip);
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
  arrayRemoveItemOnce(source.equip, equip)

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