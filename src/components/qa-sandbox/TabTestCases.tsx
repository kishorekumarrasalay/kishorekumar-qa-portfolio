"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Download,
  Code2,
  GitBranch,
  Layers,
  ArrowRight,
  CheckCircle2,
  Filter,
  Check,
  Copy,
} from "lucide-react";
import {
  type ProjectKey,
  type DefectPriority,
  type TestCaseType,
  type TestCaseItem,
  TEST_CASES,
  MODULE_COVERAGE_DATA,
  TRACEABILITY_MATRIX,
  INITIAL_BUGS,
} from "@/data/qa-lab";

export default function TabTestCases({ activeProject }: { activeProject: ProjectKey }) {
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("ALL");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Selected row for full detail inspection
  const [selectedTc, setSelectedTc] = useState<TestCaseItem | null>(TEST_CASES[0]);

  // Code snippet copied state
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Filtered test cases
  const filteredTestCases = TEST_CASES.filter((tc) => {
    const matchProj = selectedProject === "ALL" || tc.project === selectedProject;
    const matchMod = selectedModule === "ALL" || tc.module === selectedModule;
    const matchPri = selectedPriority === "ALL" || tc.priority === selectedPriority;
    const matchTyp = selectedType === "ALL" || tc.type === selectedType;
    const matchSearch =
      tc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.module.toLowerCase().includes(searchQuery.toLowerCase());

    return matchProj && matchMod && matchPri && matchTyp && matchSearch;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Test Case ID",
      "Project",
      "Module",
      "Scenario",
      "Steps",
      "Expected Result",
      "Priority",
      "Type",
      "Linked Requirement",
      "Linked Bug",
    ];

    const rows = filteredTestCases.map((tc) => [
      `"${tc.id}"`,
      `"${tc.project.toUpperCase()}"`,
      `"${tc.module}"`,
      `"${tc.scenario.replace(/"/g, '""')}"`,
      `"${tc.steps.join(" | ").replace(/"/g, '""')}"`,
      `"${tc.expectedResult.replace(/"/g, '""')}"`,
      `"${tc.priority}"`,
      `"${tc.type}"`,
      `"${tc.linkedRequirementId}"`,
      `"${tc.linkedBugId || "None"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kishore-qa-test-cases-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy playwright snippet
  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  // Unique modules across test cases
  const allModules = Array.from(new Set(TEST_CASES.map((tc) => tc.module)));

  return (
    <div className="space-y-8">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. FILTER CONTROLS & TEST CASE TABLE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-4">
        {/* Table Header & Download Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-cyan-400" />
              <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                Test Case Repository & Documentation
              </h4>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Structured manual and automated test specifications with requirement traceability.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 transition shrink-0 shadow-md shadow-cyan-600/20"
          >
            <Download size={13} /> Download as CSV
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Box */}
          <div className="flex items-center gap-2 rounded-xl border border-card-border bg-background px-3 py-1.5">
            <Search size={14} className="text-muted" />
            <input
              type="text"
              placeholder="Search ID, scenario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted"
            />
          </div>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="rounded-xl border border-card-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Projects</option>
            <option value="nso">NSO (Belgian Waffle)</option>
            <option value="hikode">HiKode (Job Platform)</option>
          </select>

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="rounded-xl border border-card-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Modules</option>
            {allModules.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-xl border border-card-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="P1">P1 (Blocker)</option>
            <option value="P2">P2 (Major)</option>
            <option value="P3">P3 (Minor)</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-card-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Types</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Edge">Edge</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/10 text-muted font-semibold border-b border-card-border">
              <tr>
                <th className="py-2.5 px-3">Test Case ID</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Scenario</th>
                <th className="py-2.5 px-3">Expected Result</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-3 text-center">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filteredTestCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted">
                    No test cases matching current search criteria.
                  </td>
                </tr>
              ) : (
                filteredTestCases.map((tc) => {
                  const isSelected = selectedTc?.id === tc.id;

                  return (
                    <tr
                      key={tc.id}
                      onClick={() => setSelectedTc(tc)}
                      className={`cursor-pointer transition ${
                        isSelected ? "bg-cyan-950/30" : "hover:bg-muted/5"
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        {tc.id}
                      </td>
                      <td className="py-3 px-3 font-semibold uppercase text-[10px] text-muted">
                        {tc.project}
                      </td>
                      <td className="py-3 px-3 text-foreground whitespace-nowrap">{tc.module}</td>
                      <td className="py-3 px-3 text-foreground font-medium max-w-[240px]">
                        {tc.scenario}
                      </td>
                      <td className="py-3 px-3 text-muted max-w-[240px] truncate">
                        {tc.expectedResult}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                            tc.priority === "P1"
                              ? "bg-red-500/20 text-red-400"
                              : tc.priority === "P2"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {tc.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                            tc.type === "Positive"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : tc.type === "Negative"
                              ? "bg-red-500/15 text-red-300"
                              : "bg-purple-500/15 text-purple-300"
                          }`}
                        >
                          {tc.type}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. BEFORE & AFTER: MANUAL SPEC VS PLAYWRIGHT TYPESCRIPT */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedTc && selectedTc.playwrightSnippet && (
        <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-cyan-400" />
                <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  Before & After: Manual Test Specification vs. Playwright TypeScript Automation
                </h4>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Demonstrating Kishore&apos;s transition from manual test case authoring to E2E code automation.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-400 self-start sm:self-auto">
              {selectedTc.id}: {selectedTc.scenario}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Left: Manual Test Case Spec */}
            <div className="rounded-xl border border-card-border bg-muted/5 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-card-border/50 pb-2">
                <span className="font-bold text-muted uppercase tracking-wider text-[11px]">
                  Manual Test Case Specification
                </span>
                <span className="rounded bg-muted/20 px-2 py-0.5 text-[10px] text-muted">Google Sheets Format</span>
              </div>
              <div>
                <span className="text-muted block text-[11px] font-semibold mb-1">Execution Steps:</span>
                <ol className="list-decimal list-inside space-y-1 text-foreground/90 font-mono text-[11px] bg-background/50 p-2.5 rounded-lg border border-card-border/40">
                  {selectedTc.steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ol>
              </div>
              <div>
                <span className="text-muted block text-[11px] font-semibold mb-0.5">Expected Result:</span>
                <p className="text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/20 text-[11px]">
                  {selectedTc.expectedResult}
                </p>
              </div>
            </div>

            {/* Right: Playwright TypeScript Automation Snippet */}
            <div className="rounded-xl border border-cyan-500/40 bg-black/95 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-card-border/60 pb-2">
                <span className="font-bold text-cyan-400 tracking-wider text-[11px]">
                  Playwright (TypeScript) Automated Script
                </span>
                <button
                  onClick={() => handleCopySnippet(selectedTc.playwrightSnippet || "")}
                  className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white"
                >
                  {copiedSnippet ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedSnippet ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="text-cyan-200 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {selectedTc.playwrightSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. COVERAGE HEATMAP & TRACEABILITY MATRIX */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Coverage Heatmap */}
        <div className="lg:col-span-6 rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-card-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-cyan-400" />
              <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                Module Coverage Heatmap
              </h4>
            </div>
            <span className="text-[10px] font-mono text-muted uppercase">Health Matrix</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {MODULE_COVERAGE_DATA.map((cov) => {
              const healthColor =
                cov.coverageScore >= 90
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                  : "border-cyan-500/30 bg-cyan-500/5 text-cyan-400";

              return (
                <div key={cov.module} className={`rounded-xl border p-3 space-y-1.5 ${healthColor}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground truncate">{cov.module}</span>
                    <span className="text-[10px] font-mono font-bold uppercase">{cov.project}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span>{cov.testCaseCount} Tests</span>
                    <span>{cov.bugsFound} Bugs</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-card-border overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${cov.coverageScore}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] font-mono font-bold text-muted">
                    Coverage: {cov.coverageScore}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traceability Matrix */}
        <div className="lg:col-span-6 rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-card-border/60 pb-3">
            <div className="flex items-center gap-2">
              <GitBranch size={18} className="text-cyan-400" />
              <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                Traceability Matrix (Req → Test Case → Bug)
              </h4>
            </div>
            <span className="text-[10px] font-mono text-muted uppercase">E2E Lineage</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {TRACEABILITY_MATRIX.map((node) => (
              <div
                key={node.requirementId}
                className="rounded-xl border border-card-border bg-muted/5 p-3 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">{node.requirementId}</span>
                    <span className="font-bold text-foreground">{node.requirementTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted uppercase">{node.project}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-muted">Tests:</span>
                  {node.testCaseIds.map((tcId) => (
                    <span
                      key={tcId}
                      className="rounded bg-blue-500/15 text-blue-300 px-1.5 py-0.5 text-[10px]"
                    >
                      {tcId}
                    </span>
                  ))}
                  <ArrowRight size={12} className="text-muted mx-1" />
                  <span className="text-muted">Bugs:</span>
                  {node.bugIds.map((bId) => (
                    <span
                      key={bId}
                      className="rounded bg-red-500/15 text-red-300 px-1.5 py-0.5 text-[10px]"
                    >
                      {bId}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
