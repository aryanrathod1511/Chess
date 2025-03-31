"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const chess_js_1 = require("chess.js");
const ws_1 = require("ws");
const chess = new chess_js_1.Chess();
class GameService {
    // Method to set WebSocket Server
    static setWebSocketServer(wss) {
        this.wss = wss;
    }
    static findOrCreateGame(playerId) {
        if (this.waitingUser) {
            const gameId = `${Date.now()}-${this.waitingUser}-${playerId}`;
            this.games.set(gameId, {
                game: new chess_js_1.Chess(),
                players: [this.waitingUser, playerId],
                turn: this.waitingUser,
                moves: [],
            });
            const opponent = this.waitingUser;
            this.waitingUser = null;
            return { gameId, opponent, color: "black" };
        }
        else {
            this.waitingUser = playerId;
            return { gameId: null, opponent: null, color: "white" };
        }
    }
    static makeMove(gameId, playerId, move) {
        const gameData = this.games.get(gameId);
        if (!gameData) {
            return { success: false, error: "Game not found" };
        }
        const { game, players, turn, moves } = gameData;
        if (turn !== playerId) {
            return { success: false, error: "Not your turn!" };
        }
        const moveResult = game.move(move);
        if (!moveResult) {
            return { success: false, error: "Invalid move!" };
        }
        const newMove = { playerId, move };
        moves.push(newMove);
        const isOver = game.isGameOver();
        let winner = null;
        let isDraw = false;
        if (isOver) {
            if (game.isCheckmate()) {
                winner = playerId;
            }
            if (game.isDraw()) {
                isDraw = true;
            }
        }
        gameData.turn = game.turn();
        // **Broadcast updated game state to all clients**
        const gameUpdate = {
            success: true,
            error: "",
            gameId,
            fen: game.fen(),
            moves: moves,
            isOver,
            winner,
            isDraw,
        };
        if (this.wss) {
            this.wss.clients.forEach((client) => {
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(JSON.stringify(gameUpdate));
                }
            });
        }
        else {
            console.error("WebSocket server not initialized!");
        }
        return gameUpdate;
    }
}
exports.GameService = GameService;
GameService.games = new Map();
GameService.waitingUser = null;
