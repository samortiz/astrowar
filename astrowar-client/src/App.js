import React from 'react';
import './App.css';
import {InfoPanel} from './InfoPanel';
import {c, fly, game, utils} from './functions';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    window.world = game.createEmptyWorld();
    this.pixiRef = React.createRef();
  }

  componentDidMount() {
    this.createPixiApp();
  }

  render() {
    return (
      <table className='root-app' width='100%'>
        <tbody>
        <tr>
          <td>
            <div className='viewport' ref={this.pixiRef}/>
          </td>
          <td className='info-panel' width='100%' height={(window.world.system.screenHeight || c.SCREEN_HEIGHT) + 'px'}>
            <div className='scroll-box'>
              <InfoPanel/>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }

  createPixiApp = () => {
    let app = new window.PIXI.Application({width: c.SCREEN_WIDTH, height: c.SCREEN_HEIGHT});
    app.renderer.backgroundColor = c.BLACK;
    this.pixiRef.current.appendChild(app.view);
    window.PIXI.loader
      .add(c.SPRITESHEET_JSON)
      .add(c.CRASH_JSON)
      .add(c.SMOKE_JSON)
      .add(c.STAR_BACKGROUND_FILE)
      .load(this.setupGame);
    window.world.system.app = app;
  }

  // Setup the App
  setupGame = () => {
    game.setupWorld(); // includes setting up the socket connection
    this.setupKeyboardListeners(window.world.system.socket);
    this.setupWindowResizeListener();
    window.world.system.gameLoop = fly.flyLoop;
    window.world.system.app.renderer.plugins.interaction.on('pointerdown', (event) => {
      game.click(event);
    });
    // After a player has joined
    window.world.system.socket.on("joined", (joinData) => {
      window.world.planets = joinData.planets;
      window.world.blueprints = joinData.blueprints;
    });
    // Screen updates
    window.world.system.socket.on("update", newDisplayData => {
      window.world.displayData = newDisplayData;
    });
    window.world.system.app.ticker.add(delta => this.mainLoop(delta));
  }

  // Main loop runs 60 times per sec
  mainLoop = (delta) => {
    if (window.world.system.gameLoop) {
      window.world.gameTickCount += 1;
      window.world.system.gameLoop(delta);
    }
    // Force redraw all the react HTML (doesn't need to be updated 60 times / sec)
    if (window.world.gameTickCount % 15 === 0) {
      this.forceUpdate();
    }
  }

  setupKeyboardListeners = (socket) => {
    if (!socket) {
      console.warn('unable to setup keyboard listeners until the socket has been created');
    }
    const keys = window.world.system.keys;
    keys.left = utils.keyboardListener("ArrowLeft", socket);
    keys.right = utils.keyboardListener("ArrowRight", socket);
    keys.up = utils.keyboardListener("ArrowUp", socket);
    keys.down = utils.keyboardListener("ArrowDown", socket);
    keys.space = utils.keyboardListener(" ", socket);
    keys.w = utils.keyboardListener("w", socket); // up
    keys.a = utils.keyboardListener("a", socket); // left
    keys.s = utils.keyboardListener("s", socket); // down
    keys.d = utils.keyboardListener("d", socket); // right
    keys.q = utils.keyboardListener("q", socket); // thrust left
    keys.e = utils.keyboardListener("e", socket); // thrust right
    keys.x = utils.keyboardListener("x", socket); // secondary weapon
    keys.c = utils.keyboardListener("c", socket); // continuous fire
  }

  setupWindowResizeListener() {
    window.addEventListener('resize', resizeScreenToWindow);
    resizeScreenToWindow();
  }
}

function resizeScreenToWindow() {
  const app = window.world.system.app;
  let h = window.innerHeight;
  const w = window.innerWidth;
  let aspectRatio = w/h;
  // We need some space on the right for the info screens
  if (aspectRatio < 1.8) {
    h = w / 1.8;
  }
  const scale = h / 1000;
  window.world.system.app.stage.scale.set(scale);
  app.renderer.resize(h, h);
  window.world.system.screenHeight = h;
  window.world.system.screenWidth = w;
  window.world.system.screenScale = scale;

  let fontSize = '14px';
  if (w < 1300) {
    fontSize = '12px';
  } else if (w < 1000) {
    fontSize = '8px';
  }
  document.body.style.fontSize = fontSize;

}

