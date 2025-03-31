import { Chess } from "chess.js";
import { WebSocket, Server } from "ws";

const chess = new Chess();

type ChessGame = typeof chess;

interface Move {
  playerId: string;
  move: string;
}

interface Game {
  game: ChessGame;
  players: string[];
  turn: string;
  moves: Move[];
}

export class GameService {
  private static games = new Map<string, Game>();
  private static waitingUser: string | null = null;
  private static wss: Server;  // Store WebSocket server instance

  // Method to set WebSocket Server
  static setWebSocketServer(wss: Server) {
    this.wss = wss;
  }

  static findOrCreateGame(playerId: string) {
    if (this.waitingUser) {
      const gameId = `${Date.now()}-${this.waitingUser}-${playerId}`;
      this.games.set(gameId, {
        game: new Chess(),
        players: [this.waitingUser, playerId],
        turn: this.waitingUser,
        moves: [],
      });

      const opponent = this.waitingUser;
      this.waitingUser = null;

      return { gameId, opponent, color: "black" };
    } else {
      this.waitingUser = playerId;
      return { gameId: null, opponent: null, color: "white" };
    }
  }

  static makeMove(gameId: string, playerId: string, move: string) {
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

    const newMove: Move = { playerId, move };
    moves.push(newMove);

    let winner: string | null = null;
    let isDraw = false;
    let drawReason:string | null = null;

    if(game.isGameOver()){
        if(game.isCheckmate()){
            winner = playerId;
        }else if(game.isDraw()){
            isDraw = true;

            if(game.isStalemate()){
                drawReason = "stalemate";
            }else if(game.isInsufficientMaterial()){
                drawReason = "Insufficient material";
            }else if(game.isThreefoldRepetition()){
                drawReason = "Threefold repetition";
            }else if(game.isDrawByFiftyMoves()){
                drawReason = "50 moves rule";
            }else {
                drawReason = "Game draw";
            }
        }
    }

    gameData.turn = game.turn();

    // **Broadcast updated game state to all clients**
    const gameUpdate = {
      success: true,
      error : "",
      gameId,
      fen: game.fen(),
      moves: moves,
      winner,
      isDraw,
      drawReason,
    };

    if (this.wss) {
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(gameUpdate));
        }
      });
    } else {
      console.error("WebSocket server not initialized!");
    }

    return gameUpdate;
  }
}
