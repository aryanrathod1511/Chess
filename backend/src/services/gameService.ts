import { Chess } from "chess.js";
import { WebSocket } from "ws";

const chess = new Chess();

type ChessGame = typeof chess;

interface Move {
  playerId: string;
  move: string;
}

interface Game {
  game: ChessGame;
  players: { white: string; black: string };
  sockets: { white: WebSocket; black: WebSocket };
  turn: string;
  moves: Move[];
}

export class GameService {
  private static games = new Map<string, Game>();
  private static waitingUser: { id: string; socket: WebSocket } | null = null;

  static findOrCreateGame(playerId: string, socket: WebSocket) {
    if (this.waitingUser) {
      const gameId = `${Date.now()}-${this.waitingUser.id}-${playerId}`;
      this.games.set(gameId, {
        game: new Chess(),
        players: { white: this.waitingUser.id, black: playerId },
        sockets: { white: this.waitingUser.socket, black: socket },
        turn: this.waitingUser.id,
        moves: [],
      });

      const opponent = this.waitingUser.id;
      this.waitingUser = null;

      return { gameId, opponent, color: "black" };
    } else {
      this.waitingUser = { id: playerId, socket };
      return { gameId: null, opponent: null, color: "white" };
    }
  }

  static makeMove(gameId: string, playerId: string, move: string) {
    const gameData = this.games.get(gameId);
    if (!gameData) return { success: false, error: "Game not found" };
  
    const { game, players, sockets, turn, moves } = gameData;
  
    if (turn !== playerId) return { success: false, error: "Not your turn!" };
  
    const moveResult = game.move(move);
    if (!moveResult) return { success: false, error: "Invalid move!" };
  
    moves.push({ playerId, move });
  
    let winner: string | null = null;
    let isDraw = false;
    let drawReason: string | null = null;
  
    if (game.isGameOver()) {
      if (game.isCheckmate()) winner = playerId;
      else if (game.isDraw()) {
        isDraw = true;
        if (game.isStalemate()) drawReason = "stalemate";
        else if (game.isInsufficientMaterial()) drawReason = "Insufficient material";
        else if (game.isThreefoldRepetition()) drawReason = "Threefold repetition";
        else if (game.isDrawByFiftyMoves()) drawReason = "50 moves rule";
        else drawReason = "Game draw";
      }
    }
    const isCheck = game.isCheck();
  
    gameData.turn = game.turn() === "w" ? players.white : players.black;
  
    // Prepare the game update as an object
    const gameUpdate = {
      success: true,
      error: "",
      gameId,
      fen: game.fen(),
      moves,
      winner,
      isDraw,
      drawReason,
      isCheck,
    };
  
    sockets.white.send(JSON.stringify(gameUpdate));
    sockets.black.send(JSON.stringify(gameUpdate));
  
    return gameUpdate;
  }
  

  static handleQuit(gameId: string, playerId: string) {
    const gameData = this.games.get(gameId);
    if (!gameData) return;

    const { players, sockets } = gameData;
    const opponentId = players.white === playerId ? players.black : players.white;
    const opponentSocket = players.white === playerId ? sockets.black : sockets.white;

    // Declare opponent as winner
    const gameUpdate = JSON.stringify({
        type: "game_over",
        gameId,
        winner: opponentId,
        reason: "Opponent quit",
    });

    if (opponentSocket.readyState === WebSocket.OPEN) {
        opponentSocket.send(gameUpdate);
    }

    // Remove game from active games
    this.games.delete(gameId);
}

}
