// CampaignStep5.tsx - UPDATED WITH CONSTANTS
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormSchemaStore } from "@/utility/llmFormWizard";
import { useCreate } from "@refinedev/core";
import { Save, ArrowLeft, FileText, Target, Wallet, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StepsHero } from "./StepsHero";
import StepsHeader from "./StepsHeader";
import {
  CAMPAIGN_VALIDATION,
  CAMPAIGN_UI_TEXTS,
  CAMPAIGN_PATHS,
  API_CONFIG,
} from "./campaignWizard.constants";

export const CampaignStep5: React.FC = () => {
  const navigate = useNavigate();
  const { getData, setData } = useFormSchemaStore();
  const { mutate: createWebsiteAnalysis } = useCreate();
  const { mutate: createMarketingStrategy } = useCreate();
  const formData = getData("campaign-wizard");

  const [title, setTitle] = useState(formData.title || "");
  const [targetAudience, setTargetAudience] = useState(
    formData.targetAudience || ""
  );
  const [budgetRecommendation, setBudgetRecommendation] = useState(
    formData.budgetRecommendation || 0
  );
  const [notes, setNotes] = useState(formData.notes || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { steps, errors: errorTexts } = CAMPAIGN_UI_TEXTS;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Walidacja tytułu
    if (!title.trim() || title.length < CAMPAIGN_VALIDATION.title.minLength) {
      newErrors.title = CAMPAIGN_VALIDATION.title.errorMessage;
    }

    // Walidacja grupy docelowej
    if (
      !targetAudience.trim() ||
      targetAudience.length < CAMPAIGN_VALIDATION.targetAudience.minLength
    ) {
      newErrors.targetAudience =
        CAMPAIGN_VALIDATION.targetAudience.errorMessage;
    }

    // Walidacja budżetu
    if (
      !budgetRecommendation ||
      budgetRecommendation < CAMPAIGN_VALIDATION.budgetRecommendation.min
    ) {
      newErrors.budgetRecommendation =
        CAMPAIGN_VALIDATION.budgetRecommendation.errorMessage;
    }

    // Walidacja notatek
    if (!notes.trim() || notes.length < CAMPAIGN_VALIDATION.notes.minLength) {
      newErrors.notes = CAMPAIGN_VALIDATION.notes.errorMessage;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      // 1. Najpierw zapisz analizę strony do bazy
      createWebsiteAnalysis(
        {
          resource: "website_analyses",
          values: {
            url: formData.url,
            description: formData.description,
            keywords: formData.keywords,
            industry: formData.industry,
          },
        },
        {
          onSuccess: (data) => {
            const websiteAnalysisId = data.data.id;

            // 2. Następnie zapisz strategię marketingową powiązaną z analizą
            createMarketingStrategy(
              {
                resource: "marketing_strategies",
                values: {
                  website_analysis_id: websiteAnalysisId,
                  title: title.trim(),
                  target_audience: targetAudience.trim(),
                  budget_recommendation: budgetRecommendation,
                  notes: notes.trim(),
                  industry_override: formData.industry,
                },
              },
              {
                onSuccess: () => {
                  // 3. Zapisz także w lokalnym store dla zachowania stanu
                  setData("campaign-wizard", {
                    ...formData,
                    title: title.trim(),
                    targetAudience: targetAudience.trim(),
                    budgetRecommendation,
                    notes: notes.trim(),
                    websiteAnalysisId,
                    saved: true,
                  });

                  setSaving(false);
                  setSaved(true);

                  // Przekieruj do listy strategii po timeout
                  setTimeout(() => {
                    navigate(CAMPAIGN_PATHS.marketingStrategies);
                  }, API_CONFIG.saveTimeout);
                },
                onError: (error) => {
                  setSaving(false);
                  console.error(errorTexts.strategyeSaveError, error);
                  alert(errorTexts.strategyeSaveError);
                },
              }
            );
          },
          onError: (error) => {
            setSaving(false);
            console.error(errorTexts.websiteAnalysisSaveError, error);
            alert(errorTexts.websiteAnalysisSaveError);
          },
        }
      );
    } catch (error) {
      setSaving(false);
      console.error(errorTexts.saveError, error);
      alert(errorTexts.unexpectedError);
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow relative">
      <StepsHero step={5} />

      <div className="p-8">
        <StepsHeader
          title={
            <>
              <Edit3 className="w-8 h-8 text-blue-500" />
              <span>{steps[5].title}</span>
            </>
          }
          description={steps[5].description}
        />

        {saved && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              {steps[5].success}
            </AlertDescription>
          </Alert>
        )}

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* Tytuł kampanii */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-base font-medium flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Tytuł kampanii <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Wprowadź tytuł kampanii..."
              maxLength={CAMPAIGN_VALIDATION.title.maxLength}
              className={`h-12 text-base ${
                errors.title ? "border-red-300" : ""
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Grupa docelowa */}
          <div className="space-y-2">
            <Label
              htmlFor="targetAudience"
              className="text-base font-medium flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Grupa docelowa <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Opisz grupę docelową..."
              rows={4}
              maxLength={CAMPAIGN_VALIDATION.targetAudience.maxLength}
              className={`text-base resize-none ${
                errors.targetAudience ? "border-red-300" : ""
              }`}
            />
            {errors.targetAudience && (
              <p className="text-sm text-red-600">{errors.targetAudience}</p>
            )}
          </div>

          {/* Budżet */}
          <div className="space-y-2">
            <Label
              htmlFor="budget"
              className="text-base font-medium flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Budżet miesięczny (PLN) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="budget"
              type="number"
              value={budgetRecommendation}
              onChange={(e) =>
                setBudgetRecommendation(parseInt(e.target.value) || 0)
              }
              placeholder={`Minimum ${CAMPAIGN_VALIDATION.budgetRecommendation.min} PLN`}
              min={CAMPAIGN_VALIDATION.budgetRecommendation.min}
              max={CAMPAIGN_VALIDATION.budgetRecommendation.max}
              className={`h-12 text-base ${
                errors.budgetRecommendation ? "border-red-300" : ""
              }`}
            />
            {errors.budgetRecommendation && (
              <p className="text-sm text-red-600">
                {errors.budgetRecommendation}
              </p>
            )}
          </div>

          {/* Notatki strategiczne */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium">
              Notatki strategiczne <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dodaj notatki strategiczne..."
              rows={6}
              className={`text-base resize-none ${
                errors.notes ? "border-red-300" : ""
              }`}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes}</p>
            )}
            <p className="text-sm text-gray-500">
              {notes.length} znaków (minimum{" "}
              {CAMPAIGN_VALIDATION.notes.minLength})
            </p>
          </div>

          {/* Informacja o zapisie */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">{steps[5].saveInfo}</p>
          </div>

          <Separator />

          {/* Przyciski nawigacji */}
          <footer className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(CAMPAIGN_PATHS.step4)}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Wstecz
            </Button>

            <Button
              type="submit"
              disabled={saving || saved}
              className="flex items-center gap-2 min-w-[160px]"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {steps[5].loading}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {steps[5].button}
                </>
              )}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};
