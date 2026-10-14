"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import MagneticButton from "./MagneticButton";
import MotionReveal from "./MotionReveal";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import SocialIcons from "./SocialIcons";
import { portfolioData } from "@/data/portfolio";

/** Official GitHub mark SVG */
function GitHubCardIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-foreground transition-transform duration-300 group-hover:scale-110"
      aria-hidden
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/** iPhone outline SVG */
function IPhoneCardIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-foreground transition-transform duration-300 group-hover:scale-110"
      aria-hidden
    >
      <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="9" y1="5" x2="15" y2="5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Contact() {
  const { contact, social } = portfolioData;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(social.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const cardClass =
    "contact-card group flex h-full min-h-[140px] w-full min-w-0 flex-col items-center justify-center rounded-2xl border border-card-border bg-card p-3.5 text-center sm:min-h-[180px] sm:p-5";

  const valueClass = (type: string) => {
    if (type === "email") {
      return "mt-1.5 w-full max-w-full px-0.5 text-[9px] leading-snug font-medium whitespace-nowrap text-foreground sm:mt-2 sm:text-[10px]";
    }
    if (type === "phone") {
      return "mt-1.5 w-full max-w-full px-0.5 text-[11px] leading-snug font-medium whitespace-nowrap text-foreground sm:mt-2 sm:text-sm";
    }
    if (type === "location") {
      return "mt-1.5 w-full max-w-full px-0.5 text-[10px] leading-tight font-medium text-foreground sm:mt-2 sm:text-[11px] break-words";
    }
    return "text-body mt-1.5 w-full max-w-full px-0.5 text-[11px] leading-snug font-medium break-all text-foreground sm:mt-2 sm:text-sm";
  };

  /** Render the card icon — SVG for github/phone, emoji for others */
  const renderIcon = (type: string, emoji: string) => {
    if (type === "github") return <GitHubCardIcon />;
    if (type === "phone") return <IPhoneCardIcon />;
    return (
      <span
        className="text-3xl transition-transform duration-300 group-hover:scale-110 sm:text-4xl"
        aria-hidden
      >
        {emoji}
      </span>
    );
  };

  return (
    <section id="contact" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title={contact.sectionTitle}
          subtitle={contact.subtitle}
        />

        <MotionStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 [&>*]:min-w-0">
          {contact.items.map((item) => {
            const content = (
              <>
                <span className="contact-card-edge" aria-hidden />
                <span className="mb-3 flex items-center justify-center">
                  {renderIcon(item.type, item.emoji)}
                </span>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase transition-colors duration-300 group-hover:text-primary-light">
                  {item.label}
                </p>
                <p className={valueClass(item.type)}>{item.value}</p>
              </>
            );

            return (
              <MotionItem
                key={item.label}
                variant="fadeUp"
                className="h-full"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={
                      item.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={cardClass}>
                    {content}
                  </div>
                )}
              </MotionItem>
            );
          })}
        </MotionStagger>

        <MotionReveal variant="fadeUp" className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton
            type="button"
            onClick={copyEmail}
            className="contact-glow w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-8 py-3.5 text-sm font-semibold text-primary transition-all sm:w-auto sm:px-10"
          >
            {copied ? (
              <>
                <Check size={18} />
                {contact.copyEmailSuccess}
              </>
            ) : (
              <>
                <Copy size={18} />
                {contact.copyEmailLabel}
              </>
            )}
          </MagneticButton>

          <MagneticButton
            as="a"
            href={`mailto:${social.email}`}
            className="w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
          >
            <Mail size={18} />
            {contact.emailCta}
          </MagneticButton>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.1} className="mt-12">
          <SocialIcons size="sm" />
        </MotionReveal>
      </div>
    </section>
  );
}
