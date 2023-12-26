import React, { useState } from 'react';
import axios from 'axios';

const Calculator: React.FC = () => {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<number | undefined>(undefined);
  const [history, setHistory] = useState<{ expression: string; result: number | undefined }[]>([]);

  const handleClick = (value: string) => {
    setExpression((prevExpression) => prevExpression + value);
  };

  const handleCalculate = async () => {
    try {
      if (!expression.trim()){
        setResult(undefined);
        console.log('Please enter a valid expression.');
        return;
      }
      const response = await axios.post<{ result: number }>("http://localhost:5000/api/calculate", { expression });
      const newResult = response.data.result;

      // Update result state
      setResult(newResult);

      // Update history
      setHistory((prevHistory) => [...prevHistory, { expression, result: newResult }]);
    } catch (error) {
      console.error('Error calculating expression:', error);
    }
  };

  return (
    <div>
      <div>
        {/* Display the history */}
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              {item.expression} = {item.result}
            </li>
          ))}
        </ul>
      </div>
      <input type="text" value={expression} readOnly />
      <div>
        <button onClick={() => handleClick('1')}>1</button>
        <button onClick={() => handleClick('2')}>2</button>
        <button onClick={() => handleClick('3')}>3</button>
        <button onClick={() => handleClick('+')}>+</button>
      </div>
      <div>
        <button onClick={() => handleClick('4')}>4</button>
        <button onClick={() => handleClick('5')}>5</button>
        <button onClick={() => handleClick('6')}>6</button>
        <button onClick={() => handleClick('-')}>-</button>
      </div>
      <div>
        <button onClick={() => handleClick('7')}>7</button>
        <button onClick={() => handleClick('8')}>8</button>
        <button onClick={() => handleClick('9')}>9</button>
        <button onClick={() => handleClick('*')}>*</button>
      </div>
      <div>
        <button onClick={() => handleClick('0')}>0</button>
        <button onClick={handleCalculate}>=</button>
        <button onClick={() => setExpression('')}>C</button>
        <button onClick={() => handleClick('/')}>/</button>
      </div>
      <div>
        <p>Result: {result}</p>
      </div>
    </div>
  );
};

export default Calculator;
