"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import MagneticButton from "./MagneticButton";
import MotionReveal from "./MotionReveal";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import SocialIcons from "./SocialIcons";
import { portfolioData } from "@/data/portfolio";

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
      return "mt-1.5 w-full max-w-full px-0.5 text-[9px] leading-snug font-medium whitespace-nowrap overflow-hidden text-ellipsis text-foreground sm:mt-2 sm:text-[10px]";
    }
    if (type === "phone") {
      return "mt-1.5 w-full max-w-full px-0.5 text-[11px] leading-snug font-medium whitespace-nowrap text-foreground sm:mt-2 sm:text-sm";
    }
    if (type === "location") {
      return "mt-1.5 w-full max-w-full px-0.5 text-[10px] leading-tight font-medium text-foreground sm:mt-2 sm:text-[11px] break-words";
    }
    return "text-body mt-1.5 w-full max-w-full px-0.5 text-[11px] leading-snug font-medium break-all text-foreground sm:mt-2 sm:text-sm";
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
                <span
                  className="mb-3 text-3xl transition-transform duration-300 group-hover:scale-110 sm:text-4xl"
                  aria-hidden
                >
                  {item.emoji}
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
                  <div
                    className={cardClass}
                  >
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
