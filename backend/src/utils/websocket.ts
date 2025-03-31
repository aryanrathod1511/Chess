import { Server, WebSocket } from "ws";
import { GameService } from "../services/gameService";

interface Message {
  type: "connect" | "move" | "quit";
  playerId: string;
  gameId?: string;
  move?: string;
}

export function setupWebSocket(server: any) {
  const wss = new Server({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    let playerId: string | null = null;
    let gameId: string | null = null;

    ws.on("message", (message: string) => {
      try {
        const data: Message = JSON.parse(message);

        if (data.type === "connect") {
          const result = GameService.findOrCreateGame(data.playerId, ws);
          playerId = data.playerId;
          gameId = result.gameId;

          if (result.gameId) {
            ws.send(
              JSON.stringify({
                type: "game_start",
                gameId: result.gameId,
                opponent: result.opponent,
                color: result.color,
              })
            );
          } else {
            ws.send(
              JSON.stringify({
                type: "waiting",
                message: "Waiting for an opponent...",
              })
            );
          }
        } else if (data.type === "move" && data.gameId && data.move) {
          const response = GameService.makeMove(data.gameId, data.playerId, data.move);

            if(!response.success){
              ws.send(
                JSON.stringify({
                  type: "error",
                  error: response.error,
                })
              );
            }
        } else if (data.type === "quit" && data.gameId) {
          GameService.handleQuit(data.gameId, data.playerId);
          ws.send(
            JSON.stringify({
              type: "quit",
              message: "You have quit the game.",
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              type: "error",
              error: "Invalid message type",
            })
          );
        }
      } catch (error) {
        console.error("Invalid message format", error);
        ws.send(
          JSON.stringify({
            type: "error",
            error: "Invalid message format",
          })
        );
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      if (playerId && gameId) {
        GameService.handleQuit(gameId, playerId);
      }
    });
  });

  console.log("WebSocket server setup complete.");
}
