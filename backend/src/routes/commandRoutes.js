import express from "express";
import Command from "../models/command.js";
import { createCommand } from "../controllers/commandController.js";

const router = express.Router();

router.post("/", createCommand);

// Get all commands
router.get("/", async (req, res) => {
  try {
    const commands = await Command.find()
      .populate('table')  
      .populate({
        path: 'products.product',
        model: 'Product'
      });
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching commands" });
  }
});

router.patch("/:id/complete", async (req, res) => {
  try {
    const command = await Command.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    if (!command) {
      return res.status(404).json({ message: "Command not found" });
    }
    res.status(200).json(command);
  } catch (error) {
    res.status(500).json({ message: "Error completing command" });
  }
});

// Get all commands for a specific table
router.get("/table/:id", async (req, res) => {
  try {
    const commands = await Command.find({ table: req.params.id })
      .populate('table')
      .populate({
        path: 'products.product',
        model: 'Product'
      });
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching commands for table" });
  }
}
);

export default router;