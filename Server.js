// server.js const express = require("express"); const http = require("http"); const socketIO = require("socket.io");

const app = express(); const server = http.createServer(app); const io = socketIO(server);

app.use(express.static("public"));

let scores = { TeamA: 0, TeamB: 0, TeamC: 0, };

let buzzQueue = [];

io.on("connection", (socket) => { console.log("New connection");

socket.on("buzz", (team) => { if (!buzzQueue.includes(team)) { buzzQueue.push(team); io.emit("buzzQueue", buzzQueue); } });

socket.on("markAnswer", ({ team, correct }) => { if (correct) scores[team] += 1; else scores[team] -= 1;

buzzQueue = [];
io.emit("scores", scores);
io.emit("buzzQueue", buzzQueue);

});

socket.on("reset", () => { buzzQueue = []; io.emit("buzzQueue", buzzQueue); }); });

server.listen(3000, () => { console.log("Server listening on http://localhost:3000"); });
