import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Use import for GoogleGenerativeAI

// Load environment variables from .env file
config();

const app = express();
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all origins

// Create a GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/generate', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    // Generate content using the model
    const result = await model.generateContent(message);
    const text = result.response.text();

    // Send response back to client
    res.json({ response: text });
  } catch (error) {
    console.error('Error generating response:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
