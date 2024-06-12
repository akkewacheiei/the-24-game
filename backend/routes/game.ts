import express, { Router, Request, Response } from "express";
import { evaluate } from "mathjs";

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
              if (typeof result === 'number' && result === 24) {
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

export default router;
