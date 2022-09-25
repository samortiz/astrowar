import React from 'react';
import './InfoFly.css';
import {HEATBAR, Heatbar} from "./Heatbar";

export function InfoFly() {
  const world = window.world;
  const player = world.displayData?.player;
  const ship = player?.currentShip;


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
      <div className='top-row'>
        <div>
          <div>Ship</div>
          <table>
            <thead>
            <tr>
              <th style={{paddingRight: '10px'}}>Armor</th>
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
      }

    </div>
  );
}


