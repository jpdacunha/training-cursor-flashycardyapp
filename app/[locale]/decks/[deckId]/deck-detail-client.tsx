"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { EditDeckDialog } from "@/components/edit-deck-dialog";
import { AddCardDialog } from "@/components/add-card-dialog";
import { Pencil, Save, X, ArrowLeft } from "lucide-react";
import { updateCard } from "@/lib/actions/card-actions";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import { ROUTES } from "@/lib/routes";

interface CardData {
  id: number;
  deckId: number;
  front: string;
  back: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DeckData {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DeckDetailClientProps {
  deck: DeckData;
  cards: CardData[];
}

export function DeckDetailClient({ deck, cards: initialCards }: DeckDetailClientProps) {
  const t = useTranslations("DeckDetail");
  const [cards, setCards] = useState(initialCards);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync local state with props when they change (after router.refresh())
  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  const cardCount = cards.length;
  const learningProgress = 0; // Placeholder for now

  const handleEdit = (card: CardData) => {
    setEditingCardId(card.id);
    setEditFront(card.front);
    setEditBack(card.back);
  };

  const handleCancel = () => {
    setEditingCardId(null);
    setEditFront("");
    setEditBack("");
  };

  const handleSave = async (cardId: number) => {
    if (!editFront.trim() || !editBack.trim()) {
      toast.error(t("updateError"));
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateCard({
        cardId,
        front: editFront,
        back: editBack,
      });

      if (result.success && result.data) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === cardId
              ? { ...card, front: result.data.front, back: result.data.back }
              : card
          )
        );
        toast.success(t("updateSuccess"));
        setEditingCardId(null);
        setEditFront("");
        setEditBack("");
      } else {
        toast.error(t("updateError"));
      }
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error(t("updateError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <Link href={ROUTES.DASHBOARD}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToDashboard")}
        </Button>
      </Link>

      {/* Deck Information Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl">{deck.title}</CardTitle>
              {deck.description && (
                <CardDescription className="text-base">{deck.description}</CardDescription>
              )}
            </div>
            <EditDeckDialog
              deckId={deck.id}
              currentTitle={deck.title}
              currentDescription={deck.description || ""}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-lg font-semibold">
              {t("cardCount", { count: cardCount })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>{t("learningProgress")}</CardTitle>
          <CardDescription>
            {t("progressComplete", { progress: learningProgress })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={learningProgress} className="w-full" />
        </CardContent>
      </Card>

      {/* Cards List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("cards")}</h2>
          <AddCardDialog deckId={deck.id} />
        </div>
        
        {cards.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t("noCards")}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <Card key={card.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {t("cardNumber", { number: index + 1 })}
                    </CardTitle>
                    {editingCardId !== card.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(card)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {t("edit")}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Front of card */}
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                      {t("front")}
                    </h4>
                    {editingCardId === card.id ? (
                      <Textarea
                        value={editFront}
                        onChange={(e) => setEditFront(e.target.value)}
                        className="min-h-[100px]"
                        placeholder={t("front")}
                      />
                    ) : (
                      <div className="p-4 bg-secondary rounded-md whitespace-pre-wrap">
                        {card.front}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Back of card */}
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                      {t("back")}
                    </h4>
                    {editingCardId === card.id ? (
                      <Textarea
                        value={editBack}
                        onChange={(e) => setEditBack(e.target.value)}
                        className="min-h-[100px]"
                        placeholder={t("back")}
                      />
                    ) : (
                      <div className="p-4 bg-secondary rounded-md whitespace-pre-wrap">
                        {card.back}
                      </div>
                    )}
                  </div>

                  {/* Action buttons when editing */}
                  {editingCardId === card.id && (
                    <div className="flex gap-2 justify-end pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        <X className="mr-2 h-4 w-4" />
                        {t("cancel")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(card.id)}
                        disabled={isSaving}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "..." : t("save")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
