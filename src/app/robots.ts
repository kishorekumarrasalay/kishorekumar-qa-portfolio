import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://kishorekumarrasalay-02.vercel.app/sitemap.xml",
  };
}
