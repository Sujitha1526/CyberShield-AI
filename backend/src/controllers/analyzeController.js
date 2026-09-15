import Message from '../models/Message.js';
import { predictMessage } from '../services/mlClient.js';

export async function analyzeText(req, res) {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'A valid text field is required.' });
  }

  try {
    const result = await predictMessage(text);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Analyze error:', error.message);
    return res.status(502).json({ error: 'ML service unavailable. Try again shortly.' });
  }
}

export async function saveAnalysis(req, res) {
  const { text, prediction, confidence, toxicityScore = 0, abusiveWords = [] } = req.body;

  if (!text || typeof prediction === 'undefined' || typeof confidence === 'undefined') {
    return res.status(400).json({ error: 'text, prediction, and confidence are required.' });
  }

  try {
    const saved = await Message.create({
      text,
      prediction,
      confidence,
      toxicityScore,
      abusiveWords,
      // Link to the authenticated user so analytics are user-scoped
      senderId: req.user?._id || null,
    });

    return res.status(201).json(saved);
  } catch (error) {
    console.error('Save error:', error.message);
    return res.status(500).json({ error: 'Failed to store analysis.' });
  }
}

