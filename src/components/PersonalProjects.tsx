"use client";

import FloatingCard from "./FloatingCard";
import MagneticButton from "./MagneticButton";
import MotionReveal from "./MotionReveal";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { GitHubIcon } from "./BrandIcons";
import { portfolioData } from "@/data/portfolio";

export default function PersonalProjects() {
  const { personalProjects } = portfolioData;

  return (
    <section id="personal-projects" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={personalProjects.sectionTitle} />

        <div className="space-y-6 sm:space-y-8">
          {personalProjects.projects.map((project) => (
            <MotionReveal
              key={project.title}
              variant="fadeUp"
              delay={0.05}
            >
              <FloatingCard className="rounded-2xl border border-card-border bg-card p-5 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h3 className="font-heading text-xl font-bold sm:text-2xl lg:text-3xl">
                    {project.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-medium text-accent">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {project.status}
                  </span>
                </div>

                <p className="text-body mt-6 text-sm text-muted md:text-base">
                  {project.description}
                </p>

                <div className="mt-8">
                  <h4 className="font-heading text-lg font-bold">
                    {project.buildingTitle}
                  </h4>
                  <ul className="text-body mt-4 space-y-2 text-sm text-muted md:text-base">
                    {project.building.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <h4 className="font-heading text-lg font-bold">
                    {project.whyTitle}
                  </h4>
                  <p className="text-body mt-4 text-sm text-muted md:text-base">
                    {project.why}
                  </p>
                </div>

                <div className="mt-8">
                  <h4 className="font-heading text-lg font-bold">
                    {project.currentFocusTitle}
                  </h4>
                  <p className="text-body mt-4 text-sm text-muted md:text-base">
                    {project.currentFocus}
                  </p>
                </div>

                {"progressTitle" in project && project.progressTitle && (
                  <div className="mt-8">
                    <h4 className="font-heading text-lg font-bold">
                      {project.progressTitle}
                    </h4>
                    {"progress" in project && project.progress && (
                      <ul className="text-body mt-4 space-y-1 text-sm text-muted md:text-base">
                        <li className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>Test cases automated: {(project.progress as { testCasesAutomated: number | null }).testCasesAutomated ?? "[TODO]"}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>Workflows covered: {(project.progress as { workflowsCovered: string | null }).workflowsCovered ?? "[TODO]"}</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>Last updated: {(project.progress as { lastUpdated: string | null }).lastUpdated ?? "[TODO]"}</span>
                        </li>
                      </ul>
                    )}
                  </div>
                )}

                <div className="mt-8">
                  <h4 className="font-heading text-lg font-bold">
                    {project.techStackTitle}
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                </div>

                {"githubUrl" in project && project.githubUrl && (
                  <div className="mt-8">
                    <MagneticButton
                      as="a"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
                    >
                      <GitHubIcon size={16} />
                      View on GitHub
                    </MagneticButton>
                  </div>
                )}
              </FloatingCard>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
