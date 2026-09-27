import express from 'express';
import multer from 'multer';
import { DEMO_REPOSITORY } from '../services/demoRepo.js';
import { runDeterministicAnalysis } from '../services/staticAnalysis.js';
import { buildArchitectureGraph } from '../services/architectureService.js';
import { analyzeDependencies } from '../services/dependencyService.js';
import { analyzeTestingHealth } from '../services/testingService.js';
import { parseZipBuffer, fetchGitHubRepository } from '../services/scanner.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

/**
 * Helper to build full report from repository files
 */
export function buildRepositoryReport(repoInfo, files) {
  const analysis = runDeterministicAnalysis(files);
  const architecture = buildArchitectureGraph(files);
  const dependencies = analyzeDependencies(files);
  const testing = analyzeTestingHealth(files);

  return {
    repository: {
      name: repoInfo.name || "Custom Repository",
      branch: repoInfo.branch || "main",
      commit: repoInfo.commit || "a1b2c3d",
      scannedAt: new Date().toISOString(),
      language: repoInfo.language || "JavaScript / TypeScript"
    },
    files: files.map(f => ({ path: f.path, size: (f.content || '').length })),
    fileContents: files.reduce((acc, f) => { acc[f.path] = f.content; return acc; }, {}),
    healthScore: analysis.overallScore,
    statusText: analysis.statusText,
    statusColor: analysis.statusColor,
    categoryScores: analysis.categoryScores,
    findings: analysis.findings,
    metrics: analysis.metrics,
    architecture,
    dependencies,
    testing
  };
}

// 1. Scan built-in demo repository (1-click immediate experience)
router.post('/demo', (req, res) => {
  try {
    const report = buildRepositoryReport(
      {
        name: DEMO_REPOSITORY.name,
        branch: DEMO_REPOSITORY.branch,
        commit: DEMO_REPOSITORY.commit,
        language: DEMO_REPOSITORY.language
      },
      DEMO_REPOSITORY.files
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to scan demo repository", message: err.message });
  }
});

// 2. Scan public GitHub repository
router.post('/github', async (req, res) => {
  try {
    const { url, githubToken } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Repository URL or owner/repo is required" });
    }

    // Extract owner and repo from URL or string
    let cleanUrl = url.trim().replace(/\/$/, '');
    let owner, repo;

    if (cleanUrl.includes('github.com/')) {
      const parts = cleanUrl.split('github.com/')[1].split('/');
      owner = parts[0];
      repo = parts[1];
    } else if (cleanUrl.includes('/')) {
      const parts = cleanUrl.split('/');
      owner = parts[0];
      repo = parts[1];
    } else {
      return res.status(400).json({ error: "Invalid repository format. Use 'owner/repo' or full GitHub URL." });
    }

    const fetched = await fetchGitHubRepository(owner, repo, githubToken);
    if (!fetched.files || fetched.files.length === 0) {
      return res.status(404).json({ error: "No scannable code files found in repository." });
    }

    const report = buildRepositoryReport(
      {
        name: `${owner}/${repo}`,
        branch: fetched.branch,
        commit: "head",
        language: "Detected Codebase"
      },
      fetched.files
    );

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to scan GitHub repository", message: err.message });
  }
});

// 3. Scan uploaded ZIP repository
router.post('/upload', upload.single('projectZip'), (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No ZIP file provided." });
    }

    const files = parseZipBuffer(req.file.buffer);
    if (files.length === 0) {
      return res.status(400).json({ error: "No valid source code files found in ZIP." });
    }

    const report = buildRepositoryReport(
      {
        name: req.file.originalname.replace('.zip', ''),
        branch: "local-upload",
        commit: "local",
        language: "Uploaded Project"
      },
      files
    );

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to process uploaded repository", message: err.message });
  }
});

// 4. Rescan with Simulated Fixes & Comparison Engine
router.post('/rescan', (req, res) => {
  try {
    const { resolvedFindingIds = [], customFiles } = req.body;
    
    // Start with demo files or customFiles
    let filesToScan = customFiles && Array.isArray(customFiles) ? customFiles : JSON.parse(JSON.stringify(DEMO_REPOSITORY.files));

    // Apply fixes based on resolved IDs
    if (resolvedFindingIds.includes('sec-key-src/config/firebase.js-7')) {
      // Fix firebase.js
      const fb = filesToScan.find(f => f.path === 'src/config/firebase.js');
      if (fb) {
        fb.content = fb.content.replace(
          'apiKey: "AIzaSyB391XqZ94FakeHackathonKeyDemoVal"',
          'apiKey: process.env.FIREBASE_API_KEY'
        );
      }
    }

    if (resolvedFindingIds.includes('sec-env-gitignore')) {
      // Fix .gitignore
      const gi = filesToScan.find(f => f.path === '.gitignore');
      if (gi) {
        gi.content += '\n.env\n.env.*\n';
      }
    }

    if (resolvedFindingIds.includes('bug-swallowed-error-src/services/authService.js-23')) {
      // Fix authService.js error handling
      const auth = filesToScan.find(f => f.path === 'src/services/authService.js');
      if (auth) {
        auth.content = auth.content.replace(
          'console.log("Error occurred");\n    return null;',
          'console.error("Auth dispatch failure:", err.message);\n    throw new Error(err.response?.data?.message || "Authentication service unavailable");'
        );
      }
    }

    if (resolvedFindingIds.includes('quality-deep-nesting-src/services/paymentService.js-16')) {
      // Refactor paymentService.js
      const pay = filesToScan.find(f => f.path === 'src/services/paymentService.js');
      if (pay) {
        pay.content = pay.content.replace(/if\s*\(customer\)\s*\{[\s\S]*?\}\s*\}\s*\}\s*\}/, `// Refactored with early returns
  const billing = customer?.billingAddress;
  if (billing?.country === 'US' && (billing.state === 'CA' || billing.state === 'NY')) {
    const taxRate = billing.state === 'CA' ? 0.0825 : 0.08875;
    amount += (amount * taxRate);
  }`);
      }
    }

    const previousReport = buildRepositoryReport(
      { name: DEMO_REPOSITORY.name, branch: "main", commit: "8f2a1b9" },
      DEMO_REPOSITORY.files
    );

    const newReport = buildRepositoryReport(
      { name: DEMO_REPOSITORY.name, branch: "main", commit: "9c3b4e1" },
      filesToScan
    );

    const scoreDiff = newReport.healthScore - previousReport.healthScore;
    const resolvedFindings = previousReport.findings.filter(f => !newReport.findings.some(nf => nf.id === f.id));

    res.json({
      previousScore: previousReport.healthScore,
      newScore: newReport.healthScore,
      scoreDiff,
      healthImproved: scoreDiff > 0,
      report: newReport,
      resolvedFindings,
      categoryDiff: {
        security: newReport.categoryScores.security - previousReport.categoryScores.security,
        bugs: newReport.categoryScores.bugs - previousReport.categoryScores.bugs,
        quality: newReport.categoryScores.quality - previousReport.categoryScores.quality,
        testing: newReport.categoryScores.testing - previousReport.categoryScores.testing
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to rescan repository", message: err.message });
  }
});

export default router;
