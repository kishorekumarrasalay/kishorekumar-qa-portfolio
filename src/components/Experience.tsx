import { Award, Briefcase, CheckCircle, ExternalLink } from "lucide-react";
import FloatingCard from "./FloatingCard";
import { MotionItem, MotionStagger } from "./MotionStagger";
import SectionHeading from "./SectionHeading";
import Tag from "./Tag";
import { portfolioData } from "@/data/portfolio";

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={experience.sectionTitle} />

        <MotionStagger className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          <MotionItem variant="fadeUp" className="h-full">
            <FloatingCard className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-heading text-xl font-bold">
                  {experience.work.title}
                </h3>
              </div>

              <div className="relative space-y-6 border-l-2 border-primary/30 pl-4 sm:space-y-8 sm:pl-6">
                {experience.work.items.map((job) => (
                  <div key={job.title} className="relative">
                    <span className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-accent sm:-left-[31px]" />
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="font-heading text-lg font-bold">{job.title}</h4>
                      <span className="rounded-full bg-tag-bg px-3 py-1 text-xs text-muted">
                        {job.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-primary">{job.company}</p>
                    <p className="text-body mt-3 text-sm text-muted">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            </FloatingCard>
          </MotionItem>

          <MotionItem variant="fadeUp" className="h-full" id="certifications">
            <FloatingCard className="rounded-2xl border border-card-border bg-card p-5 sm:p-6 lg:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tag-bg text-primary">
                  <Award size={20} />
                </div>
                <h3 className="font-heading text-xl font-bold">
                  {experience.certifications.title}
                </h3>
              </div>

              {"items" in experience.certifications &&
                Array.isArray(experience.certifications.items) &&
                experience.certifications.items.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {experience.certifications.items.map((cert) => (
                      <div
                        key={cert.credentialId}
                        className="group relative rounded-xl border border-primary/30 bg-background/80 p-4 transition-all hover:border-primary/60 sm:p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                                <CheckCircle size={12} /> Verified Certificate
                              </span>
                              <span className="text-xs text-muted">{cert.date}</span>
                            </div>
                            <h4 className="font-heading mt-2 text-base font-bold text-primary-light sm:text-lg">
                              {cert.title}
                            </h4>
                            <p className="mt-1 text-xs text-muted sm:text-sm">
                              <span className="font-medium text-primary">{cert.issuer}</span> • Instructor: {cert.instructor} • {cert.duration}
                            </p>
                          </div>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-tag-bg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-black"
                            >
                              Verify <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              <div className="rounded-xl border border-card-border bg-background/50 p-4 sm:p-5">
                <p className="text-body text-xs text-muted sm:text-sm">
                  {experience.certifications.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {experience.certifications.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </FloatingCard>
          </MotionItem>
        </MotionStagger>
      </div>
    </section>
  );
}
