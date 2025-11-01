import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // We'll create this file next for styling

// The URL of our Flask backend
const API_URL = 'https://docu-filler-app.onrender.com';

function App() {
  // --- State Management ---
  
  // 'upload', 'fill', 'download'
  const [appState, setAppState] = useState('upload'); 
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  
  // List of questions from the backend
  const [placeholders, setPlaceholders] = useState([]); 
  
  // Which question we are currently on (index)
  const [currentQuestion, setCurrentQuestion] = useState(0); 
  
  // The user's answer for the *current* input box
  const [currentAnswer, setCurrentAnswer] = useState(""); 
  
  // The final download link
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  // --- Handlers ---

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a .docx template file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Send the file to the /upload endpoint
      const response = await axios.post(`${API_URL}/upload`, formData);
      
      // 2. Save the questions and fileId from the response
      setPlaceholders(response.data.placeholders);
      setFileId(response.data.fileId);
      
      // 3. Move to the 'fill' state
      setAppState('fill');
      setCurrentQuestion(0); // Start at the first question
      setError('');

    } catch (err) {
      setError('Upload failed. Please check the server or file.');
      console.error(err);
    }
  };

  const handleNextQuestion = async (e) => {
    e.preventDefault(); // Stop form from refreshing page
    
    // 1. Save the current answer
    const key = placeholders[currentQuestion].key;
    const updatedPlaceholders = [...placeholders];
    updatedPlaceholders[currentQuestion].value = currentAnswer;
    setPlaceholders(updatedPlaceholders);

    // 2. Check if this is the last question
    if (currentQuestion < placeholders.length - 1) {
      // Not the last question: Move to the next one
      setCurrentQuestion(currentQuestion + 1);
      // Set input to next question's value (if user goes back)
      setCurrentAnswer(updatedPlaceholders[currentQuestion + 1].value || '');
    } else {
      // Last question: Time to generate the document
      
      // Create the answers object: {'KEY1': 'Value1', 'KEY2': 'Value2'}
      const answers = updatedPlaceholders.reduce((acc, p) => {
        acc[p.key] = p.value;
        return acc;
      }, {});

      try {
        // 3. Send fileId and answers to the /generate endpoint
        const response = await axios.post(`${API_URL}/generate`, { fileId, answers });
        
        // 4. Save the download link and move to the 'download' state
        setDownloadUrl(response.data.downloadUrl);
        setAppState('download');
        setError('');
      } catch (err) {
        setError('Document generation failed.');
        console.error(err);
      }
    }
  };

  // --- Render Functions for Each Step ---

  const renderUploadStep = () => (
    <div className="card">
      <h2>1. Upload Your .docx Template</h2>
      <p>Please upload a .docx file that uses {"`{{ placeholder }}`"} tags.</p>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Start</button>
    </div>
  );

  const renderFillStep = () => {
    // Get the current question object
    const question = placeholders[currentQuestion];
    return (
      <div className="card">
        <h2>2. Fill Your Document</h2>
        <p>Question {currentQuestion + 1} of {placeholders.length}</p>
        
        <form onSubmit={handleNextQuestion}>
          <label>{question.prompt}</label>
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            autoFocus
          />
          <button type="submit">
            {currentQuestion < placeholders.length - 1 ? 'Next' : 'Generate Document'}
          </button>
        </form>
      </div>
    );
  };

  const renderDownloadStep = () => (
    <div className="card">
      <h2>3. Download Your Document</h2>
      <p>Your document has been generated successfully.</p>
      <a href={downloadUrl} className="download-button" download>
        Download Completed Document
      </a>
    </div>
  );

  return (
    <div className="App">
      <header>
        <h1>Document Filler</h1>
      </header>
      <main>
        {error && <div className="error">{error}</div>}
        
        {appState === 'upload' && renderUploadStep()}
        {appState === 'fill' && placeholders.length > 0 && renderFillStep()}
        {appState === 'download' && renderDownloadStep()}
      </main>
    </div>
  );
}

export default App;