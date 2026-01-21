"use client";

import { useTranslations, useLocale } from "next-intl";
import { Calendar } from "lucide-react";
import { Link } from "@/features/internationalization/config";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { EditDeckDialog } from "@/features/decks/components/edit-deck-dialog";
import { AddDeckDialog } from "@/features/decks/components/add-deck-dialog";
import { InferSelectModel } from "drizzle-orm";
import { decksTable } from "@/infrastructure/database/schema";
import { buildRoute } from "@/core/constants/routes";

type Deck = InferSelectModel<typeof decksTable>;

export default function DashboardClient({ decks }: { decks: Deck[] }) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <AddDeckDialog />
      </div>
      <p className="text-lg text-muted-foreground mb-8">{t("description")}</p>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("myDecks")}</h2>
        
        {decks.length === 0 ? (
          <p className="text-muted-foreground">{t("noDecks")}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <Card key={deck.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
                <CardHeader className="flex-1">
                  <div className="space-y-1.5">
                    {/* Ligne 1 : Titre + Bouton */}
                    <div className="flex items-start justify-between gap-4">
                      <Link 
                        href={buildRoute.deck(deck.id)} 
                        className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <CardTitle>{deck.title}</CardTitle>
                      </Link>
                      <div className="flex-shrink-0">
                        <EditDeckDialog
                          deckId={deck.id}
                          currentTitle={deck.title}
                          currentDescription={deck.description || ""}
                        />
                      </div>
                    </div>
                    
                    {/* Ligne 2 : Description sur toute la largeur */}
                    <Link 
                      href={buildRoute.deck(deck.id)} 
                      className="block cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <CardDescription>{deck.description || ''}</CardDescription>
                    </Link>
                  </div>
                </CardHeader>
                <Separator />
                <Link href={buildRoute.deck(deck.id)} className="block">
                  <CardFooter className="h-20 flex flex-col sm:flex-row justify-between gap-2 text-sm text-muted-foreground cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{t("createdAt")}:</span>
                      <span>{new Date(deck.createdAt).toLocaleDateString(locale)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{t("updatedAt")}:</span>
                      <span>{new Date(deck.updatedAt).toLocaleDateString(locale)}</span>
                    </div>
                  </CardFooter>
                </Link>
              </Card>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
