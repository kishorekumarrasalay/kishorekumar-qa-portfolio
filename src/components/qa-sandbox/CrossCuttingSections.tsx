"use client";

import React, { useState } from "react";
import {
  Clock,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck,
} from "lucide-react";
import {
  type DefectItem,
  QA_TIMELINE_STAGES,
  MODULE_COVERAGE_DATA,
  INITIAL_BUGS,
} from "@/data/qa-lab";

interface CrossCuttingSectionsProps {
  defects: DefectItem[];
}

export default function CrossCuttingSections({ defects }: CrossCuttingSectionsProps) {
  const [selectedTimelineStep, setSelectedTimelineStep] = useState(1);

  // Compute metrics dynamically from the 5 bugs in /data/qa-lab.ts (or active defect state)
  const bugList = defects && defects.length > 0 ? defects : INITIAL_BUGS;
  const totalDefects = bugList.length;
  const criticalCount = bugList.filter((d) => d.severity === "Critical").length;
  const highCount = bugList.filter((d) => d.severity === "High").length;
  const mediumCount = bugList.filter((d) => d.severity === "Medium").length;
  const lowCount = bugList.filter((d) => d.severity === "Low").length;

  const resolvedOrClosed = bugList.filter(
    (d) => d.status === "Fixed" || d.status === "Retested" || d.status === "Closed"
  ).length;

  // Module bug counts
  const moduleCounts: Record<string, number> = {};
  bugList.forEach((d) => {
    moduleCounts[d.module] = (moduleCounts[d.module] || 0) + 1;
  });

  const activeStage =
    QA_TIMELINE_STAGES.find((s) => s.step === selectedTimelineStep) || QA_TIMELINE_STAGES[0];

  return (
    <div className="space-y-8 mt-12 pt-8 border-t border-card-border/60">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. "DAY IN THE LIFE OF KISHORE" QA TIMELINE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-cyan-400" />
              <h4 className="font-heading text-base sm:text-lg font-bold text-foreground">
                A Day in My QA Workflow
              </h4>
            </div>
            <p className="text-xs text-muted mt-0.5">
              The rigorous 6-stage testing cycle applied across sprint deliverables from PRD grooming to production sign-off.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20 self-start sm:self-auto">
            Interactive Lifecycle
          </span>
        </div>

        {/* Timeline Horizontal Step Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {QA_TIMELINE_STAGES.map((stage) => {
            const isSelected = selectedTimelineStep === stage.step;

            return (
              <button
                key={stage.step}
                onClick={() => setSelectedTimelineStep(stage.step)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-md ring-1 ring-cyan-500"
                    : "border-card-border bg-muted/5 text-muted hover:border-card-border/80 hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-mono font-bold text-muted">0{stage.step}</span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <span className="font-bold text-xs truncate w-full">{stage.stage}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        <div className="rounded-xl border border-card-border bg-muted/5 p-4 sm:p-5 grid gap-4 md:grid-cols-12 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-cyan-400">
                Phase {activeStage.step}: {activeStage.stage}
              </span>
              <span className="text-xs text-muted font-medium">• {activeStage.subtitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {activeStage.description}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-muted">
              <span className="font-semibold text-foreground">Key Deliverable:</span>
              <span>{activeStage.deliverables}</span>
            </div>
          </div>

          <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-card-border/60 pt-3 md:pt-0 md:pl-5 space-y-2">
            {/* Tools displayed: only confirmed tools used (Google Sheets, Postman). Removed: Jira, Confluence, Notion, Loom, Slack */}
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
              Tools Used:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeStage.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg bg-card border border-card-border px-2.5 py-1 text-[11px] font-semibold text-cyan-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. LIVE QA METRICS DASHBOARD */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-card-border bg-card p-4 sm:p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-cyan-400" />
              <h4 className="font-heading text-base sm:text-lg font-bold text-foreground">
                QA Quality & Defect Distribution Metrics
              </h4>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Live computed aggregations reflecting defect triage status, severity distribution, and module stability.
            </p>
          </div>
          <span className="text-[10px] font-mono text-muted bg-muted/10 px-2.5 py-1 rounded-md self-start sm:self-auto">
            Synchronized with /data/qa-lab.ts
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Metric Card 1: Bugs by Severity */}
          <div className="rounded-xl border border-card-border bg-muted/5 p-4 space-y-3">
            <span className="text-xs font-bold text-foreground block">Defects by Severity</span>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-red-400 font-semibold">Critical</span>
                  <span className="font-mono text-muted">{criticalCount}</span>
                </div>
                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${totalDefects ? (criticalCount / totalDefects) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-orange-400 font-semibold">High</span>
                  <span className="font-mono text-muted">{highCount}</span>
                </div>
                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${totalDefects ? (highCount / totalDefects) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-yellow-400 font-semibold">Medium</span>
                  <span className="font-mono text-muted">{mediumCount}</span>
                </div>
                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${totalDefects ? (mediumCount / totalDefects) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-blue-400 font-semibold">Low</span>
                  <span className="font-mono text-muted">{lowCount}</span>
                </div>
                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${totalDefects ? (lowCount / totalDefects) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metric Card 2: Bugs by Module */}
          <div className="rounded-xl border border-card-border bg-muted/5 p-4 space-y-3">
            <span className="text-xs font-bold text-foreground block">Defects by Feature Module</span>
            <div className="space-y-2 text-xs">
              {Object.entries(moduleCounts).slice(0, 4).map(([mod, count]) => (
                <div key={mod}>
                  <div className="flex justify-between mb-1">
                    <span className="text-foreground truncate max-w-[160px]">{mod}</span>
                    <span className="font-mono text-cyan-400">{count} {count === 1 ? "bug" : "bugs"}</span>
                  </div>
                  <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${(count / totalDefects) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metric Card 3: Sprint Pass Rate & Health Gauge */}
          <div className="rounded-xl border border-card-border bg-muted/5 p-4 flex flex-col justify-between space-y-3">
            <span className="text-xs font-bold text-foreground block">Defect Resolution Health</span>

            <div className="flex flex-col items-center justify-center py-2 text-center">
              <span className="font-heading text-3xl font-extrabold text-cyan-400">
                {Math.round((resolvedOrClosed / (totalDefects || 1)) * 100)}%
              </span>
              <span className="text-xs text-muted mt-1">Lifecycle Completion Rate</span>
              <span className="text-[11px] font-mono text-emerald-400 mt-0.5">
                {resolvedOrClosed} of {totalDefects} defects triaged/retested
              </span>
            </div>

            </div>
        </div>
      </div>
    </div>
  );
}
