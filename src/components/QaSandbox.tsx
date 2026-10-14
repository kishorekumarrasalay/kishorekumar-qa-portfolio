"use client";

import React, { useState } from "react";
import {
  Bug,
  Terminal,
  FileText,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import {
  type ProjectKey,
  type DefectItem,
  INITIAL_BUGS,
  PROJECTS,
} from "@/data/qa-lab";
import TabBugHunt from "./qa-sandbox/TabBugHunt";
import TabTestRunner from "./qa-sandbox/TabTestRunner";
import TabTestCases from "./qa-sandbox/TabTestCases";
import CrossCuttingSections from "./qa-sandbox/CrossCuttingSections";

export default function QaSandbox() {
  const [activeTab, setActiveTab] = useState<"bug-hunt" | "test-runner" | "test-cases">("bug-hunt");

  // Shared Defect State across tabs, metrics, and Spark AI
  const [defects, setDefects] = useState<DefectItem[]>(INITIAL_BUGS);

  // Active Project Switcher: NSO vs HiKode
  const [activeProject, setActiveProject] = useState<ProjectKey>("nso");

  return (
    <section id="qa-sandbox" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header with Badges */}
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400">
              <Sparkles size={13} /> Interactive QA Lab
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <ShieldCheck size={13} /> Mock Environment (Sanitized Data)
            </span>
          </div>

          <div className="mt-3">
            <SectionHeading title="QA Defect & Automation Playground" />
          </div>

          <p className="text-body max-w-2xl text-sm text-muted sm:text-base mt-2">
            Hands-on QA engineering environment modeled after Kishore&apos;s real-world testing on NSO (Belgian Waffle) and HiKode. Hunt simulated defects, run automated API & Playwright test suites, and explore test case traceability.
          </p>
        </div>

        {/* 3 Main Tabs Selection */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "bug-hunt"}
            onClick={() => setActiveTab("bug-hunt")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm transition-all ${
              activeTab === "bug-hunt"
                ? "bg-primary text-white shadow-md shadow-primary/20 ring-1 ring-cyan-400/50"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <Bug size={16} /> Live Bug Hunt & Defect Board
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "test-runner"}
            onClick={() => setActiveTab("test-runner")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm transition-all ${
              activeTab === "test-runner"
                ? "bg-primary text-white shadow-md shadow-primary/20 ring-1 ring-cyan-400/50"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <Terminal size={16} /> API & Playwright Test Runner
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "test-cases"}
            onClick={() => setActiveTab("test-cases")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm transition-all ${
              activeTab === "test-cases"
                ? "bg-primary text-white shadow-md shadow-primary/20 ring-1 ring-cyan-400/50"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            }`}
          >
            <FileText size={16} /> Test Case Explorer
          </button>
        </div>

        {/* Tab 1: Live Bug Hunt & Defect Board */}
        {activeTab === "bug-hunt" && (
          <div className="mt-8 animate-fadeIn">
            <TabBugHunt
              defects={defects}
              setDefects={setDefects}
              activeProject={activeProject}
              setActiveProject={setActiveProject}
            />
          </div>
        )}

        {/* Tab 2: API & Playwright Test Runner */}
        {activeTab === "test-runner" && (
          <div className="mt-8 animate-fadeIn">
            <TabTestRunner activeProject={activeProject} />
          </div>
        )}

        {/* Tab 3: Test Case Explorer */}
        {activeTab === "test-cases" && (
          <div className="mt-8 animate-fadeIn">
            <TabTestCases activeProject={activeProject} />
          </div>
        )}

        {/* Cross-Cutting Timeline & Metrics */}
        <CrossCuttingSections defects={defects} />
      </div>
    </section>
  );
}
