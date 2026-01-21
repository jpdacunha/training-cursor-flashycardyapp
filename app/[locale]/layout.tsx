import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div lang={locale} className={`${poppins.variable} flex min-h-screen flex-col`}>
      <NextIntlClientProvider messages={messages}>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </ClerkProvider>
      </NextIntlClientProvider>
    </div>
  );
}

