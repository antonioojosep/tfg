import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api", routes);


export default app;