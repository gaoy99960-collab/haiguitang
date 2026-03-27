const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const AI_BASE_URL = process.env.AI_BASE_URL ?? 'https://api.deepseek.com/v1';
const AI_MODEL = process.env.AI_MODEL ?? 'deepseek-chat';
const AI_API_KEY = process.env.DEEPSEEK_API_KEY;

app.post('/api/ask', async (req, res) => {
  if (!AI_API_KEY) {
    return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY on server' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages is required' });
  }

  try {
    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        max_tokens: 10,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      const errMsg = errBody?.error?.message || `HTTP ${response.status}`;
      console.error('[server] DeepSeek API error:', errMsg);
      return res.status(response.status).json({ error: errMsg });
    }

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error('[server] Request failed:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/health', (_, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
