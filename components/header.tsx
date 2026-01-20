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
import { Link } from "@/i18n/routing";
import { Home, LayoutDashboard, Settings, LogIn, UserPlus } from "lucide-react";

export function Header() {
  const t = useTranslations("Layout");

  return (
    <header className="flex items-center justify-between p-4 border-b border-zinc-800">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center">
          <Home className="w-5 h-5 mr-2" />
          <h1 className="text-xl font-semibold hover:text-primary transition-colors">
            {t("title")}
          </h1>
        </Link>
        <SignedIn>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                {t("dashboard")}
              </Button>
            </Link>
            <Link href="/configuration">
              <Button variant="ghost">
                <Settings className="w-4 h-4 mr-2" />
                {t("configuration")}
              </Button>
            </Link>
          </nav>
        </SignedIn>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="secondary">
              <LogIn className="w-4 h-4 mr-2" />
              {t("signIn")}
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              {t("signUp")}
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}

