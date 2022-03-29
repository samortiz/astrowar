import {c, game} from './';

export function enterManageState() {
  console.log("enter manage state");
}

// When managing planet resources - loop runs 60/s
export function manageLoop(delta) {
  if ((window.world.system.keys.up.isDown || window.world.system.keys.w.isDown)) {
    if (window.world.ship.alive && !window.world.system.isTyping) {
      takeOff();
    }
  }
}

export function takeOff() {
  game.changeGameState(c.GAME_STATE.FLY);
}

