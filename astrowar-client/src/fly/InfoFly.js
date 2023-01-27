import React from 'react';
import './InfoFly.css';
import * as c from '../functions/client-constants.js';
import * as fly from '../functions/fly.js';
import {HEATBAR, Heatbar} from "./Heatbar";
import {PushButton} from "./PushButton";
import {StatusButton} from "./StatusButton";

export function InfoFly() {
  const world = window.world;
  const player = world.displayData?.player;
  const ship = player?.currentShip;
  const shield = fly.getEquippedShield(ship);

  function playerJoinsGame() {
    console.log('client calling join ');
    const name = "";
    world.system.socket.emit("join", name);
  }

  function newShip(){
    console.log('Sending new ship');
    world.system.socket.emit("new-ship");
  }

  function printInfo() {
    console.log('display ', world.displayData);
    console.log('world ', world);
    world.system.socket.emit("info");
  }

  function setSelectedSecondaryWeaponIndex(ship, index) {
    world.system.socket.emit("select-secondary", {selectedSecondaryWeaponIndex: index});
  }

  return (
    <div className='section'
         style={{backgroundImage: 'url("images/metalbackground.png")', backgroundSize: 'cover', height: '100%', paddingLeft:'3px'}}>

      {!player &&<div>
        <button onClick={() => playerJoinsGame()}> Join </button>
      </div>}

      {world.displayData && player && !ship?.alive && <div>
        <button onClick={() => newShip()}> New Ship </button>
      </div>}

      <br/><br/>
      <button onClick={() => printInfo()}> Info </button>

      {player && ship?.alive &&
      <div>
        <div className='top-row'>
          <div className='ship-display'>
            <div>Ship</div>
            <table>
              <thead>
              <tr>
                <th style={{paddingRight: '10px'}}>Armor</th>
                <th>
                  {shield && shield.shield?.active &&
                  <span>
                    Shield
                  </span>
                  }
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td style={{textAlign: 'center'}}>
                  <Heatbar type={HEATBAR.COLOR} curr={ship.armor} max={ship.armorMax}/>
                </td>
                <td>
                  {shield && shield.shield.active &&
                  <span>
                      <Heatbar type={HEATBAR.RED} curr={shield.shield.lifetime} max={shield.shield.lifetimeMax}/>
                      <Heatbar type={HEATBAR.COLOR} curr={shield.shield.armor} max={shield.shield.armorMax}/>
                    </span>
                  }
                </td>
              </tr>
              <tr>
                <td>
                  {Math.floor(ship.armor)} / {ship.armorMax}
                </td>
                <td>
                  {shield && shield.shield?.active &&
                  <span>
                    {Math.floor(shield.shield.armor)} / {shield.shield.armorMax}
                  </span>
                  }
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div className='bluescreen-container'>
            <div className='bluescreen-background'>
              <img src='images/blue_screen.png' className='stretch' alt='bluescreen'/>
            </div>
            <div className='bluescreen-text'>
              <table cellPadding='4'>
                <thead>
                <tr>
                  <th colSpan='100%'>Resources</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Titatium</td>
                  <td>{Math.floor(ship.resources.titanium)}</td>
                </tr>
                <tr>
                  <td>Gold</td>
                  <td>{Math.floor(ship.resources.gold)}</td>
                </tr>
                <tr>
                  <td>Uranium</td>
                  <td>{Math.floor(ship.resources.uranium)}</td>
                </tr>
                <tr>
                  <td>Death Count&nbsp;</td>
                  <td>{player.deathCount}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <table className="equip-list">
          <tbody>
          <tr>
            <td>
              <div>
                <b>Equip (max {ship.equipMax})</b>
              </div>
              <table>
                <tbody>
                {ship.equip.map((equip, i) => {
                  return <tr key={i} className='equip'>
                    <td>
                      {equip.type === c.EQUIP_TYPE_SECONDARY_WEAPON &&
                      <PushButton selected={i === ship.selectedSecondaryWeaponIndex} onChange={() => {
                        setSelectedSecondaryWeaponIndex(ship, i);
                      }}/>}
                    </td>
                    <td>
                      <StatusButton curr={equip.coolTime - equip.cool} max={equip.coolTime}/>
                    </td>
                    <td>
                      {equip.name}
                    </td>
                  </tr>
                })}
                </tbody>
              </table>
            </td>
            <td style={{paddingLeft: '10px'}}> </td>
          </tr>
          </tbody>
        </table>
      </div>
      }
    </div>
  );
}


