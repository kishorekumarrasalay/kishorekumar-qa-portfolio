"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Send,
  Layers,
  HelpCircle,
  Folder,
  FileCode,
  Terminal,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  type ProjectKey,
  type ApiEndpointSpec,
  type NegativeTestScenario,
  type ChallengeQuestion,
  type PostmanCollectionTree,
  API_ENDPOINTS,
  NEGATIVE_TEST_SCENARIOS,
  CHALLENGE_QUESTIONS,
  POSTMAN_COLLECTIONS,
} from "@/data/qa-lab";

interface PlaywrightReplayData {
  suite: {
    title: string;
    project: string;
    framework: string;
    browser: string;
    durationMs: number;
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    status: string;
    note: string;
  };
  tests: {
    id: string;
    name: string;
    file: string;
    status: "passed" | "failed";
    durationMs: number;
    error?: string;
    steps: {
      action: string;
      locator: string;
      durationMs: number;
      status: "passed" | "failed";
    }[];
  }[];
}

interface NegativeTestResult {
  scenarioId: string;
  title: string;
  method: string;
  endpoint: string;
  expectedStatus: number;
  actualStatus: number;
  passed: boolean;
  durationMs: number;
  errorDetail?: string;
}

export default function TabTestRunner({ activeProject }: { activeProject: ProjectKey }) {
  // Sub-navigation within Tab 2
  const [subView, setSubView] = useState<
    "builder" | "negative" | "challenge" | "postman" | "playwright"
  >("builder");

  // ─────────────────────────────────────────────────────────────
  // 1. REQUEST BUILDER STATE
  // ─────────────────────────────────────────────────────────────
  const projectEndpoints = API_ENDPOINTS.filter((ep) => ep.project === activeProject);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(
    projectEndpoints[0]?.id || API_ENDPOINTS[0].id
  );

  const activeEpSpec =
    API_ENDPOINTS.find((ep) => ep.id === selectedEndpointId) || API_ENDPOINTS[0];

  const [reqMethod, setReqMethod] = useState<string>(activeEpSpec.method);
  const [reqPath, setReqPath] = useState<string>(activeEpSpec.path);
  const [reqHeadersText, setReqHeadersText] = useState<string>(
    JSON.stringify(activeEpSpec.defaultHeaders, null, 2)
  );
  const [reqBodyText, setReqBodyText] = useState<string>(
    activeEpSpec.defaultBody ? JSON.stringify(activeEpSpec.defaultBody, null, 2) : ""
  );

  const [isSending, setIsSending] = useState(false);
  const [resStatus, setResStatus] = useState<number | null>(null);
  const [resTimeMs, setResTimeMs] = useState<number | null>(null);
  const [resHeaders, setResHeaders] = useState<Record<string, string> | null>(null);
  const [resBody, setResBody] = useState<string | null>(null);
  const [resCopied, setResCopied] = useState(false);

  // Sync builder when endpoint selection changes
  useEffect(() => {
    setReqMethod(activeEpSpec.method);
    setReqPath(activeEpSpec.path);
    setReqHeadersText(JSON.stringify(activeEpSpec.defaultHeaders, null, 2));
    setReqBodyText(activeEpSpec.defaultBody ? JSON.stringify(activeEpSpec.defaultBody, null, 2) : "");
    setResStatus(null);
    setResBody(null);
  }, [activeEpSpec]);

  // Execute Request Builder Call
  const handleSendRequest = async () => {
    setIsSending(true);
    setResStatus(null);
    setResBody(null);
    const start = performance.now();

    try {
      let parsedHeaders: Record<string, string> = {};
      try {
        if (reqHeadersText.trim()) parsedHeaders = JSON.parse(reqHeadersText);
      } catch {
        // Fallback simple header
        parsedHeaders = { "Content-Type": "application/json" };
      }

      const fetchOptions: RequestInit = {
        method: reqMethod,
        headers: parsedHeaders,
      };

      if (["POST", "PUT", "PATCH"].includes(reqMethod) && reqBodyText.trim()) {
        fetchOptions.body = reqBodyText;
      }

      const res = await fetch(reqPath, fetchOptions);
      const elapsed = Math.round(performance.now() - start);
      setResTimeMs(elapsed);
      setResStatus(res.status);

      const headersObj: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headersObj[k] = v;
      });
      setResHeaders(headersObj);

      const json = await res.json().catch(() => null);
      if (json) {
        setResBody(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text().catch(() => "");
        setResBody(text || "(No response body returned)");
      }
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setResTimeMs(elapsed);
      setResStatus(500);
      setResBody(
        JSON.stringify(
          {
            error: "Network Fetch Error",
            message: err instanceof Error ? err.message : String(err),
            hint: "Check endpoint path and format.",
          },
          null,
          2
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 2. NEGATIVE TEST RUNNER STATE
  // ─────────────────────────────────────────────────────────────
  const [isRunningNegative, setIsRunningNegative] = useState(false);
  const [negativeResults, setNegativeResults] = useState<NegativeTestResult[]>([]);

  const handleRunNegativeTests = async () => {
    setIsRunningNegative(true);
    setNegativeResults([]);

    const results: NegativeTestResult[] = [];

    for (let i = 0; i < NEGATIVE_TEST_SCENARIOS.length; i++) {
      const scenario = NEGATIVE_TEST_SCENARIOS[i];
      const start = performance.now();

      try {
        let res: Response;
        if (scenario.id === "NEG-02") {
          // Missing Authorization token
          res = await fetch(scenario.endpoint, {
            method: scenario.method,
            headers: { "Content-Type": "application/json" },
            body: scenario.samplePayload ? JSON.stringify(scenario.samplePayload) : undefined,
          });
        } else if (scenario.id === "NEG-01") {
          // Empty body
          res = await fetch(scenario.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "",
          });
        } else {
          res = await fetch(scenario.endpoint, {
            method: scenario.method,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer mock-token",
            },
            body: scenario.samplePayload ? JSON.stringify(scenario.samplePayload) : undefined,
          });
        }

        const elapsed = Math.round(performance.now() - start);
        const passed = res.status === scenario.expectedStatus;

        results.push({
          scenarioId: scenario.id,
          title: scenario.title,
          method: scenario.method,
          endpoint: scenario.endpoint,
          expectedStatus: scenario.expectedStatus,
          actualStatus: res.status,
          passed,
          durationMs: elapsed,
        });
      } catch (err) {
        results.push({
          scenarioId: scenario.id,
          title: scenario.title,
          method: scenario.method,
          endpoint: scenario.endpoint,
          expectedStatus: scenario.expectedStatus,
          actualStatus: 500,
          passed: false,
          durationMs: 40,
          errorDetail: err instanceof Error ? err.message : String(err),
        });
      }

      setNegativeResults([...results]);
      // Small delay for animated visual progression
      await new Promise((r) => setTimeout(r, 220));
    }

    setIsRunningNegative(false);
  };

  // ─────────────────────────────────────────────────────────────
  // 3. STATUS CODE CHALLENGE STATE
  // ─────────────────────────────────────────────────────────────
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const activeQuestion = CHALLENGE_QUESTIONS[currentQIndex];

  const handleSelectOption = (code: number, isCorrect: boolean) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(code);
    setAnsweredCount((c) => c + 1);
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setCurrentQIndex((idx) => (idx + 1) % CHALLENGE_QUESTIONS.length);
  };

  // ─────────────────────────────────────────────────────────────
  // 4. POSTMAN COLLECTION VIEWER
  // ─────────────────────────────────────────────────────────────
  const activeCollection =
    POSTMAN_COLLECTIONS.find((c) => c.project === activeProject) || POSTMAN_COLLECTIONS[0];
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    [activeCollection.folders[0]?.name || ""]: true,
  });

  const toggleFolder = (name: string) => {
    setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // ─────────────────────────────────────────────────────────────
  // 5. PLAYWRIGHT RUN REPLAY
  // ─────────────────────────────────────────────────────────────
  const [replayData, setReplayData] = useState<PlaywrightReplayData | null>(null);
  const [replayLoading, setReplayLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);

  // Load replay JSON from public/data/playwright-replay.json
  useEffect(() => {
    setReplayLoading(true);
    fetch("/data/playwright-replay.json")
      .then((res) => res.json())
      .then((data: PlaywrightReplayData) => {
        setReplayData(data);
      })
      .catch((err) => {
        console.error("Failed to load playwright replay JSON:", err);
      })
      .finally(() => {
        setReplayLoading(false);
      });
  }, []);

  const handleStartReplay = () => {
    if (!replayData) return;
    setIsPlayingReplay(true);
    setActiveStepIndex(0);

    const allStepsCount = replayData.tests.flatMap((t) => t.steps).length;

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setActiveStepIndex(current);
      if (current >= allStepsCount) {
        clearInterval(interval);
        setIsPlayingReplay(false);
      }
    }, 450);
  };

  const handleResetReplay = () => {
    setIsPlayingReplay(false);
    setActiveStepIndex(-1);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border pb-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSubView("builder")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              subView === "builder"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/25"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <Send size={13} className="inline mr-1" /> Request Builder
          </button>

          <button
            onClick={() => setSubView("negative")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              subView === "negative"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/25"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <AlertTriangle size={13} className="inline mr-1" /> Negative Test Suite
          </button>

          <button
            onClick={() => setSubView("challenge")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              subView === "challenge"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/25"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <HelpCircle size={13} className="inline mr-1" /> Status Code Challenge
          </button>

          <button
            onClick={() => setSubView("postman")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              subView === "postman"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/25"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <Folder size={13} className="inline mr-1" /> Postman Collection
          </button>

          <button
            onClick={() => setSubView("playwright")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              subView === "playwright"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/25"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <Terminal size={13} className="inline mr-1" /> Playwright Replay
          </button>
        </div>

        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
          Live Next.js API Routes
        </span>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. REQUEST BUILDER VIEW */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subView === "builder" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls & Request Editor */}
          <div className="lg:col-span-6 flex flex-col rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-card-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-cyan-400" />
                <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  HTTP Request Builder
                </h4>
              </div>
              <span className="text-[10px] font-mono text-muted uppercase">Interactive Client</span>
            </div>

            {/* Preset Selector */}
            <div>
              <label className="text-[11px] font-semibold text-muted block mb-1">
                Choose API Endpoint Preset:
              </label>
              <select
                value={selectedEndpointId}
                onChange={(e) => setSelectedEndpointId(e.target.value)}
                className="w-full rounded-xl border border-card-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-cyan-500"
              >
                {API_ENDPOINTS.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    [{ep.project.toUpperCase()}] {ep.method} {ep.name} ({ep.path})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted mt-1">{activeEpSpec.description}</p>
            </div>

            {/* Method & URL Row */}
            <div className="flex gap-2">
              <select
                value={reqMethod}
                onChange={(e) => setReqMethod(e.target.value)}
                className="rounded-xl border border-card-border bg-background px-3 py-2 text-xs font-bold text-cyan-400 outline-none focus:border-cyan-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                value={reqPath}
                onChange={(e) => setReqPath(e.target.value)}
                className="flex-1 rounded-xl border border-card-border bg-background px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-cyan-500"
              />
            </div>

            {/* Headers Editor */}
            <div>
              <label className="text-[11px] font-semibold text-muted block mb-1">
                Headers (JSON):
              </label>
              <textarea
                rows={2}
                value={reqHeadersText}
                onChange={(e) => setReqHeadersText(e.target.value)}
                className="w-full rounded-xl border border-card-border bg-background p-2.5 font-mono text-[11px] text-foreground outline-none focus:border-cyan-500"
              />
            </div>

            {/* Body Editor (for POST/PUT/PATCH) */}
            {["POST", "PUT", "PATCH"].includes(reqMethod) && (
              <div>
                <label className="text-[11px] font-semibold text-muted block mb-1">
                  Request Body (JSON Payload):
                </label>
                <textarea
                  rows={4}
                  value={reqBodyText}
                  onChange={(e) => setReqBodyText(e.target.value)}
                  className="w-full rounded-xl border border-card-border bg-background p-2.5 font-mono text-[11px] text-cyan-200 outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendRequest}
              disabled={isSending}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-500 disabled:opacity-50"
            >
              <Send size={14} />
              {isSending ? "Executing HTTP Call..." : "Send Request to Next.js API"}
            </button>
          </div>

          {/* Response Inspector */}
          <div className="lg:col-span-6 flex flex-col rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-card-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-cyan-400" />
                <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  Response Inspector
                </h4>
              </div>
              {resStatus !== null && (
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${
                      resStatus >= 200 && resStatus < 300
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    HTTP {resStatus}
                  </span>
                  {resTimeMs !== null && (
                    <span className="font-mono text-xs text-muted flex items-center gap-1">
                      <Clock size={12} /> {resTimeMs}ms
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Response Content */}
            <div className="flex-1 rounded-xl bg-black/95 p-3.5 border border-card-border font-mono text-xs overflow-auto max-h-[420px]">
              {resBody === null && !isSending ? (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center text-gray-500 p-6 space-y-2">
                  <Code2 size={24} className="text-gray-600" />
                  <p>Click &apos;Send Request&apos; to dispatch an HTTP call to the local mock endpoint.</p>
                  <p className="text-[11px] text-gray-600">Inspect real status codes, latency, and returned schemas.</p>
                </div>
              ) : isSending ? (
                <div className="h-full min-h-[220px] flex items-center justify-center text-cyan-400 space-x-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Awaiting server response...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-card-border/40 pb-1">
                    <span className="text-[10px] text-gray-400">Response Payload (JSON):</span>
                    <button
                      onClick={() => {
                        if (resBody) {
                          navigator.clipboard.writeText(resBody);
                          setResCopied(true);
                          setTimeout(() => setResCopied(false), 2000);
                        }
                      }}
                      className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1"
                    >
                      {resCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      {resCopied ? "Copied" : "Copy JSON"}
                    </button>
                  </div>
                  <pre className="text-emerald-300 text-[11px] whitespace-pre-wrap break-all leading-relaxed">
                    {resBody}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. NEGATIVE TEST RUNNER VIEW */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subView === "negative" && (
        <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  Automated Negative Testing Suite
                </h4>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Execute client-side fault injection: empty bodies, invalid tokens, missing fields, schema violations, and unauthorized operations.
              </p>
            </div>

            <button
              onClick={handleRunNegativeTests}
              disabled={isRunningNegative}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black transition hover:bg-amber-400 disabled:opacity-50 shrink-0 shadow-md shadow-amber-500/20"
            >
              <Play size={14} />
              {isRunningNegative ? "Executing Scenarios..." : "Run All Negative Tests"}
            </button>
          </div>

          {/* Summary Count Bar */}
          {negativeResults.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-card-border bg-muted/5 p-3 text-xs">
              <span className="font-semibold text-foreground">
                Execution Progress: {negativeResults.length} of {NEGATIVE_TEST_SCENARIOS.length} scenarios completed
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 size={13} /> {negativeResults.filter((r) => r.passed).length} Passed
                </span>
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <XCircle size={13} /> {negativeResults.filter((r) => !r.passed).length} Failed
                </span>
              </div>
            </div>
          )}

          {/* Test Result Table */}
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/10 text-muted font-semibold border-b border-card-border">
                <tr>
                  <th className="py-2.5 px-3">Test Scenario</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Target Endpoint</th>
                  <th className="py-2.5 px-3 text-center">Expected</th>
                  <th className="py-2.5 px-3 text-center">Actual</th>
                  <th className="py-2.5 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border font-mono text-[11px]">
                {NEGATIVE_TEST_SCENARIOS.map((sc) => {
                  const result = negativeResults.find((r) => r.scenarioId === sc.id);

                  return (
                    <tr key={sc.id} className="hover:bg-muted/5 transition">
                      <td className="py-3 px-3 font-sans font-medium text-foreground">
                        <div>{sc.title}</div>
                        <div className="text-[10px] text-muted font-mono mt-0.5">{sc.payloadDescription}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-cyan-400">{sc.method}</td>
                      <td className="py-3 px-3 text-muted truncate max-w-[200px]">{sc.endpoint}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="rounded bg-muted/15 px-2 py-0.5 font-bold text-muted">
                          {sc.expectedStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {result ? (
                          <span
                            className={`rounded px-2 py-0.5 font-bold ${
                              result.actualStatus === sc.expectedStatus
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {result.actualStatus}
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {result ? (
                          result.passed ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2.5 py-0.5 text-emerald-400 font-bold font-sans">
                              <CheckCircle2 size={12} /> PASS ({result.durationMs}ms)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-red-500/20 px-2.5 py-0.5 text-red-400 font-bold font-sans">
                              <XCircle size={12} /> FAIL
                            </span>
                          )
                        ) : (
                          <span className="text-gray-500 font-sans">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. STATUS CODE CHALLENGE VIEW */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subView === "challenge" && (
        <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-5 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-cyan-400" />
                <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  Status Code Challenge (Interview Practice)
                </h4>
              </div>
              <p className="text-xs text-muted mt-0.5">{activeQuestion.topic}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-bold text-cyan-400 self-start sm:self-auto">
              Score: {score} / {answeredCount}
            </div>
          </div>

          {/* Scenario Prompt */}
          <div className="rounded-xl border border-card-border bg-muted/5 p-4 text-xs sm:text-sm text-foreground leading-relaxed">
            <span className="font-bold text-cyan-400 block mb-1">
              Question {currentQIndex + 1} of {CHALLENGE_QUESTIONS.length}:
            </span>
            {activeQuestion.scenario}
          </div>

          {/* Options */}
          <div className="grid gap-2.5">
            {activeQuestion.options.map((opt) => {
              const isChosen = selectedAnswer === opt.code;
              let btnStyle = "border-card-border bg-muted/5 hover:border-cyan-500/50 text-foreground";

              if (selectedAnswer !== null) {
                if (opt.isCorrect) {
                  btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500";
                } else if (isChosen && !opt.isCorrect) {
                  btnStyle = "border-red-500 bg-red-500/10 text-red-300 ring-1 ring-red-500";
                }
              }

              return (
                <button
                  key={opt.code}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelectOption(opt.code, opt.isCorrect)}
                  className={`rounded-xl border p-3.5 text-left text-xs transition-all ${btnStyle}`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{opt.label}</span>
                    {selectedAnswer !== null && (
                      opt.isCorrect ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : isChosen ? (
                        <XCircle size={16} className="text-red-400" />
                      ) : null
                    )}
                  </div>
                  {selectedAnswer !== null && (
                    <p className="text-[11px] text-muted mt-2 font-normal leading-normal">
                      {opt.explanation}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {selectedAnswer !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition"
              >
                Next Challenge Question →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. POSTMAN COLLECTION TREE VIEW */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subView === "postman" && (
        <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-card-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Folder size={18} className="text-orange-400" />
              <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                {activeCollection.collectionName}
              </h4>
            </div>
            <span className="text-[10px] font-mono text-muted uppercase">Read-Only Tree</span>
          </div>

          {/* Collection Folders & Requests */}
          <div className="space-y-3">
            {activeCollection.folders.map((folder) => {
              const isOpen = openFolders[folder.name];

              return (
                <div key={folder.name} className="rounded-xl border border-card-border bg-muted/5 overflow-hidden">
                  <button
                    onClick={() => toggleFolder(folder.name)}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-foreground hover:bg-muted/10 transition text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Folder size={14} className="text-cyan-400" />
                      <span>{folder.name}</span>
                      <span className="text-[10px] text-muted font-normal">({folder.requests.length} requests)</span>
                    </div>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {isOpen && (
                    <div className="p-3 border-t border-card-border/60 space-y-2 bg-background/50">
                      {folder.requests.map((req) => (
                        <div key={req.name} className="rounded-lg border border-card-border/70 p-3 bg-card space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                                  req.method === "GET"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : req.method === "POST"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : req.method === "PATCH"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {req.method}
                              </span>
                              <span className="font-bold text-foreground">{req.name}</span>
                            </div>
                            <span className="font-mono text-[10px] text-muted">{req.endpoint}</span>
                          </div>
                          <p className="text-[11px] text-muted">{req.description}</p>
                          <div className="rounded bg-black/80 p-2 font-mono text-[10px] text-cyan-300 border border-card-border">
                            <span className="text-gray-500 block mb-1">// Postman Tests Script</span>
                            {req.tests.map((t, idx) => (
                              <div key={idx}>{t}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. PLAYWRIGHT RUN REPLAY VIEW */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subView === "playwright" && (
        <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-cyan-400" />
                <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  Playwright Automation Suite Replay
                </h4>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Sample run loaded from{" "}
                <code className="text-cyan-400 bg-cyan-950/30 px-1 py-0.5 rounded">
                  /data/playwright-replay.json
                </code>{" "}
                (Can be swapped with real framework output).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleStartReplay}
                disabled={isPlayingReplay || !replayData}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 disabled:opacity-50 transition"
              >
                <Play size={13} /> {isPlayingReplay ? "Replaying..." : "Play Replay"}
              </button>
              <button
                onClick={handleResetReplay}
                title="Reset Replay"
                className="rounded-xl border border-card-border bg-muted/10 p-1.5 text-muted hover:text-foreground transition"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {replayLoading ? (
            <div className="p-8 text-center text-xs text-muted">Loading test run data...</div>
          ) : !replayData ? (
            <div className="p-8 text-center text-xs text-red-400">Failed to load replay data.</div>
          ) : (
            <div className="space-y-4">
              {/* Suite Header Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="rounded-xl border border-card-border bg-muted/5 p-2.5">
                  <span className="text-[10px] text-muted block uppercase">Suite</span>
                  <span className="font-bold text-foreground truncate block">{replayData.suite.title}</span>
                </div>
                <div className="rounded-xl border border-card-border bg-muted/5 p-2.5">
                  <span className="text-[10px] text-muted block uppercase">Browser</span>
                  <span className="font-mono font-bold text-cyan-400">{replayData.suite.browser}</span>
                </div>
                <div className="rounded-xl border border-card-border bg-muted/5 p-2.5">
                  <span className="text-[10px] text-muted block uppercase">Duration</span>
                  <span className="font-mono font-bold text-foreground">{replayData.suite.durationMs}ms</span>
                </div>
                <div className="rounded-xl border border-card-border bg-muted/5 p-2.5">
                  <span className="text-[10px] text-muted block uppercase">Results</span>
                  <span className="font-bold text-emerald-400">
                    {replayData.suite.passed} Passed / {replayData.suite.failed} Failed
                  </span>
                </div>
              </div>

              {/* Step Logs Timeline */}
              <div className="rounded-xl border border-card-border bg-black/90 p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-2">
                <div className="text-[10px] text-gray-500 border-b border-card-border/50 pb-1">
                  // Console Output & Test Assertions
                </div>
                {replayData.tests.map((test) => (
                  <div key={test.id} className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-cyan-300 font-bold">
                      <span>▸ {test.name}</span>
                      <span className="text-[10px] text-muted">{test.durationMs}ms</span>
                    </div>

                    {test.steps.map((st, sIdx) => {
                      const globalIndex = replayData.tests
                        .slice(0, replayData.tests.indexOf(test))
                        .flatMap((t) => t.steps).length + sIdx;

                      const isPassed = activeStepIndex > globalIndex;
                      const isCurrent = activeStepIndex === globalIndex && isPlayingReplay;

                      return (
                        <div
                          key={sIdx}
                          className={`flex items-center justify-between pl-4 text-[11px] rounded py-0.5 px-1.5 transition ${
                            isCurrent
                              ? "bg-cyan-500/20 text-cyan-300 animate-pulse"
                              : isPassed
                              ? "text-emerald-400/90"
                              : "text-gray-500"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {isPassed ? (
                              <Check size={11} className="text-emerald-400 shrink-0" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-600 shrink-0" />
                            )}
                            <span className="truncate">{st.action}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 shrink-0">{st.durationMs}ms</span>
                        </div>
                      );
                    })}

                    {test.error && (
                      <div className="mt-1 pl-4 text-[10px] text-red-400 bg-red-950/40 p-2 rounded border border-red-500/30 whitespace-pre-wrap">
                        {test.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
