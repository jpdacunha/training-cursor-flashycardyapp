"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/features/internationalization/config";
import { toast } from "sonner";
import { generateCards } from "@/features/ai-generation/actions";
import { bulkCreateCards } from "@/features/cards/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Sparkles, RotateCw, Pencil, Check } from "lucide-react";

interface CompleteDeckDialogProps {
  deckId: number;
  deckTitle: string;
  deckDescription: string;
  existingCardsCount: number;
}

interface GeneratedCard {
  front: string;
  back: string;
}

type WorkflowStep = "config" | "preview" | "saving";

const SUPPORTED_LANGUAGES = [
  { code: "en", labelKey: "cardLanguageEn" },
  { code: "fr", labelKey: "cardLanguageFr" },
  { code: "es", labelKey: "cardLanguageEs" },
  { code: "de", labelKey: "cardLanguageDe" },
  { code: "it", labelKey: "cardLanguageIt" },
  { code: "pt", labelKey: "cardLanguagePt" },
  { code: "ja", labelKey: "cardLanguageJa" },
  { code: "zh", labelKey: "cardLanguageZh" },
  { code: "ko", labelKey: "cardLanguageKo" },
  { code: "ru", labelKey: "cardLanguageRu" },
] as const;

export function CompleteDeckDialog({
  deckId,
  deckTitle,
  deckDescription,
  existingCardsCount,
}: CompleteDeckDialogProps) {
  const t = useTranslations("DeckDetail");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("config");
  const [isPending, startTransition] = useTransition();
  
  // Configuration step state
  const [count, setCount] = useState("10");
  const [language, setLanguage] = useState("en");
  
  // Preview step state
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isPending) {
      // Reset state when closing
      setCurrentStep("config");
      setCount("10");
      setLanguage("en");
      setGeneratedCards([]);
      setEditingCardIndex(null);
      setEditFront("");
      setEditBack("");
    }
    setOpen(newOpen);
  };

  const handleGenerate = () => {
    const cardCount = parseInt(count, 10);
    
    if (isNaN(cardCount) || cardCount < 1 || cardCount > 50) {
      toast.error("Please enter a valid number between 1 and 50");
      return;
    }

    startTransition(async () => {
      const result = await generateCards({
        deckId,
        count: cardCount,
        language: language as any,
      });

      if (result.success && result.data) {
        setGeneratedCards(result.data);
        setCurrentStep("preview");
        toast.success(t("generatedCardsSuccess", { count: result.data.length }));
      } else {
        const errorMessage = typeof result.error === 'string' ? result.error : 'An error occurred';
        toast.error(
          result.error 
            ? t("aiGenerationError", { error: errorMessage }) 
            : t("generatedCardsError")
        );
      }
    });
  };

  const handleRegenerate = () => {
    setCurrentStep("config");
    setGeneratedCards([]);
  };

  const handleEditCard = (index: number) => {
    setEditingCardIndex(index);
    setEditFront(generatedCards[index].front);
    setEditBack(generatedCards[index].back);
  };

  const handleCancelEdit = () => {
    setEditingCardIndex(null);
    setEditFront("");
    setEditBack("");
  };

  const handleSaveEdit = (index: number) => {
    if (!editFront.trim() || !editBack.trim()) {
      toast.error("Both front and back are required");
      return;
    }

    const updatedCards = [...generatedCards];
    updatedCards[index] = { front: editFront.trim(), back: editBack.trim() };
    setGeneratedCards(updatedCards);
    setEditingCardIndex(null);
    setEditFront("");
    setEditBack("");
    toast.success("Card updated");
  };

  const handleAddToDeck = () => {
    if (generatedCards.length === 0) {
      toast.error(t("noCardsGenerated"));
      return;
    }

    setCurrentStep("saving");

    startTransition(async () => {
      const result = await bulkCreateCards({
        deckId,
        cards: generatedCards,
      });

      if (result.success) {
        toast.success(t("generatedCardsSuccess", { count: generatedCards.length }));
        setOpen(false);
        router.refresh();
        
        // Reset state
        setCurrentStep("config");
        setCount("10");
        setLanguage("en");
        setGeneratedCards([]);
      } else {
        const errorMessage = typeof result.error === 'string' ? result.error : t("createCardError");
        toast.error(errorMessage);
        setCurrentStep("preview");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="h-4 w-4 mr-2" />
          {t("completeDeck")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        {/* Step 1: Configuration */}
        {currentStep === "config" && (
          <>
            <DialogHeader>
              <DialogTitle>{t("completeDeckTitle")}</DialogTitle>
              <DialogDescription>
                {t("completeDeckDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="count">{t("numberOfCards")}</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  disabled={isPending}
                  placeholder={t("numberOfCardsPlaceholder")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">{t("selectLanguage")}</Label>
                <Select value={language} onValueChange={setLanguage} disabled={isPending}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {t(lang.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                <p><strong>Deck:</strong> {deckTitle}</p>
                {deckDescription && <p><strong>Description:</strong> {deckDescription}</p>}
                <p><strong>Existing cards:</strong> {existingCardsCount}</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleGenerate} disabled={isPending}>
                <Sparkles className="h-4 w-4 mr-2" />
                {isPending ? t("generating") : t("generateCards")}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 2: Preview & Edit */}
        {currentStep === "preview" && (
          <>
            <DialogHeader>
              <DialogTitle>{t("generatedCardsPreview")}</DialogTitle>
              <DialogDescription>
                {t("generatedCardsPreviewDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {generatedCards.map((card, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        {t("generatedCardNumber", { number: index + 1 })}
                      </CardTitle>
                      {editingCardIndex !== index && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCard(index)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          {t("editGeneratedCard")}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Front */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                        {t("front")}
                      </h4>
                      {editingCardIndex === index ? (
                        <Textarea
                          value={editFront}
                          onChange={(e) => setEditFront(e.target.value)}
                          className="min-h-[60px] text-sm"
                          placeholder={t("front")}
                        />
                      ) : (
                        <div className="p-2 bg-secondary rounded text-sm whitespace-pre-wrap">
                          {card.front}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Back */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                        {t("back")}
                      </h4>
                      {editingCardIndex === index ? (
                        <Textarea
                          value={editBack}
                          onChange={(e) => setEditBack(e.target.value)}
                          className="min-h-[60px] text-sm"
                          placeholder={t("back")}
                        />
                      ) : (
                        <div className="p-2 bg-secondary rounded text-sm whitespace-pre-wrap">
                          {card.back}
                        </div>
                      )}
                    </div>

                    {/* Edit actions */}
                    {editingCardIndex === index && (
                      <div className="flex gap-2 justify-end pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          {t("cancel")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(index)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t("save")}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isPending}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                {t("regenerate")}
              </Button>
              <div className="flex-1" />
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleAddToDeck} disabled={isPending}>
                {isPending ? t("addingCards") : t("addGeneratedCards")}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 3: Saving (loading state) */}
        {currentStep === "saving" && (
          <>
            <DialogHeader>
              <DialogTitle>{t("addingCards")}</DialogTitle>
            </DialogHeader>
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-muted-foreground">{t("addingCards")}</p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
