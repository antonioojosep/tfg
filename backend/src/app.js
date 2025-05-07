import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:5173","http://frontend:5173", "http://172.20.0.5:5173"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


// Routes
app.use("/api", routes);


export default app;