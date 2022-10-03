import React, {useState} from 'react';
import './ManageStorage.css';
import * as c from '../functions/client-constants.js'

export function ManageStorage() {
  const [selectedShipId, setSelectedShipId] = useState();
  let socket = window.world.system.socket;
  let displayData = window.world.displayData;
  let planet = displayData.player.selectedPlanet;
  let currentShip = displayData.player.currentShip;
  let shipOnPlanet = currentShip.landed && currentShip.alive;
  let ships = [currentShip, ...planet.ships];
  let selectedShip = ships.find(s => s.id === selectedShipId);
  if (!selectedShip) {
    selectedShip = currentShip;
  }
  if (!selectedShipId) {
    setSelectedShipId(currentShip.id);
  }

  function viewShip(ship) {
    setSelectedShipId(ship.id);
  }

  function startUsingShip() {
    socket.emit("use-ship", selectedShip);
    setSelectedShipId(selectedShip.id);
  }

  function moveEquip(source, target, equip) {
    socket.emit("move-equip", {source, target, equip});
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
    // Some equip you can only have one
    if ([c.EQUIP_TYPE_BRAKE, c.EQUIP_TYPE_PRIMARY_WEAPON, c.EQUIP_TYPE_THRUSTER].includes(equip.type)) {
      if (ship.equip.find((eq) => eq.type === equip.type)) {
        return false;
      }
    }
    return true;
  }


  let selectedShipEquip = [];
  if (selectedShip) {
    for (let equip of selectedShip.equip) {
      selectedShipEquip.push(
        <div className="item" key={equip.id}>
          {equip.name} #{equip.id}
          <button onClick={() => moveEquip(selectedShip, planet, equip)}>Remove</button>
        </div>);
    }
  }

  return (
    <div>
      <div className='storage-section'>
        <div className='title'>Ships</div>
        <span className='item-list'>
          {(shipOnPlanet ? [currentShip] : []).concat(planet.ships).map((ship, i) => {
            return <div key={i}
                        onClick={() => viewShip(ship)}
                        className={`ship ${selectedShip === ship ? 'selected-item' : 'non-selected-item'}`}>{ship.name} #{ship.id}</div>
          })}
        </span>
        <span className='item-details'>
          {selectedShip != null && // exclude this block if no ship selected
          <div>
            <div className='item-attr'>
              <button onClick={() => startUsingShip()} disabled={selectedShip === currentShip}>Use Ship</button>
            </div>
            <div className='item-attr'><b>Name</b> {selectedShip.name} {selectedShip.id}</div>
            <div className='item-attr'>
              <b>Engine</b> Propulsion:{Math.floor(selectedShip.propulsion * 100)} Turn:{Math.floor(selectedShip.turnSpeed * 100)}
            </div>
            <div className='item-attr'>
              <b>Landing</b> Speed:{Math.floor(selectedShip.crashSpeed)} Angle:{Math.floor(selectedShip.crashAngle * 10)}
            </div>
            <div className='item-attr'><b>Armor</b> &nbsp;
              {Math.floor(selectedShip.armor)} of {Math.floor(selectedShip.armorMax)}&nbsp;
            </div>
            <div className='item-attr'><b>Resources Max</b>{Math.floor(selectedShip.resourcesMax)}</div>
            <div className='item-attr'><b>Equip</b> ({selectedShip.equip.length} of {selectedShip.equipMax})
              {selectedShipEquip}
            </div>
          </div>
          }
        </span>
      </div>

      <div className='storage-section'>
        <div className='title'>Equipment</div>
        <span className='equip-list'>
          {planet.equip.map((equip, i) => {
            return <div key={i} className='item'>
              {equip.name} &nbsp;
              <button onClick={() => moveEquip(planet, selectedShip, equip)}
                      disabled={!canEquip(selectedShip, equip)}
              >Equip
              </button>
            </div>
          })}
        </span>
      </div>
    </div>);
}

