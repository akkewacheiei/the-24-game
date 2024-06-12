const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { sequelize } = require('./config/db');

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

const port = 8000;

// Import routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

// Use routes
app.use(authRoutes);
app.use(gameRoutes);

// Listen
app.listen(port, async () => {
  await sequelize.sync();
  console.log("Server started at port 8000");
});
