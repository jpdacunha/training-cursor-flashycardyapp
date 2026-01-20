import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const locales = ["en", "fr"];
  
  const publicPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/credits", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  // Generate entries for each locale and page
  const routes = locales.flatMap((locale) =>
    publicPages.map((page) => {
      const localePrefix = locale === "en" ? "" : `/${locale}`;
      const url = `${baseUrl}${localePrefix}${page.path}`;

      return {
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${baseUrl}${page.path}`,
            fr: `${baseUrl}/fr${page.path}`,
          },
        },
      };
    })
  );

  return routes;
}


