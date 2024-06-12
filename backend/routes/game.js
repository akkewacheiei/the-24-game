const express = require("express");
const router = express.Router();
const evaluate = require("mathjs");

// ฟังก์ชันสำหรับการสุ่มเลข 4 ตัว
const generateRandomNumbers = () => {
  const numbers = [];
  for (let i = 0; i < 4; i++) {
    const num = Math.floor(Math.random() * 10) + 1; // เลือกเลขระหว่าง 1 ถึง 10
    numbers.push(num);
  }
  return numbers;
};

// ฟังก์ชันสำหรับตรวจสอบว่าชุดเลขสามารถรวมกันได้ 24 หรือไม่
const canForm24 = (numbers) => {
  const operators = ["+", "-", "*", "/"];

  const permute = (array) => {
    const results = [];
    const permuteArray = (arr, m = []) => {
      if (arr.length === 0) {
        results.push(m);
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permuteArray(curr.slice(), m.concat(next));
        }
      }
    };
    permuteArray(array);
    return results;
  };

  const permutations = permute(numbers);
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
              if (evaluate.evaluate(expr) === 24) {
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

router.get("/generate-numbers", (req, res) => {
  let numbers = generateRandomNumbers();
  //วนลูป generate เลขไปเรื่อยๆ จนกว่าจะได้ชุดที่สามารถดำเนินการเป็น 24 ได้
  while (!canForm24(numbers)) {
    numbers = generateRandomNumbers();
  }

  res.json({ numbers });
});

module.exports = router;
