import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import LandingPage from './components/LandingPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import FindingsList from './components/FindingsList.jsx';
import FindingDetailModal from './components/FindingDetailModal.jsx';
import CodeViewer from './components/CodeViewer.jsx';
import CodebaseExplainer from './components/CodebaseExplainer.jsx';
import ArchitectureExplorer from './components/ArchitectureExplorer.jsx';
import TestingHealth from './components/TestingHealth.jsx';
import DependencyHealth from './components/DependencyHealth.jsx';
import SecurityScan from './components/SecurityScan.jsx';
import TechnicalDebt from './components/TechnicalDebt.jsx';
import BugInvestigator from './components/BugInvestigator.jsx';
import NewDevOnboarding from './components/NewDevOnboarding.jsx';
import AskCodeRadar from './components/AskCodeRadar.jsx';
import ScanModal from './components/ScanModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import AuditReportModal from './components/AuditReportModal.jsx';

export default function App() {
  // Application State
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [codeViewerFile, setCodeViewerFile] = useState(null);
  const [codeViewerLine, setCodeViewerLine] = useState(null);
  const [resolvedFindingIds, setResolvedFindingIds] = useState([]);
  const [rescanDelta, setRescanDelta] = useState(null);

  // Modals & UI States
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('coderadar_gemini_key') || '');
  const [initialAskQuery, setInitialAskQuery] = useState('');

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('coderadar_gemini_key', key);
  };

  // 1. Scan Built-in Demo Repository
  const handleScanDemo = async () => {
    setIsScanning(true);
    setRescanDelta(null);
    setResolvedFindingIds([]);
    try {
      const res = await fetch('/api/scan/demo', { method: 'POST' });
      const data = await res.json();
      setReport(data);
      setIsScanModalOpen(false);
      setActiveTab('dashboard');
    } catch (e) {
      console.error("Demo scan error:", e);
      alert("Failed to scan demo repository.");
    } finally {
      setIsScanning(false);
    }
  };

  // 2. Scan GitHub Repository
  const handleScanGitHub = async (url, token) => {
    setIsScanning(true);
    setRescanDelta(null);
    setResolvedFindingIds([]);
    try {
      const res = await fetch('/api/scan/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, githubToken: token })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setReport(data);
      setIsScanModalOpen(false);
      setActiveTab('dashboard');
    } catch (e) {
      console.error("GitHub scan error:", e);
      alert("Failed to scan GitHub repository. Verify repository name and permissions.");
    } finally {
      setIsScanning(false);
    }
  };

  // 3. Scan Uploaded ZIP
  const handleScanZip = async (file) => {
    setIsScanning(true);
    setRescanDelta(null);
    setResolvedFindingIds([]);
    try {
      const formData = new FormData();
      formData.append('projectZip', file);
      const res = await fetch('/api/scan/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setReport(data);
      setIsScanModalOpen(false);
      setActiveTab('dashboard');
    } catch (e) {
      console.error("Zip upload error:", e);
      alert("Failed to scan project zip archive.");
    } finally {
      setIsScanning(false);
    }
  };

  // 4. Toggle Simulated Fix for a Finding
  const handleToggleResolve = (findingId) => {
    setResolvedFindingIds(prev => {
      const exists = prev.includes(findingId);
      const updated = exists ? prev.filter(id => id !== findingId) : [...prev, findingId];
      return updated;
    });
  };

  // 5. Trigger Rescan & Comparison
  const handleRescan = async (forcedResolvedIds) => {
    setIsScanning(true);
    const idsToResolve = forcedResolvedIds || resolvedFindingIds;
    try {
      const res = await fetch('/api/scan/rescan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolvedFindingIds: idsToResolve
        })
      });
      const data = await res.json();
      setRescanDelta({
        previousScore: data.previousScore,
        newScore: data.newScore,
        scoreDiff: data.scoreDiff,
        resolvedFindings: data.resolvedFindings,
        categoryDiff: data.categoryDiff
      });
      setReport(data.report);
      setActiveTab('dashboard');
    } catch (e) {
      console.error("Rescan failed:", e);
      alert("Failed to complete rescan.");
    } finally {
      setIsScanning(false);
    }
  };

  // 6. Direct Apply Fix from Code Viewer or Modal
  const handleApplyFixAndRescan = (findingId) => {
    const updatedIds = resolvedFindingIds.includes(findingId)
      ? resolvedFindingIds
      : [...resolvedFindingIds, findingId];
    setResolvedFindingIds(updatedIds);
    handleRescan(updatedIds);
  };

  // Handlers for switching views
  const handleCategorySelectFromRadar = (category) => {
    setSelectedCategory(category);
    setActiveTab('findings');
  };

  const handleOpenInCodeViewer = (filePath, lineNumber) => {
    setCodeViewerFile(filePath);
    setCodeViewerLine(lineNumber);
    setActiveTab('code-viewer');
  };

  const handleAskGemini = (prompt) => {
    setInitialAskQuery(prompt);
    setActiveTab('ask');
  };

  // If no repository has been scanned yet, display Landing Page
  if (!report) {
    return (
      <>
        <LandingPage
          onStartScan={() => setIsScanModalOpen(true)}
          onTryDemo={handleScanDemo}
        />
        <ScanModal
          isOpen={isScanModalOpen}
          onClose={() => setIsScanModalOpen(false)}
          onScanDemo={handleScanDemo}
          onScanGitHub={handleScanGitHub}
          onScanZip={handleScanZip}
          isScanning={isScanning}
        />
      </>
    );
  }

  // Files list for components that need it
  const repoFiles = report.files?.map(f => ({
    path: f.path,
    content: report.fileContents?.[f.path] || ''
  })) || [];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EDF3] flex flex-col">
      {/* Top Navigation */}
      <Navbar
        repoInfo={report.repository}
        isScanning={isScanning}
        onRescan={() => handleRescan()}
        onOpenAskRadar={() => setActiveTab('ask')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenScanModal={() => setIsScanModalOpen(true)}
        onOpenExportReport={() => setIsExportReportOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'findings') setSelectedCategory('all');
          }}
          findingsCount={report.findings?.length || 0}
          criticalCount={report.metrics?.criticalCount || 0}
          isOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenExportReport={() => setIsExportReportOpen(true)}
        />

        {/* Tab Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              report={report}
              rescanDelta={rescanDelta}
              onCategorySelect={handleCategorySelectFromRadar}
              onSelectFinding={(f) => setSelectedFinding(f)}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'findings' && (
            <FindingsList
              findings={report.findings || []}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onSelectFinding={(f) => setSelectedFinding(f)}
              resolvedFindingIds={resolvedFindingIds}
            />
          )}

          {activeTab === 'code-viewer' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Repository Code Viewer</h2>
                <p className="text-xs text-[#8B949E] mt-0.5">
                  Inspect source files with embedded finding callouts, line telemetry, and 1-click remediation.
                </p>
              </div>
              <CodeViewer
                files={report.fileContents || {}}
                initialFile={codeViewerFile}
                highlightLine={codeViewerLine}
                findings={report.findings || []}
                onApplyFixAndRescan={handleApplyFixAndRescan}
              />
            </div>
          )}

          {activeTab === 'explainer' && (
            <CodebaseExplainer
              files={repoFiles}
              onSelectFile={(f) => handleOpenInCodeViewer(f, 1)}
              apiKey={apiKey}
            />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureExplorer
              architecture={report.architecture}
              files={repoFiles}
              apiKey={apiKey}
            />
          )}

          {activeTab === 'testing' && (
            <TestingHealth
              testing={report.testing}
              apiKey={apiKey}
            />
          )}

          {activeTab === 'dependencies' && (
            <DependencyHealth
              dependencies={report.dependencies}
            />
          )}

          {activeTab === 'security' && (
            <SecurityScan
              findings={report.findings || []}
              onSelectFinding={(f) => setSelectedFinding(f)}
            />
          )}

          {activeTab === 'debt' && (
            <TechnicalDebt
              findings={report.findings || []}
              onSelectFinding={(f) => setSelectedFinding(f)}
              apiKey={apiKey}
            />
          )}

          {activeTab === 'investigate' && (
            <BugInvestigator
              files={repoFiles}
              apiKey={apiKey}
            />
          )}

          {activeTab === 'onboarding' && (
            <NewDevOnboarding
              files={repoFiles}
              onSelectFile={(f) => handleOpenInCodeViewer(f, 1)}
              apiKey={apiKey}
            />
          )}

          {activeTab === 'ask' && (
            <AskCodeRadar
              files={repoFiles}
              onSelectFile={(f) => handleOpenInCodeViewer(f, 1)}
              initialQuestion={initialAskQuery}
              apiKey={apiKey}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <FindingDetailModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onOpenInCodeViewer={handleOpenInCodeViewer}
        onAskGemini={handleAskGemini}
        onToggleResolve={handleToggleResolve}
        isResolved={selectedFinding ? resolvedFindingIds.includes(selectedFinding.id) : false}
        apiKey={apiKey}
      />

      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanDemo={handleScanDemo}
        onScanGitHub={handleScanGitHub}
        onScanZip={handleScanZip}
        isScanning={isScanning}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <AuditReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        report={report}
      />
    </div>
  );
}
