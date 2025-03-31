import { Request, Response } from "express";
import { GameService } from "../services/gameService";

export class GameController {
  async createGame(req: Request, res: Response): Promise<void> {
    try {
      const { playerId } = req.body;

      if (!playerId) {
        res.status(400).json({ error: "Player ID is required" });
        return;
      }

      const gameData = GameService.findOrCreateGame(playerId);
      res.status(200).json(gameData);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async makeMove(req: Request, res: Response): Promise<void> {
    try {
      const { gameId, playerId, move } = req.body;

      if (!gameId || !playerId || !move) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const moveResult = GameService.makeMove(gameId, playerId, move);

      if (!moveResult.success) {
        res.status(400).json({ error: moveResult.error });
        return;
      }

      res.status(200).json(moveResult);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export const gameController = new GameController();
