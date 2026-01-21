"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { loadTestData } from "@/tests/fixtures/test-data-actions";

export default function ConfigurationClient() {
  const t = useTranslations("Configuration");
  const [isPending, startTransition] = useTransition();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleLoadTestData = async () => {
    if (!confirm(t("testData.warning"))) {
      return;
    }

    setNotification(null);

    startTransition(async () => {
      const result = await loadTestData();

      if (result.success && result.data) {
        setNotification({
          type: 'success',
          message: t("testData.successMessage", {
            decksCount: result.data.decksCreated,
            cardsCount: result.data.cardsCreated,
          }),
        });
      } else {
        setNotification({
          type: 'error',
          message: t("testData.errorMessage"),
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-lg border ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <h3 className="font-semibold mb-1">
            {notification.type === 'success'
              ? t("testData.successTitle")
              : t("testData.errorTitle")}
          </h3>
          <p className="text-sm">{notification.message}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("testData.title")}</CardTitle>
          <CardDescription>{t("testData.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("testData.warning")}
            </p>
            <Button
              onClick={handleLoadTestData}
              disabled={isPending}
              variant="default"
            >
              {isPending ? t("testData.loadingButton") : t("testData.loadButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
