import express from "express";
import Command from "../models/command.js";
import { createCommand } from "../controllers/commandController.js";
import { getIO } from "../sockets/socket.js";

const router = express.Router();

// Helper function for command population
const populateCommand = (query) => {
  return query
    .populate('table')
    .populate({
      path: 'products.product',
      model: 'Product'
    });
};

// Create new command
router.post("/", createCommand);

// Get commands by table ID with status filter
router.get("/table/:id", async (req, res) => {
  try {
    const commands = await populateCommand(
      Command.find({ 
        table: req.params.id, 
        status: { $ne: "paid" } 
      })
    );
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching commands for table",
      error: error.message 
    });
  }
});

// Get all commands for a table (regardless of status)
router.get("/table/all/:id", async (req, res) => {
  try {
    const commands = await populateCommand(
      Command.find({ table: req.params.id })
    );
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching all commands for table",
      error: error.message 
    });
  }
});

// Get all commands
router.get("/", async (req, res) => {
  try {
    const commands = await populateCommand(Command.find());
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching all commands",
      error: error.message 
    });
  }
});

// Get pending commands by company
router.get("/company/:id", async (req, res) => {
  try {
    const commands = await populateCommand(
      Command.find({ 
        company: req.params.id, 
        status: "pending" 
      })
    );
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching commands for company",
      error: error.message 
    });
  }
});

// Update command status to completed
router.patch("/:id/complete", async (req, res) => {
  try {
    const command = await Command.findByIdAndUpdate(
      req.params.id,
      { status: "completed" })
      .populate('products.product')
      .populate('table');
    
    if (!command) {
      return res.status(404).json({ message: "Command not found" });
    }
    
    // Emitir evento websocket
    getIO().emit('command-completed', {
      type: 'command-completed',
      commandId: command._id,
      command: command
    });
    
    res.status(200).json(command);
  } catch (error) {
    console.error("Error completing command:", error);
    res.status(500).json({ 
      message: "Error completing command",
      error: error.message 
    });
  }
});

export default router;