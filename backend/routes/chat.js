const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if API key is configured
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not configured in environment variables');
}

// Initialize Gemini API with the correct API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    console.log('Processing chat request:', { message });

    try {
      // Get the generative model with the correct model name
      const model = genAI.getGenerativeModel({
         model: "gemini-1.5-flash" 
        });

      

      // Prepare the prompt
      const prompt = {
        contents: [{
          parts: [{ text: `As an AI study assistant, help with this question: ${message}` }]
        }]
      };

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from the model');
      }

      console.log('Generated response successfully');
      res.json({ response: text });
    } catch (modelError) {
      console.error('Model Error:', modelError);
      res.status(500).json({ 
        error: 'Error generating response',
        details: modelError.message 
      });
    }
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message
    });
  }
});

module.exports = router; 