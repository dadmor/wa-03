// src/pages/website-analyses/strategy-wizard/StrategyStep4.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormSchemaStore } from "@/utility/llmFormWizard";
import { useCreate } from "@refinedev/core";
import { Save, ArrowLeft, FileText, Target, Wallet, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  STRATEGY_VALIDATION,
  STRATEGY_UI_TEXTS,
} from "./strategyWizard.constants";
import StepsHero from "../web-campaign-wizard/StepsHero";
import StepsHeader from "../web-campaign-wizard/StepsHeader";

export const StrategyStep4: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getData } = useFormSchemaStore();
  const { mutate: createMarketingStrategy } = useCreate();
  const formData = getData("strategy-wizard");

  const [title, setTitle] = useState(formData.title || "");
  const [targetAudience, setTargetAudience] = useState(formData.targetAudience || "");
  const [budgetRecommendation, setBudgetRecommendation] = useState(formData.budgetRecommendation || 0);
  const [notes, setNotes] = useState(formData.notes || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { steps, errors: errorTexts } = STRATEGY_UI_TEXTS;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.length < STRATEGY_VALIDATION.title.minLength) {
      newErrors.title = STRATEGY_VALIDATION.title.errorMessage;
    }

    if (!targetAudience.trim() || targetAudience.length < STRATEGY_VALIDATION.targetAudience.minLength) {
      newErrors.targetAudience = STRATEGY_VALIDATION.targetAudience.errorMessage;
    }

    if (!budgetRecommendation || budgetRecommendation < STRATEGY_VALIDATION.budgetRecommendation.min) {
      newErrors.budgetRecommendation = STRATEGY_VALIDATION.budgetRecommendation.errorMessage;
    }

    if (!notes.trim() || notes.length < STRATEGY_VALIDATION.notes.minLength) {
      newErrors.notes = STRATEGY_VALIDATION.notes.errorMessage;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      createMarketingStrategy(
        {
          resource: "marketing_strategies",
          values: {
            website_analysis_id: formData.websiteAnalysisId,
            title: title.trim(),
            target_audience: targetAudience.trim(),
            budget_recommendation: budgetRecommendation,
            notes: notes.trim(),
            industry_override: formData.industry !== formData.originalIndustry ? formData.industry : null,
          },
        },
        {
          onSuccess: () => {
            setSaving(false);
            setSaved(true);

            setTimeout(() => {
              navigate(`/website-analyses/show/${id}`);
            }, 2000);
          },
          onError: (error) => {
            setSaving(false);
            console.error("Błąd zapisu strategii:", error);
            alert("Wystąpił błąd podczas zapisywania strategii");
          },
        }
      );
    } catch (error) {
      setSaving(false);
      console.error("Błąd:", error);
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow relative">
      <StepsHero step={4} />

      <div className="p-8">
        <StepsHeader
          title={
            <>
              <Edit3 className="w-8 h-8 text-blue-500" />
              <span>{steps[4].title}</span>
            </>
          }
          description={steps[4].description}
        />

        {saved && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              {steps[4].success}
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
          {/* Tytuł strategii */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-base font-medium flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Tytuł strategii <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Wprowadź tytuł strategii..."
              maxLength={STRATEGY_VALIDATION.title.maxLength}
              className={`h-12 text-base ${errors.title ? "border-red-300" : ""}`}
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
              maxLength={STRATEGY_VALIDATION.targetAudience.maxLength}
              className={`text-base resize-none ${errors.targetAudience ? "border-red-300" : ""}`}
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
              onChange={(e) => setBudgetRecommendation(parseInt(e.target.value) || 0)}
              placeholder={`Minimum ${STRATEGY_VALIDATION.budgetRecommendation.min} PLN`}
              min={STRATEGY_VALIDATION.budgetRecommendation.min}
              max={STRATEGY_VALIDATION.budgetRecommendation.max}
              className={`h-12 text-base ${errors.budgetRecommendation ? "border-red-300" : ""}`}
            />
            {errors.budgetRecommendation && (
              <p className="text-sm text-red-600">{errors.budgetRecommendation}</p>
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
              className={`text-base resize-none ${errors.notes ? "border-red-300" : ""}`}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes}</p>
            )}
            <p className="text-sm text-gray-500">
              {notes.length} znaków (minimum {STRATEGY_VALIDATION.notes.minLength})
            </p>
          </div>

          {/* Informacja o zapisie */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              💾 Strategia zostanie zapisana w bazie danych i powiązana z analizą strony
            </p>
          </div>

          <Separator />

          {/* Przyciski nawigacji */}
          <footer className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/website-analyses/${id}/strategy/step3`)}
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
                  {steps[4].loading}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {steps[4].button}
                </>
              )}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};