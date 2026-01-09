"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Header() {
  const t = useTranslations("Layout");

  return (
    <header className="flex items-center justify-between p-4 border-b border-zinc-800">
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="secondary">{t("signIn")}</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>{t("signUp")}</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}

