// src/App.js
import axios from 'axios';
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const summarizeText = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/summarize`,
        { text: inputText }
      );
      setSummary(response.data.summary);
    } catch (error) {
      setError('Error calling backend API. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const clearText = () => {
    setInputText('');
    setSummary('');
    setError('');
  };

  return (
    <div className="container">
      <h1>Text Summarizer</h1>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your text here..."
      ></textarea>
      <br />
      <div className="button-group">
		<button onClick={summarizeText} disabled={loading}>
			{loading ? 'Summarizing...' : 'Summarize'}
		</button>
		<button onClick={clearText} className="clear-btn" disabled={loading}>
			Clear
		</button>
		</div>
      {error && <div className="error">{error}</div>}
      <h2>Summary:</h2>
		<div className="summary-container">
		{loading ? (
			<div className="loading">Generating summary...</div>
		) : (
			<p>{summary}</p>
		)}
		</div>
    </div>
  );
};

export default App;
