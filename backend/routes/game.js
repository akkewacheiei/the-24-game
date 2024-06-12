const express = require('express');
const router = express.Router();

router.get('/generate-numbers', (req, res) => {
  const generateRandomNumber = () => Math.floor(Math.random() * 10) + 1;
  const numbers = Array.from({ length: 4 }, generateRandomNumber);
  res.json({ numbers });
});

module.exports = router;
