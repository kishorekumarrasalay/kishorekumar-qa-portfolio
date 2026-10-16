"use client";

import {
  Send,
  X,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Code,
  Sparkles,
  Mic,
  MicOff,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  getAssistantReply,
  getOutroMessage,
  getWelcomeMessage,
  SUGGESTIONS,
  type QaMessage,
} from "@/lib/qaAssistant";

// ── Types ────────────────────────────────────────────────────────────────────

interface FeedbackState {
  [msgId: string]: "up" | "down" | null;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function QaLogo({
  size = 32,
  variant = "default",
}: {
  size?: number;
  variant?: "default" | "fab";
}) {
  return (
    <span
      className={`qa-logo relative shrink-0 overflow-hidden rounded-full ${
        variant === "fab" ? "qa-logo-fab w-full h-full block" : "qa-logo-inline"
      }`}
      style={
        variant === "fab"
          ? { width: "100%", height: "100%" }
          : { width: size, height: size, minWidth: size, minHeight: size }
      }
    >
      <Image
        src="/qa-assistant-logo.png?v=2"
        alt="Spark AI"
        fill
        className="qa-logo-img"
        unoptimized
        sizes={
          variant === "fab"
            ? "(max-width: 640px) 56px, (max-width: 768px) 64px, 72px"
            : `${size}px`
        }
        priority={variant === "fab"}
      />
    </span>
  );
}

function TypingDots() {
  return (
    <div className="flex items-start gap-2.5">
      <QaLogo size={28} />
      <div className="rounded-2xl border border-card-border bg-card px-4 py-3 shadow-sm">
        <span className="qa-typing-dots inline-flex gap-1">
          <span />
          <span />
          <span />
        </span>
        <span className="ml-2 text-[10px] text-muted">Spark AI is typing…</span>
      </div>
    </div>
  );
}

/** Lead capture form shown after 3 user messages */
function LeadForm({ onDismiss }: { onDismiss: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErr("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setErr(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("ok");
      }
    } catch {
      setErr("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className="mx-auto max-w-[88%] rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">
        ✅ Thanks! Kishore will get back to you soon.{" "}
        <button onClick={onDismiss} className="ml-2 underline opacity-70">
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-foreground">
          💌 Want to share your details with Kishore?
        </p>
        <button
          onClick={onDismiss}
          className="text-muted hover:text-foreground"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
      <form onSubmit={submit} className="space-y-2">
        <input
          required
          maxLength={100}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted outline-none focus:border-primary/60"
        />
        <input
          required
          type="email"
          maxLength={200}
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted outline-none focus:border-primary/60"
        />
        <textarea
          required
          maxLength={500}
          rows={2}
          placeholder="Brief message or opportunity..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted outline-none focus:border-primary/60 resize-none"
        />
        {err && <p className="text-[10px] text-red-400">{err}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "Sending…" : "Send"}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}

/** Toast notification */
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-lg z-10 whitespace-nowrap">
      {msg}
    </div>
  );
}



// ── Main Component ───────────────────────────────────────────────────────────

export default function QaAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<QaMessage[]>([getWelcomeMessage()]);
  const [typing, setTyping] = useState(false);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set(["welcome"]));
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({});
  const [toast, setToast] = useState<string | null>(null);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (
        !ttsEnabled ||
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      )
        return;
      window.speechSynthesis.cancel();
      const clean = text.replace(
        /[\u{1F600}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,
        ""
      );
      const utt = new SpeechSynthesisUtterance(clean);
      utt.rate = 1.0;
      utt.pitch = 1.0;
      window.speechSynthesis.speak(utt);
    },
    [ttsEnabled]
  );

  const openChat = () => {
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
    setDoneIds(new Set([welcome.id]));
    setInput("");
    setTyping(false);
    setUserMsgCount(0);
    setShowLeadForm(false);
    setOpen(true);
    window.dispatchEvent(new CustomEvent("qa-chat-open"));
  };

  const closeChat = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("qa-chat-close"));
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, typing, scrollToBottom]);

  useEffect(() => {
    const onClose = () => setOpen(false);
    const onOpenPrompt = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string }>;
      setOpen(true);
      if (customEvent.detail?.prompt) {
        setInput(customEvent.detail.prompt);
      }
    };
    window.addEventListener("qa-chat-close", onClose);
    window.addEventListener("qa-chat-open-prompt", onOpenPrompt);
    return () => {
      window.removeEventListener("qa-chat-close", onClose);
      window.removeEventListener("qa-chat-open-prompt", onOpenPrompt);
    };
  }, []);

  // Lock body scroll on mobile
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [open]);

  const markDone = useCallback(
    (id: string, textToSpeak?: string) => {
      setDoneIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      if (textToSpeak) speakText(textToSpeak);
    },
    [speakText]
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveFeedback = async (msgId: string, vote: "up" | "down") => {
    const prev = feedback[msgId];
    if (prev === vote) return; // already voted
    setFeedback((f) => ({ ...f, [msgId]: vote }));
    setToast(vote === "up" ? "👍 Marked as helpful!" : "👎 Thanks for the feedback!");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msgId, vote }),
      });
    } catch {
      // silent — feedback is best-effort
    }
  };

  // Speech-to-text toggle
  const toggleListening = () => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: (new () => { lang: string; continuous: boolean; interimResults: boolean; onresult: ((e: { results: { [n: number]: { [n: number]: { transcript: string } } } }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void }) | undefined =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setToast("Speech recognition not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      setInput((prev) => prev + transcript);
      setIsListening(false);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: QaMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    markDone(userMsg.id);
    setInput("");
    setTyping(true);

    // Lead form trigger after 3 user messages
    const newCount = userMsgCount + 1;
    setUserMsgCount(newCount);
    if (newCount === 3 && !leadDismissed) {
      setTimeout(() => setShowLeadForm(true), 1500);
    }

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .filter((m) => m.id !== "welcome" && !m.id.startsWith("outro"))
      .slice(-8)
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      });

      if (res.ok && res.body) {
        const replyId = crypto.randomUUID();
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: replyId, role: "assistant", text: "", live: true },
        ]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === replyId ? { ...m, text: full } : m))
          );
          scrollToBottom();
        }

        markDone(replyId, full);
        setMessages((prev) => [...prev, getOutroMessage()]);
        return;
      }
    } catch {
      // fall through to local reply
    }

    window.setTimeout(() => {
      const replyMsg = getAssistantReply(trimmed);
      setTyping(false);
      setMessages((prev) => [...prev, replyMsg]);
      const typingDuration = Math.min(replyMsg.text.length * 6, 3500) + 500;
      window.setTimeout(() => {
        setMessages((prev) => [...prev, getOutroMessage()]);
      }, typingDuration);
    }, 350);
  };

  return (
    <>
      {/* ── CHAT WINDOW ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-card text-foreground sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(640px,calc(100vh-5rem))] sm:w-[400px] sm:rounded-2xl sm:border sm:border-card-border sm:shadow-2xl overflow-hidden">
          {/* Header */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-card-border/60 bg-card px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="relative shrink-0">
                <QaLogo size={34} />
                <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-400" />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-heading text-sm font-bold text-foreground">
                    Spark AI
                  </p>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary-light uppercase tracking-wider">
                    AI QA
                  </span>
                </div>
                <p className="text-[10px] text-muted">Online</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* TTS toggle */}
              <button
                type="button"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  ttsEnabled
                    ? "bg-primary/20 text-primary-light"
                    : "text-muted hover:bg-muted/10 hover:text-foreground"
                }`}
                title={ttsEnabled ? "Voice ON" : "Voice OFF"}
              >
                {ttsEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={closeChat}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-muted/10 hover:text-foreground transition"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Messages feed */}
          <div
            ref={listRef}
            className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 py-4 space-y-4"
          >
            {toast && (
              <Toast msg={toast} onClose={() => setToast(null)} />
            )}

            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isDone = doneIds.has(msg.id);
              const msgFeedback = feedback[msg.id];

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && <QaLogo size={28} />}
                  <div
                    className={`max-w-[85%] sm:max-w-[88%] min-w-0 rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-line shadow-sm ${
                      isUser
                        ? "bg-primary text-white font-medium"
                        : "border border-card-border bg-card text-foreground"
                    }`}
                  >
                    {msg.text}

                    {/* Code snippet */}
                    {!isUser && isDone && msg.codeSnippet && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-card-border bg-black/90 p-3 font-mono text-[11px] text-emerald-400">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 text-[10px] text-muted">
                          <span className="flex items-center gap-1 font-semibold">
                            <Code size={12} /> Playwright / API Spec
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(msg.codeSnippet!, `code-${msg.id}`)
                            }
                            className="flex items-center gap-1 rounded px-2 py-0.5 bg-white/10 text-white hover:bg-white/20 transition text-[10px]"
                          >
                            {copiedId === `code-${msg.id}` ? (
                              <Check size={11} />
                            ) : (
                              <Copy size={11} />
                            )}
                            {copiedId === `code-${msg.id}` ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {msg.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Project cards */}
                    {!isUser && isDone && msg.cards && msg.cards.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.cards.map((card) => (
                          <div
                            key={card.title}
                            className="rounded-xl border border-card-border bg-muted/10 p-3"
                          >
                            <p className="font-heading text-xs font-bold text-foreground">
                              {card.title}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {card.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary-light"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <a
                              href={card.href}
                              target={
                                card.href.startsWith("http") ? "_blank" : undefined
                              }
                              rel="noopener noreferrer"
                              className="mt-2.5 inline-flex text-[11px] font-semibold text-primary-light hover:underline"
                            >
                              {card.hrefLabel} →
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action links */}
                    {!isUser && isDone && msg.links && msg.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {msg.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target={
                              link.href.startsWith("http") ? "_blank" : undefined
                            }
                            rel="noopener noreferrer"
                            download={link.download ? true : undefined}
                            onClick={() => {
                              if (link.href.startsWith("#")) {
                                window.dispatchEvent(
                                  new CustomEvent("qa-chat-close")
                                );
                              }
                            }}
                            className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary-light transition hover:bg-primary/20"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Feedback + copy row */}
                    {!isUser && isDone && (
                      <div className="mt-2.5 flex items-center justify-end gap-1.5 border-t border-card-border/30 pt-1.5 text-[10px] text-muted">
                        <button
                          onClick={() => saveFeedback(msg.id, "up")}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${
                            msgFeedback === "up"
                              ? "text-primary-light bg-primary/10 font-bold"
                              : "hover:text-foreground"
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp size={11} />
                        </button>
                        <button
                          onClick={() => saveFeedback(msg.id, "down")}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${
                            msgFeedback === "down"
                              ? "text-red-400 bg-red-400/10 font-bold"
                              : "hover:text-foreground"
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown size={11} />
                        </button>
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:text-foreground transition"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check size={11} />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {typing && <TypingDots />}

            {/* Lead capture form */}
            {showLeadForm && !leadDismissed && (
              <LeadForm
                onDismiss={() => {
                  setShowLeadForm(false);
                  setLeadDismissed(true);
                }}
              />
            )}
          </div>

          {/* Bottom: chips + input */}
          <div className="shrink-0 border-t border-card-border/60 bg-card">
            {/* Suggestion chips — 2 wrapped rows */}
            <div className="flex flex-wrap gap-1.5 px-3 pt-2.5 pb-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => sendMessage(s.query)}
                  className="rounded-full border border-card-border bg-background px-2.5 py-1 text-[10px] font-semibold text-muted transition hover:border-primary/50 hover:text-primary-light hover:bg-primary/5"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="relative flex items-center gap-1.5 rounded-2xl border border-card-border bg-background mx-3 mb-3 mt-1.5 px-3 py-1.5 shadow-sm focus-within:border-primary/70 transition"
            >
              {/* Speech-to-text */}
              <button
                type="button"
                onClick={toggleListening}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                  isListening
                    ? "bg-red-500/20 text-red-400 animate-pulse"
                    : "text-muted hover:text-foreground"
                }`}
                title={isListening ? "Stop recording" : "Voice input"}
                aria-label="Voice input"
              >
                {isListening ? <MicOff size={13} /> : <Mic size={13} />}
              </button>

              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="send"
                name="qa-assistant-input"
                maxLength={1200}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setTimeout(scrollToBottom, 150)}
                placeholder="Ask about Kishore's portfolio, skills, projects…"
                className="flex-1 bg-transparent py-1 pr-1 text-xs sm:text-sm text-foreground outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:opacity-90 disabled:opacity-30"
                aria-label="Send prompt"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── FAB LAUNCHER ── */}
      {!open && (
        <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
          <div className="qa-assistant-fab-wrap ml-auto">
            <span className="qa-assistant-wave qa-assistant-wave-1" aria-hidden />
            <span className="qa-assistant-wave qa-assistant-wave-2" aria-hidden />
            <span className="qa-assistant-wave qa-assistant-wave-3" aria-hidden />
            <button
              type="button"
              onClick={openChat}
              className="qa-assistant-fab qa-assistant-fab-intro group relative flex h-14 w-14 items-center justify-center overflow-visible rounded-full border-0 bg-transparent p-0 shadow-none sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]"
              aria-label="Open QA Assistant"
            >
              <QaLogo size={72} variant="fab" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
