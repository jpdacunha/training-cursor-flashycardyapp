"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Calendar, FolderOpen, Hash } from "lucide-react";
import { buildRoute, ROUTES } from "@/core/constants/routes";
import { Link } from "@/features/internationalization/config";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

interface CardDetailData {
  id: number;
  publicId: string;
  deckId: number;
  deckTitle: string;
  front: string;
  back: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface CardDetailClientProps {
  card: CardDetailData;
}

export function CardDetailClient({ card }: CardDetailClientProps) {
  const t = useTranslations("CardDetail");
  const locale = useLocale();

  const formatDate = (value: Date | string) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString(locale);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={buildRoute.deck(card.deckId)}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToDeck")}
          </Button>
        </Link>
        <Link href={ROUTES.DASHBOARD}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToDashboard")}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{t("cardName", { number: card.id })}</CardTitle>
          <CardDescription>{t("readOnlyDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span className="font-medium">{t("deckName")}:</span>
              <span>{card.deckTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span className="font-medium">{t("publicId")}:</span>
              <span>{card.publicId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{t("createdAt")}:</span>
              <span>{formatDate(card.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{t("updatedAt")}:</span>
              <span>{formatDate(card.updatedAt)}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">{t("front")}</h3>
            <div className="rounded-md bg-secondary p-4 whitespace-pre-wrap">{card.front}</div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">{t("back")}</h3>
            <div className="rounded-md bg-secondary p-4 whitespace-pre-wrap">{card.back}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
