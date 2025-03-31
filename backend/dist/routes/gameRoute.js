"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = require("../controllers/gameController");
const router = (0, express_1.Router)();
router.post("/create", gameController_1.gameController.createGame);
router.post("/move", gameController_1.gameController.makeMove);
exports.default = router;
