import express, { Application } from "express";
import { userRoutes } from "./routes/user.routes";

const app: Application = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h2>Neon + Express + TypeScript API 🚀</h2>
            <p>Try: GET /users</p>`);
});

app.use("/users", userRoutes);

export default app;
