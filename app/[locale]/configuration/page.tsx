import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ConfigurationClient from "./configuration-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Configuration" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ConfigurationPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ConfigurationClient />
    </div>
  );
}
