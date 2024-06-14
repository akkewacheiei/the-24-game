import cors from "cors";
import express from "express";
import { sequelize } from "./config/db";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

const port = 8000;

// Use routes
app.use(authRoutes);
app.use(gameRoutes);

// Listen
app.listen(port, async () => {
  //await sequelize.sync({ force: true });
  await sequelize.sync();
  console.log("Server started at port 8000");
});
