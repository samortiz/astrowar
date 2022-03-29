import React from 'react';
import './InfoFly.css';
import {HEATBAR, Heatbar} from "./Heatbar";

export function InfoFly() {
  const world = window.world;
  const ship = world.ship;

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
    world.system.socket.emit("info");
  }

  return (
    <div className='section'
         style={{backgroundImage: 'url("images/metalbackground.png")', backgroundSize: 'cover', height: '100%', paddingLeft:'3px'}}>

      {!world.displayData && <div>
        <button onClick={() => playerJoinsGame()}> Join </button>
      </div>}

      {world.displayData && !world.displayData.player.alive && <div>
        <button onClick={() => newShip()}> New Ship </button>
      </div>}

      <br/> <br/>
      <button onClick={() => printInfo()}> Info </button>

      {ship &&
      <div className='top-row'>
        <div>
          <div>{ship.name}</div>
          <table>
            <thead>
            <tr>
              <th style={{paddingRight: '10px'}}>Armor</th>
              <th>Shield</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td style={{textAlign: 'center'}}>
                <Heatbar type={HEATBAR.COLOR} curr={ship.armor} max={ship.armorMax}/>
              </td>
            </tr>
            <tr>
              <td>
                {Math.floor(ship.armor)} / {ship.armorMax}
              </td>
              <td></td>
              <td></td>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
      }

    </div>
  );
}


