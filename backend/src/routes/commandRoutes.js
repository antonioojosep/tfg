import express from "express";
import { createCommand } from "../controllers/commandController.js";

const router = express.Router();

router.post("/", createCommand);

router.get("/", (req, res) => {
  res.send("Command route");
});

export default router;