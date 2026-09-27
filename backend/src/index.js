import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scanRouter from './routes/scan.js';
import geminiRouter from './routes/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'CodeRadar',
    tagline: 'Scan your code. Spot the risks. Ship with confidence.',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY')
  });
});

// Mount routes
app.use('/api/scan', scanRouter);
app.use('/api/gemini', geminiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`[CodeRadar Backend] Server running on port ${PORT}`);
  console.log(`[CodeRadar Backend] Gemini API status: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Offline / Smart Heuristic Mode'}`);
});
