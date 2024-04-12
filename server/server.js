const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors()); 

app.use(express.json());

app.post("/api/calculate", (req, res) => {
  const { expression } = req.body;
  const result = evaluateExpression(expression);
  res.json({ result });
  console.log(`result: ${result}`);
}); 

function evaluateExpression(expression) {
  // Implement your own logic to evaluate the expression without using eval()
  // You might want to use a library or implement parsing and calculation
  // This is just a placeholder
  return eval(expression);
}

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
