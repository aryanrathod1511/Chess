import { Server } from "ws";
import { GameService } from "../services/gameService";

interface MoveMessage {
  gameId: string;
  playerId: string;
  move: string;
}

export function setupWebSocket(server: any) {
  const wss = new Server({ server });

  // Store WebSocket instance in GameService
  GameService.setWebSocketServer(wss);

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    ws.on("message", (message: string) => {
      try {
        const data: MoveMessage = JSON.parse(message);
        GameService.makeMove(data.gameId, data.playerId, data.move);
      } catch (error) {
        console.error("Invalid message format", error);
        ws.send(JSON.stringify({ error: "Invalid message format" }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });
}
