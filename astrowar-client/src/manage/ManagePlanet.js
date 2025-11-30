import React, {useState} from 'react';
import './ManagePlanet.css';
import 'font-awesome/css/font-awesome.min.css';
import {Scoreboard} from "./Scoreboard";
import {PLANET_GREEN_FILE} from "../functions/client-constants";

export function ManagePlanet() {
  const [loadoutName, setLoadoutName] = useState('');
  let player = window.world.displayData?.player;
  let scores = window.world.displayData?.scores.filter(s => s.score > 0);
  scores.sort((a, b) => b.score - a.score);
  let ship = player.currentShip;
  let socket = window.world.system.socket;
  const loadouts = player.loadouts;
  const planet = window.world.displayData?.player?.selectedPlanet;
  const isOnMainPlanet = (planet.imageFile === PLANET_GREEN_FILE);

  function repairShip() {
    socket.emit("repair-ship");
  }

  function saveLoadout() {
    socket.emit("save-loadout", {name: loadoutName});
    setLoadoutName('');
  }

  function equipLoadout(name) {
    socket.emit("equip-loadout", {name: name});
  }

  return (
    <div className='planet-info'>
      {!isOnMainPlanet &&
        <div style={{display: ship.alive ? 'block' : 'none'}}>
          <div className='section'><b>Ship</b> ({Math.round(ship.armor) + ' / ' + ship.armorMax})</div>
          <div className='section'>
            <button onClick={() => repairShip()} disabled={ship.armorMax <= ship.armor}>
              Repair
            </button>
          </div>
        </div>
      }

      {!isOnMainPlanet &&
        <div className='section'>
          <div className='loadout-title'>Loadouts</div>
          {loadouts.map((loadout, index) => {
            return <div key={'loadout-'+index} className='loadout-item'>
              <button className='loadout-button' onClick={() => equipLoadout(loadout.name)}> Equip</button>
              {loadout.name}
            </div>
          })}
          <div className='section'>
            <input type='text'
                   defaultValue={loadoutName}
                   onChange={(event) => setLoadoutName(event.target.value)}
                   onFocus={() => window.world.system.isTyping = true}
                   onBlur={() => window.world.system.isTyping = false}/>
            <button onClick={() => saveLoadout()}>
              Save Loadout
            </button>
          </div>
        </div>
      }

      <div className='section'>
        <Scoreboard highScoreOnly='false'/>
      </div>

    </div>);
}

