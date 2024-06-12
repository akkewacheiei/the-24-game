const cors = require("cors");
const express = require("express");
const mysql = require("mysql2/promise");
const { Sequelize, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { log } = require("console");

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
const secret = "mysecret";

let conn = null;

// function init connection mysql
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root_password",
    database: "the_24_game",
  });
};

// use sequenlize
const sequelize = new Sequelize("the_24_game", "root", "root_password", {
  host: "localhost",
  dialect: "mysql",
});

//sequenlize ตอนสร้าง table จะมี auto เพิ่ม id, created_at, updated_at
const User = sequelize.define(
  "users",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("username:", username);
    console.log("password:", password);
    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {
      username,
      password: passwordHash,
    };
    // const [results] = await conn.query("INSERT INTO users SET ?", userData);
    const results = await User.create(userData);

    res.json({
      message: "insert ok",
      results,
    });
  } catch (error) {
    console.log("error", error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({
        message: "Username already exists",
      });
    } else {
      res.status(500).json({
        message: "insert error",
        error,
      });
    }
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [result] = await conn.query(
    "SELECT * from users WHERE username = ?",
    username
  );
  const user = result[0];
  if (!user) {
    return res.status(400).send({ message: "Invalid username or password" });
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).send({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, secret, { expiresIn: "7d" });

  res.send({ message: "Login successful", token });
});

app.get("/user", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }

    const user = jwt.verify(authToken, secret); 

    const [checkResults] = await conn.query(
      "SELECT * from users where username = ?",
      user.username
    );
  
    if (!checkResults[0]) {
      throw { message: "user not found" };
    }

    const results = checkResults.map((user) => user);

    // สร้าง object ใหม่โดยลบฟิลด์ password ออก
    const modifiedResponse = {
      user: results.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
    };

    res.json({ user: modifiedResponse.user[0] });
  } catch (error) {
    console.error(error);
    res.status(403).json({
      message: "authenication fail",
      error,
    });
  }
});

// Listen
app.listen(port, async () => {
  await initMySQL();
  //await sequelize.sync({ force: true });
  await sequelize.sync();

  console.log("Server started at port 8000");
});
