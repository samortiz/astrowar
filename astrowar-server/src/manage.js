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
