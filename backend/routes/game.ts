import express, { Router, Request, Response } from "express";
import { evaluate } from "mathjs";
import { History } from "../models/index";
import { 
  generateRandomNumbers, 
  canForm24, 
  allValidExpressions 
} from '../utils/mathUtils';

const router: Router = express.Router();

router.get("/generate-numbers", (req: Request, res: Response) => {
  let numbers: number[] = generateRandomNumbers();
  // วนลูป generate เลขไปเรื่อยๆ จนกว่าจะได้ชุดที่สามารถดำเนินการเป็น 24 ได้
  while (!canForm24(numbers)) {
    numbers = generateRandomNumbers();
  }

  res.json({ numbers });
});

router.post("/submit-solution", async (req: Request, res: Response) => {
  const { userId, numbers, solution } = req.body;

  // ตรวจสอบว่าคำตอบที่ผู้ใช้ส่งมาถูกต้องหรือไม่
  let isCorrect: boolean = false;
  try {
    if (evaluate(solution) === 24) {
      isCorrect = true;
    }
  } catch (e) {
    isCorrect = false;
  }

  if (isCorrect) {
    const historyCreated = {
      numbers: JSON.stringify(numbers),
      solution,
      isCorrect,
      userId,
    };

    await History.create(historyCreated);
  }

  res.json({ isCorrect });
});

router.get("/history", async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string, 10); // แปลง userId ให้เป็น number

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const histories = await History.findAll({ where: { userId } });
    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching history" });
  }
});

router.post("/cheat", (req: Request, res: Response) => {
  const { numbers } = req.body;

  if (!numbers || !Array.isArray(numbers) || numbers.length !== 4) {
    return res
      .status(400)
      .json({ error: "Invalid input. Please provide an array of 4 numbers." });
  }

  const validExpressions: string[] = allValidExpressions(numbers);

  return res.json({ validExpressions });
});

export default router;
