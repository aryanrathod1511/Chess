import { Router } from "express";
import { gameController } from "../controllers/gameController";

const router = Router();

router.post("/create", gameController.createGame);
router.post("/move", gameController.makeMove);

export default router;
