import * as c  from './server-constants.js'
import * as w from './world.js'
import * as run from './run.js'
import * as display from './display.js'
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
