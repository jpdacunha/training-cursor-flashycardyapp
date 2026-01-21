"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/features/internationalization/config";
import { toast } from "sonner";
import { createCard } from "@/features/cards/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Plus } from "lucide-react";

interface AddCardDialogProps {
  deckId: number;
  variant?: "default" | "icon";
  className?: string;
}

export function AddCardDialog({
  deckId,
  variant = "default",
  className,
}: AddCardDialogProps) {
  const t = useTranslations("DeckDetail");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createCard({
        deckId,
        front,
        back,
      });

      if (result.success) {
        toast.success(t("createCardSuccess"));
        setOpen(false);
        setFront("");
        setBack("");
        router.refresh();
      } else {
        toast.error(t("createCardError"));
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFront("");
      setBack("");
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className={className}>
            <Plus className="h-4 w-4" />
          </Button>
        ) : (
          <Button className={className}>
            <Plus className="h-4 w-4 mr-2" />
            {t("addCard")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("addCardTitle")}</DialogTitle>
            <DialogDescription>{t("addCardDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front">
                {t("front")}
              </Label>
              <Textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                required
                maxLength={5000}
                rows={4}
                disabled={isPending}
                placeholder={t("frontPlaceholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="back">
                {t("back")}
              </Label>
              <Textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                required
                maxLength={5000}
                rows={4}
                disabled={isPending}
                placeholder={t("backPlaceholder")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("addCard") + "..." : t("addCard")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
