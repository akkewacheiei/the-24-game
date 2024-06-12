const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const router = express.Router();

const secret = "mysecret";

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    
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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
 /*  const [result] = await conn.query(
    "SELECT * from users WHERE username = ?",
    username
  ); */
   
  //const user = result[0];

  const user = await User.findOne({ where: { username } });

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

router.get("/user", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }

    const decoded = jwt.verify(authToken, secret);
    //ดึงข้อมูลของ user โดยนำฟิลด์ password ออก
    const user = await User.findOne({ where: { username: decoded.username }, attributes: { exclude: ['password'] } });

    if (!user) {
      throw { message: "user not found" };
    }

    res.json({ user });
  } catch (error) {
    console.error("error", error);
    res.status(403).json({ message: "authentication fail", error });
  }
});

module.exports = router;
