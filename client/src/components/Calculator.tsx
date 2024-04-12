import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const Calculator: React.FC = () => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<number | undefined>(undefined);
  const [history, setHistory] = useState<{ expression: string; result: number | undefined }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [serverRunning, setServerRunning] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check server status when component mounts
    checkServerStatus();
  });

  const checkServerStatus = async () => {
    try {
      // Ping the server to check if it's running
      await axios.get('http://localhost:5000');
      setServerRunning(true);
    } catch (error) {
      setServerRunning(false);
      setShowModal(true); 
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };

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
      const response = await axios.post<{ result: number }>('http://localhost:5000/api/calculate', { expression });
      const newResult = response.data.result;

      // Update result state
      setResult(newResult);

      // Update history
      setHistory((prevHistory) => [...prevHistory, { expression, result: newResult }]);
    } catch (error) {
      console.error('Error calculating expression:', error);
    }
  };

  const handleDeleteHistoryItem = (index: number) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="calculator-container">
      {/* Check if server is not running and show modal */}
      {/* {showModal && <Modal onClose={handleCloseModal} />} */}
      <input type="text" className="input-display" value={expression} readOnly />
      <div className="button-grid">
        <div className="row">
          <button onClick={() => handleClick('1')}>1</button>
          <button onClick={() => handleClick('2')}>2</button>
          <button onClick={() => handleClick('3')}>3</button>
          <button onClick={() => handleClick('+')}>+</button>
        </div>
        <div className="row">
          <button onClick={() => handleClick('4')}>4</button>
          <button onClick={() => handleClick('5')}>5</button>
          <button onClick={() => handleClick('6')}>6</button>
          <button onClick={() => handleClick('-')}>-</button>
        </div>
        <div className="row">
          <button onClick={() => handleClick('7')}>7</button>
          <button onClick={() => handleClick('8')}>8</button>
          <button onClick={() => handleClick('9')}>9</button>
          <button onClick={() => handleClick('*')}>*</button>
        </div>
        <div className="row">
          <div className="numeric-buttons">
            <button onClick={() => handleClick('0')}>0</button>
            <button onClick={handleCalculate} className="equal">=</button>
            <button onClick={() => setExpression('')} className="clear">C</button>
            <button onClick={() => handleClick('/')}>/</button>
          </div>
        </div>
      </div>
      <div className="result-display">
        <p className="result-text">Result: {result !== undefined ? result : 'No result'}</p>
      </div>
      <div className="history-icon" onClick={() => setShowHistory(!showHistory)}>
        🕒
      </div>
      {showHistory && (
        <div className="history-modal">
          <h2 className="history-title">History</h2>
          {history.length === 0 ? (
            <p className="history-text">No history.</p>
          ) : (
            <>
              <ul className="history-list">
                {history.map((item, index) => (
                  <li key={index} className="history-item">
                    <span>{item.expression} = {item.result}</span>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteHistoryItem(index)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="clear-history-btn"
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            </>
          )}
          <button className="close-btn" onClick={() => setShowHistory(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Calculator;
