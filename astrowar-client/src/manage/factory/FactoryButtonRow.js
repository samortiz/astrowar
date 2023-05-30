import React from 'react';
import './FactoryButtonRow.css';
import * as c from "../../functions/client-constants";
import * as game from "../../functions/game";

export function FactoryButtonRow({template}) {
  const world = window.world;
  const planet = world.displayData?.player?.selectedPlanet || {ships:[], equip:[]};
  const ship = world.displayData?.player?.currentShip;
  let socket = window.world.system.socket;

  let existingInventory = (template.objectType === c.OBJECT_TYPE_SHIP) ?
    planet.ships.filter(s=> s.name === template.name).length:
    planet.equip.filter(e=> e.name === template.name).length;

  // Calculate the description
  let description = template.description;
  if (!description && template.damage) {
    description = `${Math.round(template.damage * (60 / template.coolTime))} dmg/s Range ${template.speed * template.lifetime} Speed ${template.speed} `;
  }
  if (!description && template.shield) {
    const shield = template.shield;
    description = `${shield.armorMax}dmg for ${Math.round(shield.lifetimeMax/60)}s every ${Math.round(template.coolTime/60)}s`;
  }
  if (template.createShip) {
    const newShip = template.createShip.type;
    description += ` Cost (${newShip.cost.titanium}T ${newShip.cost.gold}G ${newShip.cost.uranium}U)`;
  }
  if (template.objectType === c.OBJECT_TYPE_SHIP) {
    description = `${template.description} with ${template.armorMax} armor and ${template.equipMax} slots`
  }

  // We pretend the current ship is in storage in the planet
  if (ship.alive && template.name === ship.name) {
    existingInventory += 1;
  }

  function build(blueprint) {
    socket.emit("build", blueprint);
  }

  return (
    <tr>
      <td className="factory-row">
        {existingInventory}
      </td>
      <td className="factory-row">
      <button className="factory-button"
        disabled={!game.canAfford(planet, ship, template.cost)}
        onClick={() => build(template)}>{template.name}</button>
      </td>
      <td className="factory-row">
        <span className='cost'>{template.cost.titanium}T {template.cost.gold}G {template.cost.uranium}U</span>
      </td>
      <td className="factory-row">
        {description}
      </td>
    </tr>);
}

