import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Credits" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CreditsPage() {
  const t = await getTranslations("Credits");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("aboutTitle")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("aboutContent")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("purposeTitle")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("purposeContent")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("teamTitle")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("teamContent")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {t("technologiesTitle")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Next.js 15 - React Framework</li>
            <li>Clerk - Authentication</li>
            <li>Drizzle ORM - Database Management</li>
            <li>PostgreSQL - Database</li>
            <li>next-intl - Internationalization</li>
            <li>shadcn/ui - UI Components</li>
            <li>Tailwind CSS - Styling</li>
          </ul>
        </section>

        <section className="pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            {t("footer")}
          </p>
        </section>
      </div>
    </div>
  );
}
