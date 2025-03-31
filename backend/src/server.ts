import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authenticationRoute';
import gameRoute from './routes/gameRoute'
import http from 'http';
import { setupWebSocket } from "./utils/websocket";



dotenv.config();
console.log(process.env.JWT_SECRET);

const app = express();
const server = http.createServer(app);

//initialize websocket server
setupWebSocket(server);



app.use(express.json());
app.use("/auth", authRoutes);

app.use("/game", gameRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
