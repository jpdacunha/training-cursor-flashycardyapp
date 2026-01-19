import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/141c0218-2a81-41cf-a26b-42049c4f3a55',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/robots.ts:4',message:'robots() function called successfully',data:{baseUrl,env:process.env.NEXT_PUBLIC_SITE_URL||'not_set'},timestamp:Date.now(),sessionId:'debug-session',runId:'hydration-fix',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/_next/*",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

