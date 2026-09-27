import express from 'express';
import {
  explainFindingWithGemini,
  explainArchitectureFlow,
  explainCodebase,
  generateNewDevOnboarding,
  investigateIssue,
  prioritizeTechnicalDebt,
  askCodeRadar
} from '../services/geminiService.js';
import { DEMO_REPOSITORY } from '../services/demoRepo.js';

const router = express.Router();

// Helper to get files from body or fall back to demo files
function getFilesFromPayload(req) {
  if (req.body && req.body.files && Array.isArray(req.body.files)) {
    return req.body.files;
  }
  return DEMO_REPOSITORY.files;
}

// 1. Deep finding explanation
router.post('/explain-finding', async (req, res) => {
  try {
    const { finding, codeSnippet, apiKey } = req.body;
    if (!finding) {
      return res.status(400).json({ error: "Finding object is required" });
    }
    const result = await explainFindingWithGemini(finding, codeSnippet, apiKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to explain finding with Gemini", message: err.message });
  }
});

// 2. Architecture execution flow
router.post('/explain-flow', async (req, res) => {
  try {
    const { topic = "What happens when a user logs in?", apiKey } = req.body;
    const files = getFilesFromPayload(req);
    const result = await explainArchitectureFlow(topic, files, apiKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to explain execution flow", message: err.message });
  }
});

// 3. Explain My Codebase
router.post('/explain-codebase', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const files = getFilesFromPayload(req);
    const result = await explainCodebase(files, apiKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate codebase explanation", message: err.message });
  }
});

// 4. New Developer Mode ("I'm new here")
router.post('/onboarding', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const files = getFilesFromPayload(req);
    const result = await generateNewDevOnboarding(files, apiKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate onboarding guide", message: err.message });
  }
});

// 5. Bug Investigation ("Investigate this issue")
router.post('/investigate', async (req, res) => {
  try {
    const { errorLog, stackTrace, apiKey } = req.body;
    if (!errorLog) {
      return res.status(400).json({ error: "Error log or description is required" });
    }
    const files = getFilesFromPayload(req);
    const result = await investigateIssue(errorLog, stackTrace, files, apiKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to investigate issue", message: err.message });
  }
});

// 6. Technical Debt Prioritization ("What should I fix first?")
router.post('/tech-debt', async (req, res) => {
  try {
    const { findings = [], apiKey } = req.body;
    const result = await prioritizeTechnicalDebt(findings, apiKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to prioritize technical debt", message: err.message });
  }
});

// 7. Repository-Aware Q&A ("Ask CodeRadar")
router.post('/ask', async (req, res) => {
  try {
    const { question, apiKey } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    const files = getFilesFromPayload(req);
    const result = await askCodeRadar(question, files, apiKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to process repository question", message: err.message });
  }
});

export default router;
