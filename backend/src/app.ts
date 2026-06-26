import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './database.js';
import waitlistRouter from './routes/waitlist.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
    res.status(200).json({ message: "API is running" });
});

app.use("/api/waitlist", waitlistRouter);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error: any) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
