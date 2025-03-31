"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameController = exports.GameController = void 0;
const gameService_1 = require("../services/gameService");
class GameController {
    createGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { playerId } = req.body;
                if (!playerId) {
                    res.status(400).json({ error: "Player ID is required" });
                    return;
                }
                const gameData = gameService_1.GameService.findOrCreateGame(playerId);
                res.status(200).json(gameData);
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    makeMove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gameId, playerId, move } = req.body;
                if (!gameId || !playerId || !move) {
                    res.status(400).json({ error: "Missing required fields" });
                    return;
                }
                const moveResult = gameService_1.GameService.makeMove(gameId, playerId, move);
                if (!moveResult.success) {
                    res.status(400).json({ error: moveResult.error });
                    return;
                }
                res.status(200).json(moveResult);
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.GameController = GameController;
exports.gameController = new GameController();
