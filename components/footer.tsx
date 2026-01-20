"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CreditCard } from "lucide-react";

export function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {t("copyright")}
          </p>
          
          <nav className="flex gap-6">
            <Link 
              href="/credits" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {t("credits")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
