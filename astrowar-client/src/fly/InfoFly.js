import React from 'react';
import './InfoFly.css';
import * as c from '../functions/client-constants.js';
import * as fly from '../functions/fly.js';
import {HEATBAR, Heatbar} from "./Heatbar";
import {PushButton} from "./PushButton";
import {StatusButton} from "./StatusButton";
import {buttonDown, buttonUp, killContextMenu} from "../functions/utils";
import {Scoreboard} from "../manage/Scoreboard";

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

  function newShip() {
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
         style={{backgroundImage: 'url("images/metalbackground.png")', backgroundSize: 'cover', height: '100%', paddingLeft: '3px'}}>

      {!player && <div>
        <button onClick={() => playerJoinsGame()}> Join</button>
      </div>}

      {world.displayData && player && !ship?.alive && <div>
        <button onClick={() => newShip()}> New Ship</button>
      </div>}

      <br/><br/>
      <button onClick={() => printInfo()}> Info</button>

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
                  <tbody>
                  <tr>
                    <td>Death Count&nbsp;</td>
                    <td>{player.deathCount}</td>
                  </tr>
                  <tr>
                    <td rowSpan='2'>
                      <Scoreboard highScoreOnly='true'/>
                    </td>
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
              <td style={{paddingLeft: '10px'}}></td>
            </tr>
            </tbody>
          </table>

          <div className="button-control-container">
            <div className="button-space">
              <button type='button' onMouseDown={() => buttonDown(c.SECONDARY)} onMouseUp={() => buttonUp(c.SECONDARY)}
                      onTouchStart={() => buttonDown(c.SECONDARY)} onTouchEnd={() => buttonUp(c.SECONDARY)}
                      onContextMenu={(event) => killContextMenu(event)}>
                <b>X</b>
              </button>
            </div>
            <div className="button-space">
              <button type='button' onMouseDown={() => buttonDown(c.SPACE)} onMouseUp={() => buttonUp(c.SPACE)}
                      onTouchStart={() => buttonDown(c.SPACE)} onTouchEnd={() => buttonUp(c.SPACE)}
                      onContextMenu={(event) => killContextMenu(event)}>
                <i className="fa fa-crosshairs"> </i>
              </button>
            </div>
            <table>
              <tbody>
              <tr>
                <td></td>
                <td>
                  <button type='button' onMouseDown={() => buttonDown(c.UP)} onMouseUp={() => buttonUp(c.UP)}
                          onTouchStart={() => buttonDown(c.UP)} onTouchEnd={() => buttonUp(c.UP)}
                          onContextMenu={(event) => killContextMenu(event)}>
                    <i className="fa fa-arrow-up"> </i>
                  </button>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <button type='button' onMouseDown={() => buttonDown(c.LEFT)} onMouseUp={() => buttonUp(c.LEFT)}
                          onTouchStart={() => buttonDown(c.LEFT)} onTouchEnd={() => buttonUp(c.LEFT)}
                          onContextMenu={(event) => killContextMenu(event)}>
                    <i className="fa fa-arrow-left"> </i>
                  </button>
                </td>
                <td>
                  <button type='button' onMouseDown={() => buttonDown(c.DOWN)} onMouseUp={() => buttonUp(c.DOWN)}
                          onTouchStart={() => buttonDown(c.DOWN)} onTouchEnd={() => buttonUp(c.DOWN)}
                          onContextMenu={(event) => killContextMenu(event)}>
                    <i className="fa fa-arrow-down"> </i>
                  </button>
                </td>
                <td>
                  <button type='button' onMouseDown={() => buttonDown(c.RIGHT)} onMouseUp={() => buttonUp(c.RIGHT)}
                          onTouchStart={() => buttonDown(c.RIGHT)} onTouchEnd={() => buttonUp(c.RIGHT)}
                          onContextMenu={(event) => killContextMenu(event)}>
                    <i className="fa fa-arrow-right"> </i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

        </div>
      }
    </div>
  );
}


