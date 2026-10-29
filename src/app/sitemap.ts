import type { MetadataRoute } from "next";
import { getAllCaseStudySlugs } from "@/data/caseStudies";

const base = "https://kishorekumarrasalay-02.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls = getAllCaseStudySlugs().map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...projectUrls,
  ];
}
