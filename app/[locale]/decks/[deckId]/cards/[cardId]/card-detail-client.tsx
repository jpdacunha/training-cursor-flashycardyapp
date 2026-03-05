"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ArrowLeft, Calendar, Hash, Layers, BookOpen } from "lucide-react";
import { Link } from "@/features/internationalization/config";
import { buildRoute } from "@/core/constants/routes";

interface CardData {
  id: number;
  publicId: string;
  deckId: number;
  front: string;
  back: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface DeckData {
  id: number;
  title: string;
  description: string | null;
}

interface CardDetailClientProps {
  card: CardData;
  deck: DeckData;
}

export function CardDetailClient({ card, deck }: CardDetailClientProps) {
  const t = useTranslations("CardDetail");
  const locale = useLocale();

  const formatDate = (value: Date | string) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-3xl">
      {/* Back button */}
      <Link href={buildRoute.deck(deck.id)}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToDeck")}
        </Button>
      </Link>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>

      {/* Card Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t("cardContent")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Front */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              {t("front")}
            </h4>
            <div className="p-4 bg-secondary rounded-lg whitespace-pre-wrap text-base leading-relaxed">
              {card.front}
            </div>
          </div>

          <Separator />

          {/* Back */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              {t("back")}
            </h4>
            <div className="p-4 bg-secondary rounded-lg whitespace-pre-wrap text-base leading-relaxed">
              {card.back}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            {t("metadata")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Deck */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("deck")}
                </p>
                <Link
                  href={buildRoute.deck(deck.id)}
                  className="text-sm font-semibold hover:underline"
                >
                  {deck.title}
                </Link>
              </div>
            </div>

            {/* Public ID */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("publicId")}
                </p>
                <p className="text-sm font-mono font-semibold">
                  {card.publicId}
                </p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("createdAt")}
                </p>
                <p className="text-sm font-semibold">
                  {formatDate(card.createdAt)}
                </p>
              </div>
            </div>

            {/* Updated At */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("updatedAt")}
                </p>
                <p className="text-sm font-semibold">
                  {formatDate(card.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
