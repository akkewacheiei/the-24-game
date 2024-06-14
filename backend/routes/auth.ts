import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index";
const router: Router = express.Router();

const secret = "mysecret";

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {
      username,
      password: passwordHash,
    };

    const results = await User.create(userData);

    res.json({
      message: "insert ok",
      results,
    });
  } catch (error: any) {
    console.log("error", error);
    if (error.original.code === "ER_DUP_ENTRY") {
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

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

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

router.get("/user", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken = "";
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }

    const decoded: any = jwt.verify(authToken, secret);
    const user = await User.findOne({
      where: { username: decoded.username },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw { message: "user not found" };
    }

    res.json({ user });
  } catch (error) {
    console.error("error", error);
    res.status(403).json({ message: "authentication fail", error });
  }
});

export default router;
