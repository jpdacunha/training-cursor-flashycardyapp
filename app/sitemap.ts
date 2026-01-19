import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const locales = ["en", "fr"];
  
  // Generate entries for each locale
  const routes = locales.flatMap((locale) => {
    const localePrefix = locale === "en" ? "" : `/${locale}`;
    const url = `${baseUrl}${localePrefix}`;
    
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
      alternates: {
        languages: {
          en: baseUrl,
          fr: `${baseUrl}/fr`,
        },
      },
    };
  });

  return routes;
}

