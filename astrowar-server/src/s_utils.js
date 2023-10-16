import * as c from "./s_constants.js";

/**
 * Returns the distance between two points
 */
export function distanceBetween(ax, ay, bx, by) {
  return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
}

/**
 * Returns array with [x,y] of midpoint between two points
 * Both params should be [x,y]
 */
export function midPoint(a, b) {
  return [(a[0]+b[0])/2, (a[1]+b[1])/2];
}

/**
 * Convert the angle to 0 <= rad <= 2*PI
 */
export function normalizeRadian(radians) {
  let retVal = radians;
  if (retVal < 0) {
    retVal += Math.PI * 2;
  }
  if (retVal > Math.PI * 2) {
    retVal -= Math.PI * 2;
  }
  return retVal;
}

/**
 * @return the angle x1,y1 would need to face to point directly at x2,y2
 */
export function directionTo(x1,y1, x2,y2) {
  return normalizeRadian(Math.atan2(y2 - y1, x2 - x1));
}

/**
 * @return {{xAmt: number, yAmt: number}} splitting the dir and amount into x,y portions
 */
export function dirComponents(dir, amount) {
  let xAmt = amount * Math.cos(dir);
  let yAmt = amount * Math.sin(dir);
  return {xAmt, yAmt};
}

/**
 * @return an int between min and max inclusive
 */
export function randomInt(minP, maxP) {
  let min = Math.ceil(minP);
  let max = Math.floor(maxP);
  return Math.floor(Math.random() * (max - min +1) + min);
}

/**
 * @return a random floating point number between min and max
 */
export function randomFloat(min, max) {
  return min + (Math.random() * (max - min));
}

/**
 *  Returns a string with random hex digits
 * @param length: lenth of String to return
 */
export function randomHex(length) {
  const hexChars = '0123456789ABCDEF';
  let str = '';
  for (let i = 0; i <= length; i++) {
    str += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }
  return str;
}

/**
 * @return true 50% of the time
 */
export function randomBool() {
  return Math.random() > 0.5;
}

/**
 * @return add distance in direction to startX,startY
 */
export function getPointFrom(startX, startY, dir, distance) {
  let x = startX + (distance * Math.cos(dir));
  let y = startY + (distance * Math.sin(dir));
  return {x,y};
}

/**
 * Calc gravity for point.
 * @return {{x: number, y: number, dir: number}} This will be the x and y forces applied to the object (not a point)
 */
export function calcGravity(x, y, planet) {
  let distance = distanceBetween(x, y, planet.x, planet.y);
  if (distance < 10) {
    distance = 10;
  }
  let gravityDirection = Math.atan2(x - planet.x, y - planet.y);
  let gravityX = c.GRAVITATIONAL_CONST * planet.mass / Math.pow(distance, 2) * -Math.sin(gravityDirection);
  let gravityY = c.GRAVITATIONAL_CONST * planet.mass / Math.pow(distance, 2) * -Math.cos(gravityDirection);
  return {x:gravityX, y:gravityY, dir:gravityDirection};
}

/**
 * Does a deep clone of an object
 * NOTE: Only clones things that JSON serialize!  No functions or classes with prototype stuff
 */
export function cloneDeep(obj) {
  if (!obj) {
    return null;
  }
  return JSON.parse(JSON.stringify(obj))
}

/**
 * @return Return the first equip matching the type, if none found returns null
 */
export function getEquip(ship, equipType) {
  if (!ship || !equipType || !ship.equip) {
    return null;
  }
  return ship.equip.find(e => e.type === equipType);
}

export function arrayRemoveItemOnce(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

/**
 * @param val as an int or default if the supplied item is null or NaN
 * @param def default value if val is not a number
 */
export function getInt(val, def) {
  return parseInt(val) || def;
}

