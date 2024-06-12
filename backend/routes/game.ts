import express, { Router, Request, Response } from "express";
import { evaluate } from "mathjs";
import { History } from "../models/index";

const router: Router = express.Router();

// ฟังก์ชันสำหรับการสุ่มเลข 4 ตัว
const generateRandomNumbers = (): number[] => {
  const numbers: number[] = [];
  for (let i: number = 0; i < 4; i++) {
    const num: number = Math.floor(Math.random() * 10) + 1; // เลือกเลขระหว่าง 1 ถึง 10
    numbers.push(num);
  }
  return numbers;
};

// ฟังก์ชันสำหรับตรวจสอบว่าชุดเลขสามารถรวมกันได้ 24 หรือไม่
const canForm24 = (numbers: number[]): boolean => {
  const operators: string[] = ["+", "-", "*", "/"];

  const permute = (array: number[]): number[][] => {
    const results: number[][] = [];
    const permuteArray = (arr: number[], m: number[] = []): void => {
      if (arr.length === 0) {
        results.push(m);
      } else {
        for (let i: number = 0; i < arr.length; i++) {
          let curr: number[] = arr.slice();
          let next: number[] = curr.splice(i, 1);
          permuteArray(curr.slice(), m.concat(next));
        }
      }
    };
    permuteArray(array);
    return results;
  };

  const permutations: number[][] = permute(numbers);
  for (const nums of permutations) {
    for (const op1 of operators) {
      for (const op2 of operators) {
        for (const op3 of operators) {
          const expressions: string[] = [
            `${nums[0]}${op1}${nums[1]}${op2}${nums[2]}${op3}${nums[3]}`,
            `(${nums[0]}${op1}${nums[1]})${op2}${nums[2]}${op3}${nums[3]}`,
            `${nums[0]}${op1}(${nums[1]}${op2}${nums[2]})${op3}${nums[3]}`,
            `${nums[0]}${op1}${nums[1]}${op2}(${nums[2]}${op3}${nums[3]})`,
            `(${nums[0]}${op1}${nums[1]})${op2}(${nums[2]}${op3}${nums[3]})`,
            `(${nums[0]}${op1}(${nums[1]}${op2}${nums[2]}))${op3}${nums[3]}`,
            `(${nums[0]}${op1}${nums[1]}${op2}${nums[2]})${op3}${nums[3]}`,
          ];

          for (const expr of expressions) {
            try {
              const result = evaluate(expr);
              if (typeof result === "number" && result === 24) {
                return true;
              }
            } catch (e) {
              continue;
            }
          }
        }
      }
    }
  }
  return false;
};

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

  console.log("isCorrect:", isCorrect);

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
    const histories = await History.findAll({ where: { userId: userId } });
    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching history" });
  }
});

router.post("/cheat", (req: Request, res: Response) => {
  const { numbers } = req.body;

  if (!numbers || !Array.isArray(numbers) || numbers.length !== 4) {
    return res.status(400).json({ error: 'Invalid input. Please provide an array of 4 numbers.' });
  }

  const operators = ['+', '-', '*', '/'];
  const permutations: number[][] = permute(numbers);

  const validExpressions: string[] = [];
  for (const nums of permutations) {
    for (const op1 of operators) {
      for (const op2 of operators) {
        for (const op3 of operators) {
          const expressions = [
            `${nums[0]}${op1}${nums[1]}${op2}${nums[2]}${op3}${nums[3]}`,
            `(${nums[0]}${op1}${nums[1]})${op2}${nums[2]}${op3}${nums[3]}`,
            `${nums[0]}${op1}(${nums[1]}${op2}${nums[2]})${op3}${nums[3]}`,
            `${nums[0]}${op1}${nums[1]}${op2}(${nums[2]}${op3}${nums[3]})`,
            `(${nums[0]}${op1}${nums[1]})${op2}(${nums[2]}${op3}${nums[3]})`,
            `(${nums[0]}${op1}(${nums[1]}${op2}${nums[2]}))${op3}${nums[3]}`,
            `(${nums[0]}${op1}${nums[1]}${op2}${nums[2]})${op3}${nums[3]}`,
          ];

          for (const expr of expressions) {
            try {
              const result = evaluate(expr);
              if (typeof result === 'number' && result === 24 && !validExpressions.includes(expr)) {
                validExpressions.push(expr);
              }
            } catch (e) {
              continue;
            }
          }
        }
      }
    }
  }

  return res.json({ validExpressions });
});

// ฟังก์ชันสำหรับการสร้าง permutations
const permute = (array: number[]): number[][] => {
  const results: number[][] = [];
  const permuteArray = (arr: number[], m: number[] = []): void => {
    if (arr.length === 0) {
      results.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permuteArray(curr.slice(), m.concat(next));
      }
    }
  };
  permuteArray(array);
  return results;
};


export default router;
