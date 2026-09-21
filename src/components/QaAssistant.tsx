"use client";

import { Send, X, Volume2, VolumeX, Copy, Check, ThumbsUp, Code, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  getAssistantReply,
  getOutroMessage,
  getWelcomeMessage,
  SUGGESTIONS,
  type QaMessage,
} from "@/lib/qaAssistant";

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

function TypedText({
  text,
  onUpdate,
  onDone,
}: {
  text: string;
  onUpdate?: () => void;
  onDone?: () => void;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setCount(text.length);
      onUpdate?.();
      onDone?.();
      return;
    }

    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setCount(Math.min(i, text.length));
      onUpdate?.();
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, 12);
    return () => clearInterval(id);
  }, [text]);

  return <>{text.slice(0, count)}</>;
}

export default function QaAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<QaMessage[]>([getWelcomeMessage()]);
  const [typing, setTyping] = useState(false);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set(["welcome"]));
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [likedMsgIds, setLikedMsgIds] = useState<Set<string>>(new Set());

  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // Web Speech API text to speech
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const openChat = () => {
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
    setDoneIds(new Set([welcome.id]));
    setInput("");
    setTyping(false);
    setOpen(true);
    window.dispatchEvent(new CustomEvent("qa-chat-open"));
  };

  const closeChat = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("qa-chat-close"));
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, typing]);

  useEffect(() => {
    const onClose = () => setOpen(false);
    window.addEventListener("qa-chat-close", onClose);
    return () => window.removeEventListener("qa-chat-close", onClose);
  }, []);

  // Lock body scroll on mobile when chat overlay is open
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

  const markDone = (id: string, textToSpeak?: string) => {
    setDoneIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (textToSpeak) speakText(textToSpeak);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const toggleLikeMessage = (id: string) => {
    setLikedMsgIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .filter((m) => m.id !== "welcome" && !m.id.startsWith("outro"))
      .slice(-8)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.text,
      }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
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
      {/* OPEN CHATBOT MODAL OVERLAY — CHATGPT / GEMINI MOBILE UX */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-card text-foreground sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(580px,calc(100vh-5rem))] sm:w-[380px] sm:rounded-2xl sm:border sm:border-card-border sm:shadow-2xl overflow-hidden">
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

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  ttsEnabled ? "bg-primary/20 text-primary-light" : "text-muted hover:bg-muted/10 hover:text-foreground"
                }`}
                title={ttsEnabled ? "Voice Speech ON" : "Voice Speech OFF"}
              >
                {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
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

          {/* Messages Feed */}
          <div
            ref={listRef}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 py-4 space-y-4"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isDone = doneIds.has(msg.id);
              const isLiked = likedMsgIds.has(msg.id);

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && <QaLogo size={28} />}
                  <div
                    className={`max-w-[85%] sm:max-w-[88%] min-w-0 rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-line shadow-sm ${
                      isUser
                        ? "bg-primary text-white font-medium"
                        : "border border-card-border bg-card text-foreground"
                    }`}
                  >
                    {isUser ? (
                      msg.text
                    ) : msg.live ? (
                      msg.text
                    ) : (
                      <TypedText
                        text={msg.text}
                        onUpdate={scrollToBottom}
                        onDone={() => markDone(msg.id, msg.text)}
                      />
                    )}

                    {/* Code Snippet Box */}
                    {!isUser && isDone && msg.codeSnippet && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-card-border bg-black/90 p-3 font-mono text-[11px] text-emerald-400">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 text-[10px] text-muted">
                          <span className="flex items-center gap-1 font-semibold"><Code size={12} /> Playwright / API Spec</span>
                          <button
                            onClick={() => copyToClipboard(msg.codeSnippet!, msg.id)}
                            className="flex items-center gap-1 rounded px-2 py-0.5 bg-white/10 text-white hover:bg-white/20 transition text-[10px]"
                          >
                            {copiedCodeId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                            {copiedCodeId === msg.id ? "Copied" : "Copy Code"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {msg.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Project Cards */}
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
                              target={card.href.startsWith("http") ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="mt-2.5 inline-flex text-[11px] font-semibold text-primary-light hover:underline"
                            >
                              {card.hrefLabel} →
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    {!isUser && isDone && msg.links && msg.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {msg.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            download={link.download ? true : undefined}
                            onClick={() => {
                              if (link.href.startsWith("#")) {
                                window.dispatchEvent(new CustomEvent("qa-chat-close"));
                              }
                            }}
                            className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary-light transition hover:bg-primary/20"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Interactive Like & Copy */}
                    {!isUser && isDone && (
                      <div className="mt-2.5 flex items-center justify-end gap-2 border-t border-card-border/30 pt-1.5 text-[10px] text-muted">
                        <button
                          onClick={() => toggleLikeMessage(msg.id)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition ${
                            isLiked ? "text-primary-light bg-primary/10 font-bold" : "hover:text-foreground"
                          }`}
                        >
                          <ThumbsUp size={11} /> {isLiked ? "Helpful" : ""}
                        </button>
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:text-foreground transition"
                        >
                          {copiedCodeId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex items-start gap-2.5">
                <QaLogo size={28} />
                <div className="rounded-2xl border border-card-border bg-card px-4 py-3 shadow-sm">
                  <span className="qa-typing-dots inline-flex gap-1">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ChatGPT / Gemini Style Bottom Prompt Capsule Bar */}
          <div className="shrink-0 p-3 sm:p-4 border-t border-card-border/60 bg-card space-y-2.5">
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => sendMessage(s.query)}
                  className="shrink-0 rounded-full border border-card-border bg-background px-3 py-1 text-[11px] font-semibold text-muted transition hover:border-primary/50 hover:text-primary-light hover:bg-primary/5"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="relative flex items-center rounded-2xl border border-card-border bg-background px-3.5 py-1.5 shadow-sm focus-within:border-primary/70 transition"
            >
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="send"
                name="qa-assistant-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setTimeout(scrollToBottom, 150)}
                placeholder="Ask about Kishore's resume..."
                className="flex-1 bg-transparent py-1.5 pr-2 text-xs sm:text-sm text-foreground outline-none placeholder:text-muted"
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

      {/* FAB Floating Launcher */}
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
