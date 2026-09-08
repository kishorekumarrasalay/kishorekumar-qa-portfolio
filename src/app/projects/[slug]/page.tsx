import Link from "next/link";
import { notFound } from "next/navigation";
import {
  caseStudyMetadata,
  getAllCaseStudySlugs,
  getCaseStudy,
} from "@/data/caseStudies";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case Study" };
  return caseStudyMetadata(study);
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/#portfolio"
        className="text-sm font-medium text-primary-light hover:underline"
      >
        ← Back to Projects
      </Link>

      <header className="mt-6 pb-8">
        <p className="text-xs font-semibold tracking-widest text-muted uppercase">
          Case Study · {study.tag}
        </p>
        <h1 className="font-heading mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          {study.title}
        </h1>
        <p className="text-body mt-4 text-muted">{study.summary}</p>
      </header>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">Context</h2>
        <p className="text-body mt-3 text-sm text-muted">{study.context.product}</p>
        <p className="text-body mt-2 text-sm text-muted">
          <span className="font-medium text-foreground">My role: </span>
          {study.context.role}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">Testing scope</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          {study.testingScope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {study.modulesTested && study.modulesTested.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading text-xl font-semibold">Modules Tested</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {study.modulesTested.map((moduleItem) => (
              <div
                key={moduleItem.name}
                className="rounded-xl border border-card-border bg-card p-4 sm:p-5"
              >
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {moduleItem.name}
                </h3>
                <p className="text-body mt-2 text-sm text-muted">
                  {moduleItem.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">Approach</h2>
        <p className="text-body mt-3 text-sm text-muted">{study.approach.design}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {study.approach.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-card-border bg-card px-3 py-1 text-xs font-medium text-foreground"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">Sample artifacts</h2>
        <h3 className="mt-5 text-sm font-semibold text-foreground">
          Test cases
        </h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead className="bg-card text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Steps</th>
                <th className="px-3 py-2 font-medium">Expected</th>
              </tr>
            </thead>
            <tbody>
              {study.sampleArtifacts.testCases.map((tc) => (
                <tr key={tc.id} className="border-t border-card-border">
                  <td className="px-3 py-2 font-mono text-xs text-primary-light">
                    {tc.id}
                  </td>
                  <td className="px-3 py-2 text-foreground">{tc.title}</td>
                  <td className="px-3 py-2 text-muted">{tc.steps}</td>
                  <td className="px-3 py-2 text-muted">{tc.expected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-sm font-semibold text-foreground">
          Bug report example
        </h3>
        <article className="mt-3 rounded-xl border border-card-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-primary-light">
              {study.sampleArtifacts.bugReport.id}
            </span>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary-light uppercase">
              {study.sampleArtifacts.bugReport.severity}
            </span>
          </div>
          <h4 className="font-heading mt-2 text-base font-semibold">
            {study.sampleArtifacts.bugReport.title}
          </h4>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-foreground">Steps</dt>
              <dd className="text-muted">{study.sampleArtifacts.bugReport.steps}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Actual</dt>
              <dd className="text-muted">{study.sampleArtifacts.bugReport.actual}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Expected</dt>
              <dd className="text-muted">{study.sampleArtifacts.bugReport.expected}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">Metrics</h2>
        <p className="mt-1 text-xs text-muted">
          Placeholder values — edit in <code>src/data/caseStudies.ts</code>
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Bugs found", value: study.metrics.bugsFound },
            {
              label: "Test cases executed",
              value: study.metrics.testCasesExecuted,
            },
            {
              label: "Regression cycles",
              value: study.metrics.regressionCycles,
            },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-card-border bg-card p-4 text-center"
            >
              <p className="font-heading text-2xl font-bold text-primary-light">
                {m.value}
              </p>
              <p className="mt-1 text-[10px] font-medium tracking-wide text-muted uppercase">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 pb-8">
        <h2 className="font-heading text-xl font-semibold">Outcome & learnings</h2>
        <p className="text-body mt-3 text-sm text-muted">{study.outcome}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
          {study.learnings.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
