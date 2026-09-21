"use client";

import {
  Code2,
  FileText,
  GraduationCap,
  Network,
  Settings,
  Wrench,
} from "lucide-react";
import FloatingCard from "./FloatingCard";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import { portfolioData } from "@/data/portfolio";

const iconMap = {
  testing: FileText,
  languages: Code2,
  api: Network,
  tools: Wrench,
  automation: Settings,
  learning: GraduationCap,
} as const;

export default function Skills() {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={skills.sectionTitle} />

        <MotionStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {skills.bentoCards.map((card) => {
            const Icon = iconMap[card.icon as keyof typeof iconMap] || FileText;
            const isLearning = "learning" in card && card.learning;
            const isMultiCol = card.items.length > 7;

            return (
              <MotionItem
                key={card.id}
                variant="fadeUp"
                className="h-full"
              >
                <FloatingCard
                  float={false}
                  className={`skill-bento-tile group flex h-full flex-col rounded-2xl border ${
                    isLearning
                      ? "border-dashed border-muted/45 bg-card/60"
                      : "border-card-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3 border-b border-card-border/50 px-4 py-3.5 sm:px-5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isLearning
                          ? "bg-muted/20 text-muted"
                          : "bg-primary text-white shadow-sm shadow-primary/20"
                      }`}
                    >
                      <Icon size={16} aria-hidden />
                    </div>
                    <h3 className="font-heading min-w-0 flex-1 text-[15px] font-bold leading-snug text-foreground sm:text-base">
                      {card.title}
                    </h3>
                    {isLearning && (
                      <span className="shrink-0 rounded-full bg-muted/25 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase">
                        Learning
                      </span>
                    )}
                  </div>

                  <ul
                    className={`flex-1 px-4 py-3.5 sm:px-5 sm:py-4 ${
                      isMultiCol
                        ? "grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2"
                        : "flex flex-col gap-y-2"
                    }`}
                  >
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-snug"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            isLearning ? "bg-primary-light/70" : "bg-primary-light"
                          }`}
                          aria-hidden
                        />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </FloatingCard>
              </MotionItem>
            );
          })}
        </MotionStagger>
      </div>
    </section>
  );
}
