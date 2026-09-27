# CodeRadar 🎯

> **"Scan your code. Spot the risks. Ship with confidence."**

[![Live Demo](https://img.shields.io/badge/Live_Demo-parth--verse.github.io%2FCodeRadar-00E5FF?style=for-the-badge)](https://parth-verse.github.io/CodeRadar/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Parth--verse%2FCodeRadar-10B981?style=for-the-badge&logo=github)](https://github.com/Parth-verse/CodeRadar)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#)

---

## ⚡ Try It Right Now

You don't need to install anything or configure API keys to test it. We deployed a live build that runs directly in your browser:

👉 **[https://parth-verse.github.io/CodeRadar/](https://parth-verse.github.io/CodeRadar/)**

Click **"Try Demo"** on the landing page, and you'll immediately see it analyze an e-commerce platform with real-world issues (leaked keys, swallowed exceptions, circular dependencies, and missing tests).

---

## Why we built this

Most AI coding tools today are just chat boxes tacked onto an editor. You ask for a function, it writes the function. But that doesn't solve the bigger problem every developer faces when joining a team or auditing a project:

**"What is actually going on inside this codebase, where are the hidden landmines, and what should I fix first?"**

We built CodeRadar to give developers an intelligent, radar-style health overview of an entire project. 

Instead of relying purely on an LLM (which can hallucinate) or purely on static linters (which drown you in 400 nitpicky warnings with zero context), CodeRadar combines two engines:

1. **Deterministic Static Analysis:** Fast, reliable checks that catch hardcoded credentials, check `.gitignore` hygiene, find circular imports, measure nesting depth, and audit dependencies.
2. **Gemini AI Reasoning:** Deep context-aware reasoning that explains *why* a bug matters, traces cross-file execution flows, suggests clean fixes, generates targeted tests, and writes onboarding guides for new engineers.

The loop is simple: **Scan &rarr; Understand &rarr; Prioritize &rarr; Fix &rarr; Rescan**.

---

## What CodeRadar does

### 🕸️ 1. The Repository Radar
A hexagonal radar chart that visualizes repository health across six core pillars: **Bugs**, **Security**, **Quality**, **Testing**, **Dependencies**, and **Architecture**. Click any spoke to jump directly to those findings.

### 📊 2. CodeRadar Health Score
A heuristic score from 0 to 100 with clear status badges (*Needs Attention*, *Critical Risks*, or *Healthy*). We're upfront that this is a practical heuristic summary based on findings, not an arbitrary "objective" metric.

### 🔐 3. Credential Scanning with Safe Masking
Catches potential hardcoded Firebase keys, tokens, and missing `.env` exclusions in `.gitignore`. Critically, sensitive strings are automatically masked in the UI (`AIzaSy************`) so credentials are never exposed on screen during team reviews or recordings.

### 🛠️ 4. In-App Code Viewer with 1-Click Fix & Rescan
Inspect source files with line numbers and highlighted findings attached directly to the code. Click **"Apply Fix & Rescan"** on an issue (like the Firebase secret or swallowed error), and watch the health score recalculate live from **71 &rarr; 79 / 100 (+8 points)**.

### 🏗️ 5. Architecture & Execution Flow Explorer
Breaks down the system into clean topological tiers (*Frontend UI &rarr; Business Services &rarr; API Routes &rarr; SDKs &rarr; Tests*). Click any file to inspect what imports it and what it consumes. Then ask Gemini to trace real execution flows, like *"What happens when a user logs in?"* or *"Trace the checkout flow"*.

### 🧪 6. Testing Health Matrix
Scans your test files against realistic failure scenarios. For authentication, it checks sunny-day login vs. missing edge cases (empty inputs, timeouts, 401s, expired refresh tokens), and Gemini writes runnable Jest/Vitest code to patch the gaps.

### 📦 7. Dependency & Bundle Hygiene
Parses `package.json` to highlight heavy legacy libraries (like maintenance-mode `moment.js` adding ~290kB) and suggests modern, lightweight alternatives.

### 🧭 8. "I'm New Here" (New Developer Onboarding)
Designed for when you inherit an unfamiliar codebase. Gemini synthesizes a curated **"Start Here"** reading sequence (e.g. `README` &rarr; config &rarr; authService &rarr; orderService &rarr; routes) and explains the mental models you need to be productive on day one.

### 🧯 9. Bug Root-Cause Investigator
Paste a messy error message or production stack trace. CodeRadar maps the trace back to repository files and Gemini provides a structured diagnosis: what happened, the likely cause, evidence in code, and how to verify the fix.

### 🎨 10. Dynamic Themes
Choose between four developer themes from the header palette:
- 🔵 **Cyber Cyan** (Default high-contrast deep space navy + electric cyan)
- 🟢 **Radar Emerald** (Cyber green + dark obsidian)
- 🟣 **Cosmic Violet** (Neon purple + midnight slate)
- 🟡 **Cyber Amber** (Warm carbon gold)

### 📄 11. One-Click Audit Export
Click **"Export"** to preview and download an executive Markdown audit report ready to share with your engineering manager or teammates.

---

## Tech Stack

- **Frontend:** React 18, Vite 8, Tailwind CSS v4, Lucide React icons, Custom SVG Radar Chart.
- **Backend:** Node.js, Express, Multer, AdmZip, Axios.
- **AI Integration:** Google GenAI SDK (`@google/generative-ai`) with **Gemini 1.5 Flash**.
- **Deployment:** Live on GitHub Pages with an embedded client-side analysis fallback engine so it runs seamlessly anywhere.

---

## Running Locally

If you want to run the full stack locally with your own API key:

### 1. Clone the repo
```bash
git clone https://github.com/Parth-verse/CodeRadar.git
cd CodeRadar
```

### 2. Start the Backend (Port 5000)
```bash
cd backend
npm install
npm start
```

### 3. Start the Frontend (Port 5173)
```bash
cd ../frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser.

### 4. (Optional) Configure Gemini API Key
You can add your key to `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
Or paste it directly into **Settings** in the CodeRadar header. (If you don't provide a key, CodeRadar automatically uses its built-in heuristic reasoning engine so everything works out of the box).

---

## Project Structure

```
CodeRadar/
├── backend/
│   ├── src/
│   │   ├── index.js                  # Express API server
│   │   ├── routes/
│   │   │   ├── scan.js               # Demo scan, GitHub ingest, ZIP upload, rescan
│   │   │   └── gemini.js             # Root-cause, execution flow, onboarding, Q&A
│   │   └── services/
│   │       ├── staticAnalysis.js     # Secret detector, nesting depth, error swallows
│   │       ├── geminiService.js      # Google GenAI prompt orchestration
│   │       ├── architectureService.js# Module dependency graph builder
│   │       ├── dependencyService.js  # package.json auditor
│   │       ├── testingService.js     # Edge case matrix analyzer
│   │       └── demoRepo.js           # Multi-file demo codebase
├── frontend/
│   ├── src/
│   │   ├── App.jsx                   # Main layout and tab router
│   │   ├── index.css                 # Theme variables & base styles
│   │   ├── components/
│   │   │   ├── RadarChart.jsx        # Hexagonal SVG radar
│   │   │   ├── Dashboard.jsx         # Health score card & critical triage
│   │   │   ├── FindingsList.jsx      # Filterable findings list
│   │   │   ├── FindingDetailModal.jsx# Gemini fix & verification drawer
│   │   │   ├── CodeViewer.jsx        # Line gutter viewer + 1-click rescan
│   │   │   ├── ArchitectureExplorer.jsx # Tiered topology & execution flow
│   │   │   ├── CodebaseExplainer.jsx # High-level architecture summary
│   │   │   ├── TestingHealth.jsx     # Scenario matrix & test generation
│   │   │   ├── BugInvestigator.jsx   # Stack trace triage
│   │   │   ├── NewDevOnboarding.jsx  # "I'm new here" guide
│   │   │   ├── AskCodeRadar.jsx      # Repository-aware AI pair chat
│   │   │   ├── Navbar.jsx            # Theme switcher & repo context
│   │   │   ├── Sidebar.jsx           # Responsive navigation
│   │   │   └── AuditReportModal.jsx  # Markdown export dialog
│   │   └── services/
│   │       └── apiClient.js          # Universal client-side fallback engine
```

---

## License

MIT &copy; 2026 [Parth Sharma](https://github.com/Parth-verse). Built for developers who care about shipping clean, resilient code.
