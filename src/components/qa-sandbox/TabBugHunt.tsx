"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bug,
  TestTube2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Send,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldAlert,
  Clock,
  Eye,
  CheckCircle2,
  HelpCircle,
  Plus,
} from "lucide-react";
import {
  type ProjectKey,
  type DefectItem,
  type DefectSeverity,
  type DefectPriority,
  type DefectStatus,
  PROJECTS,
  INITIAL_BUGS,
} from "@/data/qa-lab";

interface TabBugHuntProps {
  defects: DefectItem[];
  setDefects: React.Dispatch<React.SetStateAction<DefectItem[]>>;
  activeProject: ProjectKey;
  setActiveProject: (proj: ProjectKey) => void;
}

export default function TabBugHunt({
  defects,
  setDefects,
  activeProject,
  setActiveProject,
}: TabBugHuntProps) {
  // Inspector mode state
  const [inspectorMode, setInspectorMode] = useState(false);
  const [copiedLocator, setCopiedLocator] = useState<string | null>(null);
  const [hoveredLocator, setHoveredLocator] = useState<{
    locator: string;
    label: string;
    bugId?: string;
  } | null>(null);

  // Bug found celebratory toast/moment
  const [celebrationToast, setCelebrationToast] = useState<{
    bugId: string;
    title: string;
    difficulty: string;
  } | null>(null);

  // Timer & Score
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [resultCopied, setResultCopied] = useState(false);

  // Form states for custom/prefilled defect logging
  const [formBugTitle, setFormBugTitle] = useState("");
  const [formBugDesc, setFormBugDesc] = useState("");
  const [formBugModule, setFormBugModule] = useState(PROJECTS[activeProject].moduleNames[0]);
  const [formBugSeverity, setFormBugSeverity] = useState<DefectSeverity>("High");
  const [formBugPriority, setFormBugPriority] = useState<DefectPriority>("P1");
  const [formValidationMsg, setFormValidationMsg] = useState<string | null>(null);
  const [formSuccessToast, setFormSuccessToast] = useState<string | null>(null);

  // Filter for defect board
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // NSO Mock App interactive states
  const [nsoQty, setNsoQty] = useState<number>(3);
  const [nsoStock, setNsoStock] = useState<number>(48);
  const [nsoCouponApplied, setNsoCouponApplied] = useState<boolean>(true);
  const [nsoOrderCount, setNsoOrderCount] = useState<number>(0);
  const [nsoOrderMessage, setNsoOrderMessage] = useState<string | null>(null);

  // HiKode Mock App interactive states
  const [hkSearchQuery, setHkSearchQuery] = useState<string>("Automation QA");
  const [hkHasApplied, setHkHasApplied] = useState<number>(0);
  const [hkUploadedFile, setHkUploadedFile] = useState<string | null>(null);
  const [hkLoggedOut, setHkLoggedOut] = useState<boolean>(false);
  const [hkAvatarNullError, setHkAvatarNullError] = useState<boolean>(false);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Update default form module when project changes
  useEffect(() => {
    setFormBugModule(PROJECTS[activeProject].moduleNames[0]);
  }, [activeProject]);

  // Project-filtered bugs
  const projectBugs = defects.filter((b) => b.project === activeProject);
  const foundBugsCount = projectBugs.filter((b) => b.isFound).length;
  const totalProjectBugs = projectBugs.length;

  // Trigger Bug-Found moment
  const triggerBugFound = (bugId: string) => {
    const bug = defects.find((b) => b.id === bugId);
    if (!bug) return;

    // Mark as found and set status to In Progress if currently Open
    setDefects((prev) =>
      prev.map((b) =>
        b.id === bugId
          ? { ...b, isFound: true, status: b.status === "Open" ? "In Progress" : b.status }
          : b
      )
    );

    // Pre-fill the defect form
    setFormBugTitle(bug.title);
    setFormBugDesc(
      `Defect observed in module [${bug.module}]:\n\nActual Behavior: ${bug.actualBehavior}\n\nExpected: ${bug.expectedBehavior}\n\nSteps:\n${bug.stepsToReproduce.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
    );
    setFormBugModule(bug.module);
    setFormBugSeverity(bug.severity);
    setFormBugPriority(bug.priority);

    // Show celebration alert
    setCelebrationToast({
      bugId: bug.id,
      title: bug.title,
      difficulty: bug.difficulty,
    });
    setTimeout(() => setCelebrationToast(null), 4500);
  };

  // Copy locator
  const handleCopyLocator = (locatorText: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(locatorText);
    setCopiedLocator(locatorText);
    setTimeout(() => setCopiedLocator(null), 2200);
  };

  // Copy QA Score summary
  const handleCopyResult = () => {
    const text = `🎯 My QA Bug Hunt Score: Found ${foundBugsCount} of ${totalProjectBugs} defect${totalProjectBugs === 1 ? '' : 's'} in ${timerSeconds}s on ${PROJECTS[activeProject].name}! [Interactive QA Lab - Kishore Kumar Portfolio]`;
    navigator.clipboard.writeText(text);
    setResultCopied(true);
    setTimeout(() => setResultCopied(false), 2500);
  };

  // Reset timer and hunt for current project
  const handleResetHunt = () => {
    setTimerSeconds(0);
    setTimerActive(true);
    setDefects((prev) =>
      prev.map((b) => (b.project === activeProject ? { ...b, isFound: false, status: "Open" } : b))
    );
    // Reset app states
    setNsoQty(3);
    setNsoStock(48);
    setNsoOrderCount(0);
    setNsoOrderMessage(null);
    setHkHasApplied(0);
    setHkUploadedFile(null);
    setHkLoggedOut(false);
    setHkAvatarNullError(false);
  };

  // Lifecycle transition
  const handleAdvanceStatus = (bugId: string) => {
    const cycleOrder: DefectStatus[] = ["Open", "In Progress", "Fixed", "Retested", "Closed"];
    setDefects((prev) =>
      prev.map((b) => {
        if (b.id !== bugId) return b;
        const currentIdx = cycleOrder.indexOf(b.status);
        const nextStatus = currentIdx < cycleOrder.length - 1 ? cycleOrder[currentIdx + 1] : "Closed";
        return { ...b, status: nextStatus };
      })
    );
  };

  const handleResetStatus = (bugId: string) => {
    setDefects((prev) =>
      prev.map((b) => (b.id === bugId ? { ...b, status: "Open" } : b))
    );
  };

  // Ask Spark AI integration
  const handleAskSparkAi = (bug: DefectItem) => {
    const prompt = `Could you explain the root cause, defect severity rationale, and recommended Playwright test strategy for defect ${bug.id} ("${bug.title}") in the ${bug.module} module?`;
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("qa-chat-open-prompt", {
          detail: { prompt },
        })
      );
    }
  };

  // Custom Defect Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBugTitle.trim() || formBugTitle.trim().length < 5) {
      setFormValidationMsg("Defect title must be at least 5 characters.");
      return;
    }
    if (!formBugDesc.trim()) {
      setFormValidationMsg("Please provide steps or a description.");
      return;
    }

    setFormValidationMsg(null);
    const newId = `BUG-${activeProject.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newDefect: DefectItem = {
      id: newId,
      project: activeProject,
      title: formBugTitle.trim(),
      description: formBugDesc.trim(),
      module: formBugModule,
      severity: formBugSeverity,
      priority: formBugPriority,
      status: "Open",
      difficulty: "Medium",
      difficultyCategory: "UI",
      suggestedLocator: `page.getByRole('button', { name: '${formBugTitle.trim().slice(0, 15)}' })`,
      elementLabel: formBugTitle.trim(),
      stepsToReproduce: formBugDesc.split("\n").filter((l) => l.trim().length > 0),
      expectedBehavior: "Action completes without defect.",
      actualBehavior: "Unexpected behavior observed during interactive testing.",
      isFound: true,
      isCustomReported: true,
      prefilledPrompt: `How would you test and reproduce newly logged defect ${newId}: "${formBugTitle.trim()}"?`,
    };

    setDefects([newDefect, ...defects]);
    setFormBugTitle("");
    setFormBugDesc("");
    setFormSuccessToast(`✅ Defect #${newId} logged successfully to Defect Board!`);
    setTimeout(() => setFormSuccessToast(null), 3500);
  };

  // Filtered defects for board
  const displayedDefects = projectBugs.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar: Project Switcher & Stats & Inspector Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg">
        {/* Project Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider mr-1">
            Active App:
          </span>
          <button
            onClick={() => setActiveProject("nso")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeProject === "nso"
                ? "bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/40"
                : "border border-card-border bg-muted/10 text-muted hover:text-foreground"
            }`}
          >
            🧇 NSO (Belgian Waffle)
          </button>
          <button
            onClick={() => setActiveProject("hikode")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeProject === "hikode"
                ? "bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/40"
                : "border border-card-border bg-muted/10 text-muted hover:text-foreground"
            }`}
          >
            💼 HiKode (Job Platform)
          </button>
        </div>

        {/* Score, Timer, and Inspector Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Timer & Score Pill */}
          <div className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-mono font-bold text-cyan-400">
            <Clock size={13} className="shrink-0" />
            <span>
              Found <strong className="text-white">{foundBugsCount}</strong> / {totalProjectBugs} {totalProjectBugs === 1 ? 'bug' : 'bugs'} ({timerSeconds}s)
            </span>
          </div>

          <button
            onClick={handleCopyResult}
            title="Copy Bug Hunt Result to Clipboard"
            className="flex items-center gap-1.5 rounded-xl border border-card-border bg-muted/10 px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-muted/20 transition"
          >
            {resultCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span className="hidden sm:inline">{resultCopied ? "Copied!" : "Copy Result"}</span>
          </button>

          <button
            onClick={handleResetHunt}
            title="Reset Bug Hunt & Timer"
            className="flex items-center gap-1 rounded-xl border border-card-border bg-muted/10 px-2.5 py-1.5 text-xs text-muted hover:text-foreground hover:bg-muted/20 transition"
          >
            <RotateCcw size={13} />
          </button>

          {/* Inspector Toggle */}
          <button
            onClick={() => setInspectorMode(!inspectorMode)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              inspectorMode
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/30 ring-2 ring-amber-400"
                : "border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <TestTube2 size={14} />
            <span>Inspector Mode: {inspectorMode ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Inspector Mode Banner / Locator Preview */}
      {inspectorMode && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-500/50 bg-amber-500/10 p-3.5 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold text-amber-300">Inspector Active:</span>
            <span>Hover any element in the Mock Application to reveal suggested Playwright locators. Click to spot the defect!</span>
          </div>
          {hoveredLocator && (
            <div className="flex items-center gap-2 rounded-lg bg-black/80 px-2.5 py-1 font-mono text-[11px] text-cyan-300 border border-card-border shrink-0">
              <span>{hoveredLocator.locator}</span>
              <button
                onClick={(e) => handleCopyLocator(hoveredLocator.locator, e)}
                className="hover:text-white"
                title="Copy suggested locator"
              >
                {copiedLocator === hoveredLocator.locator ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Celebratory Bug-Found Moment Toast */}
      {celebrationToast && (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/80 p-4 text-emerald-200 shadow-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="font-bold text-sm text-white">
                🎯 Defect Spotted: #{celebrationToast.bugId} ({celebrationToast.difficulty} Level)
              </p>
              <p className="text-xs text-emerald-300">
                &quot;{celebrationToast.title}&quot; — Pre-filled into the Defect Log form below!
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-300">
            +1 Defect
          </span>
        </div>
      )}

      {/* Main Grid: Interactive Mock App (Left) + Defect Lifecycle Board (Right) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: INTERACTIVE MOCK APPLICATION */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-card-border bg-card overflow-hidden shadow-lg min-w-0">
          {/* Mock Browser Title Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border px-4 py-3 bg-muted/5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono text-xs text-muted truncate max-w-[200px] sm:max-w-none">
                {PROJECTS[activeProject].domainUrl}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider rounded bg-cyan-500/10 px-2 py-0.5 text-cyan-400 border border-cyan-500/20">
              Sanitized Mock Env
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-5 flex-1">
            {/* App Header Description */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border/60 pb-3">
              <div>
                <h4 className="font-heading text-base font-bold text-foreground">
                  {PROJECTS[activeProject].name}
                </h4>
                <p className="text-xs text-muted mt-0.5">{PROJECTS[activeProject].tagline}</p>
              </div>
              <span className="text-[11px] font-mono text-muted bg-muted/10 px-2.5 py-1 rounded-md self-start sm:self-auto">
                5 Defect Scenarios
              </span>
            </div>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* NSO BELGIAN WAFFLE SIMULATOR */}
            {/* ───────────────────────────────────────────────────────────── */}
            {activeProject === "nso" && (
              <div className="space-y-4">
                {/* Bug 1: Quantity allows 0 or negative */}
                <div
                  onMouseEnter={() =>
                    setHoveredLocator({
                      locator: "page.getByRole('spinbutton', { name: 'Item Quantity' })",
                      label: "Quantity Input [-2 / 0]",
                      bugId: "BUG-NSO-01",
                    })
                  }
                  onMouseLeave={() => setHoveredLocator(null)}
                  onClick={() => inspectorMode && triggerBugFound("BUG-NSO-01")}
                  className={`rounded-xl border p-3.5 transition-all ${
                    inspectorMode
                      ? "border-amber-500/60 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                      : "border-card-border bg-muted/5"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">Item: Belgian Nutella Supreme</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          ₹199.99 / unit
                        </span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        Test input validation: try setting quantity below 1 or typing negative numbers.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNsoQty((q) => q - 1);
                        }}
                        className="h-7 w-7 rounded-lg border border-card-border bg-muted/10 font-bold hover:bg-muted/20"
                        title="Decrement quantity"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={nsoQty}
                        onChange={(e) => setNsoQty(parseInt(e.target.value, 10) || 0)}
                        aria-label="Item Quantity"
                        className={`h-7 w-14 text-center rounded-lg border px-1 text-xs font-bold ${
                          nsoQty <= 0
                            ? "border-red-500/70 bg-red-500/10 text-red-400 font-extrabold"
                            : "border-card-border bg-background text-foreground"
                        }`}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNsoQty((q) => q + 1);
                        }}
                        className="h-7 w-7 rounded-lg border border-card-border bg-muted/10 font-bold hover:bg-muted/20"
                        title="Increment quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {nsoQty <= 0 && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400 border border-red-500/20">
                      <span>⚠️ BUG-NSO-01 Active: Negative/Zero quantity allowed in cart ({nsoQty})!</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerBugFound("BUG-NSO-01");
                        }}
                        className="underline text-[10px] hover:text-white"
                      >
                        Log Defect
                      </button>
                    </div>
                  )}

                  {inspectorMode && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-amber-400 font-medium">
                      <span>Playwright: <code>page.getByRole(&apos;spinbutton&apos;, &#123; name: &apos;Item Quantity&apos; &#125;)</code></span>
                      <button
                        onClick={(e) => handleCopyLocator("page.getByRole('spinbutton', { name: 'Item Quantity' })", e)}
                        className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 hover:bg-amber-500/30"
                      >
                        <Copy size={11} /> Copy
                      </button>
                    </div>
                  )}
                </div>

                {/* Bug 2: Stock does not reduce after order confirmation */}
                <div
                  onMouseEnter={() =>
                    setHoveredLocator({
                      locator: "page.getByRole('status', { name: 'Stock Count' })",
                      label: "Inventory Counter (Static 48 units)",
                      bugId: "BUG-NSO-02",
                    })
                  }
                  onMouseLeave={() => setHoveredLocator(null)}
                  onClick={() => inspectorMode && triggerBugFound("BUG-NSO-02")}
                  className={`rounded-xl border p-3.5 transition-all ${
                    inspectorMode
                      ? "border-amber-500/60 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                      : "border-card-border bg-muted/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">Depot Inventory Stock</p>
                      <p className="text-[11px] text-muted">Stock level should decrement upon order confirmation</p>
                    </div>
                    <div
                      aria-label="Stock Count"
                      role="status"
                      className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-bold text-cyan-300"
                    >
                      {nsoStock} Units In Stock
                    </div>
                  </div>
                  {nsoOrderCount > 0 && nsoStock === 48 && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
                      <span>⚠️ BUG-NSO-02 Active: Order placed ({nsoOrderCount}x), but stock remains static at 48!</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerBugFound("BUG-NSO-02");
                        }}
                        className="underline text-[10px] hover:text-white"
                      >
                        Log Defect
                      </button>
                    </div>
                  )}
                  {inspectorMode && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-amber-400 font-medium">
                      <span>Playwright: <code>page.getByRole(&apos;status&apos;, &#123; name: &apos;Stock Count&apos; &#125;)</code></span>
                      <button
                        onClick={(e) => handleCopyLocator("page.getByRole('status', { name: 'Stock Count' })", e)}
                        className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 hover:bg-amber-500/30"
                      >
                        <Copy size={11} /> Copy
                      </button>
                    </div>
                  )}
                </div>

                {/* Bug 4 & 5: Tax calculated on pre-discount amount & Cart Total Decimal Bug */}
                <div
                  onMouseEnter={() =>
                    setHoveredLocator({
                      locator: "page.getByTestId('cart-total-price')",
                      label: "Cart Total Price Calculation",
                      bugId: "BUG-NSO-05",
                    })
                  }
                  onMouseLeave={() => setHoveredLocator(null)}
                  onClick={() => inspectorMode && triggerBugFound("BUG-NSO-05")}
                  className={`rounded-xl border p-3.5 space-y-2 transition-all ${
                    inspectorMode
                      ? "border-amber-500/60 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                      : "border-card-border bg-muted/5"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Subtotal ({nsoQty} x ₹199.99):</span>
                    {/* Bug 5: integer truncation calculation */}
                    <span className="font-mono font-bold text-foreground">
                      ₹{(Math.floor(199.99) * nsoQty).toFixed(2)}
                      <span className="text-[10px] text-red-400 ml-1.5 line-through">
                        (Expected: ₹{(199.99 * nsoQty).toFixed(2)})
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted flex items-center gap-1">
                      Coupon Applied: <strong className="text-cyan-400">WAFFLE50</strong>
                    </span>
                    <span className="font-mono text-emerald-400">-₹50.00</span>
                  </div>

                  {/* Bug 4: Tax on pre-discount amount */}
                  <div
                    data-testid="tax-amount"
                    onClick={(e) => {
                      if (inspectorMode) {
                        e.stopPropagation();
                        triggerBugFound("BUG-NSO-04");
                      }
                    }}
                    className="flex items-center justify-between text-xs border-t border-card-border/50 pt-1.5"
                  >
                    <span className="text-muted">GST Tax (5%):</span>
                    <span className="font-mono font-bold text-red-400">
                      {/* BUG-NSO-04: GST calculated on pre-discount subtotal (₹597.00 x 5% = ₹29.85) instead of discounted amount (expected ₹27.50) */}
                      ₹{((Math.floor(199.99) * nsoQty) * 0.05).toFixed(2)}
                      <span className="text-[10px] text-emerald-400 ml-1.5">
                        (Expected: ₹{Math.max(0, (199.99 * nsoQty - 50) * 0.05).toFixed(2)})
                      </span>
                    </span>
                  </div>

                  {inspectorMode && (
                    <div className="flex items-center justify-between text-[11px] text-amber-400 pt-1 border-t border-amber-500/20">
                      <span>Click row to log BUG-NSO-04 (Tax on pre-discount) or BUG-NSO-05 (Decimal rounding)</span>
                    </div>
                  )}
                </div>

                {/* Bug 3: Duplicate order on double-click */}
                <div
                  onMouseEnter={() =>
                    setHoveredLocator({
                      locator: "page.getByRole('button', { name: 'Place Order' })",
                      label: "Place Order Button (Un-debounced)",
                      bugId: "BUG-NSO-03",
                    })
                  }
                  onMouseLeave={() => setHoveredLocator(null)}
                  className={`rounded-xl border p-3.5 transition-all ${
                    inspectorMode
                      ? "border-amber-500/60 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                      : "border-card-border bg-muted/5"
                  }`}
                  onClick={() => inspectorMode && triggerBugFound("BUG-NSO-03")}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-foreground">Checkout Action</p>
                      <p className="text-[11px] text-muted">Test debouncing: try clicking rapidly twice within 200ms</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNsoOrderCount((c) => c + 1);
                        setNsoOrderMessage(`Order #${Math.floor(1000 + Math.random() * 9000)} Placed!`);
                        if (nsoOrderCount >= 1) {
                          triggerBugFound("BUG-NSO-03");
                        }
                      }}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/90 active:scale-95 shadow-md shadow-primary/20 shrink-0"
                    >
                      Place Order (Submit)
                    </button>
                  </div>

                  {nsoOrderCount > 1 && (
                    <div className="mt-2.5 rounded-lg bg-red-500/10 p-2 text-[11px] font-semibold text-red-400 border border-red-500/20">
                      ⚠️ BUG-NSO-03 Triggered: Double-click detected! Placed {nsoOrderCount} duplicate orders without debounce protection.
                    </div>
                  )}

                  {inspectorMode && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-amber-400 font-medium">
                      <span>Playwright: <code>page.getByRole(&apos;button&apos;, &#123; name: &apos;Place Order&apos; &#125;)</code></span>
                      <button
                        onClick={(e) => handleCopyLocator("page.getByRole('button', { name: 'Place Order' })", e)}
                        className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 hover:bg-amber-500/30"
                      >
                        <Copy size={11} /> Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────── */}
            {/* HIKODE JOB APPLICATION PLATFORM SIMULATOR */}
            {/* ───────────────────────────────────────────────────────────── */}
            {activeProject === "hikode" && (
              <div className="space-y-4">
                {/* Bug 3: Search filter resets on back */}
                <div
                  onMouseEnter={() =>
                    setHoveredLocator({
                      locator: "page.getByPlaceholder('Search jobs by title...')",
                      label: "Job Search Query Input",
                      bugId: "BUG-HK-03",
                    })
                  }
                  onMouseLeave={() => setHoveredLocator(null)}
                  onClick={() => inspectorMode && triggerBugFound("BUG-HK-03")}
                  className={`rounded-xl border p-3.5 transition-all ${
                    inspectorMode
                      ? "border-amber-500/60 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                      : "border-card-border bg-muted/5"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-foreground block mb-1">
                        Find Open Tech Roles:
                      </label>
                      <input
                        type="text"
                        placeholder="Search jobs by title..."
                        value={hkSearchQuery}
                        onChange={(e) => setHkSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-card-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // simulate back button resetting filter
                        setHkSearchQuery("");
                        triggerBugFound("BUG-HK-03");
                      }}
                      className="rounded-lg border border-card-border bg-muted/10 px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground self-start sm:self-end shrink-0"
                    >
                      Simulate &apos;Back&apos; Navigation
                    </button>
                  </div>
                  {hkSearchQuery === "" && (
                    <p className="mt-2 text-[11px] text-amber-400">
                      ⚠️ BUG-HK-03: Filter cleared on navigation! Expected query to persist via URL parameters.
                    </p>
                  )}
                  {inspectorMode && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-amber-400 font-medium">
                      <span>Playwright: <code>page.getByPlaceholder(&apos;Search jobs by title...&apos;)</code></span>
                      <button
                        onClick={(e) => handleCopyLocator("page.getByPlaceholder('Search jobs by title...')", e)}
                        className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 hover:bg-amber-500/30"
                      >
                        <Copy size={11} /> Copy
                      </button>
                    </div>
                  )}
                </div>

                {/* Bug 1: Apply button works twice */}
                <div
                  onMouseEnter={() =>
                    setHoveredLocator({
                      locator: "page.getByRole('button', { name: 'Apply Now' })",
                      label: "Apply Now Button (Stays active)",
                      bugId: "BUG-HK-01",
                    })
                  }
                  onMouseLeave={() => setHoveredLocator(null)}
                  onClick={() => inspectorMode && triggerBugFound("BUG-HK-01")}
                  className={`rounded-xl border p-3.5 transition-all ${
                    inspectorMode
                      ? "border-amber-500/60 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                      : "border-card-border bg-muted/5"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-foreground">Role: Senior QA Automation Engineer</p>
                      <p className="text-[11px] text-muted">CloudScale Technologies • Hyderabad (Hybrid)</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHkHasApplied((n) => n + 1);
                        if (hkHasApplied >= 1) {
                          triggerBugFound("BUG-HK-01");
                        }
                      }}
                      className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary/90 shrink-0"
                    >
                      {hkHasApplied === 0 ? "Apply Now" : `Apply Now (Submitted x${hkHasApplied})`}
                    </button>
                  </div>
                  {hkHasApplied > 1 && (
                    <div className="mt-2 rounded-lg bg-red-500/10 p-2 text-[11px] font-semibold text-red-400 border border-red-500/20">
                      ⚠️ BUG-HK-01 Active: Allowed applying {hkHasApplied} times! Button should be disabled and show &apos;Applied&apos;.
                    </div>
                  )}
                  {inspectorMode && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-amber-400 font-medium">
                      <span>Playwright: <code>page.getByRole(&apos;button&apos;, &#123; name: &apos;Apply Now&apos; &#125;)</code></span>
                      <button
                        onClick={(e) => handleCopyLocator("page.getByRole('button', { name: 'Apply Now' })", e)}
                        className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 hover:bg-amber-500/30"
                      >
                        <Copy size={11} /> Copy
                      </button>
                    </div>
                  )}
                </div>

                {/* Bug 2: Resume upload accepts .exe */}
                <div
                  onMouseEnter={() =>
                    setHoveredLocator({
                      locator: "page.getByLabel('Upload Resume')",
                      label: "Resume File Dropzone",
                      bugId: "BUG-HK-02",
                    })
                  }
                  onMouseLeave={() => setHoveredLocator(null)}
                  onClick={() => inspectorMode && triggerBugFound("BUG-HK-02")}
                  className={`rounded-xl border p-3.5 transition-all ${
                    inspectorMode
                      ? "border-amber-500/60 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                      : "border-card-border bg-muted/5"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-foreground">Candidate Resume Upload</p>
                      <p className="text-[11px] text-muted">Allowed types: PDF or DOCX only</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHkUploadedFile("malicious_updater.exe");
                          triggerBugFound("BUG-HK-02");
                        }}
                        className="rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-400 hover:bg-red-500/20"
                      >
                        Upload &apos;patch.exe&apos;
                      </button>
                    </div>
                  </div>
                  {hkUploadedFile && (
                    <div className="mt-2 rounded-lg bg-red-500/15 p-2 text-[11px] font-semibold text-red-300 border border-red-500/30">
                      🚨 BUG-HK-02 Active: Uploaded &apos;{hkUploadedFile}&apos; accepted without file extension or MIME check!
                    </div>
                  )}
                  {inspectorMode && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-amber-400 font-medium">
                      <span>Playwright: <code>page.getByLabel(&apos;Upload Resume&apos;)</code></span>
                      <button
                        onClick={(e) => handleCopyLocator("page.getByLabel('Upload Resume')", e)}
                        className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 hover:bg-amber-500/30"
                      >
                        <Copy size={11} /> Copy
                      </button>
                    </div>
                  )}
                </div>

                {/* Bug 4 & 5: Logout cache leak & Remove Avatar null crash */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Remove Avatar Null Bug */}
                  <div
                    onMouseEnter={() =>
                      setHoveredLocator({
                        locator: "page.getByRole('button', { name: 'Remove Avatar' })",
                        label: "Remove Avatar Button (Null pointer)",
                        bugId: "BUG-HK-05",
                      })
                    }
                    onMouseLeave={() => setHoveredLocator(null)}
                    onClick={() => inspectorMode && triggerBugFound("BUG-HK-05")}
                    className={`rounded-xl border p-3 transition-all ${
                      inspectorMode
                        ? "border-amber-500/60 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                        : "border-card-border bg-muted/5"
                    }`}
                  >
                    <p className="text-xs font-bold text-foreground">Avatar: Default (null)</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHkAvatarNullError(true);
                        triggerBugFound("BUG-HK-05");
                      }}
                      className="mt-2 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 border border-red-500/20"
                    >
                      Remove Avatar
                    </button>
                    {hkAvatarNullError && (
                      <p className="mt-2 text-[10px] text-red-400 font-mono">
                        TypeError: Cannot read properties of null (reading &apos;url&apos;)
                      </p>
                    )}
                  </div>

                  {/* Session Logout Cache Bug */}
                  <div
                    onMouseEnter={() =>
                      setHoveredLocator({
                        locator: "page.getByRole('button', { name: 'Sign Out' })",
                        label: "Sign Out Button (Cache leak)",
                        bugId: "BUG-HK-04",
                      })
                    }
                    onMouseLeave={() => setHoveredLocator(null)}
                    onClick={() => inspectorMode && triggerBugFound("BUG-HK-04")}
                    className={`rounded-xl border p-3 transition-all ${
                      inspectorMode
                        ? "border-amber-500/60 bg-amber-500/5 cursor-pointer hover:border-amber-400"
                        : "border-card-border bg-muted/5"
                    }`}
                  >
                    <p className="text-xs font-bold text-foreground">
                      Session State: {hkLoggedOut ? "Logged Out" : "Active (CAN-5502)"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHkLoggedOut(true);
                        }}
                        className="rounded-lg border border-card-border bg-muted/10 px-2.5 py-1 text-xs text-muted hover:text-foreground"
                      >
                        Sign Out
                      </button>
                      {hkLoggedOut && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerBugFound("BUG-HK-04");
                          }}
                          className="rounded-lg bg-amber-500/20 px-2 py-1 text-[10px] font-bold text-amber-300"
                        >
                          Hit &apos;Back&apos;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Defect Form */}
            <form onSubmit={handleFormSubmit} className="pt-4 border-t border-card-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Plus size={14} className="text-cyan-400" /> Log Defect to Board
                </span>
                <span className="text-[10px] text-muted">Prefilled when clicking bug elements</span>
              </div>

              {formValidationMsg && (
                <div className="rounded-lg bg-red-500/10 p-2 text-xs text-red-400 border border-red-500/20">
                  {formValidationMsg}
                </div>
              )}

              {formSuccessToast && (
                <div className="rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-400 border border-emerald-500/20">
                  {formSuccessToast}
                </div>
              )}

              <input
                type="text"
                placeholder="Defect Title (e.g. Quantity accepts negative integers)"
                value={formBugTitle}
                onChange={(e) => setFormBugTitle(e.target.value)}
                className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-cyan-500"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={formBugModule}
                  onChange={(e) => setFormBugModule(e.target.value)}
                  className="rounded-xl border border-card-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-cyan-500"
                >
                  {PROJECTS[activeProject].moduleNames.map((mod) => (
                    <option key={mod} value={mod}>
                      Module: {mod}
                    </option>
                  ))}
                </select>

                <select
                  value={formBugSeverity}
                  onChange={(e) => setFormBugSeverity(e.target.value as DefectSeverity)}
                  className="rounded-xl border border-card-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-cyan-500"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={formBugPriority}
                  onChange={(e) => setFormBugPriority(e.target.value as DefectPriority)}
                  className="rounded-xl border border-card-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-cyan-500"
                >
                  <option value="P1">Priority: P1 (Blocker)</option>
                  <option value="P2">Priority: P2 (Major)</option>
                  <option value="P3">Priority: P3 (Minor)</option>
                </select>
              </div>

              <textarea
                rows={2}
                placeholder="Steps to reproduce, expected vs actual behavior..."
                value={formBugDesc}
                onChange={(e) => setFormBugDesc(e.target.value)}
                className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-cyan-500"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-cyan-500"
              >
                <Send size={13} /> Save Defect to QA Board
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: DEFECT BOARD & LIFECYCLE */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-card-border bg-card p-4 sm:p-5 shadow-lg min-w-0">
          {/* Defect Board Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-cyan-400" />
              <h4 className="font-heading text-sm sm:text-base font-bold text-foreground">
                Defect Lifecycle Board
              </h4>
            </div>
            <span className="text-xs font-mono font-semibold text-muted bg-muted/10 px-2 py-0.5 rounded-md">
              {displayedDefects.length} Issues
            </span>
          </div>

          {/* Status Filter Buttons */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["ALL", "Open", "In Progress", "Fixed", "Retested", "Closed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  statusFilter === st
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-muted/10 text-muted hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Defect Cards List */}
          <div className="mt-3 flex-1 space-y-3 overflow-y-auto max-h-[560px] pr-1">
            {displayedDefects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-card-border p-6 text-center text-xs text-muted">
                No defects matching status &apos;{statusFilter}&apos;.
              </div>
            ) : (
              displayedDefects.map((bug) => {
                // Color badges
                const severityColors = {
                  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
                  High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
                  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                  Low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                };

                const statusColors: Record<DefectStatus, string> = {
                  Open: "bg-red-500/10 text-red-400 border-red-500/30",
                  "In Progress": "bg-amber-500/10 text-amber-400 border-amber-500/30",
                  Fixed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
                  Retested: "bg-purple-500/10 text-purple-400 border-purple-500/30",
                  Closed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                };

                const difficultyBadge = {
                  Easy: "bg-emerald-500/15 text-emerald-300",
                  Medium: "bg-yellow-500/15 text-yellow-300",
                  Hard: "bg-rose-500/15 text-rose-300",
                }[bug.difficulty];

                return (
                  <div
                    key={bug.id}
                    className={`rounded-xl border p-3.5 transition-all space-y-2.5 ${
                      bug.isFound
                        ? "border-cyan-500/40 bg-cyan-950/20 shadow-sm"
                        : "border-card-border bg-muted/5 opacity-85"
                    }`}
                  >
                    {/* Top Row: Bug ID, Priority, Severity, Difficulty */}
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-cyan-400">{bug.id}</span>
                        <span className="text-[10px] font-mono text-muted bg-muted/10 px-1.5 py-0.5 rounded">
                          {bug.priority}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${severityColors[bug.severity]}`}>
                          {bug.severity}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyBadge}`}>
                        {bug.difficulty} ({bug.difficultyCategory})
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <p className="text-xs font-bold text-foreground leading-snug">{bug.title}</p>
                      <p className="text-[11px] text-muted line-clamp-2 mt-0.5">{bug.description}</p>
                    </div>

                    {/* Module & Lifecycle Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-card-border/40 pt-2 text-[11px]">
                      <span className="text-muted">Module: <strong className="text-foreground">{bug.module}</strong></span>
                      <span className={`rounded-md border px-2 py-0.5 font-bold text-[10px] ${statusColors[bug.status]}`}>
                        ● {bug.status}
                      </span>
                    </div>

                    {/* Action buttons: Advance Lifecycle & Ask Spark AI */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-card-border/30">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAdvanceStatus(bug.id)}
                          className="flex items-center gap-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2 py-1 text-[11px] font-semibold transition"
                          title="Advance through Open -> In Progress -> Fixed -> Retested -> Closed"
                        >
                          <span>Advance</span>
                          <ArrowRight size={11} />
                        </button>
                        {bug.status !== "Open" && (
                          <button
                            onClick={() => handleResetStatus(bug.id)}
                            className="rounded-lg bg-muted/10 hover:bg-muted/20 text-muted hover:text-foreground px-2 py-1 text-[10px] transition"
                            title="Reset status to Open"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                    <div className="flex flex-col items-end gap-0.5">
                      <button
                        onClick={() => handleAskSparkAi(bug)}
                        title="Ask Spark AI for root cause, severity rationale, and test strategy for this defect"
                        className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/20 transition"
                      >
                        <Sparkles size={11} /> Ask Spark AI
                      </button>
                      <span className="text-[9px] text-muted">Explains root cause &amp; test strategy</span>
                    </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
