// File: src/App.jsx
import React from 'react';
import ResumeForm from './components/ResumeForm';
import Preview from './components/Preview';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Smart Resume Builder</h1>
      <ResumeForm />
      <Preview />
    </div>
  );
}

export default App;

// File: src/components/ResumeForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function ResumeForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    education: '',
    experience: '',
    skills: ''
  });
  const [suggestion, setSuggestion] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSuggestions = async () => {
    const response = await axios.post('http://localhost:5000/suggest', formData);
    setSuggestion(response.data.suggestion);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6">
      {['name', 'email', 'education', 'experience', 'skills'].map(field => (
        <div key={field} className="mb-4">
          <label className="block font-semibold mb-1 capitalize">{field}</label>
          <textarea
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      ))}
      <button onClick={getSuggestions} className="bg-blue-500 text-white px-4 py-2 rounded">Get AI Suggestions</button>
      {suggestion && <p className="mt-4 text-green-700 font-medium">Suggestion: {suggestion}</p>}
    </div>
  );
}

export default ResumeForm;

// File: src/components/Preview.jsx
import React from 'react';
import { useReactToPrint } from 'react-to-print';
import ResumeContent from './ResumeContent';

function Preview() {
  const handlePrint = useReactToPrint({
    content: () => document.getElementById('resume-preview')
  });

  return (
    <div>
      <div id="resume-preview" className="bg-white p-6 rounded shadow-md">
        <ResumeContent />
      </div>
      <button onClick={handlePrint} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Export as PDF</button>
    </div>
  );
}

export default Preview;

// File: src/components/ResumeContent.jsx
import React, { useContext } from 'react';

function ResumeContent() {
  return (
    <div>
      <h2 className="text-xl font-bold">Your Resume</h2>
      {/* Display filled data here using state management or props */}
      <p className="text-gray-600">[Resume data will go here]</p>
    </div>
  );
}

export default ResumeContent;

// File: server/index.js (Node.js backend)
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.post('/suggest', async (req, res) => {
  try {
    const { name, email, education, experience, skills } = req.body;
    const prompt = `Improve this resume section:

Name: ${name}
Email: ${email}
Education: ${education}
Experience: ${experience}
Skills: ${skills}`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ suggestion: completion.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get suggestion' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));

// File: .env
OPENAI_API_KEY=your_openai_api_key_here

// Tailwind Setup (in tailwind.config.js and index.css as usual)
// Run build with: npm run dev (client) & node index.js (server)
