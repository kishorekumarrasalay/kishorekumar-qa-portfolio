"use client";

import Link from "next/link";
import FloatingCard from "./FloatingCard";
import MagneticButton from "./MagneticButton";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

export default function Portfolio() {
  const { portfolio } = portfolioData;

  return (
    <section id="portfolio" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={portfolio.sectionTitle} />

        <MotionStagger className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {portfolio.projects.map((project, index) => (
            <MotionItem key={project.slug} variant="fadeUp" className="h-full">
              <FloatingCard
                float={index % 2 === 0}
                className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-8"
              >
                <h3 className="font-heading text-xl font-bold">{project.title}</h3>
                {"bullets" in project && Array.isArray(project.bullets) && project.bullets.length > 0 ? (
                  <>
                    <p className="text-body mt-4 text-sm text-muted">{project.description}</p>
                    <ul className="text-body mt-2 flex-1 space-y-1 text-sm text-muted">
                      {project.bullets.map((b: string) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light" aria-hidden />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-body mt-4 flex-1 text-sm text-muted">
                    {project.description}
                  </p>
                )}
                <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <Tag>{project.tag}</Tag>
                  <MagneticButton
                    as="div"
                    strength={0.25}
                    className="inline-flex"
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex text-sm font-semibold text-primary-light transition hover:underline"
                    >
                      View Case Study →
                    </Link>
                  </MagneticButton>
                </div>
              </FloatingCard>
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
