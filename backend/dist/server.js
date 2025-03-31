"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authenticationRoute_1 = __importDefault(require("./routes/authenticationRoute"));
const gameRoute_1 = __importDefault(require("./routes/gameRoute"));
const http_1 = __importDefault(require("http"));
const websocket_1 = require("./utils/websocket");
dotenv_1.default.config();
console.log(process.env.JWT_SECRET);
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
//initialize websocket server
(0, websocket_1.setupWebSocket)(server);
app.use(express_1.default.json());
app.use("/auth", authenticationRoute_1.default);
app.use("/game", gameRoute_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
