"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";
import { MotionItem, MotionStagger } from "./MotionStagger";
import { portfolioData } from "@/data/portfolio";

export default function MetricsBand() {
  const { metrics } = portfolioData;
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Career metrics"
      className="border-y border-card-border/60 bg-card/40 px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
    >
      <MotionStagger className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8">
        {metrics.items.map((item) => (
          <MotionItem key={item.label} variant="fadeUp" className="text-center">
            <p className="font-heading text-2xl font-bold text-primary-light sm:text-4xl">
              {inView ? (
                <AnimatedCounter
                  value={item.value}
                  suffix={item.suffix ?? ""}
                  prefix={item.prefix ?? ""}
                  durationMs={1100}
                />
              ) : (
                /* SSR-safe: show real final value so crawlers see correct numbers */
                <span>
                  {item.prefix ?? ""}{item.value}{item.suffix ?? ""}
                </span>
              )}
            </p>
            <p className="mt-1.5 text-[10px] font-medium tracking-wide text-muted uppercase sm:mt-2 sm:text-sm">
              {item.label}
            </p>
          </MotionItem>
        ))}
      </MotionStagger>
    </section>
  );
}
