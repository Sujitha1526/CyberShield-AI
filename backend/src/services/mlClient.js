import axios from 'axios';

const mlApi = axios.create({
  baseURL: process.env.ML_API_URL || 'http://localhost:8000',
  timeout: 10000,
});

export async function predictMessage(text) {
  const { data } = await mlApi.post('/predict', { text });
  return {
    prediction: Number(data.prediction || 0),
    confidence: Number(data.confidence || 0),
    toxicityScore: Number(data.toxicity_score || data.toxicityScore || 0),
    abusiveWords: Array.isArray(data.abusive_words || data.abusiveWords)
      ? (data.abusive_words || data.abusiveWords)
      : [],
  };
}
