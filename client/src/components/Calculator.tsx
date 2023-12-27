import React, { useState } from 'react';
import axios from 'axios';

const Calculator: React.FC = () => {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<number | undefined>(undefined);
  const [history, setHistory] = useState<{ expression: string; result: number | undefined }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleClick = (value: string) => {
    setExpression((prevExpression) => prevExpression + value);
  };

  const handleCalculate = async () => {
    try {
      if (!expression.trim()) {
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
    <div className="calculator-container bg-gray-800 text-white p-4 rounded-md shadow-md">
      <input type="text" className="input-display bg-gray-700 text-white p-2 rounded-md mb-2" value={expression} readOnly />
      <div className="button-grid grid grid-cols-4 gap-4">
        <div className="row flex justify-between">
          <button onClick={() => handleClick('1')} className="btn">1</button>
          <button onClick={() => handleClick('2')} className="btn">2</button>
          <button onClick={() => handleClick('3')} className="btn">3</button>
          <button onClick={() => handleClick('+')} className="btn bg-blue-500">+</button>
        </div>
        <div className="row flex justify-between">
          <button onClick={() => handleClick('4')} className="btn">4</button>
          <button onClick={() => handleClick('5')} className="btn">5</button>
          <button onClick={() => handleClick('6')} className="btn">6</button>
          <button onClick={() => handleClick('-')} className="btn bg-blue-500">-</button>
        </div>
        <div className="row flex justify-between">
          <button onClick={() => handleClick('7')} className="btn">7</button>
          <button onClick={() => handleClick('8')} className="btn">8</button>
          <button onClick={() => handleClick('9')} className="btn">9</button>
          <button onClick={() => handleClick('*')} className="btn bg-blue-500">*</button>
        </div>
        <div className="row flex justify-between">
          <button onClick={() => handleClick('0')} className="btn">0</button>
          <button onClick={handleCalculate} className="btn equal bg-green-500">=</button>
          <button onClick={() => setExpression('')} className="btn clear bg-red-500">C</button>
          <button onClick={() => handleClick('/')} className="btn bg-blue-500">/</button>
        </div>
      </div>
      <div className="result-display mt-4">
        <p className="text-xl">Result: {result !== undefined ? result : 'No result'}</p>
      </div>
      <div className="history-icon mt-4" onClick={() => setShowHistory(!showHistory)}>
        🕒
      </div>
      {/* History Modal */}
      {showHistory && (
        <div className="history-modal bg-gray-700 p-4 rounded-md mt-4">
          <h2 className="text-xl mb-2">History</h2>
          {history.length === 0 ? (
            <p>No history.</p>
          ) : (
            <ul>
              {history.map((item, index) => (
                <li key={index} className="mb-1">
                  {item.expression} = {item.result}
                </li>
              ))}
            </ul>
          )}
          <button className="btn bg-gray-600 mt-2" onClick={() => setShowHistory(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Calculator;
