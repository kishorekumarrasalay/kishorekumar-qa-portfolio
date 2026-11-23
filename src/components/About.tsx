import { BookOpen, Download, GraduationCap } from "lucide-react";
import FloatingCard from "./FloatingCard";
import MagneticButton from "./MagneticButton";
import MotionReveal from "./MotionReveal";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import { portfolioData } from "@/data/portfolio";

export default function About() {
  const { about } = portfolioData;

  return (
    <section id="about" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={about.sectionTitle} />

        <MotionStagger className="grid gap-4 sm:gap-5 lg:grid-cols-2 lg:items-stretch">
          <MotionItem variant="fadeUp" className="h-full min-h-[280px]">
            <FloatingCard className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-heading text-xl font-bold">
                  {about.whoIAm.title}
                </h3>
              </div>

              <div className="text-body space-y-4 text-sm text-muted md:text-base">
                {about.whoIAm.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
                {about.downloads.map((download, index) => {
                  const shouldOpenInNewTab = "openInNewTab" in download ? download.openInNewTab : !download.download;
                  const downloadName = "download" in download && download.download
                    ? typeof download.download === "string"
                      ? download.download
                      : "Kishore_Kumar_R_Resume.pdf"
                    : undefined;

                  return (
                    <MagneticButton
                      key={download.label}
                      as="a"
                      href={download.href}
                      target={shouldOpenInNewTab ? "_blank" : undefined}
                      rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
                      download={downloadName}
                      strength={0.3}
                      className={`w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 sm:w-auto inline-flex ${
                        index === 0
                          ? "bg-primary text-white"
                          : "border border-primary text-primary hover:bg-primary/10"
                      }`}
                    >
                      <Download size={16} />
                      {download.label}
                    </MagneticButton>
                  );
                })}
              </div>
            </FloatingCard>
          </MotionItem>

          <MotionItem variant="fadeUp" className="h-full min-h-[280px]">
            <FloatingCard
              float={false}
              className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-7"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                  <GraduationCap size={20} />
                </div>
                <h3 className="font-heading text-xl font-bold">
                  {about.education.title}
                </h3>
              </div>

              <h4 className="font-heading text-lg font-bold leading-snug">
                {about.education.degree}
              </h4>
              <p className="mt-2 text-sm text-primary">{about.education.college}</p>
              <span className="mt-4 inline-block rounded-full bg-tag-bg px-4 py-1 text-sm text-muted">
                {about.education.period}
              </span>
              <p className="text-body mt-6 text-sm text-muted md:text-base">
                {about.education.summary}
              </p>
            </FloatingCard>
          </MotionItem>
        </MotionStagger>

        <MotionReveal variant="fadeUp" className="mt-4 sm:mt-5">
          <div className="rounded-2xl border border-card-border bg-card px-4 py-4 sm:px-5 sm:py-5">
            <h3 className="font-heading mb-3 text-base font-bold sm:text-lg">
              {about.coreCompetenciesTitle}
            </h3>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {about.coreCompetencies.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-2.5 rounded-xl border border-card-border/80 bg-background/50 px-3 py-2.5"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light"
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-foreground/90">
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
