"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateDeck } from "@/lib/actions/deck-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

interface EditDeckDialogProps {
  deckId: number;
  currentTitle: string;
  currentDescription: string;
  variant?: "default" | "icon";
  className?: string;
}

export function EditDeckDialog({
  deckId,
  currentTitle,
  currentDescription,
  variant = "default",
  className,
}: EditDeckDialogProps) {
  const t = useTranslations("Dashboard");
  const tDeck = useTranslations("DeckDetail");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateDeck({
        id: deckId,
        title,
        description,
      });

      if (result.success) {
        toast.success(t("updateSuccess"));
        setOpen(false);
      } else {
        toast.error(t("updateError"));
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTitle(currentTitle);
      setDescription(currentDescription);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className={className}>
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" className={className}>
            <Pencil className="h-4 w-4 mr-2" />
            {tDeck("editDeck")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("editDeckTitle")}</DialogTitle>
            <DialogDescription>{t("editDeckDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                {t("deckTitle")}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">
                {t("deckDescription")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                disabled={isPending}
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
              {isPending ? t("saveChanges") + "..." : t("saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
