"use client";

import { useState } from "react";
import {
  Bug,
  CheckCircle2,
  Code2,
  FileCode,
  FileText,
  Play,
  RotateCcw,
  Search,
  Terminal,
  TestTube2,
  AlertTriangle,
  Send,
  Layers,
  Sparkles,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import {
  sampleApiEndpoints,
  sampleBugScenarios,
  samplePlaywrightSuite,
  sampleTestCases,
  type BugScenario,
  type TestCase,
} from "@/data/qaTestData";

export default function QaSandbox() {
  const [activeTab, setActiveTab] = useState<"bug-hunt" | "test-runner" | "test-cases">("bug-hunt");

  // --- State for Bug Hunt Simulator ---
  const [bugs, setBugs] = useState<BugScenario[]>(sampleBugScenarios);
  const [inspectorMode, setInspectorMode] = useState(false);
  const [reportedBugTitle, setReportedBugTitle] = useState("");
  const [selectedModule, setSelectedModule] = useState("Checkout");
  const [bugToast, setBugToast] = useState<string | null>(null);

  // --- State for Test Runner ---
  const [isRunningApi, setIsRunningApi] = useState(false);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [selectedApiId, setSelectedApiId] = useState<string>(sampleApiEndpoints[0].id);

  const [isRunningPw, setIsRunningPw] = useState(false);
  const [pwStepIndex, setPwStepIndex] = useState(-1);

  // --- State for Test Case Explorer ---
  const [tcSearch, setTcSearch] = useState("");
  const [tcFilterType, setTcFilterType] = useState<string>("ALL");
  const [selectedTc, setSelectedTc] = useState<TestCase | null>(sampleTestCases[0]);

  // Handler: Spot a bug in simulator
  const handleSpotBug = (bugId: string) => {
    setBugs((prev) =>
      prev.map((b) => (b.id === bugId ? { ...b, isFound: true, status: "In Progress" } : b))
    );
    const foundBug = bugs.find((b) => b.id === bugId);
    if (foundBug) {
      setBugToast(`🎯 Defect Identified: "${foundBug.title}" logged to Bug Tracker (Google Sheets)!`);
      setTimeout(() => setBugToast(null), 4000);
    }
  };

  // Handler: Custom bug submission
  const handleCustomBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedBugTitle.trim()) return;

    const newBug: BugScenario = {
      id: `BUG-${100 + bugs.length + 1}`,
      title: reportedBugTitle.trim(),
      project: "Custom Interactive Session",
      module: selectedModule,
      description: "User reported defect during interactive sandbox testing session.",
      stepsToReproduce: ["Navigate to module", "Interact with target control", "Observe error behavior"],
      expectedBehavior: "System handles input gracefully without exceptions.",
      actualBehavior: "Unexpected behavior observed during live testing.",
      severity: "High",
      status: "Open",
      isFound: true,
    };

    setBugs([newBug, ...bugs]);
    setReportedBugTitle("");
    setBugToast(`✅ Bug #${newBug.id} successfully added to QA board!`);
    setTimeout(() => setBugToast(null), 4000);
  };

  // Handler: Run API Test
  const handleRunApiSuite = () => {
    setIsRunningApi(true);
    setApiLogs(["[INFO] Initializing Postman API Test Suite Runner..."]);

    sampleApiEndpoints.forEach((endpoint, idx) => {
      setTimeout(() => {
        setApiLogs((prev) => [
          ...prev,
          `[EXEC] ${endpoint.method} ${endpoint.endpoint} -> Status ${endpoint.expectedStatus} OK (${endpoint.latencyMs}ms)`,
        ]);
        if (idx === sampleApiEndpoints.length - 1) {
          setTimeout(() => {
            setApiLogs((prev) => [
              ...prev,
              "--------------------------------------------------",
              `[RESULT] Total Tests: ${sampleApiEndpoints.length} | Passed: ${sampleApiEndpoints.length} | Failed: 0 | Execution Time: 532ms`,
            ]);
            setIsRunningApi(false);
          }, 300);
        }
      }, (idx + 1) * 450);
    });
  };

  // Handler: Run Playwright Suite
  const handleRunPlaywright = () => {
    setIsRunningPw(true);
    setPwStepIndex(0);

    samplePlaywrightSuite.steps.forEach((_, idx) => {
      setTimeout(() => {
        setPwStepIndex(idx + 1);
        if (idx === samplePlaywrightSuite.steps.length - 1) {
          setTimeout(() => {
            setIsRunningPw(false);
          }, 400);
        }
      }, (idx + 1) * 600);
    });
  };

  const selectedApi = sampleApiEndpoints.find((a) => a.id === selectedApiId);

  const filteredTestCases = sampleTestCases.filter((tc) => {
    const matchesSearch =
      tc.title.toLowerCase().includes(tcSearch.toLowerCase()) ||
      tc.project.toLowerCase().includes(tcSearch.toLowerCase()) ||
      tc.id.toLowerCase().includes(tcSearch.toLowerCase());
    const matchesType = tcFilterType === "ALL" || tc.type === tcFilterType;
    return matchesSearch && matchesType;
  });

  return (
    <section id="qa-sandbox" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary-light">
            <Sparkles size={14} /> Interactive QA Lab
          </span>
          <div className="mt-3">
            <SectionHeading title="QA Defect & Automation Playground" />
          </div>
          <p className="text-body max-w-2xl text-sm text-muted sm:text-base">
            Explore live QA engineering workflows: hunt simulated UI bugs, run automated API & Playwright test suites, and inspect real-world test documentation.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab("bug-hunt")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm transition-all ${
              activeTab === "bug-hunt"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <Bug size={16} /> Live Bug Hunt & Defect Board
          </button>

          <button
            onClick={() => setActiveTab("test-runner")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm transition-all ${
              activeTab === "test-runner"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <Terminal size={16} /> API & Playwright Test Runner
          </button>

          <button
            onClick={() => setActiveTab("test-cases")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm transition-all ${
              activeTab === "test-cases"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <FileText size={16} /> Test Case Explorer
          </button>
        </div>

        {/* Toast Notification */}
        {bugToast && (
          <div className="mt-4 mx-auto max-w-md rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center text-xs font-semibold text-emerald-400 shadow-lg animate-fadeIn">
            {bugToast}
          </div>
        )}

        {/* TAB 1: BUG HUNT SIMULATOR */}
        {activeTab === "bug-hunt" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            {/* Mock Application Frame */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl border border-card-border bg-card overflow-hidden shadow-lg min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border px-3.5 py-3 bg-muted/5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block shrink-0" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block shrink-0" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block shrink-0" />
                  <span className="ml-1 text-[11px] sm:text-xs font-mono text-muted truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
                    https://sandbox.ratnamsolutions.app/demo
                  </span>
                </div>
                <button
                  onClick={() => setInspectorMode(!inspectorMode)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition shrink-0 ${
                    inspectorMode
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-muted/10 text-muted hover:text-foreground"
                  }`}
                >
                  <TestTube2 size={13} /> Inspector: {inspectorMode ? "ON" : "OFF"}
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-5 flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-heading text-base sm:text-lg font-bold">NSO Belgian Waffle Store (Mock)</h4>
                    <p className="text-[11px] sm:text-xs text-muted">Test the cart total calculation & user profile actions</p>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono bg-primary/10 text-primary-light px-2.5 py-1 rounded-md border border-primary/20 self-start sm:self-auto">
                    Web Application Demo
                  </span>
                </div>

                {/* Bug Target 1: Cart Calculation */}
                <div
                  className={`relative rounded-xl border p-3.5 sm:p-4 transition-all min-w-0 ${
                    inspectorMode
                      ? "border-amber-500/50 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                      : "border-card-border bg-muted/5"
                  }`}
                  onClick={() => inspectorMode && handleSpotBug("BUG-101")}
                >
                  {inspectorMode && (
                    <span className="absolute -top-2.5 right-3 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black uppercase">
                      Inspect Defect #BUG-101
                    </span>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] sm:text-xs font-semibold text-muted">Cart Item x 3: Nutella Waffle</p>
                      <p className="text-xs sm:text-sm font-bold text-foreground">Unit Price: ₹199.99</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[11px] sm:text-xs text-muted">Displayed Total (Bugged):</p>
                      <p className="text-sm sm:text-base font-extrabold text-red-400 line-through">₹597.00</p>
                      <p className="text-[10px] sm:text-[11px] text-emerald-400">Expected: ₹599.97</p>
                    </div>
                  </div>
                  {inspectorMode && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                      <Bug size={13} /> Click here to log currency decimal rounding bug!
                    </div>
                  )}
                </div>

                {/* Bug Target 2: Avatar Null Crash */}
                <div
                  className={`relative rounded-xl border p-3.5 sm:p-4 transition-all min-w-0 ${
                    inspectorMode
                      ? "border-amber-500/50 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                      : "border-card-border bg-muted/5"
                  }`}
                  onClick={() => inspectorMode && handleSpotBug("BUG-102")}
                >
                  {inspectorMode && (
                    <span className="absolute -top-2.5 right-3 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black uppercase">
                      Inspect Defect #BUG-102
                    </span>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] sm:text-xs font-semibold text-muted">HiKode User Profile Settings</p>
                      <p className="text-xs sm:text-sm font-medium">Avatar: Default Placeholder (null)</p>
                    </div>
                    <button className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-500/20 self-start sm:self-auto">
                      Remove Avatar
                    </button>
                  </div>
                  {inspectorMode && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                      <Bug size={13} /> Click here to log null reference exception on remove action!
                    </div>
                  )}
                </div>

                {/* Manual Bug Report Input */}
                <form onSubmit={handleCustomBugSubmit} className="pt-2 border-t border-card-border/50">
                  <label className="block text-[11px] sm:text-xs font-semibold text-muted mb-1.5">
                    Log a New Custom Defect to Google Sheets:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Navigation menu overlaps on mobile viewport"
                      value={reportedBugTitle}
                      onChange={(e) => setReportedBugTitle(e.target.value)}
                      className="flex-1 rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-light shrink-0"
                    >
                      <Send size={13} /> Log Defect
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Google Sheets Defect Tracker */}
            <div className="lg:col-span-5 flex flex-col rounded-2xl border border-card-border bg-card p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-card-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-primary-light" />
                  <h4 className="font-heading text-base font-bold">Bug Tracker (Google Sheets)</h4>
                </div>
                <span className="text-xs font-semibold text-muted bg-muted/10 px-2.5 py-0.5 rounded-full">
                  {bugs.length} Defects Tracked
                </span>
              </div>

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto max-h-[380px] pr-1">
                {bugs.map((bug) => (
                  <div
                    key={bug.id}
                    className={`rounded-xl border p-3.5 transition-all ${
                      bug.isFound
                        ? "border-amber-500/40 bg-amber-500/5 shadow-sm"
                        : "border-card-border bg-muted/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-primary-light">{bug.id}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                          bug.severity === "High"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        {bug.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-foreground leading-snug">{bug.title}</p>
                    <p className="mt-1 text-[11px] text-muted line-clamp-2">{bug.description}</p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted border-t border-card-border/40 pt-2">
                      <span>Module: {bug.module}</span>
                      <span
                        className={`font-semibold ${
                          bug.status === "In Progress" ? "text-amber-400" : "text-muted"
                        }`}
                      >
                        ● {bug.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEST RUNNER SIMULATOR */}
        {activeTab === "test-runner" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            {/* Postman API Runner */}
            <div className="lg:col-span-6 rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg flex flex-col min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border/60 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Code2 size={18} className="text-primary-light shrink-0" />
                  <h4 className="font-heading text-sm sm:text-base font-bold truncate">Postman API Automation</h4>
                </div>
                <button
                  onClick={handleRunApiSuite}
                  disabled={isRunningApi}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50 shrink-0"
                >
                  <Play size={13} /> {isRunningApi ? "Executing..." : "Run Suite"}
                </button>
              </div>

              {/* Endpoint selection */}
              <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {sampleApiEndpoints.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedApiId(ep.id)}
                    className={`rounded-lg px-2 py-1 text-[11px] sm:text-xs font-mono font-semibold transition ${
                      selectedApiId === ep.id
                        ? "bg-primary text-white"
                        : "bg-muted/10 text-muted hover:text-foreground"
                    }`}
                  >
                    {ep.method} {ep.id}
                  </button>
                ))}
              </div>

              {selectedApi && (
                <div className="mt-3 rounded-xl border border-card-border bg-muted/5 p-3 text-xs space-y-2 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between font-mono gap-1 break-all">
                    <span className="font-bold text-emerald-400">{selectedApi.method} {selectedApi.endpoint}</span>
                    <span className="text-muted shrink-0">{selectedApi.latencyMs}ms</span>
                  </div>
                  <p className="text-muted text-[11px] sm:text-xs">{selectedApi.description}</p>
                </div>
              )}

              {/* Live Terminal Log Output */}
              <div className="mt-4 flex-1 rounded-xl bg-black/90 p-3 sm:p-3.5 font-mono text-[10px] sm:text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all max-h-56 border border-card-border">
                {apiLogs.length === 0 ? (
                  <span className="text-gray-500">// Click &apos;Run Suite&apos; to execute HTTP endpoint tests...</span>
                ) : (
                  apiLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Playwright E2E Runner */}
            <div className="lg:col-span-6 rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg flex flex-col min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border/60 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal size={18} className="text-primary-light shrink-0" />
                  <h4 className="font-heading text-sm sm:text-base font-bold truncate">Playwright E2E Suite</h4>
                </div>
                <button
                  onClick={handleRunPlaywright}
                  disabled={isRunningPw}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-light disabled:opacity-50 shrink-0"
                >
                  <Play size={13} /> {isRunningPw ? "Running..." : "Run E2E Test"}
                </button>
              </div>

              <div className="mt-3 text-[11px] sm:text-xs text-muted font-mono flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 break-all">
                <span>File: {samplePlaywrightSuite.file}</span>
                <span className="text-primary-light shrink-0">Browser: {samplePlaywrightSuite.browser}</span>
              </div>

              {/* Steps timeline */}
              <div className="mt-4 space-y-2 sm:space-y-2.5 flex-1 overflow-y-auto max-h-72">
                {samplePlaywrightSuite.steps.map((step, idx) => {
                  const isPassed = pwStepIndex > idx;
                  const isCurrent = pwStepIndex === idx && isRunningPw;

                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-2.5 sm:p-3 text-[11px] sm:text-xs gap-1 sm:gap-2 transition-all ${
                        isPassed
                          ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400"
                          : isCurrent
                          ? "border-primary bg-primary/10 text-primary-light animate-pulse"
                          : "border-card-border bg-muted/5 text-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isPassed ? (
                          <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted/40 shrink-0 inline-block" />
                        )}
                        <span className="font-mono font-semibold break-all leading-tight">{step.action}</span>
                      </div>
                      <span className="text-[10px] font-mono shrink-0 text-muted sm:text-right">{step.durationMs}ms</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEST CASE EXPLORER */}
        {activeTab === "test-cases" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            {/* Test Case List Sidebar */}
            <div className="lg:col-span-5 flex flex-col rounded-2xl border border-card-border bg-card p-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-card-border/60 pb-3">
                <Search size={16} className="text-muted" />
                <input
                  type="text"
                  placeholder="Filter by title, project..."
                  value={tcSearch}
                  onChange={(e) => setTcSearch(e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted"
                />
              </div>

              {/* Type Filters */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["ALL", "Smoke", "Functional", "Regression", "API"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTcFilterType(type)}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                      tcFilterType === type
                        ? "bg-primary text-white"
                        : "bg-muted/10 text-muted hover:text-foreground"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="mt-3 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredTestCases.map((tc) => (
                  <div
                    key={tc.id}
                    onClick={() => setSelectedTc(tc)}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      selectedTc?.id === tc.id
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-card-border bg-muted/5 hover:border-card-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-primary-light">{tc.id}</span>
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                        {tc.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-foreground leading-snug">{tc.title}</p>
                    <p className="mt-1 text-[10px] text-muted">{tc.project}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Case Detail Display */}
            <div className="lg:col-span-7 rounded-2xl border border-card-border bg-card p-5 shadow-lg flex flex-col justify-between">
              {selectedTc ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-card-border/60 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-primary-light">{selectedTc.id}</span>
                      <h4 className="font-heading text-base font-bold text-foreground mt-0.5">{selectedTc.title}</h4>
                      <p className="text-xs text-muted">{selectedTc.project}</p>
                    </div>
                    <span className="rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary-light border border-primary/20">
                      {selectedTc.type}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Preconditions:</h5>
                    <ul className="list-disc list-inside text-xs text-foreground/80 space-y-1">
                      {selectedTc.preconditions.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Test Steps:</h5>
                    <ol className="list-decimal list-inside text-xs text-foreground/80 space-y-1 font-mono bg-muted/5 p-3 rounded-xl border border-card-border/40">
                      {selectedTc.steps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl border border-card-border/60 bg-muted/5 p-3">
                      <h6 className="text-[11px] font-bold text-muted uppercase">Expected Result</h6>
                      <p className="text-xs text-foreground/90 mt-1">{selectedTc.expectedResult}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                      <h6 className="text-[11px] font-bold text-emerald-400 uppercase">Actual Result</h6>
                      <p className="text-xs text-emerald-300/90 mt-1">{selectedTc.actualResult}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted">
                  Select a test case from the list to view detailed execution specs.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
