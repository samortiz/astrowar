import * as c  from './server-constants.js'
import * as world from './world.js'
import * as run from './run.js'
import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import {createServer} from "http"


const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.static("public"));

export const socketIo = new Server(server);
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
    const player = world.createPlayer(socket, name);
    console.log('player joined ', player);
    socket.emit("joined", player);
  });

  socket.on("new-ship", () => {
    const player = world.getPlayer(socket.id);
    world.setupNewShipForPlayer(player);
    console.log('Created new ship for player', player);
  });

  socket.on("keypress", (keyData) => {
    const player = world.getPlayer(socket.id);
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
});


// Main server-side loop
setInterval(function() {
  run.mainServerLoop();
}, c.SERVER_TICK_MS);

server.listen(c.PORT, () => console.log(`AstroWar server running on port ${c.PORT}`));
