import { evaluate } from 'mathjs';

// ฟังก์ชันสำหรับการสุ่มเลข 4 ตัว
export const generateRandomNumbers = (): number[] => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10) + 1); // สุ่มเลขระหว่าง 1 ถึง 10
};

// ฟังก์ชันสำหรับการสร้าง permutations
export const permute = (array: number[]): number[][] => {
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

// ฟังก์ชันสำหรับสร้าง expressions จากชุดตัวเลขและ operators
export const generateExpressions = (nums: number[], operators: string[]): string[] => {
  return [
    `${nums[0]}${operators[0]}${nums[1]}${operators[1]}${nums[2]}${operators[2]}${nums[3]}`,
    `(${nums[0]}${operators[0]}${nums[1]})${operators[1]}${nums[2]}${operators[2]}${nums[3]}`,
    `${nums[0]}${operators[0]}(${nums[1]}${operators[1]}${nums[2]})${operators[2]}${nums[3]}`,
    `${nums[0]}${operators[0]}${nums[1]}${operators[1]}(${nums[2]}${operators[2]}${nums[3]})`,
    `(${nums[0]}${operators[0]}${nums[1]})${operators[1]}(${nums[2]}${operators[2]}${nums[3]})`,
    `(${nums[0]}${operators[0]}(${nums[1]}${operators[1]}${nums[2]}))${operators[2]}${nums[3]}`,
    `(${nums[0]}${operators[0]}${nums[1]}${operators[1]}${nums[2]})${operators[2]}${nums[3]}`,
  ];
};

// ฟังก์ชันสำหรับตรวจสอบว่าชุดเลขสามารถรวมกันได้ 24 หรือไม่
export const canForm24 = (numbers: number[]): boolean => {
  const operators = ["+", "-", "*", "/"];
  const permutations = permute(numbers);

  for (const nums of permutations) {
    for (const op1 of operators) {
      for (const op2 of operators) {
        for (const op3 of operators) {
          const expressions = generateExpressions(nums, [op1, op2, op3]);
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

// ฟังก์ชันสำหรับหารูปแบบ solutions ทั้งหมด ที่เป็นไปได้ในการรวมเป็น 24
export const allValidExpressions = (numbers: number[]): string[] => {
  const operators = ["+", "-", "*", "/"];
  const permutations = permute(numbers);
  const validExpressions: string[] = [];

  for (const nums of permutations) {
    for (const op1 of operators) {
      for (const op2 of operators) {
        for (const op3 of operators) {
          const expressions = generateExpressions(nums, [op1, op2, op3]);
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
  return validExpressions;
};
