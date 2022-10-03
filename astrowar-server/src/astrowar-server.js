import * as c  from './s_constants.js'
import * as w from './s_world.js'
import * as run from './s_run.js'
import * as display from './s_display.js'
import * as manage from './s_manage.js'
import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import {createServer} from "http"


const app = express();
app.use(cors());
const server = createServer(app);
app.use(express.static("public"));

export const socketIo = new Server(server, {
  cors: {
    origin: "*",  // Once a host is picked, this could be narrowed down
    methods: ["GET", "POST"]
  }
});
export const playerSockets = {}; // socketId: socket
export const playerKeys = {};  // playerId: {keyCode: isDown }

socketIo.on("connection", (socket) => {
  console.log("Made socket connection", socket.id);

  // A new player connects to the server (establish socket connection)
  socket.on("connect-to-server", () => {
    console.log('A user connected');
  });

  // Player is joining the game
  socket.on("join", (name) => {
    socket.emit("joined", display.getJoinData(socket, name));
  });

  socket.on("new-ship", () => {
    const player = w.getPlayer(socket.id);
    w.setupNewShipForPlayer(player);
    console.log('Created new ship for player', player);
  });

  socket.on("info", () => {
    console.log('\n\n');
    console.log('players', w.world.players);
    console.log('ships', w.world.ships);
    console.log('bullets', w.world.bullets);
    //console.log('explosions', w.world.explosions);
    //console.log('planets', w.world.planets);
  });

  socket.on("keypress", (keyData) => {
    const player = w.getPlayer(socket.id);
    if (!player) {
      console.log("Cannot press keys without player");
      return;
    }

    if (!player) {
      return;
    }
    let keysForThisPlayer = playerKeys[player.id];
    if (!keysForThisPlayer) {
      keysForThisPlayer = {};
      playerKeys[player.id] = keysForThisPlayer;
    }
    keysForThisPlayer[keyData.key] = keyData.isDown;
    console.log('received key ', keyData);
  });

  // Management commands
  socket.on("load-ship", () => {
    console.log("loading ship");
    const player = w.getPlayer(socket.id);
    if (!player) {
      console.log("Cannot manage without player");
      return;
    }
    if (player.currentShip && player.selectedPlanet) {
      const ship = player.currentShip;
      const planet = player.selectedPlanet;
      manage.loadShip(ship, planet);
    }
  });

  socket.on("unload-ship", () => {
    console.log("unloading ship");
    const player = w.getPlayer(socket.id);
    if (!player) {
      console.log("Cannot manage without player");
      return;
    }
    if (player.currentShip && player.selectedPlanet) {
      const ship = player.currentShip;
      const planet = player.selectedPlanet;
      manage.unloadShip(ship, planet);
    }
  });

  socket.on("repair-ship", () => {
    const player = w.getPlayer(socket.id);
    if (!player) {
      console.log("Cannot manage without player");
      return;
    }
    if (player.currentShip && player.selectedPlanet) {
      const ship = player.currentShip;
      const planet = player.selectedPlanet;
      manage.repairShip(ship, planet)
    }
  });

  socket.on("transfer-resource", (transferData) => {
    console.log("transfer ", transferData);
    const player = w.getPlayer(socket.id);
    if (!player) {
      console.log("Cannot manage without player");
      return;
    }
    if (player.currentShip && player.selectedPlanet) {
      const ship = player.currentShip;
      const planet = player.selectedPlanet;
      const sourceId = transferData.sourceId;
      const targetId = transferData.targetId;
      // Source and target must be the player's current ship and planet
      let source = sourceId === ship.id ? ship : (sourceId === planet.id ? planet : null);
      let target = targetId === ship.id ? ship : (targetId === planet.id ? planet : null);
      if (source && target) {
        manage.transferResource(source.resources, target.resources, transferData.resourceType, transferData.amt);
      } else {
        console.log("Player tried to transfer resources to/from not his current ship and planet. source=", source, " target=",target);
      }
    }
  });

  socket.on("build", (blueprint) => {
    const player = w.getPlayer(socket.id);
    if (!player) {
      console.log("Cannot build without player");
      return;
    }
    if (player.currentShip && player.selectedPlanet) {
      const planet = player.selectedPlanet;
      manage.build(blueprint, planet, player)
    }
  });

  socket.on("use-ship", (ship) => {
    const player = w.getPlayer(socket.id);
    if (!player) {
      console.log("Cannot use ship without player");
      return;
    }
    if (player.currentShip && player.selectedPlanet) {
      const planet = player.selectedPlanet;
      const newShip = w.world.ships.find(s => s.id === ship.id);
      w.startUsingShip(player, newShip, planet);
    }
  });

  socket.on("move-equip", (params) => {
    const player = w.getPlayer(socket.id);
    if (!player) {
      console.log("Cannot use ship without player");
      return;
    }
    const source = params.source;
    const target = params.target;
    const equip = params.equip;
    manage.moveEquip(source, target, equip, player);
  });


  socket.on("select-secondary", (params) => {
    const player = w.getPlayer(socket.id);
    if (!player) {
      console.log("Cannot select secondary without player");
      return;
    }
    const selectedSecondaryWeaponIndex = params.selectedSecondaryWeaponIndex;
    manage.selectSecondaryWeaponIndex(player.currentShip, selectedSecondaryWeaponIndex);
  });



});


// Main server-side loop
setInterval(function() {
  run.mainServerLoop();
}, c.SERVER_TICK_MS);

server.listen(c.PORT, () => console.log(`AstroWar server running on port ${c.PORT}`));
