const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Allow Next.js dev server (port 3000)
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  })
);

app.use(express.json());

// Health route
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Server alive',
    time: new Date().toISOString(),
  });
});

// Prompt route
app.post('/api/prompt', (req, res) => {
  const { prompt } = req.body ?? {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Prompt must be a non-empty string.',
    });
  }

  const score = Math.floor(Math.random() * 100);
  const reply = `Demo backend response to: "${prompt}"`;

  console.log('Prompt received:', prompt);

  return res.json({
    success: true,
    data: {
      prompt,
      reply,
      score,
      explanation: 'Mock model output. Replace with real logic.',
      timestamp: new Date().toISOString(),
    },
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
