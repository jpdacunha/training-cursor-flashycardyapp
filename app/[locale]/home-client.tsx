"use client";

import { useTranslations } from "next-intl";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "@/shared/components/ui/button";

export default function HomeClient() {
  const t = useTranslations("Home");
  const { isSignedIn } = useUser();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <Button size="lg" className="min-w-[150px]">
                {t("signIn")}
              </Button>
            </SignInButton>
          ) : (
            <SignOutButton>
              <Button size="lg" variant="outline" className="min-w-[150px]">
                {t("signOut")}
              </Button>
            </SignOutButton>
          )}
        </div>
      </main>
    </div>
  );
}
