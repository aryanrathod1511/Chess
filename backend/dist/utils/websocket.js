"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const ws_1 = require("ws");
const gameService_1 = require("../services/gameService");
function setupWebSocket(server) {
    const wss = new ws_1.Server({ server });
    // Store WebSocket instance in GameService
    gameService_1.GameService.setWebSocketServer(wss);
    wss.on("connection", (ws) => {
        console.log("New WebSocket connection established");
        ws.on("message", (message) => {
            try {
                const data = JSON.parse(message);
                gameService_1.GameService.makeMove(data.gameId, data.playerId, data.move);
            }
            catch (error) {
                console.error("Invalid message format", error);
                ws.send(JSON.stringify({ error: "Invalid message format" }));
            }
        });
        ws.on("close", () => {
            console.log("WebSocket connection closed");
        });
    });
}
