import React, {useState} from 'react';
import './ManagePlanet.css';
import 'font-awesome/css/font-awesome.min.css';

export function ManagePlanet() {
  const [titaniumAmt, setTitaniumAmt] = useState('');
  const [goldAmt, setGoldAmt] = useState('');
  const [uraniumAmt, setUraniumAmt] = useState('');

  let player = window.world.displayData.player;
  let planet = player.selectedPlanet;
  let ship = player.currentShip;
  let socket = window.world.system.socket;

  function unloadShip() {
    socket.emit("unload-ship");
  }

  function loadShip() {
    socket.emit("load-ship");
  }

  function repairShip() {
    socket.emit("repair-ship");
  }

  function transferResource(source, target, resourceType, amt) {
    const transferData = {sourceId:source.id, targetId:target.id, resourceType:resourceType, amt:amt};
    socket.emit("transfer-resource", transferData);
  }

  return (
      <div className='planet-info'>
        <div style={{display:ship.alive?'block':'none'}} >
          <div className='section'><b>Ship</b> ({Math.round(ship.armor) +' / '+ ship.armorMax}) </div>
          <div className='section'>
            <button style={{marginLeft:'10px'}}
                    onClick={() => unloadShip()}>
              Unload
            </button>
            <button style={{marginLeft:'10px'}}
                    onClick={() => loadShip()}>
              Load
            </button>
            <button style={{marginLeft:'10px'}}
                    onClick={() => repairShip()}
                    disabled={ship.armorMax <= ship.armor}>
              Repair
            </button>
          </div>
        </div>

        {planet && <table className="row-item resource-table">
          <thead>
          <tr>
            <th>Resource</th>
            <th>Planet</th>
            <th>Transfer</th>
            <th>Ship</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Titanium</td>
            <td>{Math.floor(planet.resources.titanium)}</td>
            <td>
              <span className='transfer-button'
                    onClick={() => transferResource(ship, planet,
                        'titanium', titaniumAmt)}><i className="fa fa-arrow-left"> </i></span>
              <input type='text' className='transfer-input'
                     defaultValue={titaniumAmt}
                     onChange={(event) => setTitaniumAmt(event.target.value)}/>
              <span className='transfer-button'
                    onClick={() => transferResource(planet, ship,
                        'titanium', titaniumAmt)}><i className="fa fa-arrow-right"> </i></span>
            </td>
            <td>{Math.floor(ship.resources.titanium)}</td>
          </tr>
          <tr>
            <td>Gold</td>
            <td>{Math.floor(planet.resources.gold)}</td>
            <td>
              <span className='transfer-button'
                    onClick={() => transferResource(ship, planet,
                        'gold', goldAmt)}><i className="fa fa-arrow-left"> </i></span>
              <input type='text' className='transfer-input'
                     defaultValue={goldAmt}
                     onChange={(event) => setGoldAmt(event.target.value)}/>
              <span className='transfer-button'
                    onClick={() => transferResource(planet, ship,
                        'gold', goldAmt)}><i className="fa fa-arrow-right"> </i></span>
            </td>
            <td>{Math.floor(ship.resources.gold)}</td>
          </tr>
          <tr>
            <td>Uranium</td>
            <td>{Math.floor(planet.resources.uranium)}</td>
            <td>
              <span className='transfer-button'
                    onClick={() => transferResource(ship, planet,
                        'uranium', uraniumAmt)}><i className="fa fa-arrow-left"> </i></span>
              <input type='text' className='transfer-input'
                     defaultValue={uraniumAmt}
                     onChange={(event) => setUraniumAmt(event.target.value)}/>
              <span className='transfer-button'
                    onClick={() => transferResource(planet, ship,
                        'uranium', uraniumAmt)}><i className="fa fa-arrow-right"> </i></span>
            </td>
            <td>{Math.floor(ship.resources.uranium)}</td>
          </tr>
          </tbody>
        </table>}

      </div>);
}

