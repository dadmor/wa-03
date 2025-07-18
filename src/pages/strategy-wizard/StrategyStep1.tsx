// src/pages/website-analyses/strategy-wizard/StrategyStep1.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShow } from "@refinedev/core";
import { useFormSchemaStore } from "@/utility/llmFormWizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { STRATEGY_WIZARD_SCHEMA } from "./strategyWizard.constants";
import StepsHero from "../web-campaign-wizard/StepsHero";
import StepsHeader from "../web-campaign-wizard/StepsHeader";

export const StrategyStep1: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { register, setData } = useFormSchemaStore();
  const [industry, setIndustry] = useState("");

  // Pobierz dane analizy strony
  const { queryResult } = useShow({
    resource: "website_analyses",
    id: id!,
  });

  const websiteAnalysis = queryResult?.data?.data;

  useEffect(() => {
    // Rejestracja schematu
    register(STRATEGY_WIZARD_SCHEMA);
  }, []);

  useEffect(() => {
    if (websiteAnalysis) {
      setIndustry(websiteAnalysis.industry);
      // Zapisz dane analizy w store
      setData("strategy-wizard", {
        websiteAnalysisId: websiteAnalysis.id,
        url: websiteAnalysis.url,
        description: websiteAnalysis.description,
        keywords: websiteAnalysis.keywords,
        originalIndustry: websiteAnalysis.industry,
        industry: websiteAnalysis.industry,
      });
    }
  }, [websiteAnalysis]);

  const handleNext = () => {
    if (!industry.trim()) return;

    setData("strategy-wizard", {
      industry: industry.trim(),
    });

    navigate(`/website-analyses/${id}/strategy/step2`);
  };

  if (queryResult?.isLoading) {
    return (
      <div className="border rounded-lg bg-white shadow relative pb-6">
        <StepsHero step={1} />
        <div className="p-8 text-center">
          <p>Ładowanie danych analizy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white shadow relative pb-6">
      <StepsHero step={1} />

      <div className="p-6">
        <StepsHeader
          title="Konfiguracja branży"
          description="Możesz dostosować branżę dla nowej strategii marketingowej"
        />

        {websiteAnalysis && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription>
              Generujesz strategię dla strony:{" "}
              <strong>{websiteAnalysis.url}</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branża
            </label>
            <Input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="np. E-commerce mody"
              className="w-full"
            />
            <p className="mt-2 text-sm text-gray-500">
              Automatycznie wykryto:{" "}
              <strong>{websiteAnalysis?.industry}</strong>
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(`/website-analyses/show/${id}`)}
            >
              Anuluj
            </Button>
            <Button onClick={handleNext} disabled={!industry.trim()}>
              Dalej
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
